import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  // Old types
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

  type OldActor = {
    words : Map.Map<Text, Word>;
    sessionWords : Nat;
  };

  type Sentence = {
    id : Nat;
    text : Text;
    addedAt : Int;
    wordStyles : [(Text, WordStyle)];
  };

  type NewActor = {
    words : Map.Map<Text, Word>;
    sessionWords : Nat;
    sentences : Map.Map<Nat, Sentence>;
    nextSentenceId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      words = old.words;
      sessionWords = old.sessionWords;
      sentences = Map.empty<Nat, Sentence>();
      nextSentenceId = 0;
    };
  };
};
