import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { splitIntoWords } from "@/lib/wordUtils";
import { Calendar, Palette, Trash2 } from "lucide-react";
import type { Sentence, WordStyle } from "../backend.d";
import { SentenceDisplay } from "./SentenceDisplay";

interface SentenceCardProps {
  sentence: Sentence;
  onDelete: (id: bigint) => void;
  onWordClick: (
    sentenceId: bigint,
    wordText: string,
    currentStyle: WordStyle,
  ) => void;
  onStyleSentence: (sentenceId: bigint) => void;
  index: number;
  styleRevision: number;
}

export function SentenceCard({
  sentence,
  onDelete,
  onWordClick,
  onStyleSentence,
  index,
  styleRevision,
}: SentenceCardProps) {
  const wordCount = splitIntoWords(sentence.text).length;
  const addedDate = new Date(Number(sentence.addedAt / 1_000_000n));
  const dateLabel = addedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      data-ocid={`sentences.item.${index}`}
      className="border border-border hover:border-primary/40 transition-all duration-200 hover:shadow-md group"
    >
      <CardContent className="p-4">
        <div className="mb-3">
          <SentenceDisplay
            sentence={sentence}
            styleRevision={styleRevision}
            onWordClick={(wordText, style) =>
              onWordClick(sentence.id, wordText, style)
            }
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {dateLabel}
            </span>
            <span className="text-border">·</span>
            <span>
              {wordCount} word{wordCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              data-ocid={`sentences.style_button.${index}`}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onStyleSentence(sentence.id)}
              title="Style all words"
            >
              <Palette size={13} />
            </Button>
            <Button
              data-ocid={`sentences.delete_button.${index}`}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
              onClick={() => onDelete(sentence.id)}
              title="Delete sentence"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
