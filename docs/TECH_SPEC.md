# SiapSapa — Technical Specification

**Document:** Technical Specification  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** MVP  
**Architecture:** TypeScript Monorepo  
**Platform:** Responsive Web

---

# 1. Purpose

Dokumen ini mendefinisikan keputusan teknis utama SiapSapa.

Dokumen ini menjadi source of truth untuk:

- technology stack,
- repository architecture,
- application boundaries,
- frontend architecture,
- backend architecture,
- authentication,
- API communication,
- validation,
- database access,
- learning engine,
- audio handling,
- error handling,
- testing,
- environment configuration,
- security,
- deployment,
- dan engineering conventions.

Behavior produk tetap mengikuti:

```text
docs/PRD.md
docs/USER_FLOWS.md
docs/requirements/FRONTEND_REQUIREMENTS.md
docs/requirements/BACKEND_REQUIREMENTS.md
docs/DATA_MODEL.md
```

Jika detail teknis di dokumen ini bertentangan dengan product requirement, jangan mengubah product behavior secara diam-diam.

---

# 2. Architecture Goals

Arsitektur MVP harus memenuhi:

1. Mudah dikerjakan beberapa developer secara paralel.
2. Mudah dipahami AI coding agent.
3. Frontend dan backend memiliki boundary yang jelas.
4. Business logic tidak tersebar di UI atau route handler.
5. Learning progression deterministic dan testable.
6. Tidak over-engineered untuk hackathon.
7. Dapat dikembangkan setelah hackathon tanpa rewrite besar.
8. Shared code digunakan hanya ketika benar-benar dibutuhkan.

---

# 3. Technology Stack

## Runtime

```text
Node.js 24 LTS
TypeScript
```

Gunakan satu Node version yang sama untuk seluruh tim dan CI.

Simpan versi melalui salah satu:

```text
.nvmrc
.node-version
```

---

## Package Manager

```text
pnpm
```

Repository menggunakan:

```text
pnpm workspace
```

Commit:

```text
pnpm-lock.yaml
```

ke repository.

---

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
React Hook Form
Zod
```

---

## Backend

```text
Node.js
TypeScript
Fastify
Zod
Prisma ORM 7.x stable
PostgreSQL
```

Exact dependency versions harus di-pin melalui `package.json` dan lockfile.

Jangan menggunakan prerelease / release candidate dependency untuk core infrastructure tanpa keputusan eksplisit.

---

# 4. Monorepo Strategy

SiapSapa menggunakan satu repository.

```text
.
├── apps/
│   ├── web/
│   └── api/
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
├── tests/
├── scripts/
│
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

MVP tidak membutuhkan Nx, Turborepo, atau monorepo orchestration framework tambahan.

Gunakan native pnpm workspace terlebih dahulu.

Tambahkan build orchestrator hanya jika kebutuhan nyata muncul.

---

# 5. Workspace Boundaries

Allowed dependency direction:

```text
apps/web
 ├── packages/validation
 ├── packages/shared
 └── packages/config

apps/api
 ├── packages/database
 ├── packages/validation
 ├── packages/shared
 └── packages/config

packages/database
 └── packages/config

packages/validation
 └── packages/shared

packages/shared
 └── no application dependency
```

Forbidden:

```text
apps/web → packages/database

packages/* → apps/*

apps/web → apps/api internal source files

apps/api → apps/web
```

Frontend berkomunikasi dengan backend hanya melalui API contract.

---

# 6. Root Package Responsibilities

Root `package.json` hanya digunakan untuk:

- workspace scripts,
- shared developer tooling,
- formatting,
- linting,
- type checking.

Contoh command yang diharapkan:

```text
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm db:migrate
pnpm db:seed
```

Exact scripts dapat disesuaikan ketika project diinisialisasi.

---

# 7. Frontend Architecture

Frontend menggunakan:

```text
feature-based architecture
```

Target structure:

```text
apps/web/src/
├── app/
│   ├── router/
│   ├── providers/
│   ├── layouts/
│   └── App.tsx
│
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── child-profile/
│   ├── daily-session/
│   ├── sound-detection/
│   ├── sound-discrimination/
│   ├── sound-association/
│   ├── progress/
│   └── parent/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── utils/
│   └── types/
│
├── main.tsx
└── index.css
```

---

# 8. Frontend Feature Structure

Feature tidak wajib memiliki semua folder berikut.

Gunakan hanya jika dibutuhkan.

Example:

```text
features/sound-detection/
├── components/
├── hooks/
├── api/
├── utils/
├── types.ts
└── index.ts
```

Page-level component dapat berada di feature terkait.

Jangan membuat folder kosong hanya untuk mengikuti template.

---

# 9. Frontend Shared Rule

Pindahkan component ke:

```text
src/shared/components
```

hanya jika digunakan oleh lebih dari satu feature atau memang merupakan primitive generik.

Contoh valid:

```text
Button
LoadingButton
ErrorState
PageContainer
SessionProgress
PauseSessionDialog
```

Component khusus Sound Detection tetap berada di:

```text
features/sound-detection/
```

---

# 10. Frontend Routing

Gunakan React Router.

Suggested route structure:

```text
/
├── /login
├── /register
├── /onboarding
├── /children/new
├── /home
├── /children/:childId
├── /children/:childId/session
├── /sessions/:sessionId
├── /children/:childId/progress
└── /parent
```

Gunakan route guard untuk authenticated route.

Authentication state tetap diverifikasi backend melalui:

```text
GET /api/v1/auth/me
```

Jangan hanya mempercayai frontend state.

---

# 11. Frontend Server State

Gunakan:

```text
@tanstack/react-query
```

untuk data dari backend seperti:

```text
current parent
child profile
session
session history
progress
session summary
```

Gunakan:

```text
useQuery
useMutation
QueryClient
```

sesuai kebutuhan.

Jangan membuat duplicate global store untuk data yang sudah dikelola TanStack Query.

---

# 12. Frontend Local State

Gunakan React local state / reducer untuk state ephemeral seperti:

```text
current prompt level
audio playback state
current child selection
activity UI state
pause dialog state
temporary response state
```

Untuk flow game yang memiliki banyak state transition, prefer:

```text
useReducer
```

dibanding banyak `useState` yang saling bergantung.

MVP tidak membutuhkan Redux.

MVP tidak membutuhkan Zustand kecuali ada kebutuhan nyata yang tidak dapat diselesaikan dengan architecture saat ini.

---

# 13. Learning Activity State Machine

Learning activity harus memiliki state yang eksplisit.

Suggested base state:

```text
READY
AUDIO_LOADING
AUDIO_PLAYING
WAITING_RESPONSE
PROMPTING
SUBMITTING
FEEDBACK
COMPLETED
AUDIO_ERROR
PAUSED
```

Transition harus deterministic.

Example:

```text
READY
  ↓
AUDIO_LOADING
  ↓
AUDIO_PLAYING
  ↓
WAITING_RESPONSE
  ↓
SUBMITTING
  ↓
FEEDBACK
  ↓
next trial
```

Untuk missing response:

```text
WAITING_RESPONSE
  ↓
PROMPTING
  ↓
AUDIO_PLAYING
  ↓
WAITING_RESPONSE
```

Jangan mengendalikan flow hanya menggunakan timeout yang tersebar di component.

---

# 14. Frontend Form Handling

Gunakan:

```text
React Hook Form
+
Zod
```

untuk:

- registration,
- login,
- child profile,
- profile editing.

Frontend schema dapat mengonsumsi schema dari:

```text
packages/validation
```

jika schema tersebut merupakan public API contract.

Backend tetap melakukan validation ulang.

---

# 15. API Client

Frontend menggunakan thin wrapper di atas native:

```text
fetch
```

MVP tidak membutuhkan Axios.

Suggested location:

```text
apps/web/src/shared/lib/api-client.ts
```

API client bertanggung jawab untuk:

- base URL,
- JSON serialization,
- cookie credentials,
- standard error parsing,
- common headers.

Example conceptual interface:

```ts
api.get()
api.post()
api.put()
api.patch()
```

Feature-specific request tetap berada di feature masing-masing.

---

# 16. API Base URL

Development:

```text
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Production preferred:

```text
/api/v1
```

Production sebaiknya menggunakan same-origin routing / reverse proxy.

Tujuannya:

- authentication cookie lebih sederhana,
- CORS lebih sederhana,
- mengurangi cross-site complexity.

---

# 17. API Request Behavior

Semua authenticated request harus:

```text
credentials: "include"
```

Backend response format mengikuti:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request tidak valid.",
    "details": []
  }
}
```

Frontend tidak boleh bergantung pada arbitrary raw backend error text.

Gunakan `error.code` untuk branching behavior.

---

# 18. Shared Validation

Package:

```text
packages/validation
```

digunakan untuk schema yang menjadi contract lintas frontend/backend.

Contoh:

```text
RegisterParentInput
LoginInput
CreateChildInput
UpdateChildInput
SubmitTrialResultInput
ParentObservationInput
```

Zod schema menjadi source untuk:

- runtime validation,
- TypeScript input inference.

Hindari mendefinisikan schema input yang sama secara terpisah di FE dan BE.

---

# 19. Shared Package

```text
packages/shared
```

hanya berisi pure code yang aman digunakan FE dan BE.

Contoh:

```text
public domain enums
constants
API-safe shared types
utility functions tanpa Node/browser dependency
```

Jangan menempatkan:

- Prisma client,
- database model implementation,
- Fastify plugin,
- React component

di package ini.

---

# 20. Backend Architecture

Backend menggunakan modular architecture.

```text
apps/api/src/
├── app/
│   ├── build-app.ts
│   └── plugins/
│
├── modules/
│   ├── auth/
│   ├── children/
│   ├── sessions/
│   ├── activities/
│   ├── trials/
│   ├── progress/
│   └── content/
│
├── common/
│   ├── errors/
│   ├── auth/
│   ├── config/
│   └── utils/
│
└── server.ts
```

`server.ts` hanya bertanggung jawab melakukan startup.

Fastify app harus dapat dibuat tanpa langsung menjalankan HTTP server agar dapat digunakan pada integration test.

---

# 21. Backend Module Pattern

Suggested pattern:

```text
modules/children/
├── child.route.ts
├── child.schema.ts
├── child.service.ts
├── child.repository.ts
├── child.types.ts
└── child.test.ts
```

Tidak semua file wajib ada.

Responsibility:

```text
route
→ HTTP concerns

schema
→ request / response validation

service
→ business logic

repository
→ database query

test
→ module behavior
```

Route handler tidak boleh menjadi tempat business logic utama.

---

# 22. Backend Request Flow

Expected flow:

```text
HTTP Request
    ↓
Fastify Route
    ↓
Authentication
    ↓
Validation
    ↓
Service
    ↓
Repository / Prisma
    ↓
Service Result
    ↓
Response Mapper
    ↓
HTTP Response
```

---

# 23. Database Package

Database-related code berada di:

```text
packages/database/
```

Suggested structure:

```text
packages/database/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── client.ts
│   └── index.ts
│
└── package.json
```

Jika Prisma 7 tooling membutuhkan configuration file:

```text
prisma.config.ts
```

tempatkan sesuai requirement Prisma version yang dipin.

---

# 24. Prisma Version Policy

Untuk MVP:

```text
Prisma ORM 7.x stable
```

Exact stable version harus dipin.

Jangan menjalankan upgrade major otomatis saat hackathon.

Upgrade major harus:

1. dilakukan sengaja,
2. membaca migration guide,
3. menjalankan seluruh test,
4. dicatat di `DECISIONS.md`.

---

# 25. Prisma Client Usage

Aplikasi hanya menggunakan satu shared database client instance per process.

Jangan membuat Prisma client baru pada setiap request.

Database access backend dilakukan melalui:

```text
packages/database
```

Frontend tidak boleh mengimpor package ini.

---

# 26. Database Migration

Gunakan versioned migration.

Development:

```text
prisma migrate dev
```

Production:

```text
prisma migrate deploy
```

Jangan menggunakan destructive schema reset pada production environment.

Migration file harus di-commit.

---

# 27. Database Seed

Seed minimum menyediakan:

```text
LearningStimulus
VisualAsset
StimulusContrast
```

Target awal:

```text
8–12 beginner audio stimuli
```

Seed harus idempotent jika memungkinkan.

Gunakan deterministic identifier atau upsert untuk curated content.

---

# 28. Authentication Strategy

MVP menggunakan:

```text
email
+
password
+
server-side opaque session
```

Tidak menggunakan JWT sebagai default.

Alasan:

- browser application,
- same-origin deployment,
- revocation sederhana,
- implementation lebih mudah dikontrol,
- tidak membutuhkan refresh-token flow.

---

# 29. Password Storage

Password di-hash menggunakan:

```text
Argon2id
```

Password plaintext:

- tidak disimpan,
- tidak dilog,
- tidak dikembalikan API.

Library implementation harus menggunakan maintained Argon2 package.

---

# 30. Authentication Session

Tambahkan entity:

```text
AuthSession
```

Suggested data:

```text
id
parentId
tokenHash
expiresAt
createdAt
lastUsedAt
```

Browser menerima random opaque token.

Database hanya menyimpan hash token.

Token raw tidak disimpan ke database.

---

# 31. Session Cookie

Suggested cookie:

```text
siapsapa_session
```

Production configuration:

```text
HttpOnly = true
Secure = true
SameSite = Lax
Path = /
```

Development localhost dapat menggunakan:

```text
Secure = false
```

Cookie tidak dapat dibaca JavaScript frontend.

---

# 32. Authentication Session Lifetime

Default prototype configuration:

```text
7 days
```

Nilai harus berada dalam centralized configuration.

Expiry bukan hardcoded tersebar.

Logout:

```text
delete/invalidate AuthSession
+
clear browser cookie
```

---

# 33. Authentication Non-Goals

MVP tidak mencakup:

```text
Google Sign-In
Magic Link
Forgot Password
Email Verification
Multi-Factor Authentication
Social Login
```

Fitur tersebut membutuhkan requirement terpisah.

---

# 34. CSRF / Request Origin Protection

Karena authentication menggunakan cookie:

state-changing request harus dilindungi.

MVP strategy:

- SameSite=Lax cookie,
- JSON API only,
- validate trusted Origin untuk state-changing requests,
- production same-origin deployment.

Jika frontend/backend nanti berada pada site berbeda, security model harus direview.

---

# 35. CORS

Development:

```text
web = http://localhost:5173
api = http://localhost:3000
```

Backend hanya mengizinkan configured web origin.

Gunakan:

```text
credentials = true
```

Jangan menggunakan:

```text
Access-Control-Allow-Origin: *
```

bersamaan dengan credential cookie.

Production preferred:

```text
same-origin
```

---

# 36. Backend Security Plugins

Gunakan Fastify-compatible middleware/plugin untuk:

```text
security headers
cookie handling
CORS
rate limiting when enabled
```

Security headers harus aktif di production.

Authentication rate limiting dapat menjadi P1 sesuai backend requirements.

---

# 37. Logging

Fastify/Pino digunakan untuk structured logging.

Log boleh mencakup:

```text
request id
method
route
status code
duration
internal error code
```

Log tidak boleh mencakup:

```text
password
raw session token
full cookie value
child sensitive data
```

Sensitive header harus di-redact.

---

# 38. Error Architecture

Buat application error abstraction.

Contoh:

```text
ValidationError
UnauthenticatedError
ForbiddenError
NotFoundError
ConflictError
InvalidStateError
ContentUnavailableError
```

Service melempar domain/application error.

Global Fastify error handler memetakan error menjadi API error response.

Jangan membuat setiap route mendefinisikan error format sendiri.

---

# 39. Learning Engine Architecture

Learning logic harus dipisahkan dari HTTP layer.

Core services minimal:

```text
SessionPlanner
TrialEvaluator
ProgressCalculator
```

Suggested responsibilities:

```text
SessionPlanner
→ menentukan skill mix
→ memilih stimulus
→ membuat trial plan

TrialEvaluator
→ mengevaluasi final response
→ menentukan normalized trial result

ProgressCalculator
→ membaca recent valid trials
→ menghitung independent rate
→ menentukan learning state
```

Semua logic harus deterministic dan testable tanpa browser.

---

# 40. Session Planner

Suggested location:

```text
apps/api/src/modules/sessions/session-planner.service.ts
```

Input:

```text
child
current learning progress
available learning content
```

Output:

```text
session plan
activities
trials
```

Planner tidak melakukan HTTP request.

Planner tidak menggunakan LLM.

Planner tidak menggunakan machine learning.

---

# 41. Centralized Learning Configuration

Learning rules disimpan di satu tempat.

Contoh:

```text
apps/api/src/common/config/learning.config.ts
```

atau shared backend config package.

Configuration mencakup:

```text
recentTrialWindow = 10
minimumProgressTrials = 5
practicingThreshold = 0.50
consistentThreshold = 0.80

sessionTrialCount = 8
minimumSessionTrialCount = 5

promptLevelMin = 0
promptLevelMax = 3
```

Session composition juga harus centralized.

Jangan menyebarkan angka tersebut sebagai magic number.

Angka ini adalah prototype product rule, bukan clinical threshold.

---

# 42. Trial Evaluation Ownership

Backend adalah authority untuk:

```text
correctness
resultType
session state
progress state
```

Frontend mengirim:

```text
child response
prompt level
technical state
response metadata
```

Frontend tidak mengirim authoritative:

```text
isCorrect
resultType
progressScore
learningState
```

---

# 43. Prompting Technical Rule

Prompting adalah **pre-response assistance**.

Frontend dapat:

```text
replay stimulus
show visual attention cue
show parent assistance prompt
```

dan melacak:

```text
promptLevel
```

Begitu child memberikan final selection/tap, response dikirim ke backend.

Frontend tidak perlu mengetahui clinical meaning dari hasil tersebut.

---

# 44. Silent Detection Trial

Untuk:

```text
DETECTION_SILENT
```

frontend:

1. tidak memainkan audio,
2. membuka response window,
3. tidak memberi visual indication bahwa trial silent,
4. mengirim response jika child tap,
5. mengirim `responded=false` jika trial selesai tanpa tap.

Silent trial tidak menjalankan audio-error behavior.

Frontend tidak boleh memainkan placeholder sound pada silent trial.

---

# 45. Trial Timing

Timing merupakan UX configuration, bukan clinical configuration.

Values seperti:

```text
preStimulusDelay
responseWindow
feedbackDuration
pairPauseDuration
```

harus diletakkan pada satu frontend activity configuration.

Jangan hardcode timeout yang sama di beberapa component.

Tidak ada countdown visual untuk child.

---

# 46. Audio Architecture

Gunakan browser media API:

```text
HTMLAudioElement
```

melalui reusable abstraction.

Suggested:

```text
apps/web/src/shared/lib/audio/
├── audio-player.ts
└── use-audio-player.ts
```

Abstraction mengelola:

```text
load
play
stop
ended
error
cleanup
```

---

# 47. Single Audio Channel

Learning activity hanya memiliki satu active learning audio pada satu waktu.

Sebelum stimulus baru:

```text
stop previous
reset playback
load next
```

Audio overlap dilarang.

---

# 48. Browser Autoplay Handling

Browser dapat membatasi autoplay audio.

Karena itu, session harus memiliki explicit user interaction sebelum learning playback pertama.

Contoh:

```text
Listening Setup
→ "Kami Siap"
→ Session Start
```

Frontend audio system harus diinisialisasi/unlock setelah user gesture.

Jangan mengandalkan autoplay saat page load.

---

# 49. Audio Preloading

Frontend boleh preload stimulus trial berikutnya setelah session dimulai.

Tujuan:

- mengurangi delay,
- memperhalus aktivitas.

Jangan preload seluruh library audio.

Preload hanya content yang menjadi bagian session aktif.

---

# 50. Learning Asset Strategy

Source assets repository:

```text
content/audio/
content/images/
content/metadata/
```

Untuk MVP, build/setup script dapat menyalin curated assets ke static web directory seperti:

```text
apps/web/public/learning-assets/
```

API menyimpan/menyediakan relative public asset path.

Example:

```text
/learning-assets/audio/animals/dog-bark-01.mp3
```

Frontend tidak mengetahui filesystem source.

---

# 51. Future Asset Migration

API contract menggunakan asset URL/path abstraction.

Karena itu aset nantinya dapat dipindahkan ke:

```text
object storage
CDN
cloud asset hosting
```

tanpa mengubah game behavior.

Jangan menyimpan binary audio di PostgreSQL.

---

# 52. Session Recovery

Backend menyimpan final trial results.

Frontend activity state yang belum disubmit tidak dianggap persisted.

Jika browser refresh di tengah trial:

```text
load session
→ backend returns completed trials
→ continue from next incomplete trial
```

Current unfinished trial dapat dimulai ulang.

Jangan menyimpan seluruh child activity state ke `localStorage`.

---

# 53. Browser Storage Policy

Jangan simpan ke localStorage:

```text
password
session token
child health information
trial history as authority
```

Authentication menggunakan HttpOnly cookie.

TanStack Query cache cukup untuk temporary server data.

Jika localStorage digunakan di masa depan, data harus non-sensitive dan memiliki alasan produk yang jelas.

---

# 54. Progress Calculation

Progress dilakukan backend.

Frontend tidak menghitung authoritative learning state.

Backend:

```text
TrialResult
→ recent valid trials
→ independent rate
→ learning state
```

`TECHNICAL_ERROR` dikeluarkan dari numerator dan denominator.

Current progress dapat disimpan pada:

```text
LearningProgress
```

tetapi harus dapat direbuild dari historical trial results.

---

# 55. Transaction Boundaries

Gunakan Prisma transaction untuk:

## Child creation

```text
Child
+
initial LearningProgress
```

## Session creation

```text
LearningSession
+
SessionActivities
+
Trials
+
AssociationOptions
```

## Session completion

```text
update session
+
recalculate progress
+
update LearningProgress
+
optional ProgressHistory
```

Partial write harus dihindari.

---

# 56. Concurrency

Critical concurrency case:

```text
create learning session
```

Business rule:

```text
maximum one IN_PROGRESS session per child
```

Backend harus memastikan dua request bersamaan tidak membuat dua active sessions.

Implementation dapat menggunakan:

- transaction,
- database constraint,
- transactional lock/guard yang sesuai.

Jangan hanya mengandalkan frontend button disable.

---

# 57. Idempotency

Operations yang harus aman terhadap duplicate request:

```text
trial final submission
session completion
logout
```

Identical retry tidak boleh:

- membuat duplicate result,
- menghitung progress dua kali,
- membuat summary ganda.

---

# 58. Responsive UI Strategy

Frontend dirancang mobile-first.

Target minimum:

```text
360px width
```

Support:

```text
mobile
tablet
desktop
```

Child activity menggunakan bounded interaction area pada desktop.

Tidak bergantung pada hover.

---

# 59. Styling

Gunakan:

```text
Tailwind CSS
```

Gunakan Vite integration resmi dari Tailwind version yang dipin.

Global design tokens dapat didefinisikan pada CSS/theme configuration.

Hindari inline style kecuali nilai memang dinamis dan tidak praktis melalui utility.

---

# 60. Component Library

MVP tidak mewajibkan external UI component library.

Alasan:

- child-facing UI sangat custom,
- menjaga dependency ringan,
- menghindari unnecessary visual conventions.

Untuk parent UI, buat primitives sederhana sendiri.

Headless UI library boleh ditambahkan hanya jika benar-benar mengurangi complexity untuk component seperti accessible dialog.

---

# 61. Icons

Jika dibutuhkan, gunakan satu icon library konsisten.

Jangan mencampur beberapa icon library.

Icon tidak boleh menjadi satu-satunya cara menyampaikan critical parent action tanpa accessible label.

---

# 62. Accessibility

Frontend harus mengikuti requirement accessibility minimum:

```text
semantic HTML
keyboard-accessible parent UI
accessible form labels
sufficient touch targets
color not sole state indicator
```

Child activity tidak bergantung pada kemampuan membaca.

Animation tidak boleh menjadi satu-satunya feedback.

---

# 63. Frontend Testing

Gunakan:

```text
Vitest
React Testing Library
```

Focus unit/component test:

```text
form validation
activity state transition
prompt progression
audio error state
duplicate submission protection
progress rendering
```

Test behavior, bukan implementation detail.

---

# 64. Backend Testing

Gunakan:

```text
Vitest
Fastify inject()
```

Service/unit tests digunakan untuk:

```text
SessionPlanner
TrialEvaluator
ProgressCalculator
```

API integration tests digunakan untuk:

```text
authentication
authorization
validation
session lifecycle
trial submission
```

---

# 65. Database Integration Testing

Gunakan dedicated PostgreSQL test database.

Environment:

```text
TEST_DATABASE_URL
```

Test tidak boleh menggunakan production/development data.

Integration test harus dapat:

```text
apply test schema
seed minimal content
run tests
cleanup
```

MVP tidak wajib menggunakan Testcontainers jika setup tersebut memperlambat tim.

---

# 66. E2E Testing

Gunakan:

```text
Playwright
```

Critical E2E flow:

```text
register
→ create child
→ start session
→ complete detection
→ complete discrimination
→ submit observation
→ view summary
→ view progress
```

E2E tidak perlu mencakup setiap edge case.

Edge case lebih efisien diuji melalui unit/integration test.

---

# 67. Linting & Formatting

Gunakan shared configuration di:

```text
packages/config
```

Recommended:

```text
ESLint
Prettier
TypeScript strict mode
```

Semua workspace menggunakan convention yang sama.

---

# 68. TypeScript Rules

Gunakan:

```text
strict: true
```

Hindari:

```text
any
```

kecuali:

- integrasi library memerlukan,
- diberi alasan,
- scope terbatas.

Prefer:

```text
unknown
```

dan explicit narrowing untuk untrusted input.

---

# 69. Naming Convention

Files:

```text
kebab-case.ts
kebab-case.tsx
```

React component:

```text
PascalCase
```

Functions / variables:

```text
camelCase
```

Constants:

```text
UPPER_SNAKE_CASE
```

Database models:

```text
PascalCase
```

API paths:

```text
kebab-case
```

---

# 70. Environment Variables

Root `.env.example` minimal mendokumentasikan:

```text
NODE_ENV=

DATABASE_URL=
TEST_DATABASE_URL=

WEB_ORIGIN=
API_PORT=

SESSION_COOKIE_NAME=
SESSION_TTL_DAYS=

VITE_API_BASE_URL=
```

Optional:

```text
PUBLIC_ASSET_BASE_URL=
```

Secret tidak boleh di-commit.

---

# 71. Environment Validation

Backend environment variable wajib divalidasi saat startup.

Jika critical environment missing:

```text
fail fast
```

Jangan menjalankan application dengan configuration yang tidak lengkap.

Frontend hanya menggunakan environment variable yang diawali:

```text
VITE_
```

untuk nilai yang aman terekspos browser.

Jangan menaruh secret dalam `VITE_*`.

---

# 72. Development Ports

Suggested:

```text
Web
http://localhost:5173

API
http://localhost:3000

PostgreSQL
localhost:5432
```

Exact database port boleh berubah jika conflict.

---

# 73. Local Database

Recommended local development:

```text
PostgreSQL via Docker Compose
```

Root dapat memiliki:

```text
docker-compose.yml
```

yang hanya menjalankan development PostgreSQL.

Developer yang sudah memiliki PostgreSQL lokal dapat menggunakan connection string sendiri.

---

# 74. Local Development Flow

Expected:

```text
pnpm install

configure .env

start PostgreSQL

run migration

seed learning content

pnpm dev
```

`pnpm dev` sebaiknya dapat menjalankan:

```text
web
+
api
```

secara paralel.

---

# 75. Build

Frontend:

```text
Vite production build
```

Backend:

```text
TypeScript compile / supported runtime build
```

Root:

```text
pnpm build
```

harus membangun seluruh production workspace yang diperlukan.

---

# 76. CI

Recommended CI steps:

```text
install dependencies
→ lint
→ typecheck
→ unit tests
→ backend integration tests
→ build
```

E2E dapat ditambahkan sebagai separate job jika waktu CI terlalu panjang.

---

# 77. Deployment Architecture

Preferred production topology:

```text
Browser
   ↓
Web Origin
   ├── React Static App
   └── /api/*
          ↓
       Fastify API
          ↓
       PostgreSQL
```

Browser sebaiknya melihat frontend dan API sebagai satu origin melalui reverse proxy / rewrite.

Provider tidak dikunci di MVP.

---

# 78. Deployment Provider Policy

Architecture harus provider-neutral.

Possible hosting:

```text
static frontend hosting
Node-compatible backend hosting
managed PostgreSQL
```

Jangan menambahkan provider-specific logic ke domain layer.

Provider-specific configuration harus berada pada infrastructure/deployment layer.

---

# 79. PostgreSQL

Gunakan standard PostgreSQL-compatible database.

Jangan bergantung pada proprietary database feature kecuali benar-benar dibutuhkan.

Database connection harus berasal dari:

```text
DATABASE_URL
```

---

# 80. API Versioning

Gunakan:

```text
/api/v1
```

Breaking API change di masa depan dapat menggunakan versi baru.

MVP tidak membutuhkan multi-version implementation.

---

# 81. API Pagination

List kecil seperti child list tidak membutuhkan pagination pada MVP.

Session history boleh mulai tanpa pagination jika jumlah data masih kecil.

Namun response contract jangan membuat pagination sulit ditambahkan nanti.

Contoh:

```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

---

# 82. API Date Format

Backend selalu mengembalikan ISO 8601 UTC.

Frontend menangani local formatting.

Jangan mengirim date dalam format locale seperti:

```text
16 Oktober 2026
```

dari backend.

---

# 83. Public vs Internal Types

Jangan expose Prisma model secara langsung sebagai API response.

Gunakan API response mapping.

Alasan:

- database field bisa berubah,
- sensitive field harus disembunyikan,
- frontend tidak perlu tahu persistence detail.

Flow:

```text
Prisma Model
→ Service
→ API DTO
→ Response
```

---

# 84. Performance

MVP tidak membutuhkan advanced optimization.

Prioritas:

- jangan query database berulang tanpa alasan,
- select hanya field yang diperlukan,
- index foreign keys penting,
- preload active-session audio secara terbatas,
- cache server data di frontend melalui TanStack Query.

Jangan melakukan premature caching infrastructure.

Tidak membutuhkan Redis untuk MVP.

---

# 85. Observability

MVP minimum:

```text
structured server logs
request id
HTTP error logging
```

Future dapat menambahkan:

```text
error monitoring
performance monitoring
analytics
```

Tanpa requirement baru, jangan memasukkan child learning data ke third-party analytics.

---

# 86. Product Analytics

Jika analytics ditambahkan:

event harus berbasis interaction, misalnya:

```text
session_started
session_completed
session_ended_early
trial_completed
audio_playback_error
```

Jangan mengirim:

```text
password
auth token
raw child health information
```

Analytics tidak diperlukan untuk core MVP implementation.

---

# 87. Privacy Boundary

MVP tidak menyimpan:

```text
microphone recording
voice recording
audiogram
medical diagnosis
hearing threshold
medical document
device programming
```

Frontend tidak meminta microphone permission.

Backend tidak memiliki voice-upload endpoint.

---

# 88. Offline Behavior

MVP merupakan online application.

Tidak mendukung:

```text
offline session completion
offline sync
service worker queue
offline database
```

Architecture boleh PWA-ready, tetapi jangan mengimplementasikan offline-first behavior tanpa requirement baru.

---

# 89. PWA

MVP tidak wajib installable sebagai PWA.

Jangan menambahkan service worker hanya karena aplikasi web responsive.

PWA dapat menjadi future enhancement.

---

# 90. Feature Flags

MVP tidak membutuhkan feature flag platform.

Experimental P1 feature cukup dikontrol melalui:

```text
code/config
```

Jika jumlah experiment meningkat, feature flag dapat dipertimbangkan kemudian.

---

# 91. Branch / Parallel Work Principle

Feature architecture harus memungkinkan beberapa developer bekerja paralel.

Recommended work split:

```text
Developer A
auth + onboarding + child profile

Developer B
session shell + sound detection

Developer C
discrimination + association + progress UI

Developer D
backend session/trial/progress engine
```

Boundary tersebut bukan aturan permanen, tetapi menunjukkan bahwa file ownership sebaiknya tidak terlalu terpusat.

---

# 92. Avoid Central God Files

Jangan membuat file seperti:

```text
services.ts
utils.ts
types.ts
api.ts
```

yang berisi seluruh aplikasi.

Prefer module-local implementation.

Shared code dipindahkan hanya setelah reuse jelas.

---

# 93. Dependency Addition Rule

Sebelum menambahkan dependency baru, tanyakan:

```text
Apakah native platform / existing dependency sudah cukup?
Apakah library ini maintained?
Apakah library ini benar-benar mengurangi complexity?
```

Hindari dependency untuk utility sederhana.

Core dependency changes harus dicatat jika berdampak architecture.

---

# 94. Required Technical Consistency

Implementation harus menjaga chain:

```text
Frontend UI
   ↓
Shared API Validation
   ↓
Fastify Route
   ↓
Service / Domain Logic
   ↓
Prisma Repository
   ↓
PostgreSQL
```

Learning business logic tidak boleh lompat dari:

```text
React Component
→ database
```

atau:

```text
Fastify Route
→ giant inline calculation
```

---

# 95. Source of Truth by Concern

| Concern | Source of Truth |
|---|---|
| Product scope | `PRD.md` |
| User journey | `USER_FLOWS.md` |
| Frontend behavior | `FRONTEND_REQUIREMENTS.md` |
| Backend behavior | `BACKEND_REQUIREMENTS.md` |
| Data entities | `DATA_MODEL.md` |
| Technical implementation | `TECH_SPEC.md` |
| Historical decisions | `DECISIONS.md` |
| AI coding behavior | `AGENTS.md` |

---

# 96. Technical Definition of Done

Implementation MVP secara teknis dianggap siap jika:

1. Monorepo dapat di-install dengan satu package manager.
2. Web dan API dapat dijalankan lokal.
3. PostgreSQL dapat dimigrasikan dan di-seed.
4. Parent dapat register dan login.
5. Session cookie bekerja.
6. Child profile dapat dibuat.
7. Session planner dapat membuat deterministic session.
8. Detection trial dapat dijalankan.
9. Discrimination trial dapat dijalankan.
10. Association trial dapat dijalankan ketika eligible.
11. Trial result divalidasi backend.
12. Progress dihitung backend.
13. Resume active session bekerja.
14. Audio error tidak dianggap child failure.
15. Ownership parent-child diterapkan.
16. Critical business logic memiliki test.
17. Frontend responsive pada mobile.
18. Production build berhasil.
19. Tidak ada child voice recording.
20. Tidak ada clinical inference.

---

# 97. Technical Non-Goals

MVP tidak membutuhkan:

```text
microservices
Kubernetes
Redis
GraphQL
WebSocket
event bus
message queue
serverless event architecture
CQRS
event sourcing
machine-learning infrastructure
LLM integration
real-time collaboration
offline synchronization
complex observability platform
```

Tambahkan hanya jika requirement nyata di masa depan membutuhkannya.

---

# 98. Final Engineering Principle

SiapSapa harus dibangun dengan pola:

```text
simple boundaries
+
explicit business rules
+
deterministic learning logic
+
testable modules
+
minimal sensitive data
```

Prefer:

```text
boring, clear, maintainable code
```

dibanding:

```text
clever, abstract, difficult-to-debug architecture
```

MVP harus cepat dibangun tanpa membuat fondasi yang menghambat pengembangan setelah hackathon.

---

# 99. Related Documents

```text
docs/PRD.md
docs/USER_FLOWS.md
docs/requirements/FRONTEND_REQUIREMENTS.md
docs/requirements/BACKEND_REQUIREMENTS.md
docs/DATA_MODEL.md
docs/DECISIONS.md
AGENTS.md
```