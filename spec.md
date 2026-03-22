# Word Learner Pro

## Current State
The Motoko backend stores words, sentences, and their styles in non-stable variables. On every canister upgrade (new deployment), all stored data including font/color styles is erased.

## Requested Changes (Diff)

### Add
- `stable var` declarations for `nextSentenceId` and `sessionWords`
- `stable var stableWords` and `stable var stableSentences` arrays for persisting map data across upgrades
- `system func preupgrade()` to serialize maps to stable arrays before upgrade
- `system func postupgrade()` to clear the stable arrays after they have been loaded into the maps

### Modify
- `var nextSentenceId` -> `stable var nextSentenceId`
- `var sessionWords` -> `stable var sessionWords`
- `let words` / `let sentences` maps initialized from stable arrays instead of empty

### Remove
- Nothing removed

## Implementation Plan
1. Add stable backing arrays for words and sentences
2. Initialize maps from those stable arrays at startup
3. Add preupgrade/postupgrade system hooks to persist data on canister upgrade
