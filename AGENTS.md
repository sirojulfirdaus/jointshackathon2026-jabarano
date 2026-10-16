# AGENTS.md

This file defines how AI coding agents should work inside the SiapSapa repository.

The goal is to keep implementation **fast, consistent, scoped, and aligned with product requirements**.

---

# 1. Core Principle

Before modifying code, understand the task and the minimum context required to complete it correctly.

**Do not repeatedly read every documentation file.**

If you have already read and understood relevant documents earlier in the current working session, reuse that context.

Prefer:

> targeted context retrieval

over:

> full-document rereading

Only re-read documentation when necessary.

---

# 2. Context Loading Rules

Important project documents:

```text
docs/PRD.md
docs/USER_FLOWS.md
docs/requirements/FRONTEND_REQUIREMENTS.md
docs/requirements/BACKEND_REQUIREMENTS.md
docs/TECH_SPEC.md
docs/DATA_MODEL.md
docs/DECISIONS.md
TASKS.md
```

Before starting work, ensure that you understand the documents relevant to the task.

## Do NOT re-read documents when:

- you already read and understood them earlier in the current session,
- the relevant requirement is already available in context,
- the document has not changed,
- the task does not depend on additional sections.

## Re-read only when:

- the relevant document changed,
- you are unsure about a requirement,
- the implementation conflicts with existing context,
- the requested feature depends on a section you have not read,
- the user explicitly asks you to verify against the source.

When possible, read only the relevant section or requirement ID.

Example:

```text
Task:
Implement FE-DETECT-03.

Preferred:
Read FE-DETECT-03 and directly related requirements.

Avoid:
Reading the entire PRD, frontend requirements, backend requirements,
tech spec, and data model again without reason.
```

---

# 3. Source of Truth

Use the following priority when resolving implementation decisions:

```text
1. Explicit latest user instruction
2. Relevant requirement (FE-* / BE-*)
3. PRD
4. USER_FLOWS
5. TECH_SPEC
6. DATA_MODEL
7. DECISIONS
8. Existing implementation
```

If two sources conflict:

**do not silently choose one.**

Identify the conflict before making a potentially breaking product decision.

---

# 4. Scope Discipline

SiapSapa is currently an MVP.

Do not introduce features outside the agreed scope unless explicitly requested.

Avoid:

- speculative features,
- premature abstractions,
- unnecessary dependencies,
- unnecessary microservices,
- complex architecture without current need,
- refactoring unrelated code during feature implementation.

Prefer the simplest implementation that:

- satisfies the requirement,
- follows the architecture,
- is maintainable,
- can evolve later.

---

# 5. Current Product Scope

SiapSapa is a **home learning companion** for parents assisting children aged approximately 4–6 years with hearing loss who are beginning to recognize sound.

Current learning focus:

```text
Sound Detection
→ Sound Discrimination
→ Early Sound Association
```

The product is designed around:

```text
Prepare
→ Listen
→ Respond
→ Prompt
→ Observe
→ Adapt
→ Practice in Real Life
→ Repeat
```

The parent is a facilitator.

The child should not be expected to independently understand complex written instructions.

---

# 6. Product Safety Boundaries

Do NOT implement SiapSapa as:

- a hearing diagnostic tool,
- an audiometry tool,
- a medical assessment system,
- a replacement for an audiologist,
- a replacement for a speech therapist,
- a clinical progress evaluator.

Application performance represents:

> performance during SiapSapa learning activities

not:

> clinical hearing ability.

Do not introduce claims such as:

```text
"hearing improved by 40%"
"hearing level 5"
"your child has mild hearing loss"
```

unless explicitly supported by a future validated clinical feature.

---

# 7. Child Data & Audio Constraints

For the MVP:

- Do not store child voice recordings.
- Do not automatically activate the microphone.
- Do not automatically modify device volume.
- Do not perform hearing threshold estimation.
- Do not perform pronunciation scoring.
- Do not infer medical conditions from learning activity.

Collect only data needed for the defined product behavior.

---

# 8. Repository Architecture

The project uses a monorepo.

High-level structure:

```text
apps/
  web/
  api/

packages/
  database/
  validation/
  shared/
  config/

content/

docs/

tests/

scripts/
```

Frontend follows a **feature-based architecture**.

Example:

```text
apps/web/src/features/
  onboarding/
  child-profile/
  daily-session/
  sound-detection/
  sound-discrimination/
  sound-association/
  progress/
```

Backend follows a **module-based architecture**.

Example:

```text
apps/api/src/modules/
  auth/
  children/
  sessions/
  activities/
  trials/
  progress/
  content/
```

Keep domain-specific logic inside the relevant feature/module.

Do not place everything into global `utils`, `services`, or shared folders.

---

# 9. Shared Code Rules

Move code into shared packages/components only when there is a real reuse case.

Do not create abstractions only because something *might* be reused later.

Use:

```text
packages/shared
```

for genuinely shared TypeScript types, constants, or domain definitions.

Use:

```text
packages/validation
```

for schemas shared between frontend and backend.

Use:

```text
packages/database
```

for Prisma/database-related implementation.

---

# 10. Requirement IDs

Frontend requirements follow:

```text
FE-{MODULE}-{NUMBER}
```

Example:

```text
FE-DETECT-01
FE-DETECT-02
```

Backend requirements follow:

```text
BE-{MODULE}-{NUMBER}
```

Example:

```text
BE-DETECT-01
BE-DETECT-02
```

When working on a requirement, keep its ID visible in:

- implementation discussion,
- task tracking,
- relevant tests when useful,
- commit/PR description when applicable.

Do not invent new requirement IDs unless requested or clearly necessary.

---

# 11. Feature Implementation Workflow

When asked to implement a feature:

### Step 1 — Understand

Identify:

- requirement ID,
- expected behavior,
- validation rules,
- dependencies,
- relevant edge cases.

### Step 2 — Inspect

Inspect only the relevant existing files and modules.

Do not scan the entire repository without reason.

### Step 3 — Implement

Make the smallest coherent change required to satisfy the feature.

### Step 4 — Validate

Check:

- happy path,
- validation,
- loading state,
- error state,
- relevant edge cases,
- responsive behavior for frontend features.

### Step 5 — Report

Clearly state:

- what changed,
- important implementation decisions,
- tests/checks performed,
- remaining blockers if any.

---

# 12. Frontend Rules

Frontend stack:

```text
React
TypeScript
Vite
Tailwind CSS
```

General rules:

- Build responsive-first.
- Primary target is mobile web while remaining usable on desktop.
- Prefer reusable feature components.
- Keep child interactions visually simple.
- Use large touch targets.
- Avoid unnecessary text on child-facing screens.
- Parent-facing instructions may contain more detail.
- Avoid stressful timers unless explicitly required.
- Do not use negative feedback such as large red "WRONG" states.
- Do not penalize children for needing prompts.

Learning interactions should support the defined prompting behavior.

---

# 13. Backend Rules

Backend stack:

```text
Node.js
TypeScript
Fastify
Prisma
PostgreSQL
```

Backend is responsible for enforcing business rules.

Do not rely only on frontend validation for:

- authorization,
- ownership,
- required fields,
- session integrity,
- progression rules,
- valid state transitions.

Keep route/controller logic thin when possible.

Business logic belongs in the relevant module/service/domain layer.

---

# 14. Database Rules

Use Prisma through:

```text
packages/database
```

Database changes must consider:

- existing relations,
- historical learning data,
- nullable vs required fields,
- unique constraints,
- indexes when relevant,
- migration safety.

Do not delete historical learning records merely because a related entity becomes inactive.

Avoid storing derived data when it can be safely calculated unless performance or product requirements justify it.

---

# 15. Learning Progression Rules

MVP progression is **rule-based**, not machine-learning based.

Do not introduce ML-based progression unless explicitly requested.

Progression may use signals such as:

```text
independent_response
prompt_level
no_response
false_response
parent_observation
```

Do not describe progression thresholds as clinical thresholds.

They are product-learning rules.

---

# 16. Testing Expectations

Test behavior that matters to the requirement.

Prioritize:

1. business rules,
2. progression logic,
3. validation,
4. API behavior,
5. critical user flows.

Avoid writing meaningless tests solely to increase coverage.

When fixing a bug, add or update a test when practical to prevent regression.

---

# 17. Documentation Updates

Do not update documentation unnecessarily.

Update documentation when implementation changes:

- public behavior,
- architecture,
- API contract,
- data model,
- important product decisions.

Use:

```text
docs/DECISIONS.md
```

for decisions that future developers or agents need to understand.

Do not duplicate the same information across multiple documents unless necessary.

---

# 18. TASKS.md

Use `TASKS.md` as the implementation backlog.

When working from an existing task:

- preserve its scope,
- do not silently expand it,
- update its status when appropriate.

If implementation reveals additional work, record it separately instead of hiding it inside the current task.

---

# 19. Do Not Guess Important Product Behavior

If a small implementation detail is unspecified, use reasonable engineering judgment.

If a decision could materially affect:

- product behavior,
- learning methodology,
- user safety,
- data privacy,
- requirement scope,
- architecture,

do not silently invent the behavior.

Flag the ambiguity.

---

# 20. Completion Standard

A task is complete when:

- relevant requirements are satisfied,
- implementation follows repository architecture,
- validation and important edge cases are handled,
- no unrelated features were added,
- relevant tests/checks pass,
- documentation is updated only when necessary,
- no known blocking issue is hidden.

---

# 21. Default Agent Behavior

Always prefer:

```text
understand → inspect targeted context → implement → validate
```

instead of:

```text
read everything → redesign everything → implement more than requested
```

Reuse context you already understand.

Do not repeatedly reload documentation merely because it exists.