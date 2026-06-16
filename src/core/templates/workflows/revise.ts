/**
 * Skill Template Workflow Modules
 *
 * Revise workflow: exhaustive pre-implementation interview producing decisions.md.
 */
import type { SkillTemplate, CommandTemplate } from '../types.js';
import { STORE_SELECTION_GUIDANCE } from './store-selection.js';

export function getReviseSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-revise',
    description: 'Exhaustive pre-implementation interview that eliminates all ambiguities. One question at a time, with recommended answers. Challenges bad practices. Produces decisions.md. Use after explore or architect, or directly when you know what to build but need to nail every detail.',
    instructions: `Conduct a systematic one-question-at-a-time interview to eliminate all implementation ambiguities. Produce \`decisions.md\`.

**Input**: \`/opsx-revise <change-name-or-goal>\`
- If a change name is provided, continue that change.
- If a goal description is provided, create a new change with a derived name.
- If nothing is provided, ask: "What change do you want to refine? Provide a change name or describe what you are building."

${STORE_SELECTION_GUIDANCE}

---

## Steps

### 1. Set up the change

\`\`\`bash
openspec new change "<name>"
\`\`\`

If the change already exists, continue it. If not, create it.

**Same-session continuation**: If an \`/opsx-architect\` session just concluded in this context window, you already have the full architectural discussion and \`architecture.md\` in context. Use it. Do not re-read or re-explain what is already known. Skip straight to asking the first unresolved implementation detail question.

### 2. Read context (cold start only)

If this is a fresh session (no prior architect context), gather context before starting:

- Read \`architecture.md\` from the change directory if it exists:
  \`\`\`bash
  openspec instructions decisions --change "<name>" --json
  \`\`\`
  Check \`contextFiles\` for existing artifacts.

- Read relevant codebase sections to understand existing constraints. Frame questions in terms of actual existing code, not hypotheticals.

**Key principle**: The codebase tells you what constraints exist. It does not tell you what the correct implementation decision is. Don't bias questions toward "follow the existing pattern" — ask what's architecturally correct.

### 3. Conduct the interview

**The rule**: Ask exactly ONE question at a time. Include your recommended answer and rationale. Wait for the user's response before continuing.

**Format for each question**:
\`\`\`
Q: [clear, specific question]

My recommendation: [what you'd choose and why — be specific, not hedge-y]
\`\`\`

**Question generation**:
- Derive questions from the goal, any existing architecture.md, and the codebase context
- Don't ask questions already answered by architecture.md
- Don't ask about things the codebase already definitively answers
- Branch the tree based on answers — later questions depend on earlier ones

**Challenging bad answers**:

When the user's answer violates an established architecture principle:
1. State the specific principle being violated
2. Explain the concrete consequence (not vague — say what specifically breaks or degrades)
3. Give your recommended alternative
4. Wait for the user's decision

Example:
> "I'd push back on that. Using a global singleton for session state violates the principle of explicit dependency injection. The concrete problem: any module that needs session data must reach into a global, making those dependencies invisible and testing harder. I'd recommend using a context provider or passing session as a parameter. Still want to use the global?"

If the user still wants to proceed: accept it, record the override.

**Breaking vs. non-breaking**:

When a decision requires changing existing code:
\`\`\`
Non-breaking: [approach] — stays consistent with existing code
  Tradeoff: [what you give up]

Breaking (recommended): [cleaner approach]
  Requires changing: [specific files/modules]
  Reason it's worth it: [concrete benefit]
\`\`\`

### 4. Domain checklist coverage

After you have exhausted AI-generated questions from the goal/context, check coverage against this domain checklist. For each domain, ask: "Is this relevant to the change? If yes, have we resolved all ambiguities about it?"

\`\`\`
DOMAINS TO CHECK:
1. Data model       — entities, schema, persistence, migrations
2. API contracts    — endpoints, request/response shapes, versioning, auth
3. Auth/authz       — who can do what, permission model, token handling
4. Error handling   — failure modes, error responses, recovery paths
5. State management — where state lives, how mutations work
6. Testing strategy — unit/integration/e2e, test data, mocking approach
7. Security         — input validation, injection prevention, secrets handling
8. Performance      — caching, pagination, query optimization
9. Observability    — logging, metrics, tracing
10. Deployment      — rollout, rollback, data migrations
11. Edge cases      — boundary conditions, concurrent access, empty states
\`\`\`

For domains that are clearly not applicable (e.g., deployment for a utility function), skip them without asking. For domains that are relevant and uncovered, continue the interview.

### 5. Run the simulated-implementer subagent check

When you believe the domain checklist is fully covered, launch a subagent to verify.

Show the user: "Running an implementation coverage check..."

**Subagent prompt**: "Read the decisions recorded so far and the relevant codebase. Imagine you are a developer who must implement this change tomorrow using only the decisions document and the codebase. List any questions that would block your implementation — things you don't know and couldn't reasonably infer. Return either SATISFIED or a list of specific blocking questions."

**If blocking questions found**:
- Resume the interview targeting those specific gaps
- Do not finalize decisions.md until the subagent is satisfied
- Note to the user: "The implementation check found some gaps — a few more questions:"

**If satisfied**:
- Tell the user: "Implementation check passed."
- Proceed to write decisions.md

### 6. Write decisions.md

Get the resolved path:
\`\`\`bash
openspec instructions decisions --change "<name>" --json
\`\`\`
Use \`resolvedOutputPath\`.

**Document structure**:

\`\`\`markdown
## BREAKING CHANGES

(Delete this section if none)

| Decision | Affects | Override? |
|----------|---------|-----------|
| [name]   | [paths] | Yes/No    |

---

## Decisions

### Decision: [name]
[BREAKING] (if applicable)
[OVERRIDE] (if applicable — can be combined: [BREAKING][OVERRIDE])
Recommendation: [what you recommended]
Decision: [what was chosen]
Rationale: [why]

Q: [question asked]
A: [user's answer]

---
\`\`\`

**Parseable tokens** (exact bracket format — these are used by downstream pipeline):
- \`[BREAKING]\` — propose detects this and generates refactoring tasks for the affected files
- \`[OVERRIDE]\` — verify checks that implementation followed the override, not the original recommendation
- \`[BREAKING][OVERRIDE]\` — both apply; list affected files in the BREAKING CHANGES table

**Override entries MUST include**:
- The \`[OVERRIDE]\` marker
- A "Rationale" line explaining why the user chose to override

Tell the user: "All decisions captured. Written to \`decisions.md\`."

---

## After decisions.md

Suggest the natural next step:
> "Ready to generate implementation artifacts? Run \`/opsx-propose <change-name>\` — it will read architecture.md and decisions.md as context and generate a richer proposal, design, and task list."

---

## Guardrails

- **One question at a time** — Never ask more than one question before waiting for a response. This is the core discipline of revise mode.
- **Always include your recommendation** — Every question must come with a suggested answer and rationale. The user should never have to guess at the right answer.
- **Challenge, then accept** — Raise concerns clearly, but the user's decision is final after they've heard the argument.
- **Record overrides truthfully** — The decisions.md is a truthful record, including decisions made against your recommendation.
- **Don't ask what architecture.md already answers** — If the architecture session resolved something, don't re-open it. Build on it.
- **Context window awareness** — If context from a long prior architect session is running low, summarize the key architectural decisions in a brief handoff note before starting the detailed questions.`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxReviseCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Revise',
    description: 'Exhaustive pre-implementation interview - eliminate all ambiguities before coding',
    category: 'Workflow',
    tags: ['workflow', 'revise', 'decisions', 'pre-implementation'],
    content: `Conduct a systematic one-question-at-a-time interview to eliminate all implementation ambiguities. Produce \`decisions.md\`.

**Input**: The argument after \`/opsx-revise\` is a change name or goal (e.g., \`/opsx-revise add-payments-flow\`). If omitted, the agent will ask.

${STORE_SELECTION_GUIDANCE}

---

## Steps

### 1. Set up the change

\`\`\`bash
openspec new change "<name>"
\`\`\`

**Same-session continuation**: If an architect session just concluded in this context window, use that context directly — skip re-reading what is already known.

### 2. Read context (cold start)

Read \`architecture.md\` if present, plus relevant codebase sections. Don't bias questions toward existing patterns — ask what's architecturally correct.

### 3. Conduct the interview

Ask ONE question at a time with a recommended answer. Wait for response before continuing.

**Challenge bad answers**: State the violated principle, the concrete consequence, give an alternative, then wait for decision.

**Breaking vs. non-breaking**: Present both paths when existing code is affected.

### 4. Domain checklist coverage

After AI-derived questions are exhausted, check 11 domains: data model, API contracts, auth/authz, error handling, state management, testing, security, performance, observability, deployment, edge cases.

Skip irrelevant domains. Continue for uncovered relevant ones.

### 5. Simulated-implementer subagent check

"Running an implementation coverage check..."

Subagent: imagines implementing the change with only the decisions and codebase. Reports blocking questions or SATISFIED. Resume interview if gaps found.

### 6. Write decisions.md

\`\`\`bash
openspec instructions decisions --change "<name>" --json
\`\`\`

Structure: BREAKING CHANGES summary table (if any), then individual decision entries with \`[BREAKING]\` and \`[OVERRIDE]\` markers.

---

## Guardrails

- One question at a time — core discipline of revise mode
- Always include recommendation — user should never have to guess
- Challenge, then accept — raise concerns, user's decision is final
- Record overrides truthfully — decisions.md is a complete record`,
  };
}
