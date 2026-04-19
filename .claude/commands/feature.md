---
description: Plan next roadmap phase via SDD spec folder (requirements/plan/validation)
---

Find the next phase on `specs/roadmap.md` and make a branch, ask me about the feature spec.

Create:
- A new directory `YYYY-MM-DD-feature-name` under `specs/` for this feature work
- In there:
  - `plan.md` — a series of numbered task groups
  - `requirements.md` — scope, decisions, context
  - `validation.md` — how to know the implementation succeeded and can be merged
  - documentation.md - based on the phase implementation update skills and app/docs project

Refer to `specs/mission.md` and `specs/tech-stack.md` for guidance.

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one.

If a question can be answered by exploring the codebase, explore the codebase instead.

Important: Don't commit anything without user review

Important: You *must* use your AskUserQuestion tool, grouped on these 3, before writing to disk.
