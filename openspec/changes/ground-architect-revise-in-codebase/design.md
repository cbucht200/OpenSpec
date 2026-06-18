## Context

The `architect` and `revise` skills guide an AI agent through architectural design and implementation planning conversations. Both skills currently include a codebase scan step, but it is underspecified: no structured output format, no visibility gate, and no enforcement mechanism. In practice, the agent can proceed to discussion and questioning without demonstrating any knowledge of the existing codebase.

The fix is purely instructional — changes are confined to two SKILL.md files. No CLI code, schema, or runtime system is touched.

## Goals / Non-Goals

**Goals:**
- The agent must produce a visible codebase synthesis before starting any architect or revise discussion
- Every recommendation touching an area where code already exists must acknowledge what is there (extend / refactor / replace framing)
- The greenfield case is explicitly handled: when nothing relevant exists, say so and proceed from first principles
- The agent's ability to challenge or recommend against existing code is fully preserved — grounding informs the challenge, it does not suppress it
- Revise always scans, regardless of whether an architect session ran before it

**Non-Goals:**
- Changes to CLI behavior, schemas, or runtime tooling
- Changes to the explore skill (which is a thinking stance, not a workflow)
- Automated enforcement of grounding (this is instructional guidance, not code)

## Decisions

### Decision: Visible synthesis before discussion

**Choice**: After the codebase scan, the agent shows the user a structured summary of findings before beginning the architectural discussion or interview.

**Rationale**: The scan has no accountability mechanism because its output is never surfaced. Making the synthesis visible serves two purposes: it forces the agent to actually do the work (can't show a summary you didn't produce), and it lets the user correct misunderstandings before the discussion gets going. This mirrors the pattern already used successfully by the coherence check and implementer check at the end of both workflows — those steps are shown to the user explicitly, and they are the most reliable parts of the workflow.

**Alternatives considered**: Tightening just the subagent prompt (structured output format without visibility) — rejected because the agent can still produce a shallow synthesis that gets absorbed internally and never referenced during discussion.

### Decision: Structured subagent prompt for codebase scan

**Choice**: The codebase scan subagent gets a quoted prompt with explicit output sections: language/framework, relevant data models, API/service patterns, auth mechanism, testing approach, and specific files most relevant to the goal.

**Rationale**: The existing architect subagent A instruction is three vague bullet points. "Read relevant parts of the codebase" gives the agent no guidance on what to extract or what format to return. The coherence and implementer subagents both use quoted prompts with structured return formats (`SATISFIED` or a list) — they are the most reliable steps. The scan should match this specificity.

**Alternatives considered**: Leaving the scan open-ended and relying on the agent's judgment — rejected because the variability in scan quality is the root cause of the problem.

### Decision: Extend / Refactor / Replace framing in discussion guidance

**Choice**: Add an explicit framing instruction to both skills: when existing code is found in a relevant area, frame the recommendation as extend, refactor, or replace — with rationale for each.

**Rationale**: The agent can know what exists (from the scan) but still not reference it during discussion. Framing gives the agent a concrete vocabulary for connecting codebase findings to recommendations. It also preserves the challenge capability: "replace" is the frame for "this existing code is wrong and should be redesigned."

**Alternatives considered**: Just improving the scan and trusting the agent to carry context into discussion — rejected because the asymmetry between scan specificity and discussion guidance means the findings can be ignored in practice.

### Decision: Revise always scans (scope varies by context)

**Choice**: Remove the "cold start only" qualifier from revise's codebase reading step. Revise always scans, but what it looks for varies: in a same-session architect flow, it focuses on implementation-level details (file conventions, testing patterns, utilities) that the architect scan did not cover; in a cold start, it performs a full scan covering both architectural and implementation constraints.

**Rationale**: The "cold start only" condition is unreliable — the agent may not know whether it has prior context. More importantly, even when architect ran in the same session, its scan focused on architectural constraints (data models, API design, auth shape). Revise needs implementation-level constraints too. The scopes are complementary, not overlapping.

**Alternatives considered**: Keeping "cold start only" and just tightening the cold-start scan — rejected because even in a same-session flow, revise needs implementation detail that architect did not gather.

## Risks / Trade-offs

- **Scan adds latency** — Launching a subagent before discussion adds time. This is acceptable: the scan is already in the workflow; the change is making it structured, not adding a new step. → Mitigation: the scan runs in parallel with the OpenSpec context subagent, same as today.
- **Synthesis can be wrong** — The agent might misread the codebase and surface incorrect findings. → Mitigation: showing the synthesis to the user before discussion starts allows them to correct it immediately.
- **Over-specification may suppress judgment** — Detailed scan templates might cause the agent to report only what the template asks for, missing surprising relevant code. → Mitigation: the template includes an open-ended "specific files most relevant to this goal" section to capture anything that doesn't fit neatly into the structured fields.
