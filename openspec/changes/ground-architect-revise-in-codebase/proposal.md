## Why

The `architect` and `revise` skills currently make architectural proposals and ask implementation questions without first establishing what code already exists. This means discussions can be entirely disconnected from reality — recommending patterns that duplicate existing infrastructure, asking questions the codebase already answers, or proposing fresh designs without acknowledging working code that should be extended, challenged, or replaced.

## What Changes

- The `architect` skill gains a structured codebase scan with a visible synthesis step shown to the user before any architectural discussion begins.
- The `revise` skill gains a codebase scan that always runs (not just on cold start), focused on implementation-level constraints not covered by architect.
- Both skills adopt an explicit **extend / refactor / replace** framing for all recommendations touching existing code.
- Both skills explicitly handle the greenfield case: when no relevant code exists, say so and proceed from first principles.
- The challenge capability of both skills is fully preserved — the agent may recommend against or overhaul existing code, but only after acknowledging what is there.

## Capabilities

### New Capabilities

- `architect-codebase-grounding`: The structured codebase scan, visible synthesis step, and grounded discussion framing for the `architect` skill.
- `revise-codebase-grounding`: The structured codebase scan, visible synthesis step, and grounded interview framing for the `revise` skill.

### Modified Capabilities

## Impact

- `.opencode/skills/openspec-architect/SKILL.md` — Step 2 and Step 3 modified; guardrails updated
- `.opencode/skills/openspec-revise/SKILL.md` — Step 2 modified (remove cold-start-only restriction, add structure); Step 3 interview guidance updated; guardrails updated
