import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { WordStyle } from "../backend.d";
import { useGetAllSentences } from "../hooks/useQueries";
import { SentenceCard } from "./SentenceCard";

interface SentencesViewProps {
  onAddSentence: () => void;
  onDelete: (id: bigint) => void;
  onWordClick: (sentenceId: bigint, wordText: string, style: WordStyle) => void;
  onStyleSentence: (sentenceId: bigint) => void;
  totalSentences: number;
  styleRevision: number;
}

export function SentencesView({
  onAddSentence,
  onDelete,
  onWordClick,
  onStyleSentence,
  totalSentences,
  styleRevision,
}: SentencesViewProps) {
  const { data: sentences = [], isLoading } = useGetAllSentences();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Sentences</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalSentences} sentence{totalSentences !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Button
          data-ocid="sentences.add_button"
          size="sm"
          className="gap-1.5"
          onClick={onAddSentence}
        >
          <Plus size={14} />
          Add Sentence
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-3xl mb-3">⏳</div>
          <p>Loading sentences...</p>
        </div>
      )}

      {!isLoading && sentences.length === 0 && (
        <div
          data-ocid="sentences.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium">No sentences yet</p>
          <p className="text-sm mt-1">
            Add your first sentence to get started!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {sentences.map((sentence, index) => (
          <SentenceCard
            key={sentence.id.toString()}
            sentence={sentence}
            index={index + 1}
            onDelete={onDelete}
            onWordClick={onWordClick}
            onStyleSentence={onStyleSentence}
            styleRevision={styleRevision}
          />
        ))}
      </div>
    </div>
  );
}
