import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { TranslationEntry } from "../lib/translations";

interface TranslationCardProps {
  entry: TranslationEntry;
  onDelete: (id: string) => void;
}

export function TranslationCard({ entry, onDelete }: TranslationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="relative shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4 pr-10">
        <button
          type="button"
          data-ocid="translation.item.button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-left w-full"
        >
          <span className="text-red-600 font-bold text-base leading-relaxed hover:text-red-700 transition-colors">
            {entry.english}
          </span>
        </button>

        {expanded && (
          <div
            className="mt-3 p-3 rounded-lg bg-muted border border-border"
            dir="rtl"
          >
            <p
              className="text-foreground text-xl leading-relaxed font-medium"
              style={{
                fontFamily: "'Noto Sans Arabic', 'Arabic Typesetting', serif",
              }}
            >
              {entry.arabic}
            </p>
          </div>
        )}
      </CardContent>

      <button
        type="button"
        data-ocid="translation.delete_button"
        onClick={() => onDelete(entry.id)}
        className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Delete translation"
      >
        <Trash2 size={14} />
      </button>
    </Card>
  );
}
