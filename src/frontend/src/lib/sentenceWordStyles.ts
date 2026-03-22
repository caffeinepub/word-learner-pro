import type { WordStyle } from "../backend.d";

const STORAGE_KEY = "wlp_sentence_word_styles_v1";

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

function makeKey(sentenceId: string, wordText: string): string {
  return `${sentenceId}:${wordText.toLowerCase()}`;
}

export function getSentenceWordStyleOverride(
  sentenceId: string,
  wordText: string,
): WordStyle | null {
  const all = loadAll();
  const rec = all[makeKey(sentenceId, wordText)];
  return rec ? fromRecord(rec) : null;
}

export function setSentenceWordStyleOverride(
  sentenceId: string,
  wordText: string,
  style: WordStyle,
) {
  const all = loadAll();
  all[makeKey(sentenceId, wordText)] = toRecord(style);
  saveAll(all);
}

export function deleteSentenceWordStylesForSentence(sentenceId: string) {
  const all = loadAll();
  const prefix = `${sentenceId}:`;
  for (const key of Object.keys(all)) {
    if (key.startsWith(prefix)) delete all[key];
  }
  saveAll(all);
}
