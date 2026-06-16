# opsx-revise-skill Specification

## Purpose
Define `/opsx-revise` behavior for exhaustive pre-implementation clarification that produces a `decisions.md` artifact eliminating all implementation ambiguities.

## Requirements

### Requirement: Revise Skill Invocation
The system SHALL provide an `/opsx-revise <change-name-or-goal>` skill that conducts a systematic one-question-at-a-time interview.

#### Scenario: Change name provided
- **WHEN** agent executes `/opsx-revise <change-name>`
- **THEN** the agent continues that existing change
- **AND** reads existing artifacts (architecture.md if present) as context before starting

#### Scenario: Goal provided for new change
- **WHEN** agent executes `/opsx-revise <goal>` and no matching change exists
- **THEN** the agent creates a new change with a derived kebab-case name
- **AND** proceeds with the interview

#### Scenario: No argument provided
- **WHEN** agent executes `/opsx-revise` with no argument
- **THEN** the agent asks: "What change do you want to refine? Provide a change name or describe what you are building."

### Requirement: Context-Informed Question Generation
The agent SHALL use existing change context to generate targeted questions rather than generic ones.

#### Scenario: Architecture.md exists
- **WHEN** architecture.md is present in the change directory
- **THEN** the agent reads it before generating questions
- **AND** does not ask questions already resolved by the architecture document

#### Scenario: Codebase context used
- **WHEN** starting a revise session
- **THEN** the agent reads relevant codebase sections to understand existing constraints
- **AND** frames questions in terms of the actual existing code, not hypothetical scenarios

### Requirement: One-Question-at-a-Time Interview
The agent SHALL conduct the interview by asking one question at a time and waiting for a response before continuing.

#### Scenario: Question format
- **WHEN** asking a question
- **THEN** the agent asks exactly one question
- **AND** provides its recommended answer with rationale
- **AND** waits for the user's response before asking the next question

#### Scenario: Question sequence
- **WHEN** the user answers a question
- **THEN** the agent uses that answer to inform subsequent questions
- **AND** branches the question tree based on the answer received

### Requirement: Domain Checklist Coverage
The agent SHALL ensure all relevant implementation domains are covered before concluding.

#### Scenario: Domain checklist applied
- **WHEN** the agent believes the interview is complete
- **THEN** it checks coverage against the following domains: data model, API contracts, authentication/authorization, error handling, state management, testing strategy, security, performance, observability, deployment/migrations, and edge cases
- **AND** for each relevant domain with unresolved questions, continues the interview

#### Scenario: Irrelevant domain skipped
- **WHEN** a domain is not applicable to the change (e.g., deployment for a utility function)
- **THEN** the agent skips that domain without asking about it

### Requirement: Architectural Challenge
The agent SHALL challenge decisions that deviate from sound architectural practices.

#### Scenario: User answers against best practices
- **WHEN** the user's answer to a question violates an established architecture principle
- **THEN** the agent states the principle being violated and the concrete consequence
- **AND** recommends an alternative
- **AND** allows the user to override after full awareness

#### Scenario: User overrides recommendation
- **WHEN** the user explicitly chooses to proceed against the agent's recommendation
- **THEN** the agent accepts the decision
- **AND** records it as an override in decisions.md with the user's stated reason

### Requirement: Breaking Change Identification
The agent SHALL identify and flag decisions that require changes to existing code.

#### Scenario: Breaking change identified
- **WHEN** a decision requires modifying existing APIs, data models, or contracts
- **THEN** the agent presents both breaking and non-breaking paths
- **AND** clearly marks the breaking option with its scope (which files/modules are affected)
- **AND** records the chosen path in decisions.md with the [BREAKING] marker if applicable

### Requirement: Decisions Document Production
The agent SHALL produce a structured `decisions.md` artifact capturing all decisions made.

#### Scenario: Decisions document structure
- **WHEN** the interview concludes
- **THEN** decisions.md SHALL contain:
  - A `## BREAKING CHANGES` summary table at the top (if any breaking decisions were made)
  - A `## Decisions` section with one entry per decision

#### Scenario: Breaking changes summary table
- **WHEN** breaking decisions exist
- **THEN** the summary table SHALL include: Decision name, Affects (file paths), Override? (Yes/No)
- **AND** use the format: `| Decision | Affects | Override? |`

#### Scenario: Individual decision entry format
- **WHEN** recording a decision
- **THEN** each entry SHALL include:
  - `### Decision: <name>`
  - `[BREAKING]` marker if breaking, `[OVERRIDE]` marker if override, or both `[BREAKING][OVERRIDE]`
  - `Recommendation:` what the agent recommended
  - `Decision:` what was chosen
  - `Rationale:` why
  - The Q&A exchange that led to the decision

#### Scenario: Override recorded
- **WHEN** the user overrides the agent's recommendation
- **THEN** the entry includes the `[OVERRIDE]` marker
- **AND** records the user's stated reason for overriding

### Requirement: Simulated-Implementer Completion Check
The agent SHALL verify that decisions are sufficient for implementation before concluding.

#### Scenario: Subagent check triggered
- **WHEN** the agent believes the domain checklist is fully covered
- **THEN** it launches a subagent acting as a simulated implementer
- **AND** notes to the user: "Running an implementation coverage check..."

#### Scenario: Subagent finds gaps
- **WHEN** the subagent identifies questions that would block implementation
- **THEN** the agent resumes the interview targeting those specific gaps
- **AND** does not finalize decisions.md until gaps are resolved

#### Scenario: Subagent satisfied
- **WHEN** the subagent confirms it could implement the change with the current decisions
- **THEN** the agent informs the user: "Implementation check passed."
- **AND** writes the final decisions.md

#### Scenario: Subagent visibility
- **WHEN** the subagent check is running
- **THEN** the user sees "Running an implementation coverage check..." but not the subagent's internal reasoning
- **AND** only sees the outcome: either more questions (gaps found) or confirmation (check passed)
