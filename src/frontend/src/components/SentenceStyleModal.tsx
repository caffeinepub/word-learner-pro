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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { GOOGLE_FONTS, getWordStyle, loadGoogleFont } from "@/lib/wordUtils";
import { Bold, Italic, Loader2, Underline, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { WordStyle } from "../backend.d";

const DEFAULT_STYLE: WordStyle = {
  fontFamily: "Inter",
  color: "#1FA6A6",
  fontSize: 16n,
  bold: false,
  italic: false,
  underline: false,
};

interface SentenceStyleModalProps {
  open: boolean;
  sentenceId: bigint | null;
  sentenceText: string;
  onClose: () => void;
  onSave: (sentenceId: bigint, style: WordStyle) => Promise<void>;
}

export function SentenceStyleModal({
  open,
  sentenceId,
  sentenceText,
  onClose,
  onSave,
}: SentenceStyleModalProps) {
  const [style, setStyle] = useState<WordStyle>(DEFAULT_STYLE);
  const [saving, setSaving] = useState(false);
  const [customFontName, setCustomFontName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setStyle(DEFAULT_STYLE);
  }, [open]);

  useEffect(() => {
    if (
      style.fontFamily &&
      GOOGLE_FONTS.includes(style.fontFamily) &&
      style.fontFamily !== "Inter"
    ) {
      loadGoogleFont(style.fontFamily);
    }
  }, [style.fontFamily]);

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fontName = file.name.replace(/\.[^.]+$/, "");
    const buffer = await file.arrayBuffer();
    const font = new FontFace(fontName, buffer);
    await font.load();
    document.fonts.add(font);
    setCustomFontName(fontName);
    setStyle((prev) => ({ ...prev, fontFamily: fontName }));
  };

  const handleSave = async () => {
    if (!sentenceId) return;
    setSaving(true);
    try {
      await onSave(sentenceId, style);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const previewCss = getWordStyle({
    ...style,
    fontSize:
      typeof style.fontSize === "bigint"
        ? style.fontSize
        : BigInt(style.fontSize),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="sentence_style.dialog" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Style Entire Sentence</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Preview */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center justify-center min-h-[72px]">
            <span style={previewCss}>{sentenceText}</span>
          </div>

          {/* Font Family */}
          <div className="space-y-1.5">
            <Label>Font Family</Label>
            <Select
              value={style.fontFamily}
              onValueChange={(v) =>
                setStyle((prev) => ({ ...prev, fontFamily: v }))
              }
            >
              <SelectTrigger data-ocid="sentence_style.font.select">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {GOOGLE_FONTS.map((f) => (
                  <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </SelectItem>
                ))}
                {customFontName && (
                  <SelectItem value={customFontName}>
                    {customFontName} (Custom)
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Font Upload */}
          <div className="space-y-1.5">
            <Label>Upload Custom Font (TTF/OTF)</Label>
            <div className="flex gap-2">
              <Button
                data-ocid="sentence_style.upload_button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={14} />
                Upload Font
              </Button>
              {customFontName && (
                <span className="text-sm text-muted-foreground self-center">
                  {customFontName}
                </span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".ttf,.otf"
              className="hidden"
              onChange={handleFontUpload}
            />
          </div>

          {/* Color + Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex gap-2 items-center">
                <input
                  data-ocid="sentence_style.color.input"
                  type="color"
                  value={style.color}
                  onChange={(e) =>
                    setStyle((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="w-10 h-9 rounded-md border border-input cursor-pointer p-0.5"
                />
                <Input
                  value={style.color}
                  onChange={(e) =>
                    setStyle((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Font Size (px)</Label>
              <Input
                data-ocid="sentence_style.fontsize.input"
                type="number"
                min={12}
                max={72}
                value={Number(style.fontSize)}
                onChange={(e) =>
                  setStyle((prev) => ({
                    ...prev,
                    fontSize: BigInt(e.target.value || 16),
                  }))
                }
              />
            </div>
          </div>

          {/* Text Style Toggles */}
          <div className="space-y-1.5">
            <Label>Text Style</Label>
            <div className="flex gap-2">
              <Toggle
                data-ocid="sentence_style.bold.toggle"
                pressed={style.bold}
                onPressedChange={(v) =>
                  setStyle((prev) => ({ ...prev, bold: v }))
                }
                aria-label="Bold"
                className="gap-1.5"
              >
                <Bold size={14} />
                Bold
              </Toggle>
              <Toggle
                data-ocid="sentence_style.italic.toggle"
                pressed={style.italic}
                onPressedChange={(v) =>
                  setStyle((prev) => ({ ...prev, italic: v }))
                }
                aria-label="Italic"
                className="gap-1.5"
              >
                <Italic size={14} />
                Italic
              </Toggle>
              <Toggle
                data-ocid="sentence_style.underline.toggle"
                pressed={style.underline}
                onPressedChange={(v) =>
                  setStyle((prev) => ({ ...prev, underline: v }))
                }
                aria-label="Underline"
                className="gap-1.5"
              >
                <Underline size={14} />
                Underline
              </Toggle>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            data-ocid="sentence_style.cancel_button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="sentence_style.save_button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Apply to All Words
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
