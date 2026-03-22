import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  addTranslation,
  deleteTranslation,
  getTranslations,
} from "../lib/translations";
import { AddTranslationModal } from "./AddTranslationModal";
import { TranslationCard } from "./TranslationCard";

export function TranslationsView() {
  const [entries, setEntries] = useState(() => getTranslations());
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (english: string, arabic: string) => {
    const entry = addTranslation(english, arabic);
    setEntries((prev) => [...prev, entry]);
  };

  const handleDelete = (id: string) => {
    deleteTranslation(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Arabic Translations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} —
            click any red text to reveal its Arabic translation
          </p>
        </div>
        <Button
          data-ocid="translation.open_modal_button"
          onClick={() => setModalOpen(true)}
          className="gap-2"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>

      {/* List */}
      {entries.length === 0 ? (
        <div
          data-ocid="translation.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <span className="text-6xl mb-4">📖</span>
          <p className="text-lg font-medium text-foreground">
            No translations yet
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Add your first word or sentence to start learning.
          </p>
          <Button
            data-ocid="translation.empty.open_modal_button"
            className="mt-4 gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} />
            Add Translation
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {entries.map((entry, i) => (
            <div key={entry.id} data-ocid={`translation.item.${i + 1}`}>
              <TranslationCard entry={entry} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      <AddTranslationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
