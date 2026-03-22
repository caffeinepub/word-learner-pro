import type { CSSProperties } from "react";
import type { Word, WordStyle } from "../backend.d";

export const DEFAULT_STYLE: WordStyle = {
  fontFamily: "Inter",
  color: "#1FA6A6",
  fontSize: 16n,
  bold: false,
  italic: false,
  underline: false,
};

export const CATEGORIES = [
  "Vocabulary",
  "Academic",
  "Business",
  "Casual",
  "Technical",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Vocabulary: "bg-blue-100 text-blue-700",
  Academic: "bg-purple-100 text-purple-700",
  Business: "bg-orange-100 text-orange-700",
  Casual: "bg-green-100 text-green-700",
  Technical: "bg-red-100 text-red-700",
};

export function getCategory(word: string): string {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash << 5) - hash + word.charCodeAt(i);
    hash |= 0;
  }
  return CATEGORIES[Math.abs(hash) % CATEGORIES.length];
}

export function getDifficulty(word: string): number {
  const len = word.length;
  if (len <= 3) return 1;
  if (len <= 5) return 2;
  if (len <= 7) return 3;
  if (len <= 10) return 4;
  return 5;
}

export function splitIntoWords(input: string): string[] {
  return input
    .split(/[\s,;.!?]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

export function getWordStyle(style: WordStyle): CSSProperties {
  return {
    fontFamily: style.fontFamily || "Inter",
    color: style.color || "#1FA6A6",
    fontSize: `${Number(style.fontSize) || 16}px`,
    fontWeight: style.bold ? "bold" : "normal",
    fontStyle: style.italic ? "italic" : "normal",
    textDecoration: style.underline ? "underline" : "none",
  };
}

export function calculateStreak(words: Word[]): number {
  if (words.length === 0) return 0;
  const days = new Set(
    words.map((w) => {
      const d = new Date(Number(w.addedAt / 1_000_000n));
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  let streak = 0;
  const current = new Date();
  while (true) {
    const key = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
    if (days.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getWeeklyData(
  words: Word[],
): { label: string; count: number }[] {
  const now = new Date();
  const weeks: { label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7 - 6);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - i * 7);
    const count = words.filter((w) => {
      const d = new Date(Number(w.addedAt / 1_000_000n));
      return d >= weekStart && d <= weekEnd;
    }).length;
    const label = `W${8 - i}`;
    weeks.push({ label, count });
  }
  return weeks;
}

export const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "Nunito",
  "Poppins",
  "Oswald",
  "Dancing Script",
  "Pacifico",
  "Lobster",
  "Source Sans Pro",
  "Ubuntu",
  "PT Sans",
  "Noto Sans",
];

export function loadGoogleFont(fontFamily: string) {
  const id = `gf-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}
