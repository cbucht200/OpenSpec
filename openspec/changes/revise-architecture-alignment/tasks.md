## 1. Update revise skill template (full instructions)

- [x] 1.1 Open `src/core/templates/workflows/revise.ts` and locate `getReviseSkillTemplate()`
- [x] 1.2 Renumber the current "After decisions.md" closing section to become Step 8 (or keep as a trailing section)
- [x] 1.3 Insert new Step 7 — "Align architecture.md" — after the `### 6. Write decisions.md` section with the following instruction text:
  - Check if `architecture.md` exists in the change directory (it will be present if an architect session ran, absent for standalone revise sessions)
  - If absent, skip the step silently
  - If present, launch an alignment subagent: *"Read decisions.md and architecture.md. Find every place where a decision in decisions.md CONTRADICTS (not merely refines) what architecture.md states. A contradiction is when decisions.md says something contrary to a statement that is explicitly present in architecture.md. Adding detail on a topic architecture.md was silent about is NOT a contradiction. Return either NO_CONTRADICTIONS or a list of: section name, current architecture.md text, and the updated text based on decisions.md."*
  - If subagent returns `NO_CONTRADICTIONS`: tell the user "architecture.md is consistent with all decisions — no updates needed."
  - If contradictions are found: show a summary list and ask the user to confirm before patching
  - If user confirms: patch only the contradicted sections, leave the rest unchanged; tell user "architecture.md aligned."
  - If user declines: leave `architecture.md` unmodified and continue

## 2. Update revise command template (condensed version)

- [x] 2.1 Open `src/core/templates/workflows/revise.ts` and locate `getOpsxReviseCommandTemplate()`
- [x] 2.2 Add a condensed Step 7 summary after the `### 6. Write decisions.md` section:
  - If `architecture.md` exists: run alignment subagent to find contradictions (not refinements)
  - If contradictions found: show summary, confirm with user, then patch only contradicted sections
  - If no contradictions or no `architecture.md`: skip or report clean

## 3. Rebuild and verify

- [x] 3.1 Run `pnpm run build` and confirm no TypeScript errors
- [x] 3.2 Run `openspec init` and confirm the updated `SKILL.md` is generated with the Step 7 content for the revise skill
- [x] 3.3 Manually inspect the generated `SKILL.md` to verify the alignment step text is present and correctly formatted
