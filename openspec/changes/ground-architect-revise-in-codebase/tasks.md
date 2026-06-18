## 1. Architect Skill — Structured Codebase Scan

- [x] 1.1 Replace the Subagent A bullet list in Step 2 with a quoted subagent prompt that specifies structured output sections: language/framework, relevant data models, existing API/service patterns, auth mechanism, testing approach, and files most relevant to the goal
- [x] 1.2 Add a hard sequencing instruction: synthesis must be shown to the user before any discussion question is asked
- [x] 1.3 Add explicit greenfield handling language in Step 2: if scan returns no relevant code, agent states "This is new ground — no existing implementation to reference" and proceeds from first principles

## 2. Architect Skill — Grounded Discussion Framing

- [x] 2.1 Add extend / refactor / replace framing to Step 3 discussion guidance: when existing code is found in a relevant area, the recommendation must be framed as one of these three options with rationale
- [x] 2.2 Add an explicit statement in Step 3 that the challenge capability is preserved: the agent may recommend against existing code, but must name it and explain specifically what is wrong before proposing a replacement
- [x] 2.3 Update the guardrails section to include: "Never discuss a design space without first acknowledging what already exists there — or that nothing exists"

## 3. Revise Skill — Always-On Codebase Scan

- [x] 3.1 Remove the "cold start only" qualifier from Step 2 and restructure the step to describe two scopes: full scan (cold start) vs. implementation-focused scan (same-session architect flow)
- [x] 3.2 Add a structured subagent prompt or structured reading instruction for the cold-start scan, matching the detail level of the architect scan
- [x] 3.3 Add a scoped reading instruction for the same-session case: focus on file conventions, testing patterns, utility locations, and naming that architect did not cover
- [x] 3.4 Add a hard sequencing instruction: synthesis must be shown to the user before the first interview question is asked
- [x] 3.5 Add explicit greenfield handling: if no relevant code is found, say so explicitly before asking questions from first principles

## 4. Revise Skill — Grounded Interview Framing

- [x] 4.1 Add grounding guidance to Step 3 interview conduct: when existing code is found for a domain, the question must reference that code specifically rather than posing an abstract choice
- [x] 4.2 Add an explicit statement that challenge is preserved: agent may push back on existing patterns, but must name them and explain the specific problem first
- [x] 4.3 Update the guardrails section to include the same grounding principle added to architect

## 5. Review and Consistency

- [x] 5.1 Read both updated SKILL.md files end-to-end and verify the scan, synthesis, and framing sections are internally consistent and do not contradict other parts of each skill
- [x] 5.2 Verify the greenfield escape hatch is present and identically worded in both skills
- [x] 5.3 Verify the extend / refactor / replace framing is present in both skills and compatible with each skill's existing "breaking vs. non-breaking" language
