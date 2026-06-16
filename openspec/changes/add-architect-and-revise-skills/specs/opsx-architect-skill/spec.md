# opsx-architect-skill Specification

## Purpose
Define `/opsx-architect` behavior for goal-driven architectural design that produces an `architecture.md` artifact.

## Requirements

### Requirement: Architect Skill Invocation
The system SHALL provide an `/opsx-architect <goal>` skill that conducts an opinionated architectural design session.

#### Scenario: Goal provided as argument
- **WHEN** agent executes `/opsx-architect <goal>`
- **THEN** the agent derives a kebab-case change name from the goal
- **AND** creates or continues a change directory for that name
- **AND** begins parallel context gathering before starting discussion

#### Scenario: No goal provided
- **WHEN** agent executes `/opsx-architect` with no argument
- **THEN** the agent asks the user: "What do you want to build? Describe your goal."
- **AND** uses the response to derive a change name and proceed

#### Scenario: Change already exists
- **WHEN** a change with the derived name already exists
- **THEN** the agent continues that change
- **AND** reads any existing artifacts (architecture.md if present) as context

### Requirement: Parallel Context Gathering
The agent SHALL gather codebase and project context in parallel before starting the architectural discussion.

#### Scenario: Context gathered via subagents
- **WHEN** the architect session starts
- **THEN** the agent launches subagents in parallel to read relevant codebase sections and existing OpenSpec artifacts
- **AND** uses the gathered context to inform the discussion without re-explaining known facts to the user

#### Scenario: No codebase found (greenfield)
- **WHEN** the codebase subagent returns no relevant files
- **THEN** the agent proceeds from first principles
- **AND** notes that no existing patterns constrain the design
- **AND** treats this as an opportunity to establish clean patterns

### Requirement: Opinionated Architectural Discussion
The agent SHALL conduct a goal-driven design discussion with strong architectural opinions, not passive facilitation.

#### Scenario: Clear best practice exists
- **WHEN** a decision has an obvious architecturally correct answer
- **THEN** the agent states its recommendation first with rationale
- **AND** explains why the alternative is problematic
- **AND** asks if the user still wants the alternative

#### Scenario: Genuinely ambiguous tradeoffs
- **WHEN** multiple approaches have valid context-dependent tradeoffs
- **THEN** the agent presents the options with a comparison
- **AND** states a clear recommendation with reasoning
- **AND** does not present options as equally valid when they are not

#### Scenario: User proposes architectural anti-pattern
- **WHEN** the user suggests an approach that violates well-established architecture principles
- **THEN** the agent challenges the decision with the specific principle being violated
- **AND** explains the concrete consequence of the anti-pattern
- **AND** recommends an alternative
- **AND** allows the user to override after full awareness

### Requirement: Breaking vs Non-Breaking Recommendations
The agent SHALL present both breaking and non-breaking paths for decisions that affect existing code.

#### Scenario: Decision conflicts with existing patterns
- **WHEN** the architecturally correct choice requires changing existing code
- **THEN** the agent presents both paths:
  - Non-breaking: stay consistent with existing approach (with tradeoffs)
  - Breaking: cleaner architecture requiring changes (with what breaks and why it is worth it)
- **AND** gives a clear recommendation indicating which path it prefers and why

#### Scenario: Greenfield decision
- **WHEN** no existing code is affected by the decision
- **THEN** the agent recommends the architecturally best approach without the breaking/non-breaking framing

### Requirement: Architectural Coherence Check
The agent SHALL verify architectural coherence before synthesizing the final document.

#### Scenario: Coherence subagent check triggered
- **WHEN** the agent believes the architectural discussion is complete
- **THEN** the agent launches a subagent to check for structural gaps, unresolved dependencies, and contradictions
- **AND** notes to the user: "Running an architecture coherence check..."

#### Scenario: Coherence check finds gaps
- **WHEN** the subagent identifies structural issues (contradictions, unresolved dependencies, missing component definitions)
- **THEN** the agent resumes the discussion targeting those specific gaps
- **AND** does not synthesize architecture.md until gaps are resolved

#### Scenario: Coherence check passes
- **WHEN** the subagent confirms no structural gaps
- **THEN** the agent informs the user: "Architecture looks coherent."
- **AND** synthesizes architecture.md from the discussion

### Requirement: Architecture Document Synthesis
The agent SHALL synthesize the architectural discussion into a structured `architecture.md` artifact.

#### Scenario: Architecture document created
- **WHEN** the coherence check passes
- **THEN** the agent writes `architecture.md` to the change directory
- **AND** the document contains all required sections

#### Scenario: Architecture document sections
- **WHEN** architecture.md is created
- **THEN** it SHALL contain the following sections:
  - Overview
  - Components
  - Key Architectural Decisions
  - Data Flow
  - Integration Points
  - Security Model
  - Error Handling Strategy
  - Observability Strategy
  - Constraints
  - Diagrams (ASCII preferred)

#### Scenario: Key Architectural Decisions format
- **WHEN** recording architectural decisions in architecture.md
- **THEN** each decision SHALL include: what was chosen, rationale, and alternatives considered

### Requirement: Session Transition to Revise
The agent SHALL support transitioning directly into a revise session within the same context window.

#### Scenario: User continues to revise in same session
- **WHEN** the user invokes `/opsx-revise` after an architect session in the same context window
- **THEN** the revise session has access to the full architect discussion and architecture.md
- **AND** does not re-explain or re-read context that is already present
