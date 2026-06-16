## Context

The current OpenSpec workflow jumps from `/opsx-explore` (open-ended ideation) directly to `/opsx-propose` (artifact generation). This leaves a gap: there is no structured way to (a) design the architecture of a feature with strong opinionated guidance, or (b) eliminate implementation ambiguities through systematic Q&A before coding begins. AI implementers silently fill these gaps with pattern-matching guesses, causing architectural drift and unexpected behavior.

This design introduces two new pre-implementation skills (`/opsx-architect` and `/opsx-revise`), two new per-change artifact types (`architecture.md` and `decisions.md`), a new `context:` field in the schema to wire optional artifacts into the downstream pipeline, and targeted updates to `/opsx-apply` and `/opsx-verify`.

The existing workflow (`propose → apply → verify → archive`) is unchanged. All new capabilities are additive.

## Goals / Non-Goals

**Goals:**
- Add `/opsx-architect`: a goal-driven, opinionated architectural discussion skill that produces `architecture.md`
- Add `/opsx-revise`: a one-question-at-a-time exhaustive interview skill that produces `decisions.md`
- Add `context:` field to `spec-driven` schema for optional artifact enrichment
- Register `architecture` and `decisions` as optional artifacts in the spec-driven schema
- Add `architecture.md` and `decisions.md` templates to the spec-driven schema
- Update `/opsx-apply` with an explicit architectural decision threshold and artifact update-on-approval behavior
- Update `/opsx-verify` to check against `architecture.md` and `decisions.md` when present

**Non-Goals:**
- A project-level living architecture document that persists across all changes (separate future concept)
- Modifying `/opsx-explore` (stays exactly as-is)
- Making architect or revise required steps in the pipeline
- Auto-capturing decisions without user interaction

## Decisions

### New SKILL.md files: architect and revise

Both new skills are implemented as SKILL.md files in `.opencode/skills/`. No CLI changes are needed for the skills themselves — they are pure agent instructions.

**Architect skill design:**
- Entry: `/opsx-architect <goal>` — goal is passed inline, change name derived from it
- Startup: two parallel subagents launched simultaneously — one reads relevant codebase sections, one reads existing OpenSpec artifacts (other changes, specs, existing architecture.md)
- If no codebase found: proceeds from first principles, no constraint on establishing clean patterns
- Discussion mode: open conversation with strong opinions. Uses style A (lead with recommendation) for clear cases, style B (present options with recommendation) for genuinely ambiguous tradeoffs. Never presents options as equally valid when they are not.
- Breaking/non-breaking: when the correct choice requires changing existing code, presents both paths with a clear recommendation
- Completion: when discussion feels complete, launches a coherence subagent. If gaps found, resumes. If satisfied, synthesizes architecture.md.
- Output: `architecture.md` written to change root, with fixed sections: Overview, Components, Key Architectural Decisions, Data Flow, Integration Points, Security Model, Error Handling Strategy, Observability Strategy, Constraints, Diagrams

**Revise skill design:**
- Entry: `/opsx-revise <change-name-or-goal>` — continues existing change or creates new one
- Startup: reads codebase, existing OpenSpec docs, and architecture.md (if present)
- If continuing after an architect session in the same context window: uses existing context, does not re-read
- Interview: one question at a time, with recommended answer and rationale per question. Waits for response before continuing.
- Domain coverage: after AI-generated questions are exhausted, checks against fixed domain checklist (data model, API contracts, auth/authz, error handling, state management, testing, security, performance, observability, deployment/migrations, edge cases). Asks about any uncovered relevant domain.
- Challenge mode: when user answer violates best practices, states the principle, consequence, and alternative before accepting the decision
- Breaking/non-breaking: flags breaking decisions with scope (affected files)
- Override recording: if user proceeds against recommendation, records [OVERRIDE] with stated reason
- Completion: when domain checklist is fully covered, launches a simulated-implementer subagent that reads decisions.md + codebase and reports what would block implementation. If gaps found, resumes. If satisfied, finalizes decisions.md.
- Output: `decisions.md` with BREAKING CHANGES summary table (if any) followed by full Q&A decision entries

### decisions.md format

The `[BREAKING]` and `[OVERRIDE]` bracket markers are the parseable tokens used by downstream stages. Propose and verify scan for these markers specifically.

Breaking changes summary table uses standard markdown table format at the top of the document, making it easy for propose to generate targeted refactoring tasks.

Individual decision entries use a consistent structure:
```
### Decision: <name>
[BREAKING][OVERRIDE] (as applicable)
Recommendation: ...
Decision: ...
Rationale: ...

Q: ...
A: ...
```

### Schema context: field

A new `context:` field is added to artifact definitions and the `apply:` block in schema.yaml. The CLI behavior: when generating instruction context (for `openspec instructions <artifact> --json`), check each artifact ID listed under `context:` — if the file exists at the change root, include its path in `dependencies`; if not, silently skip.

This requires a small CLI code change in the instruction loader. The change is localized to the context-building step and does not affect the existing `requires:` dependency chain.

Optionality is inferred: an artifact that appears only in `context:` fields (not in any `requires:` or `apply.requires`) is implicitly optional and does not appear as a blocker in status output.

### apply skill updates: architectural decision threshold

The apply SKILL.md gains an explicit threshold defining when to pause and surface an issue vs. when to proceed independently:

**Pause and propose** when the unforeseen issue requires:
1. A data model change (add/remove/rename fields, change relationships)
2. An API contract change (new endpoint, different request/response shape)
3. A new external dependency
4. Changes to components outside the task's stated scope
5. Anything that contradicts decisions.md or architecture.md
6. A security or data integrity concern

**Proceed independently** for:
1. Variable/function naming
2. Code organization within a file
3. Internal algorithm choice with no external contract impact
4. Test structure within the already-decided testing approach
5. Minor refactoring within the task's file scope

When pausing, apply proposes a solution, waits for approval, and then updates all affected artifacts (decisions.md always; architecture.md if structure changed; design.md if approach changed; proposal.md if scope changed).

### verify skill updates

Verify gains two new coherence checks that run when optional artifacts are present:
- `architecture.md` present: extract Key Architectural Decisions, check each against implementation
- `decisions.md` present: check [OVERRIDE] entries (implementation should follow the override) and [BREAKING] entries (affected files should show changes)

Missing optional artifacts are noted but do not cause check failures.

## Risks / Trade-offs

- **Context window pressure**: architect + revise in the same session can consume significant context before implementation starts. Mitigation: revise SKILL.md includes guidance to summarize when context is running low from a prior architect session.

- **Subagent coherence check cost**: both architect and revise launch subagents for completion checking. This adds latency. Mitigation: these are lightweight checks, not full re-reads of the codebase. Described in SKILL.md as targeted checks, not exhaustive analysis.

- **CLI changes scope**: the `context:` field requires changes to the instruction loader in the CLI. This is a real but localized change. Risk is minimal — the change does not touch the dependency graph logic, only the context-building step.

- **Over-questioning in revise**: the domain checklist could cause revise to ask irrelevant questions. Mitigation: the SKILL.md instructs revise to skip domains that are clearly not applicable to the change, not to ask about them robotically.

## Migration Plan

No migration needed. All new artifacts are optional. Existing changes and workflows are unaffected. The schema changes are backward-compatible — `context:` is a new additive field, and artifacts without it behave exactly as before.

New skill files can be added to `.opencode/skills/` at any time without impacting existing skills.

## Open Questions

None — all design decisions were resolved during the pre-implementation interview session.
