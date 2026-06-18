## ADDED Requirements

### Requirement: Always scan for implementation constraints
The revise skill SHALL always scan the codebase for implementation-level constraints before starting the interview, regardless of whether an architect session ran in the same context window. The scope of the scan adapts to context: in a same-session architect flow it focuses on implementation details (file conventions, testing patterns, utilities, naming) not covered by the architect scan; in a cold start it covers both architectural and implementation constraints.

#### Scenario: Same-session architect flow
- **WHEN** the user continues from an architect session into revise in the same context window
- **THEN** revise scans for implementation-level details the architect scan did not cover, rather than skipping the scan entirely

#### Scenario: Cold start
- **WHEN** revise is invoked without a preceding architect session
- **THEN** revise performs a full scan covering architectural and implementation constraints before starting the interview

#### Scenario: No relevant code exists
- **WHEN** the codebase scan finds no relevant existing code
- **THEN** the agent explicitly states this and frames questions from first principles rather than referencing hypothetical existing code

### Requirement: Visible synthesis before interview begins
The revise skill SHALL show the codebase synthesis to the user before asking the first implementation question.

#### Scenario: Synthesis shown before first question
- **WHEN** the codebase scan completes
- **THEN** the agent presents the synthesis to the user and asks the first interview question only after doing so

### Requirement: Interview questions grounded in existing code
When the codebase contains existing code relevant to a question, the revise skill SHALL frame that question in terms of the existing code — not as an abstract choice.

#### Scenario: Relevant existing code found for a domain
- **WHEN** the agent asks an interview question about a domain where the codebase scan found existing code
- **THEN** the question references the existing code specifically: what it is, where it lives, and whether to extend, refactor, or replace it

#### Scenario: No existing code found for a domain
- **WHEN** the agent asks an interview question about a domain where no existing code was found
- **THEN** the question is framed from first principles, and the agent does not invent or imply code that does not exist

### Requirement: Challenge capability preserved under grounding
The revise skill SHALL allow the agent to recommend against or challenge existing implementation choices, provided the recommendation explicitly acknowledges what currently exists and explains why it should change.

#### Scenario: Agent recommends against existing pattern
- **WHEN** existing code follows a pattern the agent believes is wrong for this feature
- **THEN** the agent names the existing pattern, explains the specific problem, and recommends the alternative — it SHALL NOT propose a replacement without first acknowledging what is there
