import type { WordStyle } from "../backend.d";

const STORAGE_KEY = "wlp_word_styles_v1";

type WordStyleRecord = {
  fontFamily: string;
  color: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

function toRecord(style: WordStyle): WordStyleRecord {
  return {
    fontFamily: style.fontFamily,
    color: style.color,
    fontSize: Number(style.fontSize),
    bold: style.bold,
    italic: style.italic,
    underline: style.underline,
  };
}

function fromRecord(r: WordStyleRecord): WordStyle {
  return {
    fontFamily: r.fontFamily,
    color: r.color,
    fontSize: BigInt(r.fontSize),
    bold: r.bold,
    italic: r.italic,
    underline: r.underline,
  };
}

function loadAll(): Record<string, WordStyleRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, WordStyleRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getWordStyleOverride(wordText: string): WordStyle | null {
  const all = loadAll();
  const rec = all[wordText.toLowerCase()];
  return rec ? fromRecord(rec) : null;
}

export function setWordStyleOverride(wordText: string, style: WordStyle) {
  const all = loadAll();
  all[wordText.toLowerCase()] = toRecord(style);
  saveAll(all);
}

export function deleteWordStyleOverride(wordText: string) {
  const all = loadAll();
  delete all[wordText.toLowerCase()];
  saveAll(all);
}
