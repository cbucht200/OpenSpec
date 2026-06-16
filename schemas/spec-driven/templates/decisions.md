## BREAKING CHANGES

<!-- Delete this section if no breaking changes were made.
     Otherwise, list all decisions that require modifying existing code:

| Decision | Affects | Override? |
|----------|---------|-----------|
| [Decision name] | path/to/file.ts | No |
| [Decision name] | path/to/other.ts | Yes - [brief reason] |

-->

---

## Decisions

<!-- One entry per decision made during the /opsx-revise interview.
     Use [BREAKING] if the decision requires changing existing code.
     Use [OVERRIDE] if the user chose to proceed against the agent's recommendation.
     Use [BREAKING][OVERRIDE] if both apply.

     Format:

     ### Decision: [name]
     [BREAKING]
     Recommendation: [what the agent recommended]
     Decision: [what was chosen]
     Rationale: [why]

     Q: [question asked]
     A: [user's answer]

     ---

     Example:

     ### Decision: API endpoint structure
     [BREAKING]
     Recommendation: REST resource-oriented routes (/api/users/:id)
     Decision: Proceed with recommended approach
     Rationale: Consistent with external API consumers

     Q: How should user endpoints be structured?
     A: Use /api/users/:id format

     ---

     ### Decision: Session management
     [BREAKING][OVERRIDE]
     Recommendation: Context provider / dependency injection
     Decision: Global singleton
     Rationale: Team controls entire app, no third-party consumers
     Override reason: Avoiding the refactor cost; acceptable for this codebase scope

     Q: How should user session state be managed?
     A: Global singleton - we own the whole app

     ---

-->
