import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    sessionWords: bigint;
    totalWords: bigint;
    totalSentences: bigint;
}
export interface Sentence {
    id: bigint;
    text: string;
    addedAt: bigint;
    wordStyles: Array<[string, WordStyle]>;
}
export interface WordStyle {
    italic: boolean;
    bold: boolean;
    color: string;
    underline: boolean;
    fontFamily: string;
    fontSize: bigint;
}
export interface Word {
    text: string;
    style: WordStyle;
    addedAt: bigint;
}
export interface backendInterface {
    addSentence(text: string): Promise<bigint>;
    addWord(text: string): Promise<boolean>;
    addWords(texts: Array<string>): Promise<bigint>;
    deleteSentence(sentenceId: bigint): Promise<void>;
    deleteWord(text: string): Promise<void>;
    getAllSentences(): Promise<Array<Sentence>>;
    getAllWords(): Promise<Array<Word>>;
    getStats(): Promise<Stats>;
    resetSessionCounter(): Promise<void>;
    updateSentenceWordStyle(sentenceId: bigint, wordText: string, style: WordStyle): Promise<void>;
    updateWordStyle(text: string, style: WordStyle): Promise<void>;
}
