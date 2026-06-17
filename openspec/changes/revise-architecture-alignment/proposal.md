## Why

After running `architect` followed by `revise`, the revise interview can produce decisions that contradict or supersede content in `architecture.md`. This leaves the two documents out of sync: `architecture.md` reflects the original architectural intent while `decisions.md` captures the refined reality. Any downstream step (propose, apply) that reads both documents must mentally reconcile contradictions, and a developer reading only `architecture.md` gets a misleading picture.

## What Changes

- The `revise` workflow gains a final alignment step (Step 7) that runs after `decisions.md` is written.
- A scoped subagent compares `decisions.md` against `architecture.md` to find genuine contradictions (not refinements that merely add detail).
- The user is shown a summary of conflicts and asked to confirm before any patches are applied to `architecture.md`.
- Only contradicted sections are patched; the rest of `architecture.md` is preserved.
- If no contradictions exist, the step reports that and completes silently.
- If `architecture.md` does not exist in the change directory, the step is skipped.
- The condensed command template for `revise` is updated to match.

## Capabilities

### New Capabilities

- `revise-architecture-alignment`: At the end of the revise workflow, detect and resolve contradictions between `decisions.md` and `architecture.md`, keeping both documents consistent.

### Modified Capabilities

_(none — no existing spec-level behavior changes)_

## Impact

- `src/core/templates/workflows/revise.ts` — only file modified (both skill template and command template).
- No CLI commands, data models, or APIs are affected.
- No breaking changes.
