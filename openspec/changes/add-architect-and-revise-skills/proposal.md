## Why

Implementation quality suffers when architectural decisions and low-level details are left ambiguous before coding starts. The current workflow jumps from open-ended exploration directly to artifact generation, leaving AI implementers to silently fill gaps with pattern-matching guesses rather than architecturally sound choices. Two new pre-implementation skills close this gap: `/opsx-architect` for goal-driven architectural design, and `/opsx-revise` for exhaustive detail clarification.

## What Changes

- **New skill**: `/opsx-architect` — a goal-driven, opinionated architectural design mode. Given a high-level goal, architect reads the codebase and OpenSpec context in parallel, challenges decisions that deviate from sound practices, recommends both breaking and non-breaking paths, and synthesizes a per-change `architecture.md` artifact.
- **New skill**: `/opsx-revise` — a systematic one-question-at-a-time interview that exhausts all implementation ambiguities. Covers a fixed domain checklist (data model, API, auth, error handling, state, testing, security, performance, observability, deployment, edge cases). Records every decision, override, and breaking change in a per-change `decisions.md` artifact. Uses a subagent "simulated implementer" to verify coverage before concluding.
- **New schema field**: `context:` on artifacts — optional context that is read if present but does not block artifact creation. Enables `architecture.md` and `decisions.md` to enrich downstream artifact generation without being required.
- **New schema artifacts**: `architecture` and `decisions` registered in `spec-driven` schema as implicitly optional (nothing requires them, they appear only in `context:` fields).
- **New templates**: `architecture.md` and `decisions.md` templates added to `spec-driven` schema.
- **Modified skill**: `/opsx-apply` — gains an explicit architectural decision threshold. Pauses and proposes when it hits issues that would change a data model, API contract, external dependency, or contradict existing decisions. On approval, updates all affected artifacts.
- **Modified skill**: `/opsx-verify` — expanded to check implementation against `architecture.md` (Key Architectural Decisions section) and `decisions.md` ([BREAKING] and [OVERRIDE] markers) in addition to tasks and specs.

## Capabilities

### New Capabilities

- `opsx-architect-skill`: Goal-driven architectural design mode that produces `architecture.md`. Reads codebase and OpenSpec context in parallel via subagents, challenges architectural anti-patterns with opinionated recommendations, presents both breaking and non-breaking paths, runs a coherence subagent check before synthesizing the final document.
- `opsx-revise-skill`: Exhaustive pre-implementation interview that produces `decisions.md`. One question at a time with recommended answers, domain checklist coverage, override and breaking change logging, and a simulated-implementer subagent check before concluding.
- `schema-context-artifacts`: The `spec-driven` schema supports a `context:` field on artifacts and in the `apply:` block. Context items are included in instruction context only when present at the change root — they do not block artifact creation if absent.

### Modified Capabilities

- `opsx-verify-skill`: Verification now checks implementation against `architecture.md` (Key Architectural Decisions) and `decisions.md` ([BREAKING], [OVERRIDE] markers) when those files exist, in addition to existing checks against tasks and specs.

## Impact

- New files: `.opencode/skills/openspec-architect/SKILL.md`, `.opencode/skills/openspec-revise/SKILL.md`
- Modified: `schemas/spec-driven/schema.yaml` — adds `context:` field to `design`, `tasks`, and `apply`; registers `architecture` and `decisions` as new artifact entries
- New files: `schemas/spec-driven/templates/architecture.md`, `schemas/spec-driven/templates/decisions.md`
- Modified: `.opencode/skills/openspec-apply-change/SKILL.md` — architectural decision threshold and artifact update-on-approval behavior
- Modified: `.opencode/skills/openspec-verify-change/SKILL.md` — extended verification coverage
- No breaking changes to existing `spec-driven` workflow — all new artifacts are optional context
