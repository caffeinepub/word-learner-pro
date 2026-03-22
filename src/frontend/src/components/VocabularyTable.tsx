import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWordStyleOverride } from "@/lib/wordStyles";
import {
  CATEGORY_COLORS,
  getCategory,
  getDifficulty,
  getWordStyle,
} from "@/lib/wordUtils";
import { Palette, Pencil, Trash2 } from "lucide-react";
import type { Word } from "../backend.d";

interface VocabularyTableProps {
  words: Word[];
  loading: boolean;
  searchQuery: string;
  highlightEnabled: boolean;
  /** Increments when a style is saved, forcing this component to re-read localStorage */
  styleRevision: number;
  onEdit: (word: Word) => void;
  onDelete: (text: string) => void;
}

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];
const DOT_KEYS = ["d1", "d2", "d3", "d4", "d5"];

function HighlightedText({
  text,
  query,
  enabled,
}: { text: string; query: string; enabled: boolean }) {
  if (!enabled || !query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-inherit rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function VocabularyTable({
  words,
  loading,
  searchQuery,
  highlightEnabled,
  styleRevision: _styleRevision,
  onEdit,
  onDelete,
}: VocabularyTableProps) {
  if (loading) {
    return (
      <div data-ocid="vocabulary.loading_state" className="space-y-2 p-4">
        {SKELETON_KEYS.map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div
        data-ocid="vocabulary.empty_state"
        className="text-center py-16 text-muted-foreground"
      >
        <div className="text-4xl mb-3">📚</div>
        <p className="font-medium">No words found</p>
        <p className="text-sm mt-1">
          {searchQuery
            ? "Try a different search term."
            : "Add your first word to get started!"}
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="vocabulary.table" className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="w-[180px]">Word</TableHead>
            <TableHead>Definition</TableHead>
            <TableHead className="w-[120px]">Category</TableHead>
            <TableHead className="w-[100px]">Difficulty</TableHead>
            <TableHead className="w-[130px]">Added</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {words.map((word, index) => {
            const category = getCategory(word.text);
            const difficulty = getDifficulty(word.text);
            // Always prefer localStorage override over backend style
            const styleOverride = getWordStyleOverride(word.text);
            const wordStyle = getWordStyle(styleOverride ?? word.style);
            const addedAt = new Date(Number(word.addedAt / 1_000_000n));
            const markerIndex = index + 1;

            return (
              <TableRow
                key={word.text}
                data-ocid={`vocabulary.item.${markerIndex}`}
                className="border-border hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <span style={wordStyle} className="font-medium">
                    <HighlightedText
                      text={word.text}
                      query={searchQuery}
                      enabled={highlightEnabled}
                    />
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  —
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${CATEGORY_COLORS[category]}`}
                  >
                    {category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-0.5">
                    {DOT_KEYS.map((dk, i) => (
                      <div
                        key={dk}
                        className={`w-2 h-2 rounded-full ${
                          i < difficulty ? "bg-primary" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {addedAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      data-ocid={`vocabulary.style_button.${markerIndex}`}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => onEdit(word)}
                      aria-label={`Style ${word.text}`}
                    >
                      <Palette size={13} />
                    </Button>
                    <Button
                      data-ocid={`vocabulary.edit_button.${markerIndex}`}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(word)}
                      aria-label={`Edit ${word.text}`}
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      data-ocid={`vocabulary.delete_button.${markerIndex}`}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(word.text)}
                      aria-label={`Delete ${word.text}`}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
