# SiapSapa

## Local setup

1. Copy `.env.example` to `.env`.
2. Configure `DATABASE_URL` for your PostgreSQL instance.
3. Install dependencies: `corepack pnpm install`.
4. Start web and API: `corepack pnpm dev`.

The web app runs at `http://localhost:5173`; API health is available at
`http://localhost:3000/api/v1/health`.

SiapSapa adalah **home learning companion** untuk membantu orang tua mendampingi anak usia 4–6 tahun dengan gangguan pendengaran yang baru mulai mengenali suara.

MVP berfokus pada pembangunan fondasi kemampuan auditori melalui aktivitas sederhana, terstruktur, dan didampingi orang tua.

> SiapSapa bukan alat diagnosis, bukan tes pendengaran, dan bukan pengganti audiolog atau terapis profesional.

---

## MVP Focus

Kemampuan utama yang dilatih:

1. **Sound Detection**  
   Anak belajar menyadari ada atau tidaknya suara.

2. **Sound Discrimination**  
   Anak mulai membedakan dua suara yang kontras.

3. **Sound Association**  
   Anak mulai menghubungkan suara dengan sumber atau objek yang sesuai.

Core learning loop:

```text
Prepare
  ↓
Listen
  ↓
Respond
  ↓
Prompt
  ↓
Observe
  ↓
Adapt
  ↓
Practice in Real Life
  ↓
Repeat
```

---

## Core MVP Features

- Parent onboarding
- Child learning profile
- Listening setup
- Daily learning session
- Sound Detection game
- Sound Discrimination game
- Sound Association game
- Prompting ladder
- Parent observation
- Session summary
- Progress tracking
- Rule-based learning progression

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- Fastify
- Prisma ORM

### Database

- PostgreSQL

### Repository

- pnpm workspace
- Monorepo architecture

---

## Project Structure

```text
.
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/
│   │       ├── features/
│   │       └── shared/
│   │
│   └── api/
│       └── src/
│           ├── modules/
│           └── common/
│
├── packages/
│   ├── database/
│   ├── validation/
│   ├── shared/
│   └── config/
│
├── content/
│   ├── audio/
│   ├── images/
│   └── metadata/
│
├── docs/
│   ├── requirements/
│   │   ├── FRONTEND_REQUIREMENTS.md
│   │   └── BACKEND_REQUIREMENTS.md
│   ├── PRD.md
│   ├── USER_FLOWS.md
│   ├── TECH_SPEC.md
│   ├── DATA_MODEL.md
│   └── DECISIONS.md
│
├── tests/
│   ├── e2e/
│   └── integration/
│
├── scripts/
├── AGENTS.md
└── README.md
```

---

## Documentation

| Document | Purpose |
|---|---|
| `docs/PRD.md` | Product goals, users, scope, and success metrics |
| `docs/USER_FLOWS.md` | End-to-end user journeys |
| `docs/requirements/FRONTEND_REQUIREMENTS.md` | Detailed frontend requirements |
| `docs/requirements/BACKEND_REQUIREMENTS.md` | Detailed backend requirements |
| `docs/TECH_SPEC.md` | Architecture and technical conventions |
| `docs/DATA_MODEL.md` | Data entities, fields, relationships, and enums |
| `docs/DECISIONS.md` | Important product and engineering decisions |
| `AGENTS.md` | Rules and context for AI coding agents |

---

## Development Principles

- Build only features included in the agreed MVP scope.
- Prefer reusable feature modules over duplicated implementation.
- Keep frontend and backend responsibilities clearly separated.
- Learning progression must follow defined rule-based logic.
- Do not interpret application performance as a clinical assessment.
- Do not implement hearing diagnosis or audiometry.
- Do not automatically change device volume.
- Do not store child voice recordings in the MVP.
- Avoid unnecessary complexity during the hackathon.

---

## Requirement Convention

Frontend requirements:

```text
FE-{MODULE}-{NUMBER}
```

Example:

```text
FE-DETECT-01
```

Backend requirements:

```text
BE-{MODULE}-{NUMBER}
```

Example:

```text
BE-DETECT-01
```

Related frontend and backend requirements should reference the same parent feature or module.

---

## Development Workflow

Before implementing a feature:

1. Check the relevant requirement.
2. Check the related user flow.
3. Check the technical constraints when necessary.
4. Implement only the requested scope.
5. Test the expected behavior and edge cases.
6. Update `TASKS.md` when the implementation status changes.

For AI-assisted development, follow `AGENTS.md`.

---

## Current Status

SiapSapa is currently in the **MVP design and implementation phase** for JOINTS Hackathon 2026.

Initial focus:

```text
Sound Detection
→ Sound Discrimination
→ Early Sound Association
```

More advanced capabilities such as speech pronunciation assessment, clinical hearing assessment, therapist dashboards, and conversational AI are outside the current MVP scope.
