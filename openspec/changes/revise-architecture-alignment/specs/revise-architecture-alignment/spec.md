## ADDED Requirements

### Requirement: Revise aligns architecture.md after decisions are captured

After `decisions.md` is written, the revise workflow SHALL check whether `architecture.md` exists in the change directory and, if so, identify any decisions that contradict content in `architecture.md`. The workflow SHALL present the contradictions to the user before making any changes.

#### Scenario: Contradictions found, user confirms update

- **WHEN** `decisions.md` has been written and `architecture.md` exists in the change directory
- **AND** the alignment subagent finds one or more contradictions between the two documents
- **AND** the user confirms they want to update `architecture.md`
- **THEN** only the contradicted sections of `architecture.md` are patched to reflect the decisions
- **AND** sections of `architecture.md` not contradicted by any decision are left unchanged
- **AND** the user is told `architecture.md` has been aligned

#### Scenario: Contradictions found, user declines update

- **WHEN** `decisions.md` has been written and `architecture.md` exists in the change directory
- **AND** the alignment subagent finds one or more contradictions
- **AND** the user declines to update `architecture.md`
- **THEN** `architecture.md` is not modified
- **AND** the workflow continues to the "run propose" suggestion

#### Scenario: No contradictions found

- **WHEN** `decisions.md` has been written and `architecture.md` exists in the change directory
- **AND** the alignment subagent finds no contradictions
- **THEN** the user is informed that `architecture.md` is consistent with all decisions
- **AND** no changes are made to `architecture.md`

#### Scenario: architecture.md does not exist

- **WHEN** `decisions.md` has been written
- **AND** `architecture.md` does not exist in the change directory
- **THEN** the alignment step is skipped silently
- **AND** the workflow continues to the "run propose" suggestion

### Requirement: Alignment distinguishes contradictions from refinements

The alignment subagent SHALL only flag content in `decisions.md` that directly contradicts a statement in `architecture.md`. It SHALL NOT flag decisions that add detail on topics `architecture.md` was silent about.

#### Scenario: Decision refines an architectural topic

- **WHEN** `architecture.md` does not address a specific implementation detail
- **AND** `decisions.md` makes a decision about that detail
- **THEN** the alignment subagent does NOT report this as a contradiction
- **AND** `architecture.md` is not patched for this decision

#### Scenario: Decision overrides an architectural choice

- **WHEN** `architecture.md` states a specific architectural choice (e.g., "use PostgreSQL")
- **AND** `decisions.md` captures a decision that contradicts it (e.g., "use SQLite")
- **THEN** the alignment subagent reports this as a contradiction
- **AND** the affected section of `architecture.md` is presented to the user for confirmation
