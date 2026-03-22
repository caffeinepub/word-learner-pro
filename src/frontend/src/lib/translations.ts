export interface TranslationEntry {
  id: string;
  english: string;
  arabic: string;
}

const STORAGE_KEY = "wlp_translations_v1";

export function getTranslations(): TranslationEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTranslation(
  english: string,
  arabic: string,
): TranslationEntry {
  const entries = getTranslations();
  const entry: TranslationEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    english,
    arabic,
  };
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entry;
}

export function deleteTranslation(id: string): void {
  const entries = getTranslations().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
