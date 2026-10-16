# SiapSapa — Decision Log

**Document:** Decision Log  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** Active

---

# 1. Purpose

Dokumen ini menyimpan keputusan penting produk dan engineering yang sudah disepakati.

Tujuannya:

- mencegah keputusan yang sama dibahas berulang,
- menjaga konsistensi antar-developer dan AI coding agent,
- menjelaskan alasan di balik keputusan penting,
- mempermudah perubahan keputusan secara terkontrol.

Jika keputusan berubah:

1. jangan hapus decision lama,
2. tandai sebagai `SUPERSEDED`,
3. tambahkan decision baru,
4. jelaskan alasan perubahan.

---

# 2. Decision Status

Gunakan status:

```text
ACTIVE
SUPERSEDED
REJECTED
```

---

# 3. Product Decisions

## DEC-001 — Product Positioning

**Status:** ACTIVE

SiapSapa diposisikan sebagai:

```text
Home Learning Companion
```

untuk orang tua yang mendampingi anak dengan gangguan pendengaran belajar di rumah.

SiapSapa bukan:

```text
clinical therapy platform
hearing diagnostic system
audiometry tool
```

### Reason

Scope ini lebih feasible untuk MVP dan sesuai tujuan hackathon.

---

## DEC-002 — Target User

**Status:** ACTIVE

Target utama MVP adalah:

```text
anak usia sekitar 4–6 tahun
dengan gangguan pendengaran
yang baru mulai menyadari atau mengenali suara
```

Anak dapat memiliki akses suara melalui:

- sisa pendengaran,
- hearing aid,
- cochlear implant,
- atau teknologi pendengaran lain.

### Reason

Target yang sempit membuat learning experience dan MVP lebih fokus.

---

## DEC-003 — Parent Is Primary User

**Status:** ACTIVE

Parent/caregiver adalah primary user.

Child adalah end user dari learning activity.

### Implication

Instruksi kompleks ditujukan kepada parent.

Child-facing UI harus sederhana dan tidak bergantung pada kemampuan membaca.

---

## DEC-004 — Learning Focus

**Status:** ACTIVE

Learning progression MVP:

```text
Sound Detection
→ Sound Discrimination
→ Early Sound Association
```

Speaking / vocal imitation tidak termasuk core MVP.

### Reason

Target child masih berada pada tahap awal auditory foundation.

---

## DEC-005 — Core Learning Loop

**Status:** ACTIVE

Core product loop:

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

Semua learning feature harus mendukung loop ini.

---

## DEC-006 — Prompt Before Failure

**Status:** ACTIVE

Ketika child belum merespons:

sistem memberikan bantuan bertahap sebelum trial dianggap selesai.

Prompt level:

```text
0 = independent
1 = replay
2 = visual attention cue
3 = parent assistance
```

### Reason

SiapSapa mendukung proses belajar, bukan menguji dengan model pass/fail.

---

## DEC-007 — No Negative Child Feedback

**Status:** ACTIVE

Child-facing UI tidak menggunakan:

```text
Wrong
Failed
Game Over
negative score
life loss
```

Reward diberikan berdasarkan participation dan completion.

---

## DEC-008 — No Clinical Interpretation

**Status:** ACTIVE

Performance aplikasi hanya merepresentasikan:

```text
performance during SiapSapa activities
```

Tidak boleh direpresentasikan sebagai:

```text
hearing score
clinical improvement
hearing severity
hearing level
```

---

# 4. Learning Engine Decisions

## DEC-009 — Rule-Based Progression

**Status:** ACTIVE

MVP menggunakan:

```text
deterministic rule-based progression
```

Bukan:

```text
machine learning
LLM recommendation
predictive model
```

### Reason

Rule-based progression:

- lebih mudah divalidasi,
- lebih explainable,
- lebih cepat dibangun,
- tidak membutuhkan training data.

---

## DEC-010 — Progress Window

**Status:** ACTIVE

Progress menggunakan maksimal:

```text
10 recent valid trials per skill
```

`TECHNICAL_ERROR` tidak termasuk valid trial.

---

## DEC-011 — Minimum Progress Evidence

**Status:** ACTIVE

Jika skill memiliki kurang dari:

```text
5 valid trials
```

state tetap:

```text
EXPLORING
```

kecuali skill masih `NOT_FOCUSED`.

---

## DEC-012 — Progress Threshold

**Status:** ACTIVE

Prototype thresholds:

```text
independent rate < 50%
→ EXPLORING

50%–79%
→ PRACTICING

>= 80%
→ BECOMING_CONSISTENT
```

### Important

Threshold ini merupakan:

```text
product learning configuration
```

bukan clinical threshold.

---

## DEC-013 — Technical Failure Exclusion

**Status:** ACTIVE

Trial dengan:

```text
TECHNICAL_ERROR
```

tidak masuk:

```text
progress numerator
progress denominator
```

Technical failure tidak boleh dianggap sebagai child failure.

---

# 5. Session Decisions

## DEC-014 — Default Session Size

**Status:** ACTIVE

Default:

```text
8 planned trials
```

Minimum valid session plan:

```text
5 trials
```

Nilai ini merupakan UX/product configuration.

---

## DEC-015 — Session Mix

**Status:** ACTIVE

Default session composition:

```text
Detection = EXPLORING

5 Detection
3 Discrimination
0 Association
```

```text
Detection = PRACTICING

4 Detection
3 Discrimination
1 Association
```

```text
Detection = BECOMING_CONSISTENT

3 Detection
3 Discrimination
2 Association
```

---

## DEC-016 — One Active Session per Child

**Status:** ACTIVE

Satu child hanya boleh memiliki:

```text
1 IN_PROGRESS session
```

pada satu waktu.

### Reason

Mengurangi ambiguity pada progress dan session resume.

---

## DEC-017 — Incomplete Session Is Not Failure

**Status:** ACTIVE

Session dapat memiliki status:

```text
INCOMPLETE
```

Jika parent mengakhiri session lebih awal.

Incomplete tidak berarti failed.

Completed trials tetap dipertahankan.

---

# 6. Product Scope Decisions

## DEC-018 — No Voice Recording

**Status:** ACTIVE

MVP tidak:

- merekam suara anak,
- menyimpan voice recording,
- mengupload microphone recording.

### Reason

Mengurangi:

- privacy risk,
- implementation complexity,
- clinical interpretation risk.

---

## DEC-019 — No Pronunciation Scoring

**Status:** ACTIVE

MVP tidak melakukan:

```text
automatic pronunciation scoring
speech recognition scoring
speech quality evaluation
```

---

## DEC-020 — No Hearing Test

**Status:** ACTIVE

MVP tidak melakukan:

```text
audiometry
hearing threshold estimation
device calibration
volume-based hearing testing
```

---

## DEC-021 — No Therapist Dashboard

**Status:** ACTIVE

Therapist dashboard tidak termasuk MVP.

Professional validation dapat dilakukan di luar aplikasi selama tahap hackathon.

---

## DEC-022 — Home Mission Is P1

**Status:** ACTIVE

Offline parent activity / Home Mission merupakan:

```text
P1
```

Core P0 harus selesai terlebih dahulu.

---

# 7. Frontend Decisions

## DEC-023 — Responsive Web

**Status:** ACTIVE

Platform MVP:

```text
Responsive Web
```

Prioritas:

```text
Mobile
→ Tablet
→ Desktop
```

---

## DEC-024 — React Stack

**Status:** ACTIVE

Frontend menggunakan:

```text
React
TypeScript
Vite
Tailwind CSS
```

---

## DEC-025 — TanStack Query for Server State

**Status:** ACTIVE

Data backend seperti:

```text
child
session
progress
summary
```

dikelola menggunakan:

```text
TanStack Query
```

---

## DEC-026 — No Redux for MVP

**Status:** ACTIVE

Redux tidak digunakan.

### Reason

Current application state dapat ditangani dengan:

```text
TanStack Query
+
React local state
+
useReducer
```

---

## DEC-027 — useReducer for Complex Game State

**Status:** ACTIVE

Learning activity dengan banyak transition sebaiknya menggunakan:

```text
useReducer
```

daripada banyak state terpisah yang saling bergantung.

---

## DEC-028 — Native Fetch Wrapper

**Status:** ACTIVE

Frontend menggunakan wrapper atas:

```text
fetch
```

Bukan Axios.

### Reason

Kebutuhan HTTP MVP sederhana dan native fetch sudah mencukupi.

---

## DEC-029 — No Full UI Component Library

**Status:** ACTIVE

MVP tidak bergantung pada full design system library.

Child-facing UI membutuhkan interaction yang cukup custom.

Headless dependency boleh ditambahkan jika benar-benar membantu component accessibility tertentu.

---

# 8. Backend Decisions

## DEC-030 — Backend Framework

**Status:** ACTIVE

Backend menggunakan:

```text
Node.js
TypeScript
Fastify
```

---

## DEC-031 — PostgreSQL

**Status:** ACTIVE

Primary database:

```text
PostgreSQL
```

---

## DEC-032 — Prisma

**Status:** ACTIVE

Database ORM/data layer:

```text
Prisma ORM 7.x stable
```

Exact stable version harus di-pin.

Jangan menggunakan prerelease secara otomatis.

---

## DEC-033 — Prisma Is Not Backend Framework

**Status:** ACTIVE

Prisma hanya bertanggung jawab sebagai:

```text
ORM / database data layer
```

Business logic tetap berada di Fastify application/service modules.

---

# 9. Authentication Decisions

## DEC-034 — Email + Password MVP

**Status:** ACTIVE

MVP authentication menggunakan:

```text
email
+
password
```

Tidak termasuk:

```text
Google Sign-In
Magic Link
MFA
```

---

## DEC-035 — Server-Side Session

**Status:** ACTIVE

Authentication menggunakan:

```text
server-side opaque session
```

Bukan JWT sebagai default.

---

## DEC-036 — HttpOnly Cookie

**Status:** ACTIVE

Authentication token dikirim melalui:

```text
HttpOnly cookie
```

Production cookie:

```text
HttpOnly = true
Secure = true
SameSite = Lax
```

---

## DEC-037 — Session Token Hash

**Status:** ACTIVE

Browser menerima random opaque token.

Database menyimpan:

```text
token hash
```

bukan raw token.

---

## DEC-038 — Argon2id Password Hash

**Status:** ACTIVE

Password hashing menggunakan:

```text
Argon2id
```

---

## DEC-039 — Same-Origin Production

**Status:** ACTIVE

Production architecture sebisa mungkin menggunakan:

```text
same-origin frontend + API
```

Contoh:

```text
https://siapsapa.app
https://siapsapa.app/api/v1/*
```

### Reason

Menyederhanakan:

- authentication cookie,
- CORS,
- CSRF protection,
- deployment behavior.

---

# 10. API Decisions

## DEC-040 — REST API

**Status:** ACTIVE

Backend menggunakan:

```text
REST JSON API
```

Base:

```text
/api/v1
```

GraphQL tidak digunakan untuk MVP.

---

## DEC-041 — Standard API Response

**Status:** ACTIVE

Success:

```json
{
  "data": {}
}
```

List dapat memiliki:

```json
{
  "data": [],
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "...",
    "details": []
  }
}
```

---

## DEC-042 — Backend Evaluates Trial

**Status:** ACTIVE

Frontend hanya mengirim response.

Backend menentukan:

```text
correctness
resultType
progress
```

Frontend tidak menjadi authority.

---

# 11. Validation Decisions

## DEC-043 — Zod

**Status:** ACTIVE

Runtime validation menggunakan:

```text
Zod
```

---

## DEC-044 — Shared Validation Package

**Status:** ACTIVE

API input schema yang digunakan FE dan BE disimpan di:

```text
packages/validation
```

Backend tetap wajib melakukan runtime validation.

---

# 12. Repository Decisions

## DEC-045 — Monorepo

**Status:** ACTIVE

Repository menggunakan:

```text
pnpm workspace monorepo
```

---

## DEC-046 — No Turborepo/Nx Initially

**Status:** ACTIVE

MVP tidak menggunakan:

```text
Nx
Turborepo
```

### Reason

Native pnpm workspace cukup untuk current scale.

---

## DEC-047 — Feature-Based Frontend

**Status:** ACTIVE

Frontend diorganisasi berdasarkan feature.

Contoh:

```text
features/
  onboarding/
  child-profile/
  sound-detection/
  sound-discrimination/
```

Bukan satu folder global besar berisi seluruh:

```text
components
hooks
services
```

---

## DEC-048 — Module-Based Backend

**Status:** ACTIVE

Backend diorganisasi berdasarkan domain module:

```text
auth
children
sessions
activities
trials
progress
content
```

---

## DEC-049 — Minimal Shared Packages

**Status:** ACTIVE

Shared packages awal:

```text
database
validation
shared
config
```

Jangan membuat package baru tanpa reuse case yang jelas.

---

# 13. Database Decisions

## DEC-050 — UUID

**Status:** ACTIVE

Externally visible primary IDs menggunakan:

```text
UUID
```

---

## DEC-051 — Historical Data Preservation

**Status:** ACTIVE

Historical learning data seperti:

```text
Session
Trial
TrialResult
```

tidak boleh dihapus ketika child profile berubah.

---

## DEC-052 — Content Deactivation

**Status:** ACTIVE

Learning content yang sudah digunakan tidak di-hard-delete.

Gunakan:

```text
isActive = false
```

---

## DEC-053 — Progress Is Derived

**Status:** ACTIVE

`LearningProgress` dapat disimpan sebagai current cache.

Source of truth tetap:

```text
TrialResult
```

Progress harus dapat dihitung ulang.

---

# 14. Audio Decisions

## DEC-054 — HTMLAudioElement

**Status:** ACTIVE

Browser audio menggunakan:

```text
HTMLAudioElement
```

melalui shared abstraction.

---

## DEC-055 — Single Active Audio

**Status:** ACTIVE

Hanya satu stimulus audio aktif pada satu waktu.

Audio tidak boleh overlap.

---

## DEC-056 — No Automatic Volume Control

**Status:** ACTIVE

Frontend tidak mengubah system volume secara otomatis.

---

## DEC-057 — Explicit User Gesture Before Audio

**Status:** ACTIVE

Learning session dimulai setelah parent melakukan explicit action:

```text
Kami Siap
```

Hal ini juga membantu memenuhi browser autoplay restriction.

---

## DEC-058 — Static Learning Assets

**Status:** ACTIVE

MVP dapat menyajikan learning assets sebagai static files.

Source content:

```text
content/audio
content/images
```

Database hanya menyimpan asset reference/path.

Binary audio tidak disimpan di PostgreSQL.

---

# 15. Testing Decisions

## DEC-059 — Vitest

**Status:** ACTIVE

Unit dan integration test menggunakan:

```text
Vitest
```

---

## DEC-060 — React Testing Library

**Status:** ACTIVE

Frontend component behavior menggunakan:

```text
React Testing Library
```

---

## DEC-061 — Fastify Inject

**Status:** ACTIVE

Backend HTTP integration test menggunakan:

```text
Fastify inject()
```

---

## DEC-062 — Playwright

**Status:** ACTIVE

Critical E2E flow menggunakan:

```text
Playwright
```

Tidak perlu menguji seluruh edge case melalui E2E.

---

# 16. Infrastructure Decisions

## DEC-064 — Provider Neutral Deployment

**Status:** ACTIVE

Architecture tidak dikunci ke vendor deployment tertentu.

Frontend, backend, dan database harus dapat dipindahkan antar-provider dengan perubahan infrastructure minimal.

---

## DEC-065 — No Redis

**Status:** ACTIVE

Redis tidak digunakan untuk MVP.

Tidak ada kebutuhan nyata saat ini.

---

## DEC-066 — No Microservices

**Status:** ACTIVE

Backend menggunakan satu modular application.

Microservices tidak digunakan.

---

## DEC-067 — No WebSocket

**Status:** ACTIVE

MVP tidak membutuhkan real-time bidirectional communication.

WebSocket tidak digunakan.

---

# 17. Documentation Decisions

## DEC-068 — PRD Separate from Functional Requirements

**Status:** ACTIVE

`PRD.md` berisi:

```text
why
what
scope
goals
```

Detailed behavior dipisahkan ke:

```text
FRONTEND_REQUIREMENTS.md
BACKEND_REQUIREMENTS.md
```

---

## DEC-069 — FE and BE Requirements Are Separate Files

**Status:** ACTIVE

Frontend:

```text
docs/requirements/FRONTEND_REQUIREMENTS.md
```

Backend:

```text
docs/requirements/BACKEND_REQUIREMENTS.md
```

Keduanya menggunakan Parent Feature ID yang sama bila terkait capability yang sama.

---

## DEC-070 — Requirement IDs

**Status:** ACTIVE

Frontend:

```text
FE-{MODULE}-{NUMBER}
```

Backend:

```text
BE-{MODULE}-{NUMBER}
```

---

## DEC-071 — No TASKS.md

**Status:** ACTIVE

Repository tidak menggunakan:

```text
TASKS.md
```

Task tracking dilakukan melalui workflow lain.

Reference ke `TASKS.md` harus dihapus dari dokumentasi lain.

---

## DEC-072 — AI Agent Uses Targeted Context

**Status:** ACTIVE

AI coding agent tidak membaca ulang seluruh dokumentasi jika sudah memahami context pada current working session.

Agent harus:

```text
reuse known context
+
read only relevant sections when needed
```

Full reread hanya jika:

- document berubah,
- requirement tidak jelas,
- context tidak lagi tersedia,
- terjadi conflict,
- user meminta verification.

---

# 18. Rejected Alternatives

## REJ-001 — JWT as Default Authentication

**Status:** REJECTED

JWT tidak dipilih untuk MVP.

### Reason

Server-side session lebih sederhana untuk current browser application dan logout/revocation.

---

## REJ-002 — Redux

**Status:** REJECTED

Redux belum diperlukan.

---

## REJ-003 — ML Adaptive Learning

**Status:** REJECTED

Tidak cukup data dan terlalu sulit divalidasi untuk MVP.

Rule-based progression dipilih.

---

## REJ-004 — Child Voice Recording

**Status:** REJECTED

Tidak diperlukan untuk core MVP dan meningkatkan privacy/safety complexity.

---

## REJ-005 — Speech Recognition MVP

**Status:** REJECTED

Tidak termasuk current learning goal.

---

## REJ-006 — Microservice Architecture

**Status:** REJECTED

Tidak sesuai kebutuhan dan timeline hackathon.

---

## REJ-007 — Full PWA / Offline First

**Status:** REJECTED

Responsive online web diprioritaskan.

PWA dapat dipertimbangkan setelah MVP.

---

# 19. How to Change a Decision

Jika keputusan perlu berubah:

Gunakan format:

```text
## DEC-XXX — New Decision

Status: ACTIVE

Supersedes:
DEC-YYY

Decision:
...

Reason:
...

Impact:
...
```

Lalu ubah decision lama menjadi:

```text
Status: SUPERSEDED
```

Jangan menghapus historical decision.

---

# 20. Decision Priority

Jika coding agent menemukan conflict, gunakan urutan:

```text
Latest explicit user instruction
        ↓
Active functional requirement
        ↓
Active decision in DECISIONS.md
        ↓
PRD
        ↓
USER_FLOWS
        ↓
TECH_SPEC
        ↓
Existing implementation
```

Conflict yang dapat mengubah product behavior harus dilaporkan, bukan ditebak.

---

# 21. Current Architecture Snapshot

Keputusan utama saat ini:

```text
Responsive Web

React + TypeScript + Vite
Tailwind CSS
TanStack Query
React Hook Form
Zod

Fastify + TypeScript
Prisma 7.x stable
PostgreSQL

pnpm monorepo

Email + Password
Server-side opaque session
HttpOnly cookie

Rule-based learning progression

No ML
No voice recording
No clinical assessment
```

---

# 22. Final Principle

Keputusan SiapSapa harus mengutamakan:

```text
product clarity
+
child safety
+
implementation speed
+
maintainability
+
explainable learning logic
```

Jika terdapat dua solusi teknis yang sama-sama memenuhi requirement:

pilih solusi yang lebih sederhana, lebih mudah diuji, dan lebih mudah dipahami developer berikutnya.
