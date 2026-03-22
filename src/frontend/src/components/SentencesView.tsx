import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Plus, Search } from "lucide-react";
import { useState } from "react";
import type { WordStyle } from "../backend.d";
import { useGetAllSentences } from "../hooks/useQueries";
import { SentenceCard } from "./SentenceCard";

interface SentencesViewProps {
  onAddSentence: () => void;
  onDelete: (id: bigint) => void;
  onWordClick: (sentenceId: bigint, wordText: string, style: WordStyle) => void;
  onStyleSentence: (sentenceId: bigint) => void;
  totalSentences: number;
}

export function SentencesView({
  onAddSentence,
  onDelete,
  onWordClick,
  onStyleSentence,
  totalSentences,
}: SentencesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: sentences = [], isLoading } = useGetAllSentences();

  const filtered = searchQuery.trim()
    ? sentences.filter((s) =>
        s.text
          .toLowerCase()
          .split(/[\s,;.!?]+/)
          .some((w) => w.includes(searchQuery.toLowerCase().trim())),
      )
    : sentences;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">My Sentences</h2>
          <span className="text-sm text-muted-foreground ml-1">
            ({totalSentences} total)
          </span>
        </div>
        <Button
          data-ocid="sentences.add.primary_button"
          className="gap-2"
          onClick={onAddSentence}
        >
          <Plus size={16} />
          Add Sentence
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="sentences.search_input"
          placeholder="Search sentences by any word..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div data-ocid="sentences.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="sentences.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <MessageSquare size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No matching sentences" : "No sentences yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            {searchQuery
              ? "Try a different search term."
              : "Add your first sentence and start customizing word styles within it."}
          </p>
          {!searchQuery && (
            <Button
              data-ocid="sentences.empty.add.primary_button"
              onClick={onAddSentence}
              className="gap-2"
            >
              <Plus size={16} />
              Add Your First Sentence
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sentence, i) => (
            <SentenceCard
              key={String(sentence.id)}
              sentence={sentence}
              onDelete={onDelete}
              onWordClick={onWordClick}
              onStyleSentence={onStyleSentence}
              index={i + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
