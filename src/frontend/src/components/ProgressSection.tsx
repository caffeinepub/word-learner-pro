import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getWeeklyData } from "@/lib/wordUtils";
import { useState } from "react";
import type { Word } from "../backend.d";

interface ProgressSectionProps {
  words: Word[];
  totalWords: number;
  goal: number;
  onGoalChange: (g: number) => void;
}

export function ProgressSection({
  words,
  totalWords,
  goal,
  onGoalChange,
}: ProgressSectionProps) {
  const weeklyData = getWeeklyData(words);
  const maxCount = Math.max(...weeklyData.map((w) => w.count), 1);
  const progressPct = Math.min((totalWords / goal) * 100, 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly bar chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Words Added Per Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {weeklyData.map((w) => (
              <div
                key={w.label}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <span className="text-xs text-muted-foreground">{w.count}</span>
                <div
                  className="w-full rounded-t-sm bg-primary transition-all"
                  style={{
                    height: `${(w.count / maxCount) * 100}%`,
                    minHeight: w.count > 0 ? "4px" : "0",
                  }}
                />
                <span className="text-xs text-muted-foreground">{w.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Vocabulary Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {totalWords} / {goal} words
              </span>
            </div>
            <Progress
              data-ocid="progress.goal.bar"
              value={progressPct}
              className="h-3"
            />
            <p className="text-xs text-muted-foreground">
              {progressPct >= 100
                ? "🎉 Goal reached! Set a new one."
                : `${Math.round(progressPct)}% complete — ${goal - totalWords} words to go!`}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-input">Set Goal (words)</Label>
            <Input
              id="goal-input"
              data-ocid="progress.goal.input"
              type="number"
              min={1}
              value={goal}
              onChange={(e) => onGoalChange(Number(e.target.value) || 100)}
              className="max-w-[120px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
