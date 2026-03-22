import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { BookOpen, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Word, WordStyle } from "./backend.d";
import { AddWordModal } from "./components/AddWordModal";
import { AppHeader } from "./components/AppHeader";
import { HeroPanel } from "./components/HeroPanel";
import { LearningTools } from "./components/LearningTools";
import { ProgressSection } from "./components/ProgressSection";
import { SearchBar } from "./components/SearchBar";
import { SentenceStyleModal } from "./components/SentenceStyleModal";
import { SentenceWordStyleModal } from "./components/SentenceWordStyleModal";
import { SentencesView } from "./components/SentencesView";
import { TranslationsView } from "./components/TranslationsView";
import { VocabularyTable } from "./components/VocabularyTable";
import { WordCustomizationModal } from "./components/WordCustomizationModal";
import {
  useAddSentence,
  useAddWords,
  useDeleteSentence,
  useDeleteWord,
  useGetAllSentences,
  useGetAllWords,
  useGetStats,
  useUpdateSentenceStyle,
  useUpdateSentenceWordStyle,
  useUpdateWordStyle,
} from "./hooks/useQueries";
import {
  deleteSentenceStyleOverride,
  getSentenceStyleOverride,
  setSentenceStyleOverride,
} from "./lib/sentenceStyles";
import {
  deleteSentenceWordStylesForSentence,
  getSentenceWordStyleOverride,
  setSentenceWordStyleOverride,
} from "./lib/sentenceWordStyles";
import {
  deleteWordStyleOverride,
  getWordStyleOverride,
  setWordStyleOverride,
} from "./lib/wordStyles";
import { DEFAULT_STYLE } from "./lib/wordUtils";

const queryClient = new QueryClient();

function AppContent() {
  const queryClientInstance = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  // styleRevision is incremented after every style save to force re-renders
  const [styleRevision, setStyleRevision] = useState(0);
  const [goal, setGoal] = useState<number>(() => {
    const stored = localStorage.getItem("wlp_goal");
    return stored ? Number.parseInt(stored, 10) : 100;
  });

  // Sentence word style modal state
  const [sentenceStyleModal, setSentenceStyleModal] = useState<{
    open: boolean;
    sentenceId: bigint | null;
    wordText: string;
    initialStyle: WordStyle;
  }>({
    open: false,
    sentenceId: null,
    wordText: "",
    initialStyle: DEFAULT_STYLE,
  });

  // Sentence-level style modal state
  const [sentenceAllStyleModal, setSentenceAllStyleModal] = useState<{
    open: boolean;
    sentenceId: bigint | null;
    sentenceText: string;
    initialStyle: WordStyle;
  }>({
    open: false,
    sentenceId: null,
    sentenceText: "",
    initialStyle: DEFAULT_STYLE,
  });

  const { data: words = [], isLoading: wordsLoading } = useGetAllWords();
  const { data: sentences = [] } = useGetAllSentences();
  const { data: stats } = useGetStats();
  const addWordsMutation = useAddWords();
  const deleteWordMutation = useDeleteWord();
  const updateStyleMutation = useUpdateWordStyle();
  const addSentenceMutation = useAddSentence();
  const deleteSentenceMutation = useDeleteSentence();
  const updateSentenceWordStyleMutation = useUpdateSentenceWordStyle();
  const updateSentenceStyleMutation = useUpdateSentenceStyle();

  // Persist goal
  useEffect(() => {
    localStorage.setItem("wlp_goal", String(goal));
  }, [goal]);

  const totalWords = Number(stats?.totalWords ?? 0);
  const sessionWords = Number(stats?.sessionWords ?? 0);
  const totalSentences = Number(stats?.totalSentences ?? 0);

  const existingWordsSet = useMemo(
    () => new Set(words.map((w) => w.text.toLowerCase())),
    [words],
  );

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return words;
    const q = searchQuery.toLowerCase();
    return words.filter((w) => w.text.toLowerCase().includes(q));
  }, [words, searchQuery]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return words
      .filter((w) => w.text.toLowerCase().includes(q))
      .slice(0, 5)
      .map((w) => w.text);
  }, [words, searchQuery]);

  const handleAddWords = async (newWords: string[]) => {
    const count = await addWordsMutation.mutateAsync(newWords);
    toast.success(
      `Added ${count} new word${count === 1n ? "" : "s"} to your vocabulary!`,
    );
  };

  const handleAddSentence = async (text: string) => {
    const count = await addSentenceMutation.mutateAsync(text);
    toast.success(
      `Sentence added! ${count} new word${count === 1n ? "" : "s"} learned.`,
    );
    setActiveTab("sentences");
  };

  const handleDeleteWord = async (text: string) => {
    await deleteWordMutation.mutateAsync(text);
    deleteWordStyleOverride(text);
    toast.success(`"${text}" removed from vocabulary.`);
  };

  const handleDeleteSentence = async (id: bigint) => {
    await deleteSentenceMutation.mutateAsync(id);
    deleteSentenceStyleOverride(String(id));
    deleteSentenceWordStylesForSentence(String(id));
    toast.success("Sentence deleted.");
  };

  const handleSaveStyle = async (text: string, style: WordStyle) => {
    // Save to localStorage immediately -- this is the source of truth for display
    setWordStyleOverride(text, style);
    // Bump styleRevision so VocabularyTable re-reads from localStorage
    setStyleRevision((r) => r + 1);
    // Also try backend (best effort)
    try {
      await updateStyleMutation.mutateAsync({ text, style });
    } catch {
      // localStorage already saved -- force re-render via query invalidation
      queryClientInstance.invalidateQueries({ queryKey: ["words"] });
    }
    toast.success(`Style updated for "${text}"`);
  };

  const handleSaveSentenceWordStyle = async (
    sentenceId: bigint,
    wordText: string,
    style: WordStyle,
  ) => {
    // Save to localStorage immediately -- source of truth for individual word display
    setSentenceWordStyleOverride(String(sentenceId), wordText, style);
    // Bump styleRevision so SentenceDisplay re-reads from localStorage
    setStyleRevision((r) => r + 1);
    // Also try backend (best effort)
    try {
      await updateSentenceWordStyleMutation.mutateAsync({
        sentenceId,
        wordText,
        style,
      });
    } catch {
      queryClientInstance.invalidateQueries({ queryKey: ["sentences"] });
    }
    toast.success(`Style updated for "${wordText}"`);
  };

  const handleStyleSentence = (sentenceId: bigint) => {
    const sentence = sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;
    // Load the currently saved style from localStorage (not DEFAULT)
    const currentStyle =
      getSentenceStyleOverride(String(sentenceId)) ?? DEFAULT_STYLE;
    setSentenceAllStyleModal({
      open: true,
      sentenceId,
      sentenceText: sentence.text,
      initialStyle: currentStyle,
    });
  };

  const handleSaveSentenceStyle = async (
    sentenceId: bigint,
    style: WordStyle,
  ) => {
    // Save to localStorage immediately -- this is the source of truth for display
    setSentenceStyleOverride(String(sentenceId), style);
    // Bump styleRevision so SentenceDisplay re-reads from localStorage
    setStyleRevision((r) => r + 1);
    // Also try backend (best effort)
    try {
      await updateSentenceStyleMutation.mutateAsync({ sentenceId, style });
    } catch {
      queryClientInstance.invalidateQueries({ queryKey: ["sentences"] });
    }
    toast.success("Style applied to all words in sentence!");
  };

  const openAddModal = () => {
    setBatchMode(false);
    setAddModalOpen(true);
  };

  const openBatchModal = () => {
    setBatchMode(true);
    setAddModalOpen(true);
  };

  const handleSentenceWordClick = (
    sentenceId: bigint,
    wordText: string,
    style: WordStyle,
  ) => {
    // Pre-load the individual word's saved style if available
    const savedStyle =
      getSentenceWordStyleOverride(String(sentenceId), wordText) ?? style;
    setSentenceStyleModal({
      open: true,
      sentenceId,
      wordText,
      initialStyle: savedStyle,
    });
  };

  // When the user opens the word style modal, load the localStorage override if available
  const handleEditWord = (w: Word) => {
    const override = getWordStyleOverride(w.text);
    if (override) {
      setEditingWord({ ...w, style: override });
    } else {
      setEditingWord(w);
    }
  };

  const renderVocabularySection = () => (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          <CardTitle className="text-base">My Vocabulary</CardTitle>
          <span className="text-xs text-muted-foreground">
            ({filteredWords.length} words)
          </span>
        </div>
        <Button
          data-ocid="vocabulary.add.primary_button"
          size="sm"
          className="gap-1.5"
          onClick={openAddModal}
        >
          <Plus size={14} />
          Add Word
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <VocabularyTable
          words={filteredWords}
          loading={wordsLoading}
          searchQuery={searchQuery}
          highlightEnabled={highlightEnabled}
          styleRevision={styleRevision}
          onEdit={handleEditWord}
          onDelete={handleDeleteWord}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-[1100px] mx-auto px-6 py-8 space-y-6">
        {/* Dashboard tab */}
        {(activeTab === "dashboard" ||
          activeTab === "vocabulary" ||
          activeTab === "tools" ||
          activeTab === "progress") && (
          <>
            {/* Hero - always visible */}
            {activeTab === "dashboard" && (
              <HeroPanel
                totalWords={totalWords}
                sessionWords={sessionWords}
                words={words}
                onAddWord={openAddModal}
                onBatchImport={openBatchModal}
              />
            )}

            {/* Vocabulary section */}
            {(activeTab === "dashboard" || activeTab === "vocabulary") && (
              <>
                <SearchBar
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  suggestions={suggestions}
                  highlightEnabled={highlightEnabled}
                  onHighlightToggle={setHighlightEnabled}
                  onSuggestionSelect={(w) => setSearchQuery(w)}
                />
                {renderVocabularySection()}
              </>
            )}

            {/* Progress section */}
            {(activeTab === "dashboard" || activeTab === "progress") && (
              <div>
                {activeTab === "dashboard" && (
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    Your Progress
                  </h2>
                )}
                <ProgressSection
                  words={words}
                  totalWords={totalWords}
                  goal={goal}
                  onGoalChange={setGoal}
                />
              </div>
            )}

            {/* Learning Tools */}
            {(activeTab === "dashboard" || activeTab === "tools") && (
              <LearningTools />
            )}
          </>
        )}

        {/* Sentences tab */}
        {activeTab === "sentences" && (
          <SentencesView
            onAddSentence={openAddModal}
            onDelete={handleDeleteSentence}
            onWordClick={handleSentenceWordClick}
            onStyleSentence={handleStyleSentence}
            totalSentences={totalSentences}
            styleRevision={styleRevision}
          />
        )}

        {/* Arabic Translations tab */}
        {activeTab === "arabic" && <TranslationsView />}
      </main>

      {/* Footer */}
      <footer className="footer-bg mt-16 py-8">
        <div className="max-w-[1100px] mx-auto px-6 text-center text-white/50 text-sm">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/80 transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* Modals */}
      <AddWordModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        existingWords={existingWordsSet}
        onAdd={handleAddWords}
        onAddSentence={handleAddSentence}
        isBatchMode={batchMode}
      />

      <WordCustomizationModal
        word={editingWord}
        onClose={() => setEditingWord(null)}
        onSave={handleSaveStyle}
      />

      <SentenceWordStyleModal
        open={sentenceStyleModal.open}
        sentenceId={sentenceStyleModal.sentenceId}
        wordText={sentenceStyleModal.wordText}
        initialStyle={sentenceStyleModal.initialStyle}
        onClose={() =>
          setSentenceStyleModal((prev) => ({ ...prev, open: false }))
        }
        onSave={handleSaveSentenceWordStyle}
      />

      <SentenceStyleModal
        open={sentenceAllStyleModal.open}
        sentenceId={sentenceAllStyleModal.sentenceId}
        sentenceText={sentenceAllStyleModal.sentenceText}
        initialStyle={sentenceAllStyleModal.initialStyle}
        onClose={() =>
          setSentenceAllStyleModal((prev) => ({ ...prev, open: false }))
        }
        onSave={handleSaveSentenceStyle}
      />

      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
