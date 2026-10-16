# SiapSapa — Backend Functional Requirements

**Document:** Backend Functional Requirements  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** MVP  
**Backend:** Node.js + TypeScript + Fastify  
**ORM:** Prisma  
**Database:** PostgreSQL

---

# 1. Purpose

Dokumen ini merupakan **source of truth untuk perilaku backend SiapSapa**.

Dokumen ini menjelaskan:

- business behavior,
- API behavior,
- validation,
- authorization,
- state transition,
- learning session logic,
- trial evaluation,
- prompting data,
- progress calculation,
- edge cases,
- dan safety constraints.

Dokumen ini tidak menentukan detail implementasi internal yang tidak memengaruhi behavior produk.

Detail architecture berada di:

```text
docs/TECH_SPEC.md
```

Detail entity dan relational model berada di:

```text
docs/DATA_MODEL.md
```

---

# 2. Requirement Convention

Backend Requirement ID:

```text
BE-{MODULE}-{NUMBER}
```

Contoh:

```text
BE-AUTH-01
BE-CHILD-03
BE-SESSION-05
BE-DETECT-02
```

Parent Feature ID:

```text
AUTH-01
CHILD-01
SESSION-01
DETECT-01
```

Semua requirement dengan Parent Feature ID yang sama merupakan bagian dari capability yang sama.

---

# 3. Priority Convention

| Priority | Meaning |
|---|---|
| P0 | Wajib tersedia untuk MVP |
| P1 | Dikerjakan setelah seluruh P0 selesai |
| P2 | Future / tidak termasuk MVP |

Coding agent **tidak boleh mengimplementasikan P1/P2 tanpa instruksi** apabila task hanya meminta P0.

---

# 4. General API Conventions

Base API:

```text
/api/v1
```

Request dan response menggunakan:

```text
application/json
```

Timestamp menggunakan:

```text
ISO 8601 UTC
```

Contoh:

```text
2026-10-16T08:30:00.000Z
```

Frontend bertanggung jawab melakukan localization terhadap waktu.

---

# 5. Standard Success Response

Gunakan response yang konsisten.

Contoh:

```json
{
  "data": {},
  "meta": {}
}
```

`meta` bersifat opsional.

Untuk list:

```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

---

# 6. Standard Error Response

Semua error API harus mengikuti struktur konsisten.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request tidak valid.",
    "details": []
  }
}
```

Minimal error code:

```text
VALIDATION_ERROR
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
CONFLICT
INVALID_STATE
RATE_LIMITED
INTERNAL_ERROR
CONTENT_UNAVAILABLE
TRIAL_ALREADY_COMPLETED
SESSION_ALREADY_COMPLETED
```

Backend tidak boleh mengirim stack trace ke client production.

---

# 7. Authentication & Parent Account

## AUTH-01 — Parent Registration

### BE-AUTH-01 — Register Parent Account

**Priority:** P0

**Endpoint**

```text
POST /api/v1/auth/register
```

**Requirement**

Sistem dapat membuat akun parent menggunakan email dan password.

**Expected Behavior**

Jika data valid:

1. parent account dibuat,
2. password disimpan dalam bentuk hash,
3. parent dianggap authenticated,
4. backend membuat authentication session/token,
5. response mengembalikan data parent minimum.

**Required Input**

```json
{
  "email": "parent@example.com",
  "password": "..."
}
```

**Validation / Rules**

- Email wajib ada.
- Email harus memiliki format valid.
- Email disimpan dalam normalized lowercase.
- Email harus unique.
- Password wajib memenuhi minimum security policy.
- Password plaintext tidak boleh disimpan.
- Parent account baru memiliki status `ACTIVE`.

**Error / Edge Case**

Jika email sudah digunakan:

```text
409 CONFLICT
```

Backend tidak boleh membuat akun duplikat.

---

### BE-AUTH-02 — Password Security

**Priority:** P0

Password wajib disimpan menggunakan password hashing algorithm yang sesuai standar engineering.

Password:

- tidak boleh disimpan plaintext,
- tidak boleh muncul di log,
- tidak boleh dikembalikan melalui API,
- tidak boleh dimasukkan ke analytics event.

---

## AUTH-02 — Parent Login

### BE-AUTH-03 — Login Parent

**Priority:** P0

**Endpoint**

```text
POST /api/v1/auth/login
```

**Input**

```json
{
  "email": "parent@example.com",
  "password": "..."
}
```

**Expected Behavior**

Jika credential valid:

- parent berhasil authenticated,
- authentication session/token dibuat,
- data parent minimum dikembalikan.

**Validation / Rules**

Login hanya berhasil jika:

- account ditemukan,
- password sesuai,
- account berstatus `ACTIVE`.

---

### BE-AUTH-04 — Reject Invalid Login

**Priority:** P0

Jika credential salah:

```text
401 UNAUTHENTICATED
```

Error message tidak boleh mengungkap apakah:

- email tidak ditemukan,
- atau password salah.

Gunakan generic message.

Contoh:

```text
Email atau password tidak valid.
```

---

## AUTH-03 — Current Session

### BE-AUTH-05 — Get Current Parent

**Priority:** P0

**Endpoint**

```text
GET /api/v1/auth/me
```

Backend mengembalikan parent yang sedang authenticated.

Response minimum:

```json
{
  "id": "...",
  "email": "...",
  "createdAt": "..."
}
```

Password hash tidak pernah dikembalikan.

---

### BE-AUTH-06 — Logout

**Priority:** P0

**Endpoint**

```text
POST /api/v1/auth/logout
```

Backend harus mengakhiri atau menginvalidasi authentication session yang digunakan.

Logout harus idempotent.

---

### BE-AUTH-07 — Protect Authenticated Routes

**Priority:** P0

Semua endpoint child/session/progress wajib membutuhkan authenticated parent.

Request tanpa authentication valid:

```text
401 UNAUTHENTICATED
```

---

# 8. Child Profile

## CHILD-01 — Create Child Profile

### BE-CHILD-01 — Create Child Profile

**Priority:** P0

**Endpoint**

```text
POST /api/v1/children
```

**Requirement**

Parent dapat membuat child learning profile.

**Required Input**

```json
{
  "nickname": "Dara",
  "birthYear": 2021,
  "hearingDeviceType": "HEARING_AID",
  "startingAbility": "STARTING_SOUND_AWARENESS",
  "familiarSoundCategories": [
    "ANIMALS",
    "HOME"
  ]
}
```

---

### BE-CHILD-02 — Validate Child Nickname

**Priority:** P0

Nickname:

- wajib diisi,
- harus berupa string,
- tidak boleh hanya whitespace,
- memiliki panjang maksimum yang ditentukan engineering.

Nama lengkap legal tidak dibutuhkan untuk MVP.

---

### BE-CHILD-03 — Validate Child Age

**Priority:** P0

Target produk adalah sekitar usia 4–6 tahun.

Backend dapat menerima tahun lahir yang valid.

Backend **tidak boleh menggunakan usia untuk menyimpulkan diagnosis atau eligibility medis**.

Jika usia berada di luar target:

- backend tetap dapat menyimpan profil jika format valid,
- frontend dapat menampilkan contextual message.

MVP tidak perlu melakukan hard block berdasarkan usia.

---

## CHILD-02 — Hearing Device Context

### BE-CHILD-04 — Store Hearing Device Context

**Priority:** P0

Allowed values:

```text
HEARING_AID
COCHLEAR_IMPLANT
OTHER
NONE
PREFER_NOT_TO_SAY
```

Data ini hanya merupakan context pengguna.

Backend tidak boleh menggunakan value ini untuk:

- menentukan diagnosis,
- menentukan volume audio,
- mengubah audio gain,
- memperkirakan hearing threshold.

---

## CHILD-03 — Starting Ability

### BE-CHILD-05 — Store Starting Ability

**Priority:** P0

Allowed values:

```text
STARTING_SOUND_AWARENESS
FREQUENT_SOUND_AWARENESS
EARLY_SOUND_DISCRIMINATION
```

Target utama MVP:

```text
STARTING_SOUND_AWARENESS
```

---

### BE-CHILD-06 — Initialize Learning State

**Priority:** P0

Ketika child profile pertama kali dibuat:

```text
Sound Detection       → EXPLORING
Sound Discrimination  → NOT_FOCUSED
Sound Association     → NOT_FOCUSED
```

Initial state merupakan product-learning state.

Bukan clinical state.

---

## CHILD-04 — Familiar Sound Category

### BE-CHILD-07 — Store Familiar Sound Categories

**Priority:** P0

Kategori awal dapat mencakup:

```text
ANIMALS
VEHICLES
HOME
FAMILY
MUSIC
OTHER
```

Field dapat kosong.

Jika tersedia, data dapat digunakan untuk memilih stimulus yang lebih familiar.

---

## CHILD-05 — Child Ownership

### BE-CHILD-08 — Parent Owns Child Profile

**Priority:** P0

Setiap child profile wajib terhubung ke parent owner.

Parent hanya dapat mengakses child profile miliknya.

---

### BE-CHILD-09 — Reject Unauthorized Child Access

**Priority:** P0

Jika Parent A mencoba mengakses Child milik Parent B:

```text
403 FORBIDDEN
```

Backend wajib melakukan ownership validation.

Frontend visibility tidak cukup sebagai access control.

---

## CHILD-06 — Read Child Profiles

### BE-CHILD-10 — List Parent Children

**Priority:** P0

**Endpoint**

```text
GET /api/v1/children
```

Backend hanya mengembalikan child profile milik authenticated parent.

---

### BE-CHILD-11 — Get Child Detail

**Priority:** P0

**Endpoint**

```text
GET /api/v1/children/:childId
```

Response dapat mencakup:

- profile,
- current learning state,
- latest session summary,
- latest session status.

---

## CHILD-07 — Update Child Profile

### BE-CHILD-12 — Update Allowed Child Fields

**Priority:** P0

**Endpoint**

```text
PATCH /api/v1/children/:childId
```

Parent dapat mengubah:

- nickname,
- hearing device context,
- familiar sound categories.

Perubahan `startingAbility` setelah learning activity berjalan tidak boleh otomatis menghapus progress history.

---

### BE-CHILD-13 — Preserve Learning History

**Priority:** P0

Update child profile tidak boleh:

- menghapus session,
- menghapus trial result,
- mereset progress,
- mengubah historical result.

---

# 9. Learning Content & Stimulus

## CONTENT-01 — Stimulus Repository

### BE-CONTENT-01 — Store Learning Stimulus Metadata

**Priority:** P0

Setiap stimulus audio minimal memiliki:

```text
id
name
asset reference / URL
category
stimulus type
difficulty
active status
```

Optional metadata:

```text
duration
display image
tags
```

---

### BE-CONTENT-02 — Stimulus Type

**Priority:** P0

Stimulus type minimum:

```text
ENVIRONMENTAL_SOUND
ANIMAL_SOUND
HOUSEHOLD_SOUND
MUSICAL_SOUND
EARLY_SPEECH_SOUND
```

`EARLY_SPEECH_SOUND` tidak wajib digunakan pada MVP pertama.

---

### BE-CONTENT-03 — Stimulus Difficulty

**Priority:** P0

Minimal difficulty:

```text
BEGINNER
INTERMEDIATE
```

MVP terutama menggunakan:

```text
BEGINNER
```

Backend tidak boleh menentukan difficulty berdasarkan volume audio.

---

## CONTENT-02 — Content Availability

### BE-CONTENT-04 — Only Active Content Can Be Selected

**Priority:** P0

Session planner hanya boleh menggunakan stimulus:

```text
active = true
```

Inactive stimulus tidak boleh muncul dalam session baru.

Historical session tetap mempertahankan reference terhadap stimulus lama.

---

### BE-CONTENT-05 — Handle Missing Audio Content

**Priority:** P0

Jika file audio untuk stimulus tidak tersedia saat session planning:

- stimulus tidak boleh dipilih,
- sistem harus mencoba stimulus lain.

Jika content yang tersedia tidak cukup untuk membuat minimum session:

```text
CONTENT_UNAVAILABLE
```

---

### BE-CONTENT-06 — Audio Failure Must Not Affect Learning Result

**Priority:** P0

Jika audio gagal diputar di client:

trial dapat ditandai:

```text
TECHNICAL_ERROR
```

Trial tersebut:

- tidak dihitung benar,
- tidak dihitung salah,
- tidak masuk progress denominator.

---

## CONTENT-03 — Content Selection

### BE-CONTENT-07 — Prefer Familiar Categories

**Priority:** P0

Jika child memiliki familiar sound categories:

session planner sebaiknya memprioritaskan stimulus aktif dari kategori tersebut.

Jika stimulus tidak cukup:

fallback ke kategori lain yang sesuai difficulty.

---

### BE-CONTENT-08 — Avoid Excessive Repetition

**Priority:** P0

Dalam satu activity:

stimulus yang sama tidak boleh digunakan berulang kali jika inventory menyediakan alternatif yang cukup.

---

# 10. Learning Session

## SESSION-01 — Create Session

### BE-SESSION-01 — Create Daily Learning Session

**Priority:** P0

**Endpoint**

```text
POST /api/v1/children/:childId/sessions
```

Backend:

1. memvalidasi ownership child,
2. membaca current progress state,
3. menentukan session plan,
4. memilih learning content,
5. membuat session,
6. membuat activity/trial plan,
7. mengembalikan session data.

---

### BE-SESSION-02 — Session Initial Status

**Priority:** P0

Session baru memiliki status:

```text
IN_PROGRESS
```

Session menyimpan:

```text
startedAt
childId
session plan
```

---

### BE-SESSION-03 — Prevent Accidental Duplicate Session

**Priority:** P0

Jika parent melakukan request create session dua kali secara tidak sengaja dalam waktu sangat dekat:

backend harus memiliki mekanisme untuk mengurangi duplicate active session.

Minimal rule:

satu child hanya boleh memiliki **satu active `IN_PROGRESS` session** pada satu waktu.

Jika masih ada session aktif:

backend mengembalikan session tersebut atau response conflict yang dapat digunakan frontend untuk resume.

---

## SESSION-02 — Session Plan

### BE-SESSION-04 — Default Session Size

**Priority:** P0

Target default:

```text
8 valid planned trials
```

Backend dapat membuat session lebih sedikit jika content terbatas, tetapi:

```text
minimum = 5 trials
```

Angka ini adalah product configuration, bukan clinical prescription.

---

### BE-SESSION-05 — First Session Plan

**Priority:** P0

Untuk child tanpa learning history:

```text
5 × Sound Detection
3 × Sound Discrimination
0 × Sound Association
```

Total:

```text
8 trials
```

---

### BE-SESSION-06 — Exploring Detection Session Plan

**Priority:** P0

Jika Detection state:

```text
EXPLORING
```

plan default:

```text
5 Detection
3 Discrimination
0 Association
```

---

### BE-SESSION-07 — Practicing Detection Session Plan

**Priority:** P0

Jika Detection state:

```text
PRACTICING
```

plan default:

```text
4 Detection
3 Discrimination
1 Association
```

---

### BE-SESSION-08 — Consistent Detection Session Plan

**Priority:** P0

Jika Detection state:

```text
BECOMING_CONSISTENT
```

plan default:

```text
3 Detection
3 Discrimination
2 Association
```

---

### BE-SESSION-09 — Session Plan Configuration

**Priority:** P0

Trial count tidak boleh tersebar sebagai magic number di banyak service.

Backend harus memiliki centralized configuration untuk session planning.

---

## SESSION-03 — Retrieve Session

### BE-SESSION-10 — Get Session

**Priority:** P0

**Endpoint**

```text
GET /api/v1/sessions/:sessionId
```

Response minimal:

```text
session id
status
child
planned activities
trial status
completed trial count
remaining trial count
```

---

### BE-SESSION-11 — Resume Session

**Priority:** P0

Jika session masih:

```text
IN_PROGRESS
```

backend harus mengembalikan:

- trial completed,
- trial remaining,
- next trial.

Completed trials tidak boleh dimainkan ulang kecuali future requirement secara eksplisit mengizinkannya.

---

## SESSION-04 — End Session

### BE-SESSION-12 — Complete Session

**Priority:** P0

Session menjadi:

```text
COMPLETED
```

jika seluruh required trial telah memiliki final result atau valid technical skip sesuai session rules.

---

### BE-SESSION-13 — End Session Early

**Priority:** P0

**Endpoint**

```text
POST /api/v1/sessions/:sessionId/end
```

Jika parent mengakhiri session sebelum semua trial selesai:

status:

```text
INCOMPLETE
```

Completed trial tetap disimpan.

---

### BE-SESSION-14 — Incomplete Is Not Failure

**Priority:** P0

Session dengan status:

```text
INCOMPLETE
```

tidak boleh diklasifikasikan sebagai:

```text
FAILED
```

dan tidak boleh menambahkan negative learning score.

---

### BE-SESSION-15 — Completed Session Cannot Be Modified Arbitrarily

**Priority:** P0

Setelah session `COMPLETED`:

backend menolak perubahan trial result biasa.

```text
409 INVALID_STATE
```

---

# 11. Sound Detection

## DETECT-01 — Detection Trial Generation

### BE-DETECT-01 — Generate Sound Trial

**Priority:** P0

Detection activity dapat memiliki:

```text
SOUND
```

trial.

SOUND trial memiliki stimulus audio.

---

### BE-DETECT-02 — Generate Silent Trial

**Priority:** P0

Detection activity dapat memiliki:

```text
SILENT
```

trial.

SILENT trial:

- tidak memiliki audio stimulus,
- tetap memiliki response window pada frontend.

---

### BE-DETECT-03 — Include Silent Trials

**Priority:** P0

Detection plan harus memiliki kombinasi:

```text
SOUND + SILENT
```

agar child tidak hanya belajar melakukan tap berdasarkan timing.

---

### BE-DETECT-04 — Prevent Predictable Silent Pattern

**Priority:** P0

Session planner tidak boleh menghasilkan pola silent trial yang terlalu mudah ditebak.

Minimum rule:

- tidak lebih dari 2 silent trial berturut-turut,
- tidak semua silent trial berada di akhir activity.

---

## DETECT-02 — Evaluate Detection Response

### BE-DETECT-05 — Independent Sound Response

**Priority:** P0

Jika:

```text
trial type = SOUND
responded = true
promptLevel = 0
```

result:

```text
INDEPENDENT_RESPONSE
```

---

### BE-DETECT-06 — Prompted Sound Response

**Priority:** P0

Jika:

```text
trial type = SOUND
responded = true
promptLevel > 0
```

result:

```text
PROMPTED_RESPONSE
```

---

### BE-DETECT-07 — No Response

**Priority:** P0

Jika:

```text
trial type = SOUND
responded = false
prompt sequence finished
```

result:

```text
NO_RESPONSE
```

---

### BE-DETECT-08 — False Response

**Priority:** P0

Jika:

```text
trial type = SILENT
responded = true
```

result:

```text
FALSE_RESPONSE
```

---

### BE-DETECT-09 — Successful Silent Trial

**Priority:** P0

Jika:

```text
trial type = SILENT
responded = false
```

trial dapat dicatat sebagai successful inhibition / expected silent response.

Untuk progress calculation, backend dapat menyimpan normalized result:

```text
INDEPENDENT_RESPONSE
```

dengan metadata:

```text
trialType = SILENT
```

agar denominator konsisten.

---

# 12. Sound Discrimination

## DISCRIM-01 — Trial Generation

### BE-DISCRIM-01 — Generate Sound Pair

**Priority:** P0

Discrimination trial memiliki:

```text
stimulusA
stimulusB
relation
```

Relation:

```text
SAME
DIFFERENT
```

---

### BE-DISCRIM-02 — High Contrast Only for MVP

**Priority:** P0

MVP hanya menggunakan pasangan:

```text
HIGH_CONTRAST
```

untuk different trial.

Contoh konsep:

```text
drum vs bell
animal vs vehicle
long vs short
```

---

### BE-DISCRIM-03 — Same Trial

**Priority:** P0

Untuk relation:

```text
SAME
```

stimulus dapat:

- menggunakan asset sama,
- atau dua asset dari source/category yang dianggap ekuivalen berdasarkan content metadata.

Untuk MVP paling aman menggunakan stimulus source yang sama.

---

### BE-DISCRIM-04 — Different Trial

**Priority:** P0

Untuk:

```text
DIFFERENT
```

stimulus A dan B harus memiliki valid contrast metadata.

Backend tidak boleh memasangkan dua stimulus secara random tanpa memastikan valid contrast.

---

## DISCRIM-02 — Evaluate Response

### BE-DISCRIM-05 — Evaluate Same/Different Choice

**Priority:** P0

Client mengirim pilihan:

```text
SAME
DIFFERENT
```

Backend menentukan correctness berdasarkan stored trial relation.

Client **tidak boleh mengirim `isCorrect` sebagai source of truth**.

---

### BE-DISCRIM-06 — Independent Correct Response

**Priority:** P0

Jika choice benar dan:

```text
promptLevel = 0
```

result:

```text
INDEPENDENT_RESPONSE
```

---

### BE-DISCRIM-07 — Prompted Correct Response

**Priority:** P0

Jika choice benar dan:

```text
promptLevel > 0
```

result:

```text
PROMPTED_RESPONSE
```

---

### BE-DISCRIM-08 — Incorrect Final Response

**Priority:** P0

Jika prompting sequence selesai dan final response masih tidak sesuai:

normalized result:

```text
NO_RESPONSE
```

atau dedicated metadata:

```text
finalAnswerCorrect = false
```

Backend harus menyimpan correctness terpisah dari prompt level agar analytics tidak kehilangan detail.

---

# 13. Sound Association

## ASSOC-01 — Association Trial Generation

### BE-ASSOC-01 — Generate Closed-Set Trial

**Priority:** P0

Association trial memiliki:

```text
1 audio stimulus
2 visual options
```

Salah satu option adalah correct source.

---

### BE-ASSOC-02 — Two Options for MVP

**Priority:** P0

Jumlah pilihan default:

```text
2
```

MVP tidak menggunakan lebih dari 2 visual choices kecuali requirement berubah.

---

### BE-ASSOC-03 — Distinct Distractor

**Priority:** P0

Distractor harus berasal dari source/category yang cukup berbeda.

Contoh:

```text
dog vs car
```

bukan:

```text
dog vs wolf
```

untuk beginner activity.

---

### BE-ASSOC-04 — Correct Answer Stored Server-Side

**Priority:** P0

Correct option harus disimpan dalam trial definition.

Client tidak menentukan correct answer.

---

## ASSOC-02 — Evaluate Association

### BE-ASSOC-05 — Evaluate Selected Option

**Priority:** P0

Client mengirim:

```text
selectedOptionId
promptLevel
```

Backend membandingkan dengan stored correct option.

---

### BE-ASSOC-06 — Independent Association

**Priority:** P0

Correct + promptLevel 0:

```text
INDEPENDENT_RESPONSE
```

---

### BE-ASSOC-07 — Prompted Association

**Priority:** P0

Correct + promptLevel > 0:

```text
PROMPTED_RESPONSE
```

---

# 14. Trial Result & Prompting

## TRIAL-01 — Submit Trial Result

### BE-TRIAL-01 — Submit Final Trial Result

**Priority:** P0

Suggested endpoint:

```text
PUT /api/v1/sessions/:sessionId/trials/:trialId/result
```

`PUT` dipilih agar operation dapat dibuat idempotent.

---

### BE-TRIAL-02 — Trial Result Payload

**Priority:** P0

Payload dapat berbeda berdasarkan activity tetapi minimal mendukung:

```json
{
  "responded": true,
  "promptLevel": 0,
  "selectedOptionId": null,
  "selectedRelation": null,
  "responseTimeMs": 1200,
  "technicalError": false
}
```

---

### BE-TRIAL-03 — Prompt Level Range

**Priority:** P0

Allowed:

```text
0
1
2
3
```

Meaning:

```text
0 = independent attempt
1 = stimulus replay
2 = visual attention cue
3 = parent assistance
```

---

### BE-TRIAL-04 — Reject Invalid Prompt Level

**Priority:** P0

Value di luar:

```text
0..3
```

harus ditolak:

```text
400 VALIDATION_ERROR
```

---

### BE-TRIAL-05 — Trial Belongs to Session

**Priority:** P0

Backend harus memvalidasi:

```text
trial.sessionId == requested sessionId
```

Cross-session submission harus ditolak.

---

### BE-TRIAL-06 — Parent Owns Trial Through Child

**Priority:** P0

Authorization chain:

```text
Parent
→ Child
→ Session
→ Trial
```

Parent harus memiliki child dari session terkait.

---

### BE-TRIAL-07 — One Final Result Per Trial

**Priority:** P0

Satu trial hanya memiliki satu final result.

Repeated identical `PUT` harus aman/idempotent.

Request yang mencoba mengganti hasil final dengan payload berbeda:

```text
409 TRIAL_ALREADY_COMPLETED
```

---

### BE-TRIAL-08 — Technical Error

**Priority:** P0

Jika:

```text
technicalError = true
```

backend menyimpan result:

```text
TECHNICAL_ERROR
```

Trial tidak dihitung dalam learning progress.

---

### BE-TRIAL-09 — Store Response Time

**Priority:** P0

Backend dapat menyimpan:

```text
responseTimeMs
```

jika diberikan.

Validation:

- integer,
- tidak negatif,
- memiliki upper bound yang wajar.

Data ini hanya untuk product interaction analytics.

Tidak boleh diinterpretasikan sebagai clinical reaction time.

---

### BE-TRIAL-10 — Do Not Trust Client Evaluation

**Priority:** P0

Backend tidak menerima field seperti:

```text
isCorrect
resultType
progressScore
```

sebagai authority.

Backend menghitung result berdasarkan:

- stored trial,
- submitted response,
- prompt level.

---

# 15. Parent Observation

## OBS-01 — Submit Observation

### BE-OBS-01 — Store Parent Observation

**Priority:** P0

**Endpoint**

```text
POST /api/v1/sessions/:sessionId/observation
```

Allowed observation values:

```text
OFTEN_RESPONDED_INDEPENDENTLY
RESPONDED_AFTER_REPETITION
NEEDED_FREQUENT_ASSISTANCE
DIFFICULTY_MAINTAINING_ATTENTION
```

---

### BE-OBS-02 — Observation Is Optional

**Priority:** P0

Parent observation tidak wajib untuk menyelesaikan session.

Jika tidak diisi:

session tetap dapat selesai.

---

### BE-OBS-03 — Observation Belongs to Session

**Priority:** P0

Observation harus memiliki:

```text
sessionId
childId
parentId
```

secara relational.

---

### BE-OBS-04 — No Clinical Interpretation

**Priority:** P0

Backend tidak boleh mengubah observation menjadi:

- diagnosis,
- hearing severity,
- medical recommendation.

---

### BE-OBS-05 — Observation Does Not Directly Change Progress State in MVP

**Priority:** P0

Untuk MVP:

parent observation disimpan dan dapat ditampilkan sebagai context.

Observation **tidak langsung mengubah learning state calculation**.

Hal ini menjaga progression deterministic berdasarkan activity result.

---

# 16. Session Summary

## SUMMARY-01 — Generate Summary

### BE-SUMMARY-01 — Generate Session Summary

**Priority:** P0

Setelah session selesai, backend dapat menghasilkan summary berdasarkan trial result.

Suggested endpoint:

```text
GET /api/v1/sessions/:sessionId/summary
```

---

### BE-SUMMARY-02 — Summary Metrics by Skill

**Priority:** P0

Per skill, backend menghitung:

```text
total valid trials
independent responses
prompted responses
no responses
false responses
technical errors
```

---

### BE-SUMMARY-03 — Technical Error Exclusion

**Priority:** P0

`TECHNICAL_ERROR`:

- ditampilkan jika relevan,
- tidak masuk denominator learning performance.

---

### BE-SUMMARY-04 — Generate Deterministic Insight

**Priority:** P0

MVP tidak membutuhkan LLM untuk membuat summary.

Narrative dapat dibentuk dari deterministic templates.

Contoh:

```text
Pada sesi ini, Dara lebih sering merespons aktivitas deteksi suara tanpa bantuan dibanding aktivitas membedakan suara.
```

---

### BE-SUMMARY-05 — Insight Must Include Activity Context

**Priority:** P0

Summary tidak boleh menggunakan language seperti:

```text
Pendengaran meningkat.
Kemampuan mendengar membaik 20%.
```

Gunakan:

```text
Dalam aktivitas SiapSapa hari ini...
```

---

# 17. Progress Calculation

## PROGRESS-01 — Skill Progress

### BE-PROGRESS-01 — Supported Skills

**Priority:** P0

Progress dihitung secara terpisah untuk:

```text
SOUND_DETECTION
SOUND_DISCRIMINATION
SOUND_ASSOCIATION
```

---

### BE-PROGRESS-02 — Supported Learning State

**Priority:** P0

Allowed:

```text
NOT_FOCUSED
EXPLORING
PRACTICING
BECOMING_CONSISTENT
```

Tidak boleh menggunakan terminology:

```text
hearing level
medical grade
severity
```

---

## PROGRESS-02 — Progress Dataset

### BE-PROGRESS-03 — Use Recent Valid Trials

**Priority:** P0

Progress calculation menggunakan maksimal:

```text
10 most recent valid trials per skill
```

Valid trial berarti result bukan:

```text
TECHNICAL_ERROR
```

---

### BE-PROGRESS-04 — Minimum Evidence

**Priority:** P0

Jika skill belum pernah dimainkan:

```text
NOT_FOCUSED
```

Jika memiliki:

```text
1–4 valid trials
```

state:

```text
EXPLORING
```

---

## PROGRESS-03 — State Calculation

### BE-PROGRESS-05 — Calculate Independent Response Rate

**Priority:** P0

Formula:

```text
independent_rate =
independent_valid_trials
/
total_valid_trials
```

---

### BE-PROGRESS-06 — Exploring Rule

**Priority:** P0

Jika minimal 5 valid trials dan:

```text
independent_rate < 0.50
```

state:

```text
EXPLORING
```

---

### BE-PROGRESS-07 — Practicing Rule

**Priority:** P0

Jika minimal 5 valid trials dan:

```text
0.50 <= independent_rate < 0.80
```

state:

```text
PRACTICING
```

---

### BE-PROGRESS-08 — Becoming Consistent Rule

**Priority:** P0

Jika minimal 5 valid trials dan:

```text
independent_rate >= 0.80
```

state:

```text
BECOMING_CONSISTENT
```

---

### BE-PROGRESS-09 — Thresholds Are Product Configuration

**Priority:** P0

Threshold:

```text
0.50
0.80
5 trials
10 recent trials
```

harus diletakkan di centralized configuration.

Jangan hardcode tersebar.

Angka ini adalah prototype learning rule.

Bukan clinical threshold.

---

### BE-PROGRESS-10 — Recalculate After Session

**Priority:** P0

Progress state dihitung ulang setelah:

```text
COMPLETED session
```

dan dapat dihitung setelah `INCOMPLETE` session jika terdapat valid completed trials.

---

### BE-PROGRESS-11 — Technical Error Has No Progress Impact

**Priority:** P0

Technical error:

```text
excluded from numerator
excluded from denominator
```

---

## PROGRESS-04 — Read Progress

### BE-PROGRESS-12 — Get Child Progress

**Priority:** P0

**Endpoint**

```text
GET /api/v1/children/:childId/progress
```

Response minimal:

```json
{
  "skills": [
    {
      "skill": "SOUND_DETECTION",
      "state": "PRACTICING",
      "recentValidTrials": 10,
      "independentResponses": 6,
      "promptedResponses": 3,
      "noResponses": 1
    }
  ]
}
```

---

### BE-PROGRESS-13 — Progress Must Preserve Context

**Priority:** P0

Response tidak boleh memiliki field seperti:

```text
hearingScore
hearingPercentage
hearingAge
clinicalImprovement
```

---

# 18. Next Session Recommendation

## ADAPT-01 — Session Adaptation

### BE-ADAPT-01 — Determine Session Mix from Detection State

**Priority:** P0

Session planner menggunakan Detection state sebagai primary MVP progression signal.

Rules:

```text
EXPLORING
→ 5 Detection
→ 3 Discrimination

PRACTICING
→ 4 Detection
→ 3 Discrimination
→ 1 Association

BECOMING_CONSISTENT
→ 3 Detection
→ 3 Discrimination
→ 2 Association
```

---

### BE-ADAPT-02 — Association Eligibility

**Priority:** P0

Association mulai masuk session jika:

```text
Detection state >= PRACTICING
```

---

### BE-ADAPT-03 — Never Use ML for MVP Progression

**Priority:** P0

MVP progression bersifat:

```text
deterministic
rule-based
explainable
```

Tidak boleh menggunakan machine learning tanpa requirement baru.

---

### BE-ADAPT-04 — Do Not Increase Audio Volume as Difficulty

**Priority:** P0

Difficulty tidak boleh dimodifikasi dengan:

- menaikkan volume,
- menurunkan volume,
- menentukan dB target.

---

### BE-ADAPT-05 — No Background Noise in MVP

**Priority:** P0

Session planner tidak menambahkan artificial background noise.

---

# 19. Session History

## HISTORY-01 — Retrieve Sessions

### BE-HISTORY-01 — List Child Sessions

**Priority:** P0

**Endpoint**

```text
GET /api/v1/children/:childId/sessions
```

Response dapat diurutkan:

```text
newest first
```

---

### BE-HISTORY-02 — Session History Data

**Priority:** P0

Minimal data:

```text
session id
status
startedAt
completedAt
valid trial count
learning focus
```

---

### BE-HISTORY-03 — Preserve Incomplete Sessions

**Priority:** P0

Incomplete session tetap ada dalam history.

Tidak boleh dihapus otomatis.

---

# 20. Home Mission

## HOME-01 — Offline Activity Recommendation

**Priority:** P1

### BE-HOME-01 — Generate Home Mission

Setelah session selesai, sistem dapat memilih home activity berdasarkan current learning focus.

Contoh mapping:

```text
Detection → notice everyday sound
Discrimination → compare two household sounds
Association → match familiar sound to object
```

---

### BE-HOME-02 — Deterministic Home Mission

**Priority:** P1

Home Mission MVP tidak membutuhkan generative AI.

Content berasal dari curated templates.

---

# 21. Privacy & Sensitive Data

## PRIVACY-01 — Voice Data

### BE-PRIVACY-01 — Do Not Store Child Voice Recording

**Priority:** P0

MVP tidak boleh memiliki persistence untuk:

```text
child voice recordings
microphone audio
speech recording files
```

---

### BE-PRIVACY-02 — No Automatic Microphone Data

**Priority:** P0

Backend tidak menyediakan mandatory endpoint untuk upload child voice.

---

## PRIVACY-02 — Health Data Minimization

### BE-PRIVACY-03 — Do Not Collect Audiogram

**Priority:** P0

MVP tidak meminta atau menyimpan:

```text
audiogram result
hearing threshold
clinical diagnosis document
implant mapping
hearing aid programming
```

---

### BE-PRIVACY-04 — Minimize Personal Data

**Priority:** P0

Child profile tidak membutuhkan:

- legal full name,
- address,
- school,
- identity number,
- medical record number.

---

# 22. Safety Constraints

## SAFETY-01 — Clinical Boundaries

### BE-SAFETY-01 — No Diagnosis Logic

**Priority:** P0

Backend tidak boleh memiliki rules yang menghasilkan:

```text
mild hearing loss
moderate hearing loss
severe hearing loss
profound hearing loss
```

berdasarkan game result.

---

### BE-SAFETY-02 — No Clinical Recommendation

**Priority:** P0

Backend tidak boleh memberikan:

- hearing device configuration,
- medicine recommendation,
- medical treatment recommendation.

---

### BE-SAFETY-03 — No Clinical Score

**Priority:** P0

Backend tidak membuat field:

```text
clinicalScore
hearingScore
medicalProgress
hearingImprovementPercentage
```

---

# 23. State Integrity

## STATE-01 — Valid State Transition

### BE-STATE-01 — Session State Transition

**Priority:** P0

Allowed:

```text
IN_PROGRESS → COMPLETED

IN_PROGRESS → INCOMPLETE
```

Disallowed:

```text
COMPLETED → IN_PROGRESS
INCOMPLETE → COMPLETED
```

kecuali future resume requirement secara eksplisit mengizinkannya.

---

### BE-STATE-02 — Completed Trial Immutable

**Priority:** P0

Final trial result tidak boleh diedit melalui normal client flow.

---

### BE-STATE-03 — Child Progress Derived from Trials

**Priority:** P0

Frontend tidak boleh mengirim learning state untuk disimpan sebagai authority.

Backend menghitung progress dari trial data.

---

# 24. Transaction & Consistency

## SYSTEM-01 — Transaction Safety

### BE-SYSTEM-01 — Session Creation Transaction

**Priority:** P0

Pembuatan:

```text
session
activities
planned trials
```

harus atomic.

Jika trial plan gagal dibuat:

session tidak boleh tersimpan setengah jadi.

---

### BE-SYSTEM-02 — Session Completion Transaction

**Priority:** P0

Saat menyelesaikan session:

1. session status diubah,
2. completion timestamp disimpan,
3. progress dihitung,
4. progress state diperbarui.

Operasi yang harus konsisten sebaiknya dilakukan dalam transaction.

---

# 25. Idempotency

## SYSTEM-02 — Duplicate Request Protection

### BE-SYSTEM-03 — Trial Submission Idempotency

**Priority:** P0

Repeated request dengan payload identik tidak boleh menciptakan duplicate trial result.

---

### BE-SYSTEM-04 — Session Completion Idempotency

**Priority:** P0

Repeated request menyelesaikan session yang sama tidak boleh:

- membuat summary ganda,
- membuat progress history ganda,
- menghitung trial dua kali.

---

# 26. Logging

## SYSTEM-03 — Operational Logging

### BE-SYSTEM-05 — Structured Application Logging

**Priority:** P0

Backend harus mencatat error operasional yang relevan.

Log tidak boleh berisi:

- plaintext password,
- authentication token penuh,
- sensitive child data yang tidak diperlukan.

---

### BE-SYSTEM-06 — Error Correlation

**Priority:** P1

Production error dapat memiliki request/correlation ID agar debugging lebih mudah.

---

# 27. Validation

## SYSTEM-04 — Request Validation

### BE-SYSTEM-07 — Validate All External Input

**Priority:** P0

Semua input API harus divalidasi sebelum masuk business logic.

Validasi mencakup:

- body,
- params,
- query.

---

### BE-SYSTEM-08 — Reject Unknown Critical Enum Value

**Priority:** P0

Backend tidak boleh silently menerima enum yang tidak dikenali.

Contoh:

```text
startingAbility = "SUPER_HEARING"
```

harus ditolak.

---

### BE-SYSTEM-09 — Trim Relevant String Input

**Priority:** P0

String seperti nickname/email harus dinormalisasi sesuai kebutuhan sebelum disimpan.

---

# 28. Authorization

## SECURITY-01 — Parent Data Isolation

### BE-SECURITY-01 — Parent Can Only Access Own Data

**Priority:** P0

Ownership harus divalidasi untuk:

```text
child
session
trial
progress
observation
summary
history
```

---

### BE-SECURITY-02 — Never Trust Child ID Alone

**Priority:** P0

Backend tidak boleh menganggap akses valid hanya karena client mengetahui:

```text
childId
```

Selalu cek ownership.

---

# 29. Rate Limiting

## SECURITY-02 — Auth Protection

### BE-SECURITY-03 — Login Rate Limit

**Priority:** P1

Login endpoint sebaiknya memiliki rate limiting untuk mengurangi brute-force attempt.

---

# 30. API Endpoint Summary

## Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

## Children

```text
POST   /api/v1/children
GET    /api/v1/children
GET    /api/v1/children/:childId
PATCH  /api/v1/children/:childId
```

## Sessions

```text
POST   /api/v1/children/:childId/sessions
GET    /api/v1/children/:childId/sessions
GET    /api/v1/sessions/:sessionId
POST   /api/v1/sessions/:sessionId/end
GET    /api/v1/sessions/:sessionId/summary
```

## Trial

```text
PUT    /api/v1/sessions/:sessionId/trials/:trialId/result
```

## Observation

```text
POST   /api/v1/sessions/:sessionId/observation
```

## Progress

```text
GET    /api/v1/children/:childId/progress
```

P1:

```text
GET    /api/v1/sessions/:sessionId/home-mission
```

---

# 31. Core Backend Enums

Backend minimal membutuhkan semantic enum berikut.

## Hearing Device

```text
HEARING_AID
COCHLEAR_IMPLANT
OTHER
NONE
PREFER_NOT_TO_SAY
```

## Starting Ability

```text
STARTING_SOUND_AWARENESS
FREQUENT_SOUND_AWARENESS
EARLY_SOUND_DISCRIMINATION
```

## Skill

```text
SOUND_DETECTION
SOUND_DISCRIMINATION
SOUND_ASSOCIATION
```

## Learning State

```text
NOT_FOCUSED
EXPLORING
PRACTICING
BECOMING_CONSISTENT
```

## Session Status

```text
IN_PROGRESS
COMPLETED
INCOMPLETE
```

## Trial Result

```text
INDEPENDENT_RESPONSE
PROMPTED_RESPONSE
NO_RESPONSE
FALSE_RESPONSE
TECHNICAL_ERROR
```

## Detection Trial Type

```text
SOUND
SILENT
```

## Discrimination Relation

```text
SAME
DIFFERENT
```

## Difficulty

```text
BEGINNER
INTERMEDIATE
```

---

# 32. Suggested Backend Module Ownership

Repository:

```text
apps/api/src/modules/
```

Suggested mapping:

```text
auth/
  BE-AUTH-*

children/
  BE-CHILD-*

content/
  BE-CONTENT-*

sessions/
  BE-SESSION-*
  BE-STATE-*

activities/
  BE-DETECT-*
  BE-DISCRIM-*
  BE-ASSOC-*

trials/
  BE-TRIAL-*

progress/
  BE-PROGRESS-*
  BE-ADAPT-*
  BE-SUMMARY-*

common/
  BE-SYSTEM-*
  BE-SECURITY-*
  BE-SAFETY-*
```

Feature boundaries boleh disesuaikan selama behavior requirement tetap sama.

---

# 33. Backend P0 Completion Checklist

Backend MVP dianggap functional jika seluruh flow berikut berjalan:

```text
Parent registers
        ↓
Parent logs in
        ↓
Parent creates child profile
        ↓
Backend initializes learning state
        ↓
Parent creates session
        ↓
Backend generates session plan
        ↓
Backend generates Detection trials
        ↓
Backend generates Discrimination trials
        ↓
Association appears when eligible
        ↓
Frontend submits trial responses
        ↓
Backend evaluates responses
        ↓
Backend stores prompt levels
        ↓
Parent submits observation
        ↓
Session completes
        ↓
Backend calculates summary
        ↓
Backend recalculates progress
        ↓
Next session plan changes based on progress
```

---

# 34. Backend Definition of Done

Sebuah backend requirement dianggap selesai jika:

1. Behavior sesuai requirement ID.
2. Request input memiliki validation.
3. Authentication diterapkan jika endpoint bersifat protected.
4. Ownership diperiksa untuk child-related data.
5. Business rule dijalankan di backend.
6. Expected error state ditangani.
7. Tidak ada clinical inference yang tidak diizinkan.
8. Historical learning data tidak rusak.
9. Critical business logic memiliki automated test.
10. API response mengikuti project convention.

---

# 35. Critical Automated Test Coverage

Minimal automated tests wajib mencakup:

## Authentication

```text
valid registration
duplicate email
valid login
invalid login
protected endpoint
```

## Child Ownership

```text
parent can access own child
parent cannot access another parent's child
```

## Session

```text
first session generation
only one active session
session completion
incomplete session
```

## Detection

```text
sound + tap → independent
sound + prompt + tap → prompted
sound + no response → no response
silent + tap → false response
silent + no tap → expected response
```

## Discrimination

```text
correct same/different evaluation
prompted response
incorrect response
```

## Association

```text
correct option evaluation
wrong option evaluation
prompted option evaluation
```

## Technical Failure

```text
audio failure excluded from progress
```

## Progress

```text
<5 trials → exploring
<50% → exploring
50–79% → practicing
>=80% → becoming consistent
technical error excluded
```

## Authorization

```text
cross-parent access denied
```

---

# 36. Explicit Backend Non-Goals

Coding agent tidak boleh menambahkan tanpa requirement baru:

```text
AI speech recognition
pronunciation scoring
audio recording upload
hearing diagnosis
audiometry
hearing threshold estimation
automatic device volume calibration
hearing aid configuration
cochlear implant mapping
therapist portal
video consultation
real-time chat
LLM-based progress calculation
ML-based progression
leaderboard
gamification economy
social features
```

---

# 37. Requirement Traceability

Backend implementation harus dapat ditelusuri dari:

```text
PRD Goal
   ↓
User Flow
   ↓
Parent Feature ID
   ↓
BE Requirement ID
   ↓
Backend Module
   ↓
Automated Test
```

Contoh:

```text
Sound Detection
   ↓
UF-07
   ↓
DETECT-01
   ↓
BE-DETECT-01
BE-DETECT-02
BE-DETECT-03
...
   ↓
activities module
   ↓
detection tests
```

---

# 38. Related Documents

Product direction:

```text
docs/PRD.md
```

User behavior:

```text
docs/USER_FLOWS.md
```

Frontend requirements:

```text
docs/requirements/FRONTEND_REQUIREMENTS.md
```

Data model:

```text
docs/DATA_MODEL.md
```

Technical architecture:

```text
docs/TECH_SPEC.md
```

Decision history:

```text
docs/DECISIONS.md
```

---

# 39. Final Backend Principle

Backend SiapSapa harus selalu menjaga boundary berikut:

```text
Learning Activity Data
        ≠
Clinical Hearing Assessment
```

Backend bertugas:

```text
plan
→ validate
→ evaluate activity
→ store
→ summarize
→ calculate learning progress
→ determine next activity
```

Backend tidak bertugas:

```text
diagnose
→ clinically assess
→ prescribe
→ configure hearing devices
```