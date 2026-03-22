import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddTranslationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (english: string, arabic: string) => void;
}

export function AddTranslationModal({
  open,
  onClose,
  onAdd,
}: AddTranslationModalProps) {
  const [english, setEnglish] = useState("");
  const [arabic, setArabic] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!english.trim() || !arabic.trim()) {
      setError("Both fields are required.");
      return;
    }
    onAdd(english.trim(), arabic.trim());
    setEnglish("");
    setArabic("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setEnglish("");
    setArabic("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="translation.dialog">
        <DialogHeader>
          <DialogTitle>Add Arabic Translation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="english-input">English text</Label>
            <Input
              id="english-input"
              data-ocid="translation.input"
              placeholder="Hello and welcome"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="arabic-input">Arabic translation</Label>
            <Input
              id="arabic-input"
              data-ocid="translation.arabic.input"
              dir="rtl"
              placeholder="مرحبًا وأهلاً"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ fontFamily: "'Noto Sans Arabic', serif" }}
            />
          </div>

          {error && (
            <p
              data-ocid="translation.error_state"
              className="text-sm text-red-600"
            >
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="translation.cancel_button"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-ocid="translation.submit_button">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
