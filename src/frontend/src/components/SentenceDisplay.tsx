import { DEFAULT_STYLE, getWordStyle, splitIntoWords } from "@/lib/wordUtils";
import type { Sentence, WordStyle } from "../backend.d";
import { getSentenceStyleOverride } from "../lib/sentenceStyles";
import { getSentenceWordStyleOverride } from "../lib/sentenceWordStyles";

interface SentenceDisplayProps {
  sentence: Sentence;
  onWordClick?: (wordText: string, currentStyle: WordStyle) => void;
  /** Increments when a style is saved, forcing this component to re-read localStorage */
  styleRevision?: number;
}

export function SentenceDisplay({
  sentence,
  onWordClick,
  styleRevision: _styleRevision,
}: SentenceDisplayProps) {
  const words = splitIntoWords(sentence.text);
  const styleMap = new Map(sentence.wordStyles);
  const sentenceIdStr = String(sentence.id);

  // Sentence-level override (from "Apply to All Words")
  const sentenceOverride = getSentenceStyleOverride(sentenceIdStr);

  return (
    <p className="leading-relaxed text-base">
      {words.map((word, i) => {
        // Priority: individual word localStorage > sentence-wide localStorage > backend per-word > default
        const individualOverride = getSentenceWordStyleOverride(
          sentenceIdStr,
          word,
        );
        const backendStyle =
          styleMap.get(word) ?? styleMap.get(word.toLowerCase());
        const style =
          individualOverride ??
          sentenceOverride ??
          backendStyle ??
          DEFAULT_STYLE;
        const cssStyle = getWordStyle(style);
        const key = `word-${i}-${word}`;
        return (
          <span key={key}>
            <span
              role={onWordClick ? "button" : undefined}
              tabIndex={onWordClick ? 0 : undefined}
              style={cssStyle}
              className={
                onWordClick
                  ? "cursor-pointer hover:opacity-70 transition-opacity rounded px-0.5"
                  : ""
              }
              onClick={() => onWordClick?.(word, style)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  onWordClick?.(word, style);
              }}
              title={onWordClick ? `Click to style "${word}"` : undefined}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
