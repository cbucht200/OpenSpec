## Context

The `revise` workflow (`src/core/templates/workflows/revise.ts`) conducts a structured interview to nail down implementation decisions and writes the results to `decisions.md`. When a user runs `architect` before `revise`, the revise interview can override architectural choices made during architect — yet `architecture.md` is never updated. Both documents are read by downstream steps (`propose`, `apply`), creating an inconsistent picture of the intended design.

The fix is a new final step in the `revise` skill template that detects and resolves contradictions between `decisions.md` and `architecture.md` before the workflow concludes.

## Goals / Non-Goals

**Goals:**
- Add a Step 7 to the revise skill instruction text that runs an alignment subagent after `decisions.md` is written
- The subagent finds genuine contradictions (not refinements) between `decisions.md` and `architecture.md`
- The user sees a clear summary of conflicts and confirms before any changes are applied
- Only contradicted sections of `architecture.md` are patched; unchanged sections are preserved
- The step is a no-op when `architecture.md` does not exist
- The same alignment step is summarized in the condensed command template

**Non-Goals:**
- No new CLI commands, flags, or runtime code paths
- No changes to the architect workflow
- No changes to any other skill templates
- Not a full rewrite of `architecture.md` — surgical patches only

## Decisions

### Placement: After decisions.md, before the "run propose" suggestion

The alignment step must run after `decisions.md` is fully written so the subagent operates on the complete, final decision set. It is placed as Step 7 (the current closing suggestion becomes Step 8 / "After decisions.md" section).

**Alternatives considered:**
- During the interview: Too early — decisions accumulate throughout the interview; the alignment logic would need to run incrementally.
- As a separate command: Adds friction; users would need to remember to run it. The natural moment is immediately after revise completes.

### Scope: Contradictions only, not refinements

The subagent is explicitly instructed to find places where `decisions.md` says something *contrary* to `architecture.md` — not places where `decisions.md` adds detail on topics `architecture.md` was silent about. Refinements are expected and correct; contradictions are the problem.

**Why this matters:** An overly broad alignment step that "updates architecture.md to match decisions.md everywhere" would degrade the architecture document by filling it with implementation-level detail that belongs only in decisions.md.

### User confirmation before patching

The user is shown the list of contradictions and must confirm before `architecture.md` is modified. This keeps the step transparent and prevents silent mutations to a document the user may consider stable.

**Alternatives considered:**
- Auto-patch without confirmation: Too aggressive; the user may have intentionally diverged (e.g., decided to leave architecture.md as a historical record of the original intent).

### Implementation: text changes only in revise.ts

This is purely a skill template change — instruction text in `getReviseSkillTemplate()` and the condensed version in `getOpsxReviseCommandTemplate()`. No runtime TypeScript logic is added. The subagent behavior is governed entirely by the instruction text given to the AI.

## Risks / Trade-offs

- **Subagent over-patches** → Mitigation: The instruction text explicitly limits scope to contradictions, not refinements. The user confirmation gate provides a final check.
- **False positives (flags refinements as contradictions)** → Mitigation: The subagent prompt uses a precise definition; "something decisions.md says that contradicts what architecture.md states" vs. "something decisions.md adds that architecture.md doesn't mention."
- **architecture.md doesn't exist** → No risk; step is explicitly skipped. Cold-start revise sessions without a prior architect run are unaffected.
- **Same-session continuation (architect → revise in one context window)** → No special handling needed; the agent already has both documents in context and the alignment step works the same way.
