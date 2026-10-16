# SiapSapa — Frontend Functional Requirements

**Document:** Frontend Functional Requirements  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** MVP  
**Platform:** Responsive Web  
**Frontend:** React + TypeScript + Vite + Tailwind CSS

---

# 1. Purpose

Dokumen ini merupakan **source of truth untuk perilaku frontend SiapSapa**.

Dokumen ini mendefinisikan:

- screen behavior,
- user interaction,
- UI state,
- validation behavior,
- loading state,
- error state,
- audio interaction,
- child-facing interaction,
- parent-facing interaction,
- responsive behavior,
- accessibility,
- dan integrasi dengan backend.

Detail product direction berada di:

```text
docs/PRD.md
```

Detail user journey berada di:

```text
docs/USER_FLOWS.md
```

Detail backend behavior berada di:

```text
docs/requirements/BACKEND_REQUIREMENTS.md
```

---

# 2. Requirement Convention

Frontend requirement menggunakan:

```text
FE-{MODULE}-{NUMBER}
```

Contoh:

```text
FE-AUTH-01
FE-CHILD-03
FE-DETECT-04
```

Parent Feature ID:

```text
AUTH-01
CHILD-01
DETECT-01
```

Requirement frontend dan backend dengan parent feature yang sama harus merepresentasikan capability produk yang sama.

---

# 3. Priority Convention

| Priority | Meaning |
|---|---|
| P0 | Wajib tersedia untuk MVP |
| P1 | Dikerjakan setelah seluruh P0 selesai |
| P2 | Future / di luar MVP |

Coding agent tidak boleh mengimplementasikan P1/P2 tanpa instruksi apabila task hanya meminta P0.

---

# 4. Frontend Principles

Frontend SiapSapa harus mengikuti prinsip:

```text
Parent understands
Child interacts
System supports
```

## FP-01 — Mobile First

Primary viewport adalah mobile web.

Urutan prioritas:

```text
Mobile
→ Tablet
→ Desktop
```

---

## FP-02 — Parent Guided

Instruksi kompleks diberikan kepada parent.

Child-facing screen harus sesederhana mungkin.

---

## FP-03 — No Negative Child Feedback

Child-facing UI tidak boleh menampilkan:

```text
Wrong
Incorrect
Failed
Game Over
Try harder
```

atau bentuk feedback negatif yang setara.

---

## FP-04 — Large Interaction Targets

Child-facing interactive target harus mudah disentuh.

Minimum target yang direkomendasikan:

```text
44 × 44 CSS pixels
```

Untuk tombol utama anak, gunakan area yang lebih besar jika memungkinkan.

---

## FP-05 — No Reading Dependency

Child tidak boleh diwajibkan membaca teks untuk menyelesaikan learning activity.

---

## FP-06 — Audio First, Visual Support

Pada activity yang menguji sound awareness, visual tidak boleh membocorkan jawaban sebelum stimulus diberikan kecuali merupakan bagian prompting.

---

# 5. Application Routing

Suggested routes:

```text
/
 /login
 /register

 /onboarding
 /children/new

 /home
 /children/:childId

 /children/:childId/session
 /sessions/:sessionId

 /children/:childId/progress
 /parent
```

Exact route dapat disesuaikan selama behavior tetap sama.

---

# 6. Authentication

## AUTH-01 — Registration

### FE-AUTH-01 — Registration Screen

**Priority:** P0  
**Backend:** BE-AUTH-01

Frontend menyediakan form:

```text
Email
Password
Confirm Password
```

CTA:

```text
Daftar
```

---

### FE-AUTH-02 — Registration Validation

**Priority:** P0

Frontend melakukan basic validation:

- email wajib,
- email format valid,
- password wajib,
- confirm password harus sama,
- tombol submit disabled jika field utama belum valid.

Frontend validation hanya untuk UX.

Backend tetap source of truth.

---

### FE-AUTH-03 — Registration Loading State

**Priority:** P0

Setelah submit:

- CTA masuk loading state,
- duplicate submit dicegah,
- form tidak dikirim berkali-kali.

---

### FE-AUTH-04 — Registration Error State

**Priority:** P0

Jika backend mengembalikan:

```text
CONFLICT
```

frontend menampilkan pesan:

```text
Email ini sudah digunakan.
```

Generic backend error:

```text
Terjadi kendala. Coba lagi.
```

---

### FE-AUTH-05 — Successful Registration

**Priority:** P0

Setelah registrasi berhasil:

```text
Register
→ Authenticated
→ Create Child Profile
```

User tidak perlu login ulang.

---

## AUTH-02 — Login

### FE-AUTH-06 — Login Screen

**Priority:** P0  
**Backend:** BE-AUTH-03

Fields:

```text
Email
Password
```

CTA:

```text
Masuk
```

---

### FE-AUTH-07 — Invalid Login

**Priority:** P0

Jika authentication gagal:

```text
Email atau password tidak valid.
```

Frontend tidak boleh menampilkan apakah email atau password yang salah.

---

### FE-AUTH-08 — Login Loading State

**Priority:** P0

Saat login:

- button disabled,
- loading indicator tampil,
- duplicate submit dicegah.

---

### FE-AUTH-09 — Successful Login

**Priority:** P0

Jika parent belum memiliki child profile:

```text
Login
→ Create Child Profile
```

Jika sudah memiliki child:

```text
Login
→ Home
```

---

## AUTH-03 — Authentication State

### FE-AUTH-10 — Restore Parent Session

**Priority:** P0  
**Backend:** BE-AUTH-05

Saat aplikasi dimuat:

frontend mengecek current authentication state.

Behavior:

```text
Authenticated
→ app

Not authenticated
→ login
```

---

### FE-AUTH-11 — Protected Route

**Priority:** P0

Protected screens tidak boleh ditampilkan ke unauthenticated user.

Jika API mengembalikan:

```text
401
```

frontend mengarahkan user ke login.

---

### FE-AUTH-12 — Logout

**Priority:** P0  
**Backend:** BE-AUTH-06

Parent dapat logout dari parent-facing navigation/settings.

Setelah logout:

```text
clear local auth state
→ redirect login
```

---

# 7. First-Time Onboarding

## ONBOARD-01 — Welcome

### FE-ONBOARD-01 — Welcome Screen

**Priority:** P0

Screen menjelaskan secara ringkas:

```text
SiapSapa membantu Ayah/Bunda
mendampingi anak belajar mengenali suara di rumah.
```

Primary CTA:

```text
Mulai
```

---

### FE-ONBOARD-02 — Product Boundary

**Priority:** P0

Welcome/onboarding harus menyampaikan bahwa SiapSapa:

- bukan tes pendengaran,
- bukan alat diagnosis,
- tidak menggantikan profesional.

Pesan tidak perlu mendominasi UI tetapi harus terbaca.

---

### FE-ONBOARD-03 — Onboarding Length

**Priority:** P0

Onboarding tidak boleh terlalu panjang.

Target MVP:

```text
1–3 screens sebelum child profile
```

---

# 8. Child Profile

## CHILD-01 — Create Child Profile

### FE-CHILD-01 — Child Profile Form

**Priority:** P0  
**Backend:** BE-CHILD-01

Form minimal:

```text
Nama panggilan
Tahun lahir
Perangkat pendengaran
Kemampuan awal
Familiar sound categories
```

---

### FE-CHILD-02 — Nickname Input

**Priority:** P0

Label:

```text
Nama panggilan anak
```

Tidak menggunakan label:

```text
Nama lengkap
```

karena legal full name tidak diperlukan.

---

### FE-CHILD-03 — Birth Year

**Priority:** P0

Input dapat menggunakan:

- numeric field,
- year selector.

Frontend tidak meminta tanggal lahir lengkap jika tidak diperlukan.

---

## CHILD-02 — Hearing Device

### FE-CHILD-04 — Hearing Device Selection

**Priority:** P0  
**Backend:** BE-CHILD-04

Pilihan:

```text
Alat bantu dengar
Implan koklea
Lainnya
Tidak menggunakan
Tidak ingin menjawab
```

Frontend tidak boleh memberi kesan bahwa salah satu perangkat menentukan level kemampuan.

---

## CHILD-03 — Starting Ability

### FE-CHILD-05 — Starting Ability Question

**Priority:** P0  
**Backend:** BE-CHILD-05

Question harus menggunakan bahasa fungsional.

Contoh:

```text
Saat ini, mana yang paling menggambarkan respons anak?
```

Pilihan:

```text
Kadang mulai menyadari adanya suara

Sudah cukup sering menyadari suara familiar

Mulai dapat membedakan beberapa suara
```

Frontend tidak menggunakan istilah klinis.

---

### FE-CHILD-06 — Primary MVP Option

**Priority:** P0

Pilihan utama MVP:

```text
Kadang mulai menyadari adanya suara
```

mapping ke:

```text
STARTING_SOUND_AWARENESS
```

---

## CHILD-04 — Familiar Sounds

### FE-CHILD-07 — Familiar Sound Categories

**Priority:** P0  
**Backend:** BE-CHILD-07

Multi-select:

```text
Hewan
Kendaraan
Suara rumah
Suara keluarga
Musik
Lainnya
```

Field optional.

---

## CHILD-05 — Save Profile

### FE-CHILD-08 — Save Child Profile

**Priority:** P0

Saat submit:

- validate required field,
- show loading state,
- prevent duplicate request.

---

### FE-CHILD-09 — Profile Creation Error

**Priority:** P0

Jika request gagal:

- data form tidak hilang,
- parent dapat retry.

---

### FE-CHILD-10 — Successful Profile Creation

**Priority:** P0

Setelah berhasil:

```text
Create Child
→ Home
```

---

# 9. Home

## HOME-01 — Main Dashboard

### FE-HOME-01 — Display Child Context

**Priority:** P0

Home menampilkan:

- nama panggilan anak,
- learning focus saat ini,
- CTA session utama.

---

### FE-HOME-02 — Primary CTA

**Priority:** P0

Primary CTA:

```text
Mulai Misi Hari Ini
```

CTA harus menjadi visual priority utama pada home.

---

### FE-HOME-03 — Current Learning Focus

**Priority:** P0

Contoh:

```text
Fokus hari ini:
Menyadari suara
```

Tidak menggunakan:

```text
Hearing Level
Hearing Score
```

---

### FE-HOME-04 — Existing Incomplete Session

**Priority:** P0

Jika child memiliki session aktif:

CTA utama berubah menjadi:

```text
Lanjutkan Misi
```

atau parent diberi pilihan sesuai backend response.

---

### FE-HOME-05 — Home Loading

**Priority:** P0

Saat child/session/progress data sedang dimuat:

gunakan skeleton/loading state.

Jangan menampilkan fake progress.

---

### FE-HOME-06 — Home Error State

**Priority:** P0

Jika data gagal dimuat:

```text
Kami belum bisa memuat data.
```

CTA:

```text
Coba lagi
```

---

# 10. Main Navigation

## NAV-01 — Parent Navigation

### FE-NAV-01 — Main Navigation

**Priority:** P0

Parent-facing navigation minimal:

```text
Home
Progress
Parent
```

---

### FE-NAV-02 — Hide Navigation During Child Activity

**Priority:** P0

Saat learning session aktif:

navigation utama dapat disembunyikan agar distraction berkurang.

Parent tetap memiliki:

```text
Pause / Exit
```

---

# 11. Listening Setup

## SETUP-01 — Pre-Session Setup

### FE-SETUP-01 — Listening Setup Screen

**Priority:** P0

Sebelum session dimulai, tampilkan checklist:

```text
Pastikan perangkat pendengaran yang biasa digunakan anak sudah digunakan.

Pilih tempat yang relatif tenang.

Dampingi anak selama permainan.
```

---

### FE-SETUP-02 — No Volume Calibration

**Priority:** P0

Frontend tidak boleh:

- mengubah system volume,
- meminta dB target,
- melakukan audiometry,
- menjalankan hearing threshold test.

---

### FE-SETUP-03 — Parent Ready Confirmation

**Priority:** P0

CTA:

```text
Kami Siap
```

Session baru dibuat setelah parent mengonfirmasi readiness.

---

### FE-SETUP-04 — Session Creation Loading

**Priority:** P0  
**Backend:** BE-SESSION-01

Saat session dibuat:

- CTA disabled,
- show loading,
- duplicate creation dicegah.

---

# 12. Learning Session Shell

## SESSION-01 — Active Session

### FE-SESSION-01 — Session Container

**Priority:** P0

Active learning session memiliki:

- current activity area,
- optional subtle progress indicator,
- parent pause control.

---

### FE-SESSION-02 — No Score During Session

**Priority:** P0

Jangan menampilkan:

```text
3/5 correct
Score 80
Accuracy 75%
```

kepada child.

---

### FE-SESSION-03 — Session Progress

**Priority:** P0

Allowed:

```text
Activity 3 dari 8
```

atau visual progress bar sederhana.

Ini merepresentasikan completion, bukan correctness.

---

### FE-SESSION-04 — Load Session

**Priority:** P0  
**Backend:** BE-SESSION-10

Frontend harus dapat merender session berdasarkan plan dari backend.

Frontend tidak boleh menentukan sendiri activity sequence sebagai source of truth.

---

### FE-SESSION-05 — Resume Session

**Priority:** P0  
**Backend:** BE-SESSION-11

Saat resume:

- completed trials tidak dimainkan ulang,
- frontend mulai dari next incomplete trial.

---

# 13. Shared Audio Behavior

## AUDIO-01 — Audio Playback

### FE-AUDIO-01 — Controlled Playback

**Priority:** P0

Learning audio dimainkan hanya saat activity menginstruksikan playback.

---

### FE-AUDIO-02 — Prevent Overlapping Playback

**Priority:** P0

Satu learning stimulus tidak boleh overlap dengan stimulus berikutnya.

Jika audio sedang dimainkan:

request playback kedua harus:

- diabaikan,
- atau menunggu playback selesai,

sesuai activity behavior.

---

### FE-AUDIO-03 — Playback State

**Priority:** P0

Frontend harus mengetahui state:

```text
idle
loading
playing
ended
error
```

---

### FE-AUDIO-04 — Disable Premature Interaction

**Priority:** P0

Untuk activity yang membutuhkan mendengar stimulus dahulu:

interactive response area dapat disabled sampai stimulus telah mulai atau selesai sesuai mechanic.

---

### FE-AUDIO-05 — Audio Failure

**Priority:** P0  
**Backend:** BE-CONTENT-06

Jika audio gagal:

- jangan catat sebagai child failure,
- tampilkan parent-facing recovery UI.

Contoh:

```text
Audio belum dapat diputar.
```

CTA:

```text
Coba Lagi
Lewati
```

---

### FE-AUDIO-06 — Report Technical Error

**Priority:** P0

Jika parent memilih skip karena playback failure:

frontend mengirim:

```text
technicalError = true
```

untuk trial tersebut.

---

### FE-AUDIO-07 — No Automatic Volume Modification

**Priority:** P0

Frontend tidak boleh memanggil mechanism untuk mengubah system/device volume.

---

# 14. Sound Detection

## DETECT-01 — Child Interaction

### FE-DETECT-01 — Detection Activity Screen

**Priority:** P0  
**Backend:** BE-DETECT-01 sampai BE-DETECT-09

Child-facing screen memiliki:

- satu primary interaction target,
- visual sederhana,
- minimum distraction.

---

### FE-DETECT-02 — Ready State

**Priority:** P0

Sebelum stimulus:

UI berada pada neutral ready state.

Tidak boleh menampilkan visual yang membocorkan apakah trial:

```text
SOUND
```

atau:

```text
SILENT
```

---

### FE-DETECT-03 — Sound Trial Behavior

**Priority:** P0

Untuk SOUND trial:

```text
Ready
→ stimulus
→ response window
→ wait child response
```

---

### FE-DETECT-04 — Silent Trial Behavior

**Priority:** P0

Untuk SILENT trial:

frontend tetap menjalankan response window tanpa audio.

Child tidak diberi informasi bahwa trial tersebut silent.

---

### FE-DETECT-05 — Child Response

**Priority:** P0

Anak merespons melalui primary tap area.

Tap harus:

- memberikan immediate visual acknowledgement,
- tidak langsung menampilkan benar/salah.

---

### FE-DETECT-06 — Prevent Multiple Response Submission

**Priority:** P0

Setelah response diterima:

- response target disabled,
- trial hanya dikirim sekali.

---

# 15. Prompting Ladder

## PROMPT-01 — Prompt Level UI

### FE-PROMPT-01 — Prompt Level 0

**Priority:** P0

Stimulus diberikan tanpa bantuan.

Tidak ada hint tambahan.

---

### FE-PROMPT-02 — Prompt Level 1

**Priority:** P0

Jika anak belum merespons:

frontend dapat memutar ulang stimulus.

Child-facing feedback:

```text
Ayo dengarkan sekali lagi
```

---

### FE-PROMPT-03 — Prompt Level 2

**Priority:** P0

Jika masih belum merespons:

frontend memberikan visual attention cue.

Contoh:

- karakter bergerak ringan,
- glow/pulse pada area relevant.

Cue tidak boleh membocorkan jawaban secara langsung.

---

### FE-PROMPT-04 — Prompt Level 3

**Priority:** P0

Parent-facing instruction muncul.

Contoh:

```text
Ayah/Bunda, bantu anak memperhatikan.
Kita dengarkan bersama sekali lagi.
```

---

### FE-PROMPT-05 — Maximum Prompt Level

**Priority:** P0

MVP maximum:

```text
3
```

Frontend tidak membuat additional prompt level sendiri.

---

### FE-PROMPT-06 — No Immediate Failure

**Priority:** P0

Trial tidak ditandai gagal sebelum prompting sequence selesai.

---

### FE-PROMPT-07 — Prompt Level Submission

**Priority:** P0

Frontend mengirim final prompt level ke backend bersama trial result.

---

# 16. Sound Discrimination

## DISCRIM-01 — Activity Screen

### FE-DISCRIM-01 — Pair Playback

**Priority:** P0  
**Backend:** BE-DISCRIM-01 sampai BE-DISCRIM-08

Flow:

```text
Play A
→ pause
→ play B
→ response options
```

---

### FE-DISCRIM-02 — No Response Before Pair Completion

**Priority:** P0

Response controls disabled sampai kedua stimulus selesai dimainkan.

---

### FE-DISCRIM-03 — Child-Friendly Choice

**Priority:** P0

Jangan mengandalkan teks:

```text
Sama
Berbeda
```

sebagai satu-satunya interaction mechanism.

Gunakan visual pairing/metaphor sederhana.

Text dapat tetap ada untuk parent/support.

---

### FE-DISCRIM-04 — Same Option

**Priority:** P0

UI menyediakan child-understandable interaction untuk memilih:

```text
SAME
```

---

### FE-DISCRIM-05 — Different Option

**Priority:** P0

UI menyediakan child-understandable interaction untuk memilih:

```text
DIFFERENT
```

---

### FE-DISCRIM-06 — Selection Feedback

**Priority:** P0

Setelah memilih:

- UI acknowledge pilihan,
- jangan menampilkan large red/green correctness state.

---

### FE-DISCRIM-07 — Prompting Integration

**Priority:** P0

Jika belum tepat/response belum selesai sesuai flow:

gunakan prompting ladder yang sama.

---

# 17. Sound Association

## ASSOC-01 — Closed Set Activity

### FE-ASSOC-01 — Association Screen

**Priority:** P0  
**Backend:** BE-ASSOC-01 sampai BE-ASSOC-07

Display:

```text
Audio stimulus
+
2 visual options
```

---

### FE-ASSOC-02 — Two Large Options

**Priority:** P0

Kedua options harus:

- besar,
- memiliki spacing cukup,
- dapat disentuh dengan mudah.

---

### FE-ASSOC-03 — Audio Before Selection

**Priority:** P0

Stimulus audio dimainkan sebelum child diharapkan memilih.

Replay dapat terjadi melalui prompting.

---

### FE-ASSOC-04 — Child Selects Image

**Priority:** P0

Frontend mengirim:

```text
selectedOptionId
promptLevel
```

Backend menentukan correctness.

---

### FE-ASSOC-05 — Do Not Determine Correctness Locally as Authority

**Priority:** P0

Frontend boleh mengetahui visual state dari API response tetapi tidak boleh menjadi source of truth untuk correct answer.

---

# 18. Trial Submission

## TRIAL-01 — Result Submission

### FE-TRIAL-01 — Submit Trial Result

**Priority:** P0  
**Backend:** BE-TRIAL-01

Setelah final child interaction:

frontend mengirim satu final result.

---

### FE-TRIAL-02 — Submission Loading

**Priority:** P0

Saat result dikirim:

- disable repeated interaction,
- child tidak perlu melihat technical spinner besar.

Gunakan transition/loading ringan.

---

### FE-TRIAL-03 — Retry Failed Submission

**Priority:** P0

Jika network request gagal:

- result local sementara tidak hilang,
- frontend mencoba retry atau memberikan parent retry option.

Trial tidak boleh langsung dilanjutkan jika result belum tersimpan dan akan menyebabkan state inconsistency.

---

### FE-TRIAL-04 — Duplicate Protection

**Priority:** P0

Frontend tidak mengirim final result berkali-kali akibat double tap.

---

### FE-TRIAL-05 — Response Time

**Priority:** P0

Jika digunakan, timer internal dapat mengukur:

```text
responseTimeMs
```

Timer tidak ditampilkan kepada child.

Tidak digunakan sebagai countdown.

---

# 19. Positive Feedback

## FEEDBACK-01 — Participation Feedback

### FE-FEEDBACK-01 — Trial Completion Feedback

**Priority:** P0

Setelah trial selesai:

gunakan positive/neutral feedback.

Contoh:

```text
Bagus sudah mencoba!
```

atau animation sederhana.

---

### FE-FEEDBACK-02 — No Correctness Reward Dependency

**Priority:** P0

Reward tidak hanya diberikan saat correct independent response.

Child yang membutuhkan prompt tetap mendapatkan positive completion feedback.

---

### FE-FEEDBACK-03 — No Competitive Mechanics

**Priority:** P0

Tidak ada:

```text
leaderboard
lives
negative points
rank
streak punishment
```

---

# 20. Pause & Exit

## SESSION-02 — Pause Session

### FE-SESSION-06 — Parent Pause Control

**Priority:** P0

Saat session aktif, parent memiliki pause control yang mudah ditemukan tetapi tidak terlalu menarik perhatian anak.

---

### FE-SESSION-07 — Pause Behavior

**Priority:** P0

Saat paused:

- audio berhenti/tidak melanjutkan ke stimulus berikut,
- child interaction disabled,
- parent controls muncul.

Options:

```text
Lanjutkan
Akhiri Sesi
```

---

### FE-SESSION-08 — End Session Confirmation

**Priority:** P0

Sebelum end early:

tampilkan confirmation.

Contoh:

```text
Akhiri sesi sekarang?

Aktivitas yang sudah selesai tetap tersimpan.
```

---

### FE-SESSION-09 — End Early

**Priority:** P0  
**Backend:** BE-SESSION-13

Jika parent mengonfirmasi:

frontend mengirim end session.

Setelah sukses:

```text
→ optional observation
→ summary/home
```

---

# 21. Parent Observation

## OBS-01 — Observation Screen

### FE-OBS-01 — Show Parent Observation

**Priority:** P0  
**Backend:** BE-OBS-01

Setelah learning activities:

tampilkan parent-only screen.

---

### FE-OBS-02 — Observation Options

**Priority:** P0

Pilihan:

```text
Anak sering merespons sendiri

Anak lebih sering merespons setelah suara diulang

Anak membutuhkan banyak bantuan

Anak tampak sulit mempertahankan perhatian
```

---

### FE-OBS-03 — Observation Optional

**Priority:** P0

Parent dapat:

```text
Lewati
```

karena observation tidak wajib.

---

### FE-OBS-04 — Submit Observation

**Priority:** P0

Selected option dikirim ke backend.

Loading state harus mencegah duplicate submit.

---

# 22. Session Summary

## SUMMARY-01 — Summary Screen

### FE-SUMMARY-01 — Display Completion

**Priority:** P0  
**Backend:** BE-SUMMARY-01

Heading child-friendly / parent-friendly:

```text
Misi Hari Ini Selesai 🎉
```

---

### FE-SUMMARY-02 — Skill Summary

**Priority:** P0

Display per skill:

```text
Menyadari suara
Membedakan suara
Menghubungkan suara
```

Gunakan bahasa awam di UI.

---

### FE-SUMMARY-03 — Response Breakdown

**Priority:** P0

Parent dapat melihat informasi seperti:

```text
5 aktivitas dilakukan tanpa bantuan
2 aktivitas membutuhkan bantuan
```

Tidak harus menampilkan raw technical enum.

---

### FE-SUMMARY-04 — Technical Error

**Priority:** P0

Technical error tidak ditampilkan sebagai child failure.

Jika perlu:

```text
1 aktivitas dilewati karena kendala audio.
```

---

### FE-SUMMARY-05 — Activity Context

**Priority:** P0

Summary harus menggunakan wording seperti:

```text
Dalam aktivitas SiapSapa hari ini...
```

Hindari:

```text
Pendengaran anak meningkat.
```

---

### FE-SUMMARY-06 — Primary CTA

**Priority:** P0

Setelah summary:

```text
Kembali ke Home
```

P1:

```text
Lihat Misi Rumah
```

---

# 23. Progress

## PROGRESS-01 — Progress Overview

### FE-PROGRESS-01 — Progress Page

**Priority:** P0  
**Backend:** BE-PROGRESS-12

Display skills:

```text
Menyadari suara
Membedakan suara
Menghubungkan suara
```

---

### FE-PROGRESS-02 — Learning State Mapping

**Priority:** P0

Backend state:

```text
NOT_FOCUSED
EXPLORING
PRACTICING
BECOMING_CONSISTENT
```

UI mapping:

```text
Belum menjadi fokus
Mulai mencoba
Sedang berlatih
Mulai konsisten
```

Wording final dapat disesuaikan design.

---

### FE-PROGRESS-03 — Do Not Show Clinical Score

**Priority:** P0

Tidak menampilkan:

```text
Hearing Score
Hearing Level
Hearing Age
Clinical Improvement
```

---

### FE-PROGRESS-04 — Recent Pattern

**Priority:** P0

Parent dapat melihat pattern sederhana.

Contoh:

```text
Sesi terakhir:
lebih banyak aktivitas dilakukan tanpa bantuan.
```

---

### FE-PROGRESS-05 — Empty Progress State

**Priority:** P0

Jika belum ada session:

```text
Belum ada aktivitas yang tercatat.
Mulai misi pertama untuk melihat perkembangan latihan.
```

CTA:

```text
Mulai Misi
```

---

### FE-PROGRESS-06 — Loading/Error

**Priority:** P0

Progress page memiliki:

- loading state,
- error state,
- retry.

---

# 24. Parent Area

## PARENT-01 — Parent Corner

### FE-PARENT-01 — Parent Information Area

**Priority:** P0

Parent area dapat memuat:

- penjelasan singkat learning focus,
- product boundary,
- child profile access,
- logout.

---

### FE-PARENT-02 — Learning Goal Explanation

**Priority:** P0

Contoh:

```text
Menyadari suara

Aktivitas ini membantu anak berlatih memperhatikan
kapan suara muncul dalam permainan SiapSapa.
```

Tidak menggunakan klaim terapi.

---

# 25. Child Profile Management

## CHILD-06 — View / Edit Child

### FE-CHILD-11 — View Child Profile

**Priority:** P0  
**Backend:** BE-CHILD-11

Parent dapat melihat child profile.

---

### FE-CHILD-12 — Edit Child Profile

**Priority:** P0  
**Backend:** BE-CHILD-12

Editable:

```text
nickname
hearing device
familiar categories
```

---

### FE-CHILD-13 — Preserve Progress Messaging

**Priority:** P0

Editing profile tidak boleh memberikan kesan bahwa progress akan direset.

---

# 26. Incomplete Session

## SESSION-03 — Resume / Incomplete

### FE-SESSION-10 — Detect Existing Active Session

**Priority:** P0

Jika backend mengembalikan active session:

frontend menawarkan:

```text
Lanjutkan Misi
```

---

### FE-SESSION-11 — Incomplete Session Is Not Failure

**Priority:** P0

Tidak menampilkan:

```text
Misi gagal
Session failed
```

Gunakan neutral state.

---

# 27. Network Error Behavior

## ERROR-01 — General API Failure

### FE-ERROR-01 — Recoverable Error

**Priority:** P0

Untuk network error:

```text
Terjadi kendala koneksi.
Coba lagi.
```

User input yang sudah dibuat tidak boleh hilang jika memungkinkan.

---

### FE-ERROR-02 — Retry

**Priority:** P0

Screen penting harus menyediakan retry jika request dapat diulang dengan aman.

---

### FE-ERROR-03 — Unauthorized

**Priority:** P0

Jika API mengembalikan 401:

```text
clear invalid auth state
→ redirect login
```

---

### FE-ERROR-04 — Forbidden

**Priority:** P0

403 tidak boleh ditampilkan sebagai app crash.

Generic message:

```text
Kamu tidak memiliki akses ke data ini.
```

---

### FE-ERROR-05 — Not Found

**Priority:** P0

404 child/session:

```text
Data tidak ditemukan.
```

CTA:

```text
Kembali ke Home
```

---

# 28. Loading States

## LOADING-01 — General Loading

### FE-LOADING-01 — Prevent Layout Jump

**Priority:** P0

Gunakan skeleton atau stable loading layout untuk parent-facing content.

---

### FE-LOADING-02 — Child-Facing Loading

**Priority:** P0

Child-facing loading harus:

- sederhana,
- tidak terlalu lama menampilkan blank screen.

---

### FE-LOADING-03 — Disable Duplicate Action

**Priority:** P0

Selama submit:

CTA disabled jika duplicate action dapat menyebabkan duplicate request.

---

# 29. Accessibility

## A11Y-01 — Keyboard

### FE-A11Y-01 — Parent UI Keyboard Access

**Priority:** P0

Parent-facing controls harus dapat dinavigasi dengan keyboard pada desktop.

---

## A11Y-02 — Semantic Controls

### FE-A11Y-02 — Use Semantic HTML

**Priority:** P0

Gunakan:

```text
button
input
label
nav
main
```

sesuai fungsi.

Jangan mengganti semua interaction dengan generic `div`.

---

## A11Y-03 — Screen Reader

### FE-A11Y-03 — Parent UI Labels

**Priority:** P0

Form dan parent controls memiliki accessible name.

---

## A11Y-04 — Color

### FE-A11Y-04 — Do Not Depend on Color Alone

**Priority:** P0

State tidak boleh dikomunikasikan hanya melalui warna.

---

## A11Y-05 — Motion

### FE-A11Y-05 — Respect Reduced Motion

**Priority:** P1

Non-essential animation sebaiknya menghormati:

```text
prefers-reduced-motion
```

---

# 30. Responsive Requirements

## RESPONSIVE-01 — Mobile

### FE-RESP-01 — Mobile Primary

**Priority:** P0

Target minimum layout harus usable sekitar:

```text
360px viewport width
```

---

### FE-RESP-02 — No Horizontal Overflow

**Priority:** P0

Core screen tidak boleh menghasilkan horizontal scroll pada viewport yang didukung.

---

## RESPONSIVE-02 — Tablet / Desktop

### FE-RESP-03 — Content Width

**Priority:** P0

Pada desktop, child activity tidak harus memenuhi seluruh layar.

Gunakan bounded content area agar interaction tetap fokus.

---

### FE-RESP-04 — Touch Support

**Priority:** P0

Desktop optimization tidak boleh merusak touch behavior pada tablet/mobile.

---

# 31. Visual Interaction Constraints

## UI-01 — Child Screen

### FE-UI-01 — Minimal Child UI

**Priority:** P0

Child activity sebaiknya hanya memiliki:

- stimulus area,
- response area,
- subtle progress,
- parent pause access.

---

### FE-UI-02 — No Advertising / Distraction

**Priority:** P0

Tidak ada:

- unrelated card,
- promo,
- social feature,
- decorative interaction yang mengganggu learning task.

---

### FE-UI-03 — Text Size

**Priority:** P0

Parent-facing instructional text harus tetap terbaca di mobile.

Jangan menggunakan text terlalu kecil demi memasukkan lebih banyak content.

---

# 32. Frontend State Management

## STATE-01 — Server vs Local State

### FE-STATE-01 — Server Data

**Priority:** P0

Data seperti:

```text
parent
child
session
trial plan
progress
summary
```

harus diperlakukan sebagai server-backed state.

---

### FE-STATE-02 — Ephemeral Activity State

**Priority:** P0

State seperti:

```text
current prompt level
audio state
current selection
temporary response state
```

dapat berada di local component/feature state.

---

### FE-STATE-03 — Do Not Duplicate Server Authority

**Priority:** P0

Frontend tidak boleh memiliki persistent calculation yang menjadi source of truth untuk:

```text
progress state
correct answer
session status
learning state
```

---

# 33. Content Rendering

## CONTENT-01 — Stimulus Asset

### FE-CONTENT-01 — Render Backend Content

**Priority:** P0

Audio/image content berasal dari session/trial payload backend.

Frontend tidak hardcode stimulus sebagai source of truth.

Mock data diperbolehkan untuk local development/testing.

---

### FE-CONTENT-02 — Missing Image

**Priority:** P0

Jika optional image gagal dimuat:

- gunakan fallback visual,
- jangan menyebabkan app crash.

---

### FE-CONTENT-03 — Missing Required Audio

**Priority:** P0

Jika required audio gagal:

gunakan audio technical error flow.

---

# 34. Home Mission

## HOME-MISSION-01 — Offline Practice

### FE-HOME-MISSION-01 — Home Mission Screen

**Priority:** P1

Setelah summary, parent dapat melihat satu aktivitas sederhana tanpa screen.

---

### FE-HOME-MISSION-02 — Parent-Only Content

**Priority:** P1

Home Mission ditulis untuk parent, bukan child.

---

# 35. Frontend Module Ownership

Suggested structure:

```text
apps/web/src/features/
```

Mapping:

```text
auth/
  FE-AUTH-*

onboarding/
  FE-ONBOARD-*

child-profile/
  FE-CHILD-*

daily-session/
  FE-SETUP-*
  FE-SESSION-*
  FE-TRIAL-*
  FE-AUDIO-*
  FE-PROMPT-*

sound-detection/
  FE-DETECT-*

sound-discrimination/
  FE-DISCRIM-*

sound-association/
  FE-ASSOC-*

progress/
  FE-PROGRESS-*

parent/
  FE-PARENT-*

shared/
  FE-A11Y-*
  FE-ERROR-*
  FE-LOADING-*
  FE-RESP-*
```

Structure boleh berkembang jika behavior requirement tetap terjaga.

---

# 36. Suggested Reusable Components

Shared component dibuat hanya jika benar-benar reusable.

Potential components:

```text
Button
LoadingButton
ErrorState
PageContainer
ParentInstructionCard
AudioPlaybackState
SessionProgress
PauseSessionDialog
PositiveFeedback
LargeChoiceCard
```

Game-specific components tetap berada dalam feature masing-masing jika tidak reusable.

---

# 37. Frontend-to-Backend Mapping

## Authentication

```text
FE-AUTH-01..05
→ BE-AUTH-01..02

FE-AUTH-06..09
→ BE-AUTH-03..04

FE-AUTH-10..12
→ BE-AUTH-05..07
```

## Child

```text
FE-CHILD-01..10
→ BE-CHILD-01..07

FE-CHILD-11..13
→ BE-CHILD-10..13
```

## Session

```text
FE-SETUP-*
FE-SESSION-*
→ BE-SESSION-*
```

## Audio

```text
FE-AUDIO-*
→ BE-CONTENT-05..06
→ BE-TRIAL-08
```

## Detection

```text
FE-DETECT-*
→ BE-DETECT-*
```

## Discrimination

```text
FE-DISCRIM-*
→ BE-DISCRIM-*
```

## Association

```text
FE-ASSOC-*
→ BE-ASSOC-*
```

## Trial

```text
FE-TRIAL-*
→ BE-TRIAL-*
```

## Observation

```text
FE-OBS-*
→ BE-OBS-*
```

## Summary

```text
FE-SUMMARY-*
→ BE-SUMMARY-*
```

## Progress

```text
FE-PROGRESS-*
→ BE-PROGRESS-*
```

---

# 38. Critical UI States per Screen

Setiap data-driven parent screen minimal mempertimbangkan:

```text
loading
success
empty
error
```

Interactive session screen minimal mempertimbangkan:

```text
ready
audio loading
audio playing
waiting response
prompting
submitting
completed
audio error
network error
paused
```

Coding agent tidak boleh hanya mengimplementasikan happy path.

---

# 39. Critical Frontend Test Coverage

Minimal test penting mencakup:

## Authentication

```text
registration validation
login validation
auth redirect
```

## Child Profile

```text
required fields
ability selection
profile submit
submit failure retains input
```

## Session

```text
session loading
active session resume
pause
end early
```

## Detection

```text
sound trial
silent trial
single response submission
prompt progression
```

## Audio

```text
playback success
playback error
retry
technical skip
```

## Discrimination

```text
pair playback
response disabled before audio completion
selection
prompt
```

## Association

```text
two visual options
selection
submission
```

## Trial

```text
duplicate click prevention
failed network submission retry
```

## Progress

```text
normal progress
empty progress
loading
error
```

---

# 40. Frontend P0 Completion Checklist

Frontend MVP dianggap functional jika flow berikut dapat digunakan:

```text
Parent registers/logs in
        ↓
Creates child profile
        ↓
Sees Home
        ↓
Starts Today's Mission
        ↓
Reads Listening Setup
        ↓
Starts session
        ↓
Child completes Sound Detection
        ↓
Prompting Ladder appears when needed
        ↓
Child completes Sound Discrimination
        ↓
Child completes Association if planned
        ↓
Parent submits observation
        ↓
Session Summary appears
        ↓
Progress page updates
        ↓
Parent can start/resume next session
```

---

# 41. Frontend Definition of Done

Sebuah frontend requirement dianggap selesai jika:

1. Behavior sesuai FE requirement.
2. Integrasi backend sesuai API contract.
3. Loading state tersedia.
4. Relevant empty/error state tersedia.
5. Duplicate interaction dicegah.
6. Responsive pada mobile target.
7. Child-facing UI tidak membutuhkan kemampuan membaca.
8. Tidak ada negative learning feedback.
9. Product safety boundary tetap dijaga.
10. Important interaction memiliki test jika praktis.

---

# 42. Explicit Frontend Non-Goals

Coding agent tidak boleh menambahkan tanpa requirement baru:

```text
microphone recording
speech recognition
pronunciation score
hearing test
audiogram upload
volume calibration
device configuration
therapist dashboard
AI chatbot
leaderboard
social feed
complex avatar economy
competitive ranking
advanced animation system
offline-first architecture
full PWA installation
```

---

# 43. MVP Interaction Principle

Frontend harus menjaga pemisahan:

```text
Parent UI
=
informative + instructional + management

Child UI
=
visual + simple + touch-based + supportive
```

Jangan menggunakan child-facing interface sebagai mini dashboard orang dewasa.

---

# 44. Final Frontend Principle

Frontend SiapSapa harus selalu mengikuti:

```text
Hear
→ Respond
→ Get Support When Needed
→ Complete Positively
```

Bukan:

```text
Hear
→ Be Judged
→ Receive Score
→ Pass / Fail
```

Frontend bertugas membuat learning loop terasa:

```text
simple
safe
predictable
supportive
```

tanpa mengubah aktivitas SiapSapa menjadi evaluasi klinis.

---

# 45. Related Documents

Product direction:

```text
docs/PRD.md
```

User flow:

```text
docs/USER_FLOWS.md
```

Backend behavior:

```text
docs/requirements/BACKEND_REQUIREMENTS.md
```

Data model:

```text
docs/DATA_MODEL.md
```

Technical implementation:

```text
docs/TECH_SPEC.md
```

Important decisions:

```text
docs/DECISIONS.md
```