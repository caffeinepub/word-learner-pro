import { DEFAULT_STYLE, getWordStyle, splitIntoWords } from "@/lib/wordUtils";
import type { Sentence, WordStyle } from "../backend.d";

interface SentenceDisplayProps {
  sentence: Sentence;
  onWordClick?: (wordText: string, currentStyle: WordStyle) => void;
}

export function SentenceDisplay({
  sentence,
  onWordClick,
}: SentenceDisplayProps) {
  const words = splitIntoWords(sentence.text);
  const styleMap = new Map(sentence.wordStyles);

  return (
    <p className="leading-relaxed text-base">
      {words.map((word, i) => {
        const style =
          styleMap.get(word) ??
          styleMap.get(word.toLowerCase()) ??
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
