## Overview

<!-- What this change does architecturally and how it fits into the existing system. -->

## Components

<!-- Major pieces being built or modified. For each component, describe its responsibility.
     Example:
     - **PaymentProcessor**: Handles charge submission and response parsing
     - **WebhookHandler**: Receives and validates provider callbacks -->

## Key Architectural Decisions

<!-- The choices that matter. Format each as:

### [Decision name]
**Choice**: what was chosen
**Rationale**: why
**Alternatives considered**: what was rejected and why

Example:

### Event-driven vs synchronous payment confirmation
**Choice**: Synchronous response with async webhook reconciliation
**Rationale**: Immediate user feedback is required; webhooks handle edge cases
**Alternatives considered**: Pure async - rejected because UX requires instant confirmation -->

## Data Flow

<!-- How data moves through this feature. ASCII diagrams preferred.

Example:
    Client
      │
      ▼
    API Layer ──────────────────▶ Payment Provider
      │                                  │
      ▼                                  ▼
    DB (pending)              Webhook ──▶ DB (confirmed)
-->

## Integration Points

<!-- Where this connects to the existing system.
     - APIs consumed
     - Events published or subscribed
     - Shared state or databases
     - External services -->

## Security Model

<!-- Trust boundaries, authentication/authorization requirements, sensitive data handling.
     Example:
     - All payment data transmitted over TLS only
     - Card numbers never stored; use provider tokens
     - Webhook endpoints validate HMAC signature before processing -->

## Error Handling Strategy

<!-- Error model, how errors propagate through layers, retry policies, circuit breakers.
     Example:
     - Network errors: retry up to 3x with exponential backoff
     - Provider declines: return structured error to client (no retry)
     - Webhook delivery failures: idempotent handler, provider retries for 72h -->

## Observability Strategy

<!-- What gets logged (and at what level), key metrics emitted, trace boundaries.
     Example:
     - INFO: payment initiated, payment confirmed, webhook received
     - ERROR: provider timeout, signature validation failure
     - Metrics: payment.initiated, payment.confirmed, payment.failed (with reason tag) -->

## Constraints

<!-- Hard limits: things that cannot change, boundaries that must be respected.
     Example:
     - Must use existing auth middleware (no new auth patterns)
     - No new external network calls from the worker process -->

## Diagrams

<!-- ASCII diagrams of system shape, component relationships, sequence flows.
     Add any diagrams that clarify structure not captured in Data Flow above. -->
