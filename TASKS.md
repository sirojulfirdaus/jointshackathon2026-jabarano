# Tech 2 — Senior Backend Backlog

Status: planned. Semua task di bawah adalah P0 kecuali jika diberi label lain.

## Foundation dan API contract

- [ ] Finalisasi enum publik, DTO response, Zod input schema, dan error code di `packages/shared` serta `packages/validation`. Referensi: BE-SYSTEM-07 sampai BE-SYSTEM-09, DEC-040 sampai DEC-044.
- [x] Tambahkan global Fastify error handler, request validation, response mapper, dan route registration. Referensi: BE-SYSTEM-05, API convention.
- [ ] Dokumentasikan contract endpoint untuk FE dan Backend Junior sebelum implementasi route domain dimulai.

## Database architecture

- [x] Implementasikan Prisma schema untuk `Parent`, `AuthSession`, `Child`, `LearningProgress`, `LearningSession`, `SessionActivity`, `Trial`, `AssociationOption`, `TrialResult`, dan `ProgressHistory`.
- [x] Generate dan commit migration awal. Terapkan ke PostgreSQL development saat instance tersedia.
- [ ] Terapkan UUID, foreign key, unique constraint, serta index sesuai data model; pertahankan historical learning data. Referensi: DEC-050 sampai DEC-053.
- [ ] Tambahkan constraint aman terhadap race condition untuk maksimal satu `IN_PROGRESS` session per child. Referensi: BE-SESSION-03, DEC-016.
- [ ] Sediakan transaction boundary untuk pembuatan child/progress, session/trial plan, dan completion/progress update. Referensi: BE-SYSTEM-01 sampai BE-SYSTEM-02.

## Authentication dan authorization

- [x] Implementasikan register, login, logout, dan current-parent endpoint beserta shared contract-nya. Referensi: BE-AUTH-01 sampai BE-AUTH-07.
- [x] Hash password dengan Argon2id; gunakan opaque server-side session, hash token di database, dan HttpOnly cookie. Referensi: DEC-034 sampai DEC-038.
- [ ] Tambahkan middleware authenticated route dan ownership guard untuk chain Parent → Child → Session → Trial. Referensi: BE-SECURITY-01 sampai BE-SECURITY-02.
- [ ] Tambahkan origin protection untuk request yang mengubah state dan pastikan CORS hanya menerima `WEB_ORIGIN`.

## Core learning engine

- [x] Buat centralized learning configuration untuk window progress, threshold, prompt level, dan session mix. Referensi: BE-PROGRESS-09, BE-SESSION-09.
- [x] Implementasikan `ProgressCalculator` sebagai pure service dan unit test rule state per skill. Referensi: BE-PROGRESS-01 sampai BE-PROGRESS-11.
- [x] Implementasikan `TrialEvaluator` untuk Detection, Discrimination, dan Association; backend menentukan correctness dan result type. Referensi: BE-DETECT-05 sampai BE-DETECT-09, BE-DISCRIM-05 sampai BE-DISCRIM-08, BE-ASSOC-05 sampai BE-ASSOC-07, BE-TRIAL-10.
- [x] Implementasikan `SessionPlanner` dengan session mix berbasis Detection state, tanpa ML, perubahan volume, atau background noise. Referensi: BE-SESSION-04 sampai BE-SESSION-08, BE-ADAPT-01 sampai BE-ADAPT-05.

## Session, trial, progress, dan summary

- [ ] Implementasikan create/get/resume/end session, atomic session plan creation, valid state transition, dan idempotent completion. Referensi: BE-SESSION-01 sampai BE-SESSION-15, BE-STATE-01.
- [ ] Implementasikan final trial submission: validasi ownership/session relation, satu final result, technical error exclusion, response time bound, dan idempotency. Referensi: BE-TRIAL-01 sampai BE-TRIAL-09, BE-STATE-02.
- [ ] Implementasikan session summary yang dihitung dari session dan trial result, lalu `GET /children/:childId/progress`. Referensi: BE-SUMMARY-01 sampai BE-SUMMARY-05, BE-PROGRESS-12 sampai BE-PROGRESS-13.

## Integration dan handoff

- [ ] Berikan FE mock-ready request/response examples untuk auth, session, trial result, summary, dan progress.
- [ ] Review contract Junior untuk child creation/progress initialization, content selection, observation, dan history tanpa mengambil implementation module mereka.
- [ ] Tambahkan integration test untuk auth, cross-parent access, one-active-session rule, trial idempotency, state transition, dan progress exclusion technical error.

## Out of scope untuk Tech 2

- Child CRUD route/service, content metadata API, seed data, parent observation route, dan session history route: ownership Backend Junior.
- UI, audio playback, activity interaction state, serta responsive behavior: ownership Frontend.
- Diagnosis, audiometry, voice recording, pronunciation scoring, dan ML progression: bukan scope MVP.
