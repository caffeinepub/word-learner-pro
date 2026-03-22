import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Sentence, Word, WordStyle } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllWords() {
  const { actor, isFetching } = useActor();
  return useQuery<Word[]>({
    queryKey: ["words"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return { sessionWords: 0n, totalWords: 0n, totalSentences: 0n };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addWord(text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["words"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAddWords() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (texts: string[]) => {
      if (!actor) throw new Error("No actor");
      return actor.addWords(texts);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["words"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteWord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteWord(text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["words"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateWordStyle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ text, style }: { text: string; style: WordStyle }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateWordStyle(text, style);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["words"] });
    },
  });
}

export function useGetAllSentences() {
  const { actor, isFetching } = useActor();
  return useQuery<Sentence[]>({
    queryKey: ["sentences"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSentences();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSentence() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addSentence(text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sentences"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteSentence() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sentenceId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSentence(sentenceId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sentences"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateSentenceWordStyle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sentenceId,
      wordText,
      style,
    }: {
      sentenceId: bigint;
      wordText: string;
      style: WordStyle;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSentenceWordStyle(sentenceId, wordText, style);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sentences"] });
    },
  });
}

export function useUpdateSentenceStyle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sentenceId,
      style,
    }: {
      sentenceId: bigint;
      style: WordStyle;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSentenceStyle(sentenceId, style);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sentences"] });
    },
  });
}
