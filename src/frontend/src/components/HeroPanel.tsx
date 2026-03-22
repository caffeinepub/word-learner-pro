import { Button } from "@/components/ui/button";
import { calculateStreak } from "@/lib/wordUtils";
import { BookOpen, Flame, Plus, Zap } from "lucide-react";
import type { Word } from "../backend.d";

interface HeroPanelProps {
  totalWords: number;
  sessionWords: number;
  words: Word[];
  onAddWord: () => void;
  onBatchImport: () => void;
}

export function HeroPanel({
  totalWords,
  sessionWords,
  words,
  onAddWord,
  onBatchImport,
}: HeroPanelProps) {
  const streak = calculateStreak(words);

  return (
    <div
      className="rounded-2xl p-8 text-white animate-fade-in"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.28 0.06 240) 0%, oklch(0.35 0.07 240) 100%)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: copy */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, Alex! 👋</h1>
          <p className="text-white/70 text-sm">
            Keep building your vocabulary. You're doing great!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {totalWords.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">Words Learned</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Flame size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-white/60 text-xs">Day Streak</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold">{sessionWords}</div>
                <div className="text-white/60 text-xs">Session Words</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            data-ocid="hero.add_word.primary_button"
            onClick={onAddWord}
            className="bg-white text-foreground hover:bg-white/90 font-semibold gap-2"
          >
            <Plus size={16} />
            Add Word
          </Button>
          <Button
            data-ocid="hero.batch_import.secondary_button"
            onClick={onBatchImport}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold"
          >
            Batch Import
          </Button>
        </div>
      </div>
    </div>
  );
}
