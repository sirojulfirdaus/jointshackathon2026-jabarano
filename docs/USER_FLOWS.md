# SiapSapa — User Flows

**Document:** User Flows  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** MVP  
**Platform:** Responsive Web

---

# 1. Purpose

Dokumen ini mendefinisikan alur pengguna utama SiapSapa dari onboarding hingga progress tracking.

Dokumen ini menjadi penghubung antara:

```text
PRD
↓
USER FLOWS
↓
FRONTEND / BACKEND REQUIREMENTS
↓
IMPLEMENTATION
```

Detail UI tidak dikunci di dokumen ini kecuali jika perilaku tersebut penting bagi alur produk.

---

# 2. Primary Actors

## Parent / Caregiver

Pengguna utama aplikasi.

Bertugas untuk:

- melakukan onboarding,
- membuat profil anak,
- menyiapkan sesi,
- mendampingi aktivitas,
- memberikan bantuan,
- memberikan observasi,
- melihat progress.

---

## Child

Pengguna akhir dari learning activity.

Anak berinteraksi terutama melalui:

- audio,
- visual,
- tap,
- pilihan sederhana.

Anak tidak diharapkan membaca instruksi kompleks.

---

# 3. Primary Product Flow

```text
Parent Opens SiapSapa
        ↓
Parent Onboarding
        ↓
Child Profile
        ↓
Home
        ↓
Start Today's Session
        ↓
Listening Setup
        ↓
Learning Session
        ↓
Parent Observation
        ↓
Session Summary
        ↓
Progress Updated
        ↓
Return Home
```

---

# 4. Flow UF-01 — First-Time Parent Onboarding

## Goal

Membantu orang tua memahami fungsi SiapSapa dan memulai penggunaan tanpa onboarding yang panjang.

## Entry Condition

User membuka SiapSapa untuk pertama kali.

## Flow

```text
Open SiapSapa
      ↓
Welcome Screen
      ↓
Product Explanation
      ↓
Safety / Product Boundary
      ↓
Continue
      ↓
Create Parent Account / Session
      ↓
Create Child Profile
```

## Expected Experience

Welcome screen harus menjelaskan secara singkat bahwa SiapSapa:

- membantu aktivitas mendengar di rumah,
- digunakan bersama orang tua,
- bukan alat diagnosis atau tes pendengaran.

## Exit Condition

Parent berhasil masuk ke proses pembuatan profil anak.

---

# 5. Flow UF-02 — Create Child Learning Profile

## Goal

Mengumpulkan informasi minimum yang diperlukan untuk menentukan starting experience anak.

## Required Information

Minimal:

- nama panggilan anak,
- usia,
- status penggunaan perangkat pendengaran,
- gambaran kemampuan mendengar saat ini.

## Example Ability Options

```text
A. Kadang mulai menyadari adanya suara

B. Sudah cukup sering menyadari suara familiar

C. Mulai dapat membedakan beberapa suara
```

Target utama MVP adalah kategori A.

## Flow

```text
Enter Child Basic Information
        ↓
Select Hearing Device Context
        ↓
Select Current Listening Ability
        ↓
Optional Familiar Sound Categories
        ↓
Review
        ↓
Save Child Profile
        ↓
Go to Home
```

## Validation

Parent tidak diminta memasukkan:

- hasil audiogram,
- hearing threshold,
- diagnosis klinis,
- konfigurasi hearing aid,
- konfigurasi cochlear implant.

## Exit Condition

Child profile berhasil tersimpan dan memiliki starting learning state.

---

# 6. Flow UF-03 — Home

## Goal

Memberikan parent akses sederhana ke fungsi utama.

## Primary Navigation

```text
Home
├── Today's Mission
├── Progress
└── Parent Corner
```

## Home Content

Home dapat menampilkan:

- nama anak,
- learning focus saat ini,
- CTA memulai sesi,
- status sesi terbaru,
- progress singkat.

## Primary CTA

```text
Mulai Misi Hari Ini
```

---

# 7. Flow UF-04 — Start Daily Session

## Goal

Mempersiapkan parent dan anak sebelum learning activity dimulai.

## Flow

```text
Parent selects Today's Mission
        ↓
Listening Setup
        ↓
Confirm Ready
        ↓
Session Created
        ↓
Warm-Up / First Activity
```

---

# 8. Flow UF-05 — Listening Setup

## Goal

Mengurangi faktor lingkungan yang dapat mengganggu aktivitas.

## Information Shown

Parent diingatkan untuk:

- menggunakan perangkat pendengaran yang biasa digunakan anak sesuai arahan profesional,
- memilih tempat yang relatif tenang,
- tetap mendampingi anak,
- memastikan perangkat yang digunakan memiliki audio yang dapat terdengar nyaman.

Aplikasi tidak menentukan volume klinis atau melakukan hearing test.

## Flow

```text
Listening Setup Screen
        ↓
Parent reviews checklist
        ↓
Parent confirms ready
        ↓
Start Session
```

---

# 9. Flow UF-06 — Session Structure

Satu learning session MVP terdiri dari beberapa activity.

Contoh:

```text
Session Start
      ↓
Sound Detection
      ↓
Sound Detection
      ↓
Sound Discrimination
      ↓
Sound Discrimination
      ↓
Optional Sound Association
      ↓
Parent Observation
      ↓
Session Summary
```

Jumlah aktivitas dapat disesuaikan oleh progression rule.

---

# 10. Flow UF-07 — Sound Detection

## Goal

Melatih anak menyadari keberadaan suara.

## Basic Interaction

```text
Ready State
    ↓
Stimulus Trial
    ↓
Child Response
    ↓
Evaluate Trial
    ↓
Next Trial
```

## Trial Types

### Sound Trial

Audio dimainkan.

Expected behavior:

```text
Sound Played
    ↓
Child taps response area
```

### Silent Trial

Tidak ada stimulus audio.

Tujuannya adalah mengurangi kemungkinan anak hanya menekan layar berdasarkan pola waktu.

---

# 11. Sound Detection Trial Result

Setiap trial dapat menghasilkan:

```text
Independent Response
Prompted Response
No Response
False Response
```

## Independent Response

Anak merespons tanpa bantuan.

## Prompted Response

Anak memberikan respons setelah satu atau lebih prompt.

## No Response

Anak belum merespons setelah prompting sequence selesai.

## False Response

Anak memberikan respons ketika stimulus tidak diberikan.

Label tersebut digunakan untuk sistem dan parent insight.

Child-facing UI tidak menampilkan label negatif.

---

# 12. Flow UF-08 — Prompting Ladder

## Goal

Memberikan bantuan secara bertahap ketika anak belum merespons.

## Base Flow

```text
Play Stimulus
      ↓
Wait for Response
      ↓
No Response
      ↓
Prompt 1
      ↓
Replay Stimulus
      ↓
No Response
      ↓
Prompt 2
      ↓
Parent Assistance
      ↓
Complete Trial
```

## Suggested Prompt Levels

### Prompt Level 0

Stimulus diberikan tanpa bantuan tambahan.

### Prompt Level 1

Stimulus diulang.

### Prompt Level 2

Visual attention cue ditambahkan.

### Prompt Level 3

Parent mendapatkan instruksi untuk membantu anak.

Prompt level disimpan sebagai bagian dari trial result.

---

# 13. Prompting Principles

Sistem tidak menampilkan:

```text
Wrong
Failed
Incorrect
```

kepada anak.

Sebaliknya gunakan feedback seperti:

```text
Ayo coba lagi
Kita dengarkan sekali lagi
Ayo dengarkan bersama
```

Prompting bertujuan mendukung aktivitas, bukan menghukum kegagalan.

---

# 14. Flow UF-09 — Sound Discrimination

## Goal

Membantu anak mulai memahami bahwa dua suara dapat berbeda.

## Basic Flow

```text
Play Sound A
      ↓
Pause
      ↓
Play Sound B
      ↓
Child selects response
      ↓
Evaluate
      ↓
Prompt if needed
      ↓
Next Trial
```

## MVP Difficulty

Mulai dari stimulus dengan kontras tinggi.

Contoh:

```text
Drum
vs
Bell
```

atau:

```text
Long Sound
vs
Short Sound
```

Background noise tidak digunakan dalam MVP.

---

# 15. Flow UF-10 — Sound Association

## Goal

Membantu anak menghubungkan suara dengan sumber visual.

## MVP Interaction Type

Closed-set selection.

Example:

```text
Play:
"guk guk"

Display:

[ Dog ] [ Car ]

Child selects one image.
```

## Flow

```text
Play Familiar Sound
      ↓
Display Limited Visual Options
      ↓
Child Selects
      ↓
Evaluate
      ↓
Prompt if Needed
      ↓
Next Trial
```

Pilihan awal harus memiliki perbedaan visual dan makna yang jelas.

---

# 16. Flow UF-11 — Positive Feedback

## Goal

Menjaga pengalaman belajar tetap positif.

Feedback diberikan berdasarkan:

- partisipasi,
- penyelesaian aktivitas,
- willingness to try.

Bukan hanya berdasarkan jawaban benar.

Example:

```text
Trial Complete
      ↓
Positive Animation
      ↓
Continue
```

Tidak ada:

- leaderboard,
- negative point,
- life system,
- punishment,
- stressful countdown.

---

# 17. Flow UF-12 — Parent Observation

## Goal

Mengumpulkan konteks yang mungkin tidak terlihat dari data sistem.

## Entry Condition

Learning activity utama selesai.

## Example Question

```text
Apa yang Ayah/Bunda perhatikan selama sesi ini?
```

Possible answers:

```text
Anak sering merespons sendiri

Anak lebih sering merespons setelah suara diulang

Anak membutuhkan banyak bantuan

Anak tampak sulit mempertahankan perhatian
```

## Flow

```text
Activity Completed
      ↓
Parent Observation Screen
      ↓
Parent Selects Observation
      ↓
Submit
      ↓
Generate Session Summary
```

---

# 18. Flow UF-13 — Session Summary

## Goal

Memberikan ringkasan sederhana tanpa membuat interpretasi klinis.

## Summary Content

Contoh:

```text
Misi Hari Ini Selesai

Sound Detection
5 independent responses
2 prompted responses

Sound Discrimination
2 independent responses
2 required repetition
```

Narrative insight dapat berupa:

> Hari ini anak lebih sering merespons aktivitas deteksi suara tanpa bantuan dibanding aktivitas membedakan suara.

Harus selalu dipahami sebagai:

```text
performance during SiapSapa activities
```

bukan:

```text
clinical hearing assessment
```

---

# 19. Flow UF-14 — Progress Update

## Goal

Memperbarui learning state berdasarkan activity history.

## Input

Progression dapat menggunakan:

```text
independent_response
prompted_response
prompt_level
no_response
false_response
parent_observation
```

## Basic Flow

```text
Session Completed
      ↓
Aggregate Recent Activity Results
      ↓
Apply Progression Rules
      ↓
Update Learning State
      ↓
Determine Next Session Focus
```

---

# 20. Learning State

MVP dapat menggunakan state:

```text
Exploring
Practicing
Becoming Consistent
```

Example:

```text
Sound Detection
Becoming Consistent

Sound Discrimination
Exploring

Sound Association
Not Yet Focused
```

State tersebut bukan level kemampuan pendengaran secara klinis.

---

# 21. Flow UF-15 — Progress Page

## Goal

Membantu parent memahami aktivitas yang telah dilakukan dari waktu ke waktu.

## Progress Page May Show

- skill yang sedang dilatih,
- learning state,
- jumlah sesi,
- recent independent response pattern,
- prompt dependency,
- recent parent observations.

## Example

```text
Sound Detection
Becoming Consistent

Recent Sessions:
Session 1 → banyak bantuan
Session 2 → beberapa bantuan
Session 3 → lebih banyak independent response
```

Hindari istilah seperti:

```text
Hearing Score
Hearing Level
Clinical Improvement
```

---

# 22. Flow UF-16 — Return User

## Entry Condition

Parent sudah memiliki child profile.

## Flow

```text
Open SiapSapa
      ↓
Restore Parent Session
      ↓
Load Child Profile
      ↓
Home
      ↓
Today's Mission
```

Parent tidak perlu mengulang onboarding.

---

# 23. Flow UF-17 — Interrupted Session

## Scenario

Parent atau anak keluar dari sesi sebelum selesai.

## Desired Flow

```text
Session Interrupted
      ↓
Store Completed Trial Results
      ↓
Mark Session as Incomplete
```

Ketika parent kembali:

```text
Home
      ↓
Resume Session
OR
Start New Session
```

Behavior final terkait resume akan didefinisikan di functional requirements.

---

# 24. Flow UF-18 — Audio Playback Failure

Jika audio gagal dimainkan:

```text
Attempt Audio Playback
      ↓
Playback Error
      ↓
Do NOT count trial as child failure
      ↓
Show Parent Retry Option
      ↓
Retry or Skip Trial
```

Technical failure tidak boleh memengaruhi progress anak.

---

# 25. Flow UF-19 — No Child Response

Jika anak tidak merespons:

```text
Stimulus
    ↓
No Response
    ↓
Prompt Ladder
    ↓
Still No Response
    ↓
Record No Response
    ↓
Positive Neutral Feedback
    ↓
Continue or Parent Pause
```

Tidak ada negative child-facing message.

---

# 26. Flow UF-20 — Parent Pauses Session

Parent harus dapat menghentikan aktivitas sementara.

```text
Parent Pause
      ↓
Pause Audio / Activity
      ↓
Show Parent Controls
```

Options:

```text
Continue Session
End Session
```

Anak tidak kehilangan progress trial yang sudah selesai.

---

# 27. Flow UF-21 — Session End Early

Jika parent memilih mengakhiri sesi:

```text
End Session
      ↓
Save Completed Trials
      ↓
Mark Session Incomplete
      ↓
Optional Parent Observation
      ↓
Return Home
```

Incomplete session tidak boleh diperlakukan sebagai failed session.

---

# 28. Future Flow — Home Mission

**Priority:** P1

Setelah session summary:

```text
Session Summary
      ↓
Home Mission
      ↓
Parent reads simple offline activity
      ↓
Practice without screen
```

Example:

> Gunakan dua benda di rumah yang menghasilkan suara berbeda dan ajak anak memperhatikan kapan suara muncul.

Home Mission tidak wajib untuk MVP P0.

---

# 29. Navigation Rules

Child-facing activity tidak menampilkan navigation kompleks.

Parent dapat memiliki akses ke navigation utama melalui:

```text
Home
Progress
Parent Corner
```

Saat learning session aktif, navigation sekunder dapat disembunyikan untuk mengurangi gangguan.

Parent tetap membutuhkan cara yang jelas untuk:

```text
Pause
Exit
```

---

# 30. Responsive Behavior

Primary experience adalah mobile web.

Prioritas:

```text
Mobile
↓
Tablet
↓
Desktop
```

Learning activity harus tetap usable pada semua viewport yang didukung.

Child interaction harus menggunakan touch target besar dan tidak bergantung pada hover behavior.

---

# 31. End-to-End MVP Demo Flow

Flow berikut harus dapat didemonstrasikan secara penuh:

```text
Parent opens SiapSapa
        ↓
Creates child profile
        ↓
Child starting state:
New to Sound Recognition
        ↓
Parent starts Today's Mission
        ↓
Listening Setup
        ↓
Sound Detection Trial
        ↓
Child does not respond
        ↓
Prompting Ladder activated
        ↓
Child responds with assistance
        ↓
Next Detection Trial
        ↓
Sound Discrimination
        ↓
Early Sound Association
        ↓
Parent Observation
        ↓
Session Summary
        ↓
Progress Updated
        ↓
Next learning focus determined
```

---

# 32. Flow Principles

Semua user flow harus mengikuti prinsip berikut:

### FP-01

Parent tetap memiliki kontrol terhadap session.

### FP-02

Anak tidak menerima feedback negatif.

### FP-03

Technical error tidak boleh dicatat sebagai learning failure.

### FP-04

Prompting dilakukan sebelum suatu trial dianggap selesai tanpa respons.

### FP-05

Learning activity tidak dianggap sebagai clinical assessment.

### FP-06

Data yang dikumpulkan harus seminimal mungkin sesuai kebutuhan produk.

### FP-07

Complex instructions ditujukan kepada parent, bukan child.

---

# 33. Related Documents

Product direction:

```text
docs/PRD.md
```

Frontend behavior:

```text
docs/requirements/FRONTEND_REQUIREMENTS.md
```

Backend behavior:

```text
docs/requirements/BACKEND_REQUIREMENTS.md
```

Data structure:

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