## 1. Schema Changes

- [x] 1.1 Add `context:` field support to schema.yaml artifact definition structure (CLI instruction loader)
- [x] 1.2 Register `architecture` artifact in `schemas/spec-driven/schema.yaml` with `generates: architecture.md` and `requires: []`
- [x] 1.3 Register `decisions` artifact in `schemas/spec-driven/schema.yaml` with `generates: decisions.md` and `requires: []`
- [x] 1.4 Add `context: [architecture, decisions]` to the `design` artifact in `schemas/spec-driven/schema.yaml`
- [x] 1.5 Add `context: [architecture, decisions]` to the `tasks` artifact in `schemas/spec-driven/schema.yaml`
- [x] 1.6 Add `context: [architecture, decisions]` to the `apply:` block in `schemas/spec-driven/schema.yaml`
- [x] 1.7 Update CLI instruction loader to check `context:` items for file existence and conditionally include in `dependencies`
- [x] 1.8 Update `openspec status` to report optional artifacts (those with no `requires:` references and not in `apply.requires`) separately from required chain

## 2. Schema Templates

- [x] 2.1 Create `schemas/spec-driven/templates/architecture.md` with sections: Overview, Components, Key Architectural Decisions, Data Flow, Integration Points, Security Model, Error Handling Strategy, Observability Strategy, Constraints, Diagrams
- [x] 2.2 Create `schemas/spec-driven/templates/decisions.md` with sections: BREAKING CHANGES (summary table), Decisions (individual entries with [BREAKING]/[OVERRIDE] markers)
- [x] 2.3 Add `instruction:` for `architecture` artifact to `schemas/spec-driven/schema.yaml` describing the Key Architectural Decisions format
- [x] 2.4 Add `instruction:` for `decisions` artifact to `schemas/spec-driven/schema.yaml` describing the [BREAKING]/[OVERRIDE] marker format

## 3. Architect Skill

- [x] 3.1 Create `.opencode/skills/openspec-architect/SKILL.md` with frontmatter (name, description, license, compatibility, metadata)
- [x] 3.2 Implement invocation section: inline goal argument, change name derivation, change directory creation/continuation
- [x] 3.3 Implement parallel context gathering: two subagents launched simultaneously (codebase + OpenSpec docs)
- [x] 3.4 Implement greenfield handling: explicit branch when codebase subagent returns empty
- [x] 3.5 Implement opinionated discussion stance: style A for clear cases, style B for ambiguous tradeoffs, never false balance
- [x] 3.6 Implement architectural challenge behavior: state violated principle, consequence, alternative, then allow override
- [x] 3.7 Implement breaking/non-breaking recommendation pattern: present both paths when existing code is affected
- [x] 3.8 Implement coherence subagent check: lightweight check for structural gaps, contradictions, unresolved dependencies
- [x] 3.9 Implement architecture.md synthesis: triggered after coherence check passes, writes to change root with all required sections
- [x] 3.10 Add session transition note: if user invokes `/opsx-revise` after architect in same window, revise uses existing context

## 4. Revise Skill

- [x] 4.1 Create `.opencode/skills/openspec-revise/SKILL.md` with frontmatter
- [x] 4.2 Implement invocation: change-name-or-goal argument, create or continue change, ask if no argument
- [x] 4.3 Implement context reading: reads codebase, OpenSpec docs, architecture.md (if present) before starting
- [x] 4.4 Implement same-session continuation: detect prior architect context, skip re-reading what is already known
- [x] 4.5 Implement one-question-at-a-time interview: single question with recommended answer and rationale, wait for response
- [x] 4.6 Implement domain checklist: after AI-derived questions, check coverage against 11 domains, continue for uncovered relevant ones
- [x] 4.7 Implement architectural challenge: state principle, consequence, alternative when answer violates best practices
- [x] 4.8 Implement override recording: [OVERRIDE] marker with stated reason when user proceeds against recommendation
- [x] 4.9 Implement breaking change identification: present both paths, flag scope (affected files), [BREAKING] marker
- [x] 4.10 Implement simulated-implementer subagent check: reads decisions.md + codebase, reports implementation blockers
- [x] 4.11 Implement decisions.md writing: BREAKING CHANGES summary table at top, followed by individual decision entries

## 5. Apply Skill Updates

- [x] 5.1 Add architectural decision threshold to `.opencode/skills/openspec-apply-change/SKILL.md`: explicit pause triggers (data model, API, external dep, out-of-scope components, contradicts decisions.md/architecture.md, security)
- [x] 5.2 Add proceed-independently list: variable naming, internal organization, internal algorithm, test structure, minor in-scope refactoring
- [x] 5.3 Implement propose-and-wait flow: when architectural issue hit, surface to user with proposed solution, wait for approval
- [x] 5.4 Implement update-all-affected-artifacts on approval: always update decisions.md; conditionally update architecture.md, design.md, proposal.md based on what changed

## 6. Verify Skill Updates

- [x] 6.1 Add architecture.md coherence check to `.opencode/skills/openspec-verify-change/SKILL.md`: read Key Architectural Decisions section, check each against implementation
- [x] 6.2 Add decisions.md [OVERRIDE] check: verify implementation followed override decisions (not original recommendations)
- [x] 6.3 Add decisions.md [BREAKING] check: verify affected files listed in breaking decisions show changes
- [x] 6.4 Handle missing optional artifacts gracefully: note "No architecture.md to verify against" without failing

## 7. Verification

- [x] 7.1 Test full pipeline with all stages: `openspec new change` → architect → revise → propose → apply → verify
- [x] 7.2 Test old pipeline still works: `openspec new change` → propose → apply → verify
- [x] 7.3 Test schema context field: verify `openspec instructions design --json` includes architecture.md and decisions.md in dependencies when present, excludes when absent
- [x] 7.4 Test optional artifact does not block apply: verify `openspec status` does not report missing architecture.md or decisions.md as blockers
- [x] 7.5 Run existing test suite to confirm no regressions from schema changes
