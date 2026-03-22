import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { splitIntoWords } from "@/lib/wordUtils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AddWordModalProps {
  open: boolean;
  onClose: () => void;
  existingWords: Set<string>;
  onAdd: (words: string[]) => Promise<void>;
  onAddSentence?: (text: string) => Promise<void>;
  isBatchMode?: boolean;
}

export function AddWordModal({
  open,
  onClose,
  existingWords,
  onAdd,
  onAddSentence,
  isBatchMode = false,
}: AddWordModalProps) {
  const [singleInput, setSingleInput] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isSentence = splitIntoWords(singleInput).length > 1;

  const handleSingleSubmit = async () => {
    const trimmed = singleInput.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      if (isSentence && onAddSentence) {
        await onAddSentence(trimmed);
      } else {
        const words = splitIntoWords(trimmed).filter(
          (w) => !existingWords.has(w.toLowerCase()),
        );
        if (words.length === 0) return;
        await onAdd(words);
      }
      setSingleInput("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async () => {
    const lines = batchInput
      .split(/\n|,/)
      .flatMap((line) => splitIntoWords(line))
      .filter((w) => !existingWords.has(w.toLowerCase()));
    const unique = [...new Set(lines)];
    if (unique.length === 0) return;
    setLoading(true);
    try {
      await onAdd(unique);
      setBatchInput("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="add_word.dialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Words or Sentences</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={isBatchMode ? "batch" : "single"}>
          <TabsList className="w-full">
            <TabsTrigger
              data-ocid="add_word.single.tab"
              value="single"
              className="flex-1"
            >
              Single / Sentence
            </TabsTrigger>
            <TabsTrigger
              data-ocid="add_word.batch.tab"
              value="batch"
              className="flex-1"
            >
              Batch Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="single-input">Word or Sentence</Label>
              <Input
                id="single-input"
                data-ocid="add_word.single.input"
                placeholder={'e.g. serendipity or "The quick brown fox"'}
                value={singleInput}
                onChange={(e) => setSingleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSingleSubmit()}
              />
              {singleInput.trim() && (
                <p
                  className={`text-xs font-medium ${
                    isSentence ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {isSentence
                    ? "✦ This will be added as a sentence (click words to style them individually)"
                    : "This will be added as a word to your vocabulary"}
                </p>
              )}
            </div>
            <Button
              data-ocid="add_word.single.submit_button"
              onClick={handleSingleSubmit}
              className="w-full"
              disabled={loading || !singleInput.trim()}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSentence ? "Add Sentence" : "Add Word"}
            </Button>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="batch-input">
                Words or Sentences (one per line or comma-separated)
              </Label>
              <Textarea
                id="batch-input"
                data-ocid="add_word.batch.textarea"
                placeholder={
                  "serendipity\nepiphany\nThe early bird catches the worm\nmagnanimous, eloquent"
                }
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                className="min-h-[140px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Only new words will be added. Duplicates are skipped.
              </p>
            </div>
            <Button
              data-ocid="add_word.batch.submit_button"
              onClick={handleBatchSubmit}
              className="w-full"
              disabled={loading || !batchInput.trim()}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Import Words
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
