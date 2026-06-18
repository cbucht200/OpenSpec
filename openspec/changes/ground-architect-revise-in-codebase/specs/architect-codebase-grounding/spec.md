## ADDED Requirements

### Requirement: Structured codebase scan before discussion
Before starting any architectural discussion, the architect skill SHALL perform a structured codebase scan and produce a synthesis covering: language and framework, relevant data models, existing API and service patterns, authentication mechanism, testing approach, and specific files most relevant to the stated goal.

#### Scenario: Codebase has relevant code
- **WHEN** the user invokes the architect skill with a goal
- **THEN** the agent scans the codebase before starting the discussion and produces a structured synthesis covering each of the required sections

#### Scenario: No relevant code exists
- **WHEN** the user invokes the architect skill with a goal and no relevant existing code is found
- **THEN** the agent explicitly states "This is new ground — no existing implementation to reference" and proceeds from first principles

### Requirement: Visible synthesis before discussion begins
The architect skill SHALL show the codebase synthesis to the user before asking any architectural question or making any recommendation.

#### Scenario: Synthesis shown upfront
- **WHEN** the codebase scan completes
- **THEN** the agent presents the synthesis to the user and begins the discussion only after doing so

#### Scenario: User can correct misunderstandings
- **WHEN** the synthesis is shown and contains an error or misidentified pattern
- **THEN** the user can correct it and the agent incorporates the correction before proceeding

### Requirement: Extend / refactor / replace framing for recommendations
When existing code is found in an area relevant to a recommendation, the architect skill SHALL frame that recommendation explicitly as extend, refactor, or replace — with rationale for each option.

#### Scenario: Existing code found in relevant area
- **WHEN** the agent makes an architectural recommendation about an area where the codebase scan found existing code
- **THEN** the recommendation names the existing code and presents it as extend, refactor, or replace — not as a context-free design decision

#### Scenario: Challenge is preserve under grounding
- **WHEN** the agent believes existing code should be redesigned or replaced
- **THEN** the agent acknowledges the existing code, explains specifically what is wrong with it, and recommends replacement — it SHALL NOT simply propose a fresh design as if nothing existed

### Requirement: Greenfield case explicit acknowledgment
When the codebase scan finds no relevant existing code for a given area, the architect skill SHALL explicitly acknowledge this before making recommendations for that area.

#### Scenario: No existing implementation found
- **WHEN** the codebase scan finds no existing code relevant to the architectural area under discussion
- **THEN** the agent states this explicitly and frames the recommendation as establishing a new pattern
