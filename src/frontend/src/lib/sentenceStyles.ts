import type { WordStyle } from "../backend.d";

const STORAGE_KEY = "wlp_sentence_styles_v2";

type SentenceStyleRecord = {
  fontFamily: string;
  color: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

function toRecord(style: WordStyle): SentenceStyleRecord {
  return {
    fontFamily: style.fontFamily,
    color: style.color,
    fontSize: Number(style.fontSize),
    bold: style.bold,
    italic: style.italic,
    underline: style.underline,
  };
}

function fromRecord(r: SentenceStyleRecord): WordStyle {
  return {
    fontFamily: r.fontFamily,
    color: r.color,
    fontSize: BigInt(r.fontSize),
    bold: r.bold,
    italic: r.italic,
    underline: r.underline,
  };
}

function loadAll(): Record<string, SentenceStyleRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, SentenceStyleRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getSentenceStyleOverride(sentenceId: string): WordStyle | null {
  const all = loadAll();
  const rec = all[sentenceId];
  return rec ? fromRecord(rec) : null;
}

export function setSentenceStyleOverride(sentenceId: string, style: WordStyle) {
  const all = loadAll();
  all[sentenceId] = toRecord(style);
  saveAll(all);
}

export function deleteSentenceStyleOverride(sentenceId: string) {
  const all = loadAll();
  delete all[sentenceId];
  saveAll(all);
}
