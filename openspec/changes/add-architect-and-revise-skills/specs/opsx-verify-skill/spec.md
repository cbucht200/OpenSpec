# opsx-verify-skill Delta Specification

## MODIFIED Requirements

### Requirement: Coherence Verification
The agent SHALL verify that implementation is sensible and follows design decisions, including architecture and decisions artifacts when present.

#### Scenario: Design.md adherence check
- **WHEN** verifying coherence
- **AND** design.md exists for the change
- **THEN** extract key decisions from design.md
- **AND** verify implementation follows those decisions
- **AND** report any deviations

#### Scenario: No design.md
- **WHEN** verifying coherence
- **AND** no design.md exists
- **THEN** skip design adherence check
- **AND** note "No design.md to verify against"

#### Scenario: Architecture.md adherence check
- **WHEN** verifying coherence
- **AND** architecture.md exists for the change
- **THEN** extract each decision from the Key Architectural Decisions section
- **AND** verify the implementation honors each decision
- **AND** report any architectural drift as WARNING or CRITICAL depending on severity

#### Scenario: No architecture.md
- **WHEN** verifying coherence
- **AND** no architecture.md exists
- **THEN** skip architecture adherence check
- **AND** note "No architecture.md to verify against"

#### Scenario: Decisions.md override verification
- **WHEN** verifying coherence
- **AND** decisions.md exists for the change
- **THEN** extract all entries marked [OVERRIDE]
- **AND** verify the implementation followed the override decision (not the original recommendation)
- **AND** report any case where implementation followed the recommendation instead of the override as WARNING

#### Scenario: Decisions.md breaking change verification
- **WHEN** verifying coherence
- **AND** decisions.md exists and contains [BREAKING] entries
- **THEN** verify the affected files listed were actually updated
- **AND** report any [BREAKING] decision whose affected files show no changes as CRITICAL

#### Scenario: No decisions.md
- **WHEN** verifying coherence
- **AND** no decisions.md exists
- **THEN** skip decisions adherence check
- **AND** note "No decisions.md to verify against"

#### Scenario: Design decision followed
- **WHEN** implementation follows a design or architectural decision
- **THEN** report as confirmed
- **AND** cite evidence from code

#### Scenario: Design decision violated
- **WHEN** implementation contradicts a design or architectural decision
- **THEN** report as WARNING
- **AND** explain the contradiction
- **AND** suggest: either update implementation or update the relevant artifact

#### Scenario: Code pattern consistency
- **WHEN** verifying coherence
- **THEN** check if new code follows existing project patterns
- **AND** flag any significant deviations as suggestions
