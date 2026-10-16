# SiapSapa — Data Model

**Document:** Data Model  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** MVP  
**Database:** PostgreSQL  
**ORM:** Prisma

---

# 1. Purpose

Dokumen ini mendefinisikan struktur data utama SiapSapa.

Dokumen ini menjadi source of truth untuk:

- entity,
- relationship,
- field,
- enum,
- ownership,
- historical data,
- derived data,
- unique constraint,
- dan data lifecycle.

Dokumen ini belum merupakan Prisma schema final.

Prisma schema harus mengikuti model konseptual di dokumen ini kecuali terdapat keputusan engineering yang didokumentasikan di:

```text
docs/DECISIONS.md
```

---

# 2. Data Modeling Principles

## DM-01 — Minimal Data Collection

Simpan hanya data yang dibutuhkan untuk menjalankan produk.

MVP tidak membutuhkan:

- nama lengkap legal anak,
- alamat,
- sekolah,
- nomor identitas,
- medical record number,
- audiogram,
- hasil diagnosis,
- hearing threshold,
- konfigurasi hearing aid,
- konfigurasi cochlear implant,
- rekaman suara anak.

---

## DM-02 — Historical Learning Data Is Preserved

Data historical seperti:

```text
Session
Trial
TrialResult
ProgressHistory
```

tidak boleh hilang ketika profil anak berubah.

---

## DM-03 — Backend Is Source of Truth

Field seperti:

```text
session status
trial result
learning state
correct answer
progress calculation
```

ditentukan backend.

Frontend tidak menjadi authority.

---

## DM-04 — Learning Data ≠ Clinical Data

Data yang disimpan menggambarkan:

> performa dalam aktivitas SiapSapa

bukan:

> kondisi klinis pendengaran anak.

---

# 3. High-Level Entity Relationship

```text
Parent
  │
  └──< Child
         │
         ├──< LearningProgress
         │
         ├──< ProgressHistory
         │
         └──< LearningSession
                │
                ├──< SessionActivity
                │      │
                │      └──< Trial
                │              │
                │              └── TrialResult
                │
                └── ParentObservation

LearningStimulus
      │
      └── referenced by Trial

VisualAsset
      │
      └── referenced by AssociationOption

HomeMissionTemplate
      │
      └── optional future session recommendation
```

---

# 4. Parent

## Entity

```text
Parent
```

## Purpose

Merepresentasikan akun orang tua atau caregiver yang menggunakan SiapSapa.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `email` | String | Yes | Login email |
| `passwordHash` | String | Yes | Hashed password |
| `status` | ParentStatus | Yes | Account status |
| `createdAt` | DateTime | Yes | Created timestamp |
| `updatedAt` | DateTime | Yes | Last update |

## Constraints

```text
email UNIQUE
```

Email harus disimpan dalam normalized lowercase.

---

## ParentStatus

```text
ACTIVE
INACTIVE
```

MVP registration menghasilkan:

```text
ACTIVE
```

---

# 5. Child

## Entity

```text
Child
```

## Purpose

Merepresentasikan learning profile anak.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `parentId` | UUID | Yes | Owner parent |
| `nickname` | String | Yes | Nama panggilan |
| `birthYear` | Integer | Yes | Tahun lahir |
| `hearingDeviceType` | HearingDeviceType | Yes | Device context |
| `startingAbility` | StartingAbility | Yes | Starting learning context |
| `createdAt` | DateTime | Yes | Created timestamp |
| `updatedAt` | DateTime | Yes | Last update |

## Relationship

```text
Parent 1 → N Child
```

Setiap child wajib memiliki satu parent owner.

---

# 6. HearingDeviceType

```text
HEARING_AID
COCHLEAR_IMPLANT
OTHER
NONE
PREFER_NOT_TO_SAY
```

Field ini hanya digunakan sebagai context.

Tidak digunakan untuk diagnosis atau penentuan volume audio.

---

# 7. StartingAbility

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

# 8. Familiar Sound Category

Karena satu anak dapat memiliki beberapa kategori familiar, gunakan relational model.

## Entity

```text
ChildFamiliarSoundCategory
```

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `childId` | UUID | Yes |
| `category` | SoundCategory | Yes |
| `createdAt` | DateTime | Yes |

## Constraint

```text
UNIQUE(childId, category)
```

---

# 9. SoundCategory

Minimum enum:

```text
ANIMALS
VEHICLES
HOME
FAMILY
MUSIC
OTHER
```

Kategori dapat berkembang tanpa mengubah core learning logic.

---

# 10. Skill

Skill pembelajaran utama MVP:

```text
SOUND_DETECTION
SOUND_DISCRIMINATION
SOUND_ASSOCIATION
```

---

# 11. LearningProgress

## Entity

```text
LearningProgress
```

## Purpose

Menyimpan **current learning state** per skill untuk satu child.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `childId` | UUID | Yes | Child |
| `skill` | Skill | Yes | Learning skill |
| `state` | LearningState | Yes | Current state |
| `recentValidTrials` | Integer | Yes | Cached recent valid trial count |
| `independentResponses` | Integer | Yes | Cached calculation |
| `promptedResponses` | Integer | Yes | Cached calculation |
| `noResponses` | Integer | Yes | Cached calculation |
| `falseResponses` | Integer | Yes | Cached calculation |
| `updatedAt` | DateTime | Yes | Last recalculation |

## Constraint

```text
UNIQUE(childId, skill)
```

---

# 12. LearningState

```text
NOT_FOCUSED
EXPLORING
PRACTICING
BECOMING_CONSISTENT
```

Initial state:

```text
SOUND_DETECTION
→ EXPLORING

SOUND_DISCRIMINATION
→ NOT_FOCUSED

SOUND_ASSOCIATION
→ NOT_FOCUSED
```

---

# 13. LearningProgress as Derived Data

`LearningProgress` merupakan cached/derived current state.

Source of truth tetap:

```text
TrialResult
```

Jika progress cache rusak atau perlu dihitung ulang:

```text
TrialResult
→ Progress Calculation
→ LearningProgress
```

harus dapat dilakukan kembali.

---

# 14. ProgressHistory

## Entity

```text
ProgressHistory
```

## Purpose

Menyimpan perubahan learning state dari waktu ke waktu.

Recommended untuk MVP jika implementasi tidak terlalu membebani.

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `childId` | UUID | Yes |
| `skill` | Skill | Yes |
| `previousState` | LearningState | No |
| `newState` | LearningState | Yes |
| `independentRate` | Decimal | No |
| `validTrialCount` | Integer | Yes |
| `triggerSessionId` | UUID | No |
| `createdAt` | DateTime | Yes |

## Notes

Tidak setiap recalculation wajib membuat history baru.

Buat record ketika:

```text
learning state berubah
```

Contoh:

```text
EXPLORING → PRACTICING
```

---

# 15. LearningStimulus

## Entity

```text
LearningStimulus
```

## Purpose

Merepresentasikan stimulus audio yang digunakan dalam learning activities.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `name` | String | Yes | Internal readable name |
| `assetPath` | String | Yes | Audio asset reference |
| `stimulusType` | StimulusType | Yes | Type |
| `category` | SoundCategory | Yes | Category |
| `difficulty` | Difficulty | Yes | Difficulty |
| `durationMs` | Integer | No | Audio duration |
| `isActive` | Boolean | Yes | Available for new sessions |
| `createdAt` | DateTime | Yes | Created |
| `updatedAt` | DateTime | Yes | Updated |

---

# 16. StimulusType

```text
ENVIRONMENTAL_SOUND
ANIMAL_SOUND
HOUSEHOLD_SOUND
MUSICAL_SOUND
EARLY_SPEECH_SOUND
```

`EARLY_SPEECH_SOUND` boleh tersedia di data model tetapi tidak wajib digunakan pada MVP awal.

---

# 17. Difficulty

```text
BEGINNER
INTERMEDIATE
```

MVP terutama menggunakan:

```text
BEGINNER
```

Difficulty bukan representasi clinical difficulty.

---

# 18. Stimulus Contrast

Sound Discrimination membutuhkan metadata pasangan yang valid.

Jangan hanya memilih dua stimulus random.

Gunakan entity:

```text
StimulusContrast
```

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `stimulusAId` | UUID | Yes |
| `stimulusBId` | UUID | Yes |
| `contrastLevel` | ContrastLevel | Yes |
| `isActive` | Boolean | Yes |
| `createdAt` | DateTime | Yes |

## Constraint

Pasangan A/B tidak boleh diduplikasi secara logis.

---

# 19. ContrastLevel

MVP:

```text
HIGH
```

Future:

```text
MEDIUM
LOW
```

MVP hanya menggunakan:

```text
HIGH
```

---

# 20. VisualAsset

## Entity

```text
VisualAsset
```

## Purpose

Merepresentasikan image/illustration yang digunakan dalam association activity.

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `name` | String | Yes |
| `assetPath` | String | Yes |
| `category` | SoundCategory | Yes |
| `isActive` | Boolean | Yes |
| `createdAt` | DateTime | Yes |

---

# 21. LearningStimulus ↔ VisualAsset

Sebuah stimulus dapat memiliki visual source yang benar.

Gunakan optional relation:

```text
LearningStimulus.correctVisualAssetId
```

atau join table jika di masa depan satu sound dapat memiliki beberapa visual.

Untuk MVP, direct optional relation cukup.

Contoh:

```text
dog_bark.wav
→ dog.png
```

---

# 22. LearningSession

## Entity

```text
LearningSession
```

## Purpose

Satu parent-assisted learning session.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `childId` | UUID | Yes | Child |
| `status` | SessionStatus | Yes | Current status |
| `startedAt` | DateTime | Yes | Start |
| `completedAt` | DateTime | No | Completion |
| `createdAt` | DateTime | Yes | Created |
| `updatedAt` | DateTime | Yes | Updated |

---

# 23. SessionStatus

```text
IN_PROGRESS
COMPLETED
INCOMPLETE
```

Allowed transitions:

```text
IN_PROGRESS → COMPLETED
IN_PROGRESS → INCOMPLETE
```

MVP tidak mendukung:

```text
COMPLETED → IN_PROGRESS
INCOMPLETE → IN_PROGRESS
```

---

# 24. Active Session Constraint

Business rule:

```text
1 child
→ maximum 1 IN_PROGRESS session
```

Prisma/PostgreSQL implementation dapat menggunakan:

- transaction check,
- partial unique index,
- atau application-level constraint yang aman terhadap race condition.

Detail diputuskan di `TECH_SPEC.md`.

---

# 25. SessionActivity

## Entity

```text
SessionActivity
```

## Purpose

Mengelompokkan trial berdasarkan skill/activity di dalam session.

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `sessionId` | UUID | Yes |
| `skill` | Skill | Yes |
| `sequence` | Integer | Yes |
| `createdAt` | DateTime | Yes |

Example:

```text
Session
├── Activity 1 — SOUND_DETECTION
├── Activity 2 — SOUND_DISCRIMINATION
└── Activity 3 — SOUND_ASSOCIATION
```

---

# 26. Trial

## Entity

```text
Trial
```

## Purpose

Satu unit learning interaction.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `activityId` | UUID | Yes | Parent activity |
| `sequence` | Integer | Yes | Order |
| `trialType` | TrialType | Yes | Trial variant |
| `stimulusId` | UUID | No | Main stimulus |
| `stimulusBId` | UUID | No | Secondary stimulus |
| `discriminationRelation` | DiscriminationRelation | No | SAME/DIFFERENT |
| `correctOptionId` | UUID | No | Association correct answer |
| `createdAt` | DateTime | Yes | Created |

---

# 27. TrialType

```text
DETECTION_SOUND
DETECTION_SILENT
DISCRIMINATION
ASSOCIATION
```

Using explicit trial type simplifies backend validation.

---

# 28. Detection Trial Shape

## Sound Trial

```text
trialType = DETECTION_SOUND
stimulusId = required
```

## Silent Trial

```text
trialType = DETECTION_SILENT
stimulusId = null
```

---

# 29. Discrimination Trial Shape

```text
trialType = DISCRIMINATION

stimulusId = required
stimulusBId = required
discriminationRelation = SAME | DIFFERENT
```

Correct answer disimpan server-side.

---

# 30. DiscriminationRelation

```text
SAME
DIFFERENT
```

---

# 31. Association Trial

```text
trialType = ASSOCIATION
stimulusId = required
correctOptionId = required
```

Pilihan association sebaiknya disimpan terpisah agar tidak hardcoded di client.

---

# 32. AssociationOption

## Entity

```text
AssociationOption
```

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `trialId` | UUID | Yes |
| `visualAssetId` | UUID | Yes |
| `sequence` | Integer | Yes |
| `createdAt` | DateTime | Yes |

MVP:

```text
2 options / association trial
```

Constraint:

```text
UNIQUE(trialId, visualAssetId)
```

---

# 33. TrialResult

## Entity

```text
TrialResult
```

## Purpose

Menyimpan final outcome satu trial.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Primary identifier |
| `trialId` | UUID | Yes | Trial |
| `resultType` | TrialResultType | Yes | Normalized result |
| `responded` | Boolean | No | Child responded |
| `promptLevel` | Integer | No | 0–3 |
| `selectedOptionId` | UUID | No | Association |
| `selectedRelation` | DiscriminationRelation | No | Discrimination |
| `isCorrect` | Boolean | No | Server-calculated |
| `responseTimeMs` | Integer | No | Product analytics |
| `createdAt` | DateTime | Yes | Completion timestamp |

## Constraint

```text
trialId UNIQUE
```

Satu trial hanya memiliki satu final result.

---

# 34. TrialResultType

```text
INDEPENDENT_RESPONSE
PROMPTED_RESPONSE
NO_RESPONSE
FALSE_RESPONSE
TECHNICAL_ERROR
```

---

# 35. Prompt Level

Valid values:

```text
0
1
2
3
```

Meaning:

```text
0 = independent
1 = stimulus replay
2 = visual attention cue
3 = parent assistance
```

Validation berada di backend.

---

# 36. Correctness

`isCorrect` dihitung backend.

Frontend tidak boleh menjadi source of truth.

Examples:

```text
Detection SOUND + child tap
→ correct

Detection SILENT + child tap
→ false response

Discrimination SAME + selected SAME
→ correct

Association correct option selected
→ correct
```

---

# 37. Technical Error

Jika technical playback failure:

```text
resultType = TECHNICAL_ERROR
```

Data seperti:

```text
isCorrect
promptLevel
```

dapat null jika tidak relevan.

Technical error tidak masuk progress calculation.

---

# 38. ParentObservation

## Entity

```text
ParentObservation
```

## Purpose

Menyimpan contextual parent observation setelah session.

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `sessionId` | UUID | Yes |
| `observationType` | ParentObservationType | Yes |
| `createdAt` | DateTime | Yes |

## Constraint

MVP dapat menggunakan:

```text
maximum 1 observation per session
```

---

# 39. ParentObservationType

```text
OFTEN_RESPONDED_INDEPENDENTLY
RESPONDED_AFTER_REPETITION
NEEDED_FREQUENT_ASSISTANCE
DIFFICULTY_MAINTAINING_ATTENTION
```

Observation tidak mengubah progress calculation pada MVP.

---

# 40. Session Summary

Untuk MVP, `SessionSummary` **tidak wajib menjadi table**.

Summary dapat dihitung dari:

```text
Session
+ TrialResult
+ ParentObservation
```

Suggested behavior:

```text
GET session summary
→ calculate dynamically
```

Jika performance nantinya membutuhkan caching, baru tambahkan summary entity.

---

# 41. Progress Calculation

Source:

```text
10 most recent valid TrialResults per Skill
```

Excluded:

```text
TECHNICAL_ERROR
```

Formula:

```text
independentRate =
independent response count
/
valid trial count
```

---

# 42. Progress Rule

## No trials

```text
NOT_FOCUSED
```

kecuali Detection initial state:

```text
EXPLORING
```

---

## 1–4 valid trials

```text
EXPLORING
```

---

## ≥5 trials

```text
independentRate < 0.50
→ EXPLORING

0.50 <= independentRate < 0.80
→ PRACTICING

independentRate >= 0.80
→ BECOMING_CONSISTENT
```

Rules merupakan product configuration.

Bukan clinical threshold.

---

# 43. Session Planning Configuration

Session plan tidak perlu disimpan sebagai dedicated configuration table untuk MVP.

Gunakan central application config.

Default:

```text
EXPLORING Detection

5 Detection
3 Discrimination
0 Association
```

```text
PRACTICING Detection

4 Detection
3 Discrimination
1 Association
```

```text
BECOMING_CONSISTENT Detection

3 Detection
3 Discrimination
2 Association
```

---

# 44. HomeMissionTemplate

**Priority:** P1

## Entity

```text
HomeMissionTemplate
```

## Fields

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `skill` | Skill | Yes |
| `title` | String | Yes |
| `instruction` | Text | Yes |
| `difficulty` | Difficulty | Yes |
| `isActive` | Boolean | Yes |
| `createdAt` | DateTime | Yes |

P1 tidak boleh menghambat core MVP.

---

# 45. Authentication Session

Exact model bergantung keputusan implementation auth di `TECH_SPEC.md`.

Jika menggunakan server-side session:

```text
AuthSession
```

dapat memiliki:

| Field | Type |
|---|---|
| `id` | UUID/String |
| `parentId` | UUID |
| `expiresAt` | DateTime |
| `createdAt` | DateTime |

Jika menggunakan token-based auth, model ini dapat berubah.

Data model tidak mengunci metode authentication sebelum `TECH_SPEC.md`.

---

# 46. Ownership Chain

Semua learning data harus dapat ditelusuri ke parent.

```text
Parent
  ↓
Child
  ↓
LearningSession
  ↓
SessionActivity
  ↓
Trial
  ↓
TrialResult
```

Authorization dilakukan melalui chain tersebut.

---

# 47. Recommended Foreign Key Behavior

## Parent → Child

Jangan melakukan cascade delete otomatis di MVP jika deletion account belum didefinisikan.

---

## Child → Session

Historical session harus dipertahankan.

---

## Session → Trial

Trial merupakan bagian historical session.

Jangan menghapus trial secara individual dari normal product flow.

---

## Stimulus → Trial

Stimulus yang sudah digunakan oleh historical trial **tidak boleh hard-delete**.

Gunakan:

```text
isActive = false
```

---

# 48. Soft Deactivation

Entity content seperti:

```text
LearningStimulus
VisualAsset
HomeMissionTemplate
```

menggunakan:

```text
isActive
```

bukan delete jika pernah digunakan.

---

# 49. Delete Behavior

MVP tidak menyediakan child deletion flow.

Jika fitur deletion ditambahkan nanti, harus diputuskan secara khusus karena menyangkut historical learning data.

Coding agent tidak boleh menambahkan hard delete child tanpa requirement baru.

---

# 50. Index Recommendations

Recommended indexes:

## Parent

```text
UNIQUE(email)
```

## Child

```text
INDEX(parentId)
```

## LearningProgress

```text
UNIQUE(childId, skill)
```

## LearningSession

```text
INDEX(childId, startedAt)
INDEX(childId, status)
```

## SessionActivity

```text
INDEX(sessionId)
UNIQUE(sessionId, sequence)
```

## Trial

```text
INDEX(activityId)
UNIQUE(activityId, sequence)
```

## TrialResult

```text
UNIQUE(trialId)
INDEX(createdAt)
```

## Stimulus

```text
INDEX(category, difficulty, isActive)
```

## ProgressHistory

```text
INDEX(childId, skill, createdAt)
```

---

# 51. Suggested ID Strategy

Recommended:

```text
UUID
```

untuk externally visible entity IDs.

Benefits:

- sulit ditebak secara sequential,
- mudah digunakan across environments,
- cocok untuk API resource IDs.

Exact UUID version mengikuti engineering decision.

---

# 52. Timestamp Convention

Entity utama menggunakan:

```text
createdAt
updatedAt
```

Stored as:

```text
UTC
```

Frontend bertanggung jawab melakukan timezone formatting.

---

# 53. Fields That Must Never Be Exposed

Backend API tidak boleh mengembalikan:

```text
Parent.passwordHash
auth secret
internal token hash
```

---

# 54. Sensitive Child Data Boundary

MVP **tidak memiliki entity**:

```text
Audiogram
MedicalDiagnosis
HearingThreshold
SpeechRecording
MedicalRecord
DeviceProgramming
ClinicalAssessment
```

Jika coding agent membutuhkan entity tersebut untuk menyelesaikan task MVP, itu indikasi implementasi telah keluar scope.

---

# 55. Suggested Prisma Model Mapping

Konsep entity dapat dipetakan kira-kira menjadi:

```text
Parent
Child
ChildFamiliarSoundCategory

LearningProgress
ProgressHistory

LearningStimulus
StimulusContrast
VisualAsset

LearningSession
SessionActivity
Trial
AssociationOption
TrialResult

ParentObservation

HomeMissionTemplate   // P1
```

Auth session tergantung architecture decision.

---

# 56. Entity Dependency Order

Untuk migration / development:

```text
Parent
  ↓
Child
  ↓
LearningProgress

LearningStimulus
VisualAsset
StimulusContrast

Child
  ↓
LearningSession
  ↓
SessionActivity
  ↓
Trial
  ↓
AssociationOption
  ↓
TrialResult

LearningSession
  ↓
ParentObservation

LearningProgress
  ↓
ProgressHistory
```

---

# 57. Seed Data Requirements

Development environment membutuhkan minimal seed untuk:

```text
LearningStimulus
VisualAsset
StimulusContrast
```

Recommended starter dataset:

```text
8–12 beginner audio stimuli
```

dengan beberapa kategori berbeda.

Contoh kategori:

```text
ANIMALS
HOME
VEHICLES
MUSIC
```

Harus cukup untuk:

- Sound Detection,
- high-contrast Discrimination,
- Association.

---

# 58. Example Stimulus Record

```json
{
  "id": "uuid",
  "name": "Dog Bark 01",
  "assetPath": "/audio/animals/dog-bark-01.mp3",
  "stimulusType": "ANIMAL_SOUND",
  "category": "ANIMALS",
  "difficulty": "BEGINNER",
  "durationMs": 1800,
  "isActive": true
}
```

---

# 59. Example Detection Trial

```json
{
  "trialType": "DETECTION_SOUND",
  "stimulusId": "dog-bark-01",
  "sequence": 1
}
```

Silent:

```json
{
  "trialType": "DETECTION_SILENT",
  "stimulusId": null,
  "sequence": 2
}
```

---

# 60. Example Discrimination Trial

```json
{
  "trialType": "DISCRIMINATION",
  "stimulusId": "dog-bark-01",
  "stimulusBId": "bell-01",
  "discriminationRelation": "DIFFERENT"
}
```

---

# 61. Example Association Trial

```text
Trial
stimulus = dog-bark-01
correctOption = dog-image
```

Options:

```text
dog-image
car-image
```

---

# 62. Example Trial Result

```json
{
  "trialId": "uuid",
  "resultType": "PROMPTED_RESPONSE",
  "responded": true,
  "promptLevel": 2,
  "selectedOptionId": null,
  "selectedRelation": null,
  "isCorrect": true,
  "responseTimeMs": 3400
}
```

---

# 63. Example Progress

```json
{
  "childId": "uuid",
  "skill": "SOUND_DETECTION",
  "state": "PRACTICING",
  "recentValidTrials": 10,
  "independentResponses": 6,
  "promptedResponses": 3,
  "noResponses": 1,
  "falseResponses": 0
}
```

---

# 64. Data Lifecycle

Typical lifecycle:

```text
Parent created
     ↓
Child created
     ↓
Initial LearningProgress created
     ↓
Session generated
     ↓
Activities generated
     ↓
Trials generated
     ↓
TrialResults submitted
     ↓
Observation submitted
     ↓
Session completed
     ↓
Progress recalculated
     ↓
Progress state updated
     ↓
Optional ProgressHistory created
```

---

# 65. Transaction Boundaries

Recommended transaction:

## Child Creation

```text
Create Child
+
Create initial LearningProgress records
```

Harus atomic.

---

## Session Creation

```text
Create Session
+
Create Activities
+
Create Trials
+
Create AssociationOptions when needed
```

Harus atomic.

---

## Session Completion

```text
Update Session
+
Recalculate Progress
+
Update LearningProgress
+
Create ProgressHistory if state changed
```

Harus dilakukan secara konsisten.

---

# 66. Derived vs Stored Data

## Stored

```text
TrialResult
LearningProgress.current state
Session status
Parent observation
```

## Derived

```text
session summary
independent rate
recent activity pattern
next session recommendation
```

Beberapa derived value boleh dicache jika diperlukan.

---

# 67. Future-Proofing

Data model harus memungkinkan future addition seperti:

```text
additional skill
more difficulty levels
speech practice
therapist collaboration
multiple learning programs
```

tetapi MVP tidak boleh membuat tabel kompleks hanya untuk kebutuhan hipotetis tersebut.

---

# 68. Explicit Non-Entities

Jangan membuat entity berikut pada MVP:

```text
Leaderboard
AchievementEconomy
Friend
SocialPost
ChatRoom
AIConversation
ClinicalDiagnosis
Audiogram
SpeechScore
VoiceRecording
DeviceCalibration
TherapistAssignment
Prescription
```

kecuali scope berubah secara eksplisit.

---

# 69. Backend Requirement Traceability

| Data Entity | Related Backend Requirement |
|---|---|
| Parent | BE-AUTH-* |
| Child | BE-CHILD-* |
| Familiar Category | BE-CHILD-07 |
| LearningStimulus | BE-CONTENT-* |
| StimulusContrast | BE-DISCRIM-* |
| LearningSession | BE-SESSION-* |
| SessionActivity | BE-SESSION-* |
| Trial | BE-DETECT-*, BE-DISCRIM-*, BE-ASSOC-* |
| TrialResult | BE-TRIAL-* |
| ParentObservation | BE-OBS-* |
| LearningProgress | BE-PROGRESS-* |
| ProgressHistory | BE-PROGRESS-* |

---

# 70. Data Model Definition of Done

Data model MVP dianggap siap apabila:

1. Parent dapat memiliki child.
2. Child memiliki initial learning progress.
3. Learning content dapat disimpan dan dinonaktifkan.
4. Session dapat memiliki ordered activities.
5. Activity dapat memiliki ordered trials.
6. Detection SOUND dan SILENT dapat direpresentasikan.
7. Discrimination SAME/DIFFERENT dapat direpresentasikan.
8. Association closed-set dapat direpresentasikan.
9. Satu trial hanya memiliki satu final result.
10. Prompt level dapat disimpan.
11. Technical error dapat dibedakan dari child response.
12. Parent observation dapat disimpan.
13. Progress dapat dihitung ulang dari historical trial.
14. Historical learning data tetap dapat dipertahankan.
15. Tidak ada data klinis yang tidak diperlukan dalam MVP.

---

# 71. Related Documents

Product scope:

```text
docs/PRD.md
```

User flow:

```text
docs/USER_FLOWS.md
```

Frontend requirements:

```text
docs/requirements/FRONTEND_REQUIREMENTS.md
```

Backend requirements:

```text
docs/requirements/BACKEND_REQUIREMENTS.md
```

Technical architecture:

```text
docs/TECH_SPEC.md
```

Engineering/product decisions:

```text
docs/DECISIONS.md
```

---

# 72. Final Data Principle

Data model SiapSapa harus memungkinkan sistem menjawab:

```text
Apa yang dimainkan?
Apa respons anak?
Berapa banyak bantuan yang digunakan?
Bagaimana pola aktivitas terbaru?
Apa latihan yang tepat berikutnya?
```

tanpa mencoba menjawab:

```text
Seberapa berat gangguan pendengaran anak?
Apakah pendengaran anak membaik secara klinis?
Apakah anak memiliki diagnosis tertentu?
```