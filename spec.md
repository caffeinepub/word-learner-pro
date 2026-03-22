# Word Learner Pro

## Current State
Full-stack English vocabulary learning app with sentence management, per-word styling, progress tracking, and localStorage-based style persistence. Five tabs: Dashboard, My Vocabulary, Sentences, Tools, Progress.

## Requested Changes (Diff)

### Add
- New "Arabic" tab in navigation
- TranslationsView component: lists all saved red-word entries, each showing the English text in red and an "Add" button at the top
- AddTranslationModal: form with English text field + Arabic translation field
- TranslationCard: displays English phrase in red bold; clicking it opens a popup showing the Arabic translation in a clear, styled panel
- `src/frontend/src/lib/translations.ts`: localStorage CRUD for translation entries (`wlp_translations_v1`)
- Each entry: `{ id: string, english: string, arabic: string }`

### Modify
- AppHeader: add "Arabic" tab to NAV_ITEMS
- App.tsx: render TranslationsView when activeTab === "arabic"

### Remove
- Nothing removed

## Implementation Plan
1. Create `lib/translations.ts` with get/add/delete helpers using localStorage key `wlp_translations_v1`
2. Create `components/TranslationCard.tsx` showing red English text; click opens inline popover with Arabic translation
3. Create `components/AddTranslationModal.tsx` with English + Arabic fields
4. Create `components/TranslationsView.tsx` with list + add button
5. Update `AppHeader.tsx` to add Arabic nav item
6. Update `App.tsx` to import and render TranslationsView for activeTab === "arabic"
