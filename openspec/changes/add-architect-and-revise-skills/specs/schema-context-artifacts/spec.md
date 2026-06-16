# schema-context-artifacts Specification

## Purpose
Define support for a `context:` field in the `spec-driven` schema that allows optional artifacts to enrich downstream artifact generation when present, without blocking creation when absent.

## Requirements

### Requirement: Context Field in Schema
The system SHALL support a `context:` field on schema artifacts and in the `apply:` block that lists artifact IDs to include as context when their files are present.

#### Scenario: Context field on artifact
- **WHEN** a schema artifact definition includes a `context:` field
- **THEN** the CLI includes those artifacts' file paths in the instruction context when they exist at the change root
- **AND** silently omits them when they do not exist

#### Scenario: Context field on apply block
- **WHEN** the schema's `apply:` block includes a `context:` field
- **THEN** the CLI includes those artifacts' file paths in `contextFiles` for the apply instruction when they exist
- **AND** silently omits them when they do not exist

### Requirement: Implicit Optional Artifacts
The system SHALL treat artifacts as optional when they appear only in `context:` fields and not in any `requires:` or `apply.requires` list.

#### Scenario: Artifact is implicitly optional
- **WHEN** an artifact has `requires: []` and is not referenced in any other artifact's `requires:` or `apply.requires`
- **THEN** the artifact does not block any other artifact's creation
- **AND** `openspec status` reports it as an optional artifact separate from the required chain

#### Scenario: Optional artifact does not block apply
- **WHEN** an optional artifact (e.g., architecture.md, decisions.md) has not been created
- **THEN** `openspec apply` proceeds normally
- **AND** does not report the missing artifact as a blocker

### Requirement: Architecture and Decisions as Schema Artifacts
The `spec-driven` schema SHALL register `architecture` and `decisions` as optional artifact types that downstream artifacts consume via the `context:` field.

#### Scenario: Architecture artifact registered
- **WHEN** using the `spec-driven` schema
- **THEN** `architecture` is a registered artifact type with `generates: architecture.md`
- **AND** it appears in the `context:` field of `design`, `tasks`, and `apply`

#### Scenario: Decisions artifact registered
- **WHEN** using the `spec-driven` schema
- **THEN** `decisions` is a registered artifact type with `generates: decisions.md`
- **AND** it appears in the `context:` field of `design`, `tasks`, and `apply`

#### Scenario: Downstream artifact receives context
- **WHEN** `openspec instructions design --json` is called
- **AND** architecture.md and decisions.md exist in the change directory
- **THEN** the `dependencies` field includes the paths to those files

#### Scenario: Downstream artifact skips missing context
- **WHEN** `openspec instructions design --json` is called
- **AND** architecture.md does not exist
- **THEN** the `dependencies` field does not include an architecture.md path
- **AND** no error is reported
