# Word Learner Pro

## Current State
The app stores individual words with per-word styling (font, color, size, bold/italic/underline). It has:
- Word add modal (single word/sentence splits into words, or batch import)
- Vocabulary table listing all individual words with styles
- Word customization modal for style editing
- Progress and learning tools tabs
- Backend: Word type with WordStyle, addWord/addWords/updateWordStyle/deleteWord/getStats

Missing: Sentences are split into words immediately on input and never stored as sentence units. There is no "Sentences" view showing full sentences together with per-word visual styling.

## Requested Changes (Diff)

### Add
- Backend `Sentence` type: `{ id: Nat, text: Text, addedAt: Int, wordStyles: [(Text, WordStyle)] }` stored as a stable map
- Backend APIs: `addSentence(text)`, `getAllSentences()`, `updateSentenceWordStyle(id, wordText, style)`, `deleteSentence(id)`
- `addSentence` internally extracts words, adds new ones to words map for tracking, and stores sentence as a unit
- Frontend "Sentences" tab/view showing each sentence as a visual unit with per-word styling applied inline
- Clicking any word within a sentence opens style editor for that word (within the sentence's wordStyles)
- Search bar filters sentences by matching words within them
- SentenceDisplay component: renders sentence with each word styled individually, words flow inline
- SentenceCard component: shows full sentence, date, delete button, word count

### Modify
- AddWordModal: "Single / Sentence" tab now routes to `addSentence` when input contains multiple words; single word uses existing `addWord`
- App.tsx: add "sentences" tab, wire up new sentence queries/mutations
- AppHeader: add Sentences tab navigation item
- SearchBar: extend to filter sentence words

### Remove
- Nothing removed, existing word-level storage and vocabulary table remain

## Implementation Plan
1. Update backend main.mo: add Sentence type, sentence storage map, addSentence/getAllSentences/updateSentenceWordStyle/deleteSentence APIs
2. Regenerate backend.d.ts bindings to include Sentence interfaces and new methods
3. Add useGetAllSentences, useAddSentence, useDeleteSentence, useUpdateSentenceWordStyle hooks
4. Create SentenceDisplay component: renders sentence text as inline word spans each with custom style
5. Create SentenceCard component: wraps SentenceDisplay with metadata and actions
6. Create SentencesView component: lists all sentences, search-filtered
7. Update AddWordModal: detect multi-word input, call addSentence
8. Update AppHeader: add Sentences tab
9. Update App.tsx: integrate sentences tab and data
