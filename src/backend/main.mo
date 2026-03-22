import Map "mo:core/Map";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Word = {
    text : Text;
    addedAt : Int;
    style : WordStyle;
  };

  type WordStyle = {
    fontFamily : Text;
    color : Text;
    fontSize : Nat;
    bold : Bool;
    italic : Bool;
    underline : Bool;
  };

  type Sentence = {
    id : Nat;
    text : Text;
    addedAt : Int;
    wordStyles : [(Text, WordStyle)];
  };

  module Sentence {
    public func compare(s1 : Sentence, s2 : Sentence) : Order.Order {
      Int.compare(s2.addedAt, s1.addedAt);
    };
  };

  type Stats = {
    totalWords : Nat;
    sessionWords : Nat;
    totalSentences : Nat;
  };

  var nextSentenceId = 0;
  var sessionWords = 0;

  let words = Map.empty<Text, Word>();
  let sentences = Map.empty<Nat, Sentence>();

  let defaultStyle : WordStyle = {
    fontFamily = "Arial";
    color = "black";
    fontSize = 12;
    bold = false;
    italic = false;
    underline = false;
  };

  func getWordInternal(id : Text) : Word {
    switch (words.get(id)) {
      case (null) { Runtime.trap("Word does not exist") };
      case (?word) { word };
    };
  };

  func getSentenceInternal(id : Nat) : Sentence {
    switch (sentences.get(id)) {
      case (null) { Runtime.trap("Sentence does not exist") };
      case (?sentence) { sentence };
    };
  };

  func splitTextIntoWords(text : Text) : [Text] {
    text.trim(#char ' ').split(#char ' ').toArray().filter(func(word) { not word.isEmpty() });
  };

  public shared ({ caller }) func addWord(text : Text) : async Bool {
    if (words.containsKey(text)) { return false };
    let newWord : Word = {
      text;
      addedAt = Time.now();
      style = defaultStyle;
    };
    words.add(text, newWord);
    sessionWords += 1;
    true;
  };

  public shared ({ caller }) func addWords(texts : [Text]) : async Nat {
    var count = 0;
    for (text in texts.values()) {
      if (not words.containsKey(text)) {
        let newWord : Word = {
          text;
          addedAt = Time.now();
          style = defaultStyle;
        };
        words.add(text, newWord);
        count += 1;
      };
    };
    sessionWords += count;
    count;
  };

  public shared ({ caller }) func addSentence(text : Text) : async Nat {
    let id = nextSentenceId;
    let sentenceWords = splitTextIntoWords(text);
    let existingWordsSet = Set.fromIter(sentenceWords.values());
    let newWords = existingWordsSet.toArray().filter(
      func(word) {
        not words.containsKey(word);
      }
    );
    let sentence : Sentence = {
      id;
      text;
      addedAt = Time.now();
      wordStyles = sentenceWords.map(
        func(word) {
          (word, defaultStyle);
        }
      );
    };

    sentences.add(id, sentence);
    nextSentenceId += 1;
    sessionWords += newWords.size();

    for (word in newWords.values()) {
      let newWord : Word = {
        text = word;
        addedAt = Time.now();
        style = defaultStyle;
      };
      words.add(word, newWord);
    };
    newWords.size();
  };

  public query ({ caller }) func getAllSentences() : async [Sentence] {
    sentences.values().toArray().sort();
  };

  public shared ({ caller }) func updateSentenceWordStyle(sentenceId : Nat, wordText : Text, style : WordStyle) : async () {
    let sentence = getSentenceInternal(sentenceId);
    let updatedWordStyles = sentence.wordStyles.map(
      func((word, wordStyle)) {
        if (Text.equal(word, wordText)) {
          (word, style);
        } else {
          (word, wordStyle);
        };
      }
    );
    let updatedSentence : Sentence = {
      sentence with
      wordStyles = updatedWordStyles;
    };
    sentences.add(sentenceId, updatedSentence);
  };

  public shared ({ caller }) func deleteSentence(sentenceId : Nat) : async () {
    if (not sentences.containsKey(sentenceId)) { Runtime.trap("Sentence does not exist") };
    sentences.remove(sentenceId);
  };

  public query ({ caller }) func getAllWords() : async [Word] {
    words.values().toArray();
  };

  public shared ({ caller }) func updateWordStyle(text : Text, style : WordStyle) : async () {
    let word = getWordInternal(text);
    let updatedWord : Word = {
      word with
      style;
    };
    words.add(text, updatedWord);
  };

  public shared ({ caller }) func deleteWord(text : Text) : async () {
    if (not words.containsKey(text)) { Runtime.trap("Word does not exist") };
    words.remove(text);
  };

  func countWords() : Nat {
    words.size();
  };

  func countSentences() : Nat {
    sentences.size();
  };

  public query ({ caller }) func getStats() : async Stats {
    {
      totalWords = countWords();
      sessionWords;
      totalSentences = countSentences();
    };
  };

  public shared ({ caller }) func resetSessionCounter() : async () {
    sessionWords := 0;
  };
};
