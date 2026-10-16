# SiapSapa — Product Requirements Document

**Document:** PRD  
**Product:** SiapSapa  
**Version:** 0.1  
**Status:** MVP  
**Platform:** Responsive Web  
**Context:** JOINTS Hackathon 2026

---

# 1. Product Overview

## 1.1 Product Name

**SiapSapa**

## 1.2 Product Positioning

SiapSapa adalah **home learning companion** yang membantu orang tua mendampingi anak usia 4–6 tahun dengan gangguan pendengaran yang baru mulai mengenali suara.

Produk berfokus pada aktivitas pembelajaran auditori sederhana yang dapat dilakukan di rumah melalui permainan interaktif dan pendampingan orang tua.

SiapSapa bukan alat diagnosis, bukan tes pendengaran, dan bukan pengganti audiolog maupun terapis profesional.

---

# 2. Problem Statement

Anak dengan gangguan pendengaran yang baru mulai memperoleh akses terhadap suara membutuhkan latihan berulang untuk mulai:

- menyadari keberadaan suara,
- membedakan karakteristik suara,
- dan menghubungkan suara dengan sumber atau maknanya.

Di rumah, orang tua dapat memiliki keinginan untuk membantu proses tersebut tetapi belum tentu mengetahui:

- aktivitas apa yang sesuai dengan kemampuan anak,
- bagaimana memberikan bantuan ketika anak belum merespons,
- bagaimana menjaga latihan tetap menyenangkan,
- dan bagaimana memahami perkembangan aktivitas belajar anak dari waktu ke waktu.

SiapSapa bertujuan menyediakan pengalaman latihan yang **terstruktur, sederhana, adaptif, dan dapat dilakukan bersama orang tua di rumah**.

---

# 3. Product Vision

Membantu anak dengan gangguan pendengaran membangun fondasi kemampuan mendengar dan komunikasi sejak usia prasekolah melalui pengalaman belajar di rumah yang terarah dan didampingi keluarga.

---

# 4. Core Value Proposition

SiapSapa membantu orang tua mengubah waktu belajar di rumah menjadi aktivitas mendengar yang:

- mudah dilakukan,
- sesuai kemampuan awal anak,
- menyenangkan bagi anak,
- memberikan bantuan secara bertahap,
- dan memberikan gambaran sederhana mengenai aktivitas yang telah dilakukan.

---

# 5. Target Users

## 5.1 Primary User — Parent / Caregiver

Orang tua atau pengasuh menjadi pengguna utama aplikasi dan fasilitator aktivitas belajar.

### Characteristics

- memiliki anak usia sekitar 4–6 tahun,
- mendampingi anak dengan gangguan pendengaran,
- anak memiliki akses terhadap sebagian suara,
- dapat menggunakan smartphone atau browser modern,
- ingin melakukan aktivitas pembelajaran tambahan di rumah.

### Main Needs

Orang tua membutuhkan:

- panduan aktivitas yang jelas,
- aktivitas yang tidak membutuhkan pengetahuan klinis,
- bantuan dalam memilih latihan yang sesuai,
- cara sederhana untuk mengetahui aktivitas yang sudah dilakukan anak,
- ide latihan yang dapat dilakukan bersama anak.

---

## 5.2 End User — Child

Anak usia sekitar 4–6 tahun dengan gangguan pendengaran yang **baru mulai mengenali atau menyadari suara**.

Anak dapat memiliki akses terhadap suara melalui:

- sisa pendengaran,
- hearing aid,
- cochlear implant,
- atau teknologi pendengaran lain yang digunakan sesuai arahan profesional.

### Starting Ability

Target MVP terutama adalah anak yang:

- mulai memberikan respons terhadap beberapa suara,
- belum selalu konsisten dalam merespons suara,
- belum konsisten membedakan jenis suara,
- dan masih membutuhkan bantuan orang tua dalam aktivitas belajar.

### Main Needs

Anak membutuhkan pengalaman belajar yang:

- sederhana,
- visual,
- interaktif,
- tidak bergantung pada kemampuan membaca,
- tidak memberikan tekanan ketika salah,
- memungkinkan pengulangan,
- dan memberikan bantuan secara bertahap.

---

# 6. Product Goals

## G-01 — Structured Home Practice

Memberikan aktivitas latihan mendengar yang terstruktur dan mudah dijalankan orang tua di rumah.

---

## G-02 — Build Auditory Foundation

Memberikan aktivitas yang mendukung latihan:

1. Sound Detection
2. Sound Discrimination
3. Early Sound Association

---

## G-03 — Parent-Assisted Learning

Menjadikan orang tua sebagai bagian aktif dalam pengalaman belajar, bukan hanya pihak yang menyerahkan perangkat kepada anak.

---

## G-04 — Adaptive Learning Experience

Menyesuaikan tingkat aktivitas berdasarkan respons anak selama sesi menggunakan rule-based progression.

---

## G-05 — Positive Learning Experience

Menciptakan pengalaman belajar yang:

- tidak menghukum kesalahan,
- tidak menggunakan kompetisi,
- tidak menggunakan leaderboard,
- tidak menampilkan penilaian klinis,
- dan mendorong anak untuk terus mencoba.

---

## G-06 — Observable Learning Activity

Memberikan kepada orang tua ringkasan sederhana mengenai:

- aktivitas yang dilakukan,
- respons anak,
- tingkat bantuan yang dibutuhkan,
- dan area latihan berikutnya.

---

# 7. Learning Focus

Learning progression utama MVP:

```text
Sound Detection
      ↓
Sound Discrimination
      ↓
Early Sound Association
```

## 7.1 Sound Detection

Anak berlatih menyadari kapan suara muncul dan kapan tidak ada suara.

---

## 7.2 Sound Discrimination

Anak mulai membedakan dua suara dengan karakteristik yang kontras.

---

## 7.3 Early Sound Association

Anak mulai menghubungkan suara familiar dengan sumber atau objek yang sesuai.

---

# 8. Core Learning Loop

Pengalaman SiapSapa mengikuti loop:

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

Loop ini menjadi dasar pengalaman belajar dalam MVP.

---

# 9. Product Principles

## P-01 — Parent Guided

Aktivitas anak dirancang untuk dilakukan dengan pendampingan orang tua.

## P-02 — Child Friendly

Child-facing interface harus sederhana, visual, dan memiliki touch target besar.

## P-03 — No Punishment

Anak tidak mendapatkan penalti karena:

- salah menjawab,
- tidak merespons,
- atau membutuhkan bantuan.

## P-04 — Prompt Before Failure

Ketika anak kesulitan, sistem memberikan bantuan bertahap sebelum aktivitas dianggap selesai.

## P-05 — Progress, Not Diagnosis

Data aplikasi merepresentasikan **performa anak dalam aktivitas SiapSapa**, bukan kemampuan pendengaran secara klinis.

## P-06 — Minimal Sensitive Data

MVP hanya menyimpan data yang diperlukan untuk menjalankan pengalaman belajar.

---

# 10. MVP Scope

## 10.1 P0 — Core MVP

Fitur berikut harus tersedia pada MVP:

### Parent Experience

- Parent onboarding
- Child learning profile
- Listening setup
- Parent observation
- Session summary
- Progress overview

### Child Learning Experience

- Daily learning session
- Sound Detection activity
- Sound Discrimination activity
- Early Sound Association activity
- Prompting ladder
- Positive participation feedback

### Learning System

- Trial tracking
- Prompt level tracking
- Session tracking
- Rule-based progression
- Basic learning progress state

---

# 11. P1 — If Time Allows

Fitur berikut dapat dikembangkan setelah P0 selesai:

- Home Mission / offline parent activity
- Personalized content recommendation
- More stimulus categories
- Richer parent learning insights
- Expanded progress visualization

P1 tidak boleh menghambat penyelesaian fitur P0.

---

# 12. Out of Scope

Fitur berikut **tidak termasuk MVP**:

- hearing diagnosis,
- audiometry,
- hearing threshold estimation,
- hearing aid configuration,
- cochlear implant configuration,
- pronunciation scoring,
- automatic speech assessment,
- speech-to-text evaluation,
- child voice recording storage,
- clinical progress scoring,
- therapist dashboard,
- teletherapy,
- video consultation,
- AI conversational therapist,
- advanced machine-learning personalization,
- listening comprehension untuk kalimat kompleks,
- leaderboard atau competitive scoring.

---

# 13. Core User Journey

Alur utama MVP:

```text
Parent Onboarding
        ↓
Child Learning Profile
        ↓
Listening Setup
        ↓
Daily Session
        ↓
Learning Activity
        ↓
Prompting if Needed
        ↓
Parent Observation
        ↓
Session Summary
        ↓
Progress
        ↓
Next Session
```

Detail interaksi dijelaskan di:

```text
docs/USER_FLOWS.md
```

---

# 14. Prompting Concept

Ketika anak belum merespons stimulus, sistem tidak langsung menandainya gagal.

Contoh progression:

```text
Stimulus
   ↓
Independent Attempt
   ↓
Repeat Stimulus
   ↓
Visual Attention Cue
   ↓
Parent Assistance
```

Sistem dapat mencatat tingkat bantuan yang dibutuhkan untuk menyelesaikan aktivitas.

Prompting behavior detail akan didefinisikan dalam functional requirements.

---

# 15. Learning Progress Representation

Progress tidak ditampilkan sebagai nilai klinis.

Hindari representasi seperti:

```text
Hearing Score: 75%
Hearing Level: 4
Hearing improved by 30%
```

Gunakan state pembelajaran seperti:

```text
Exploring
Practicing
Becoming Consistent
```

Progress selalu memiliki konteks:

> performa dalam aktivitas SiapSapa.

---

# 16. Success Metrics

Success metrics MVP berfokus pada **product usability dan learning interaction**, bukan clinical outcome.

## SM-01 — Session Completion

Mengukur persentase sesi yang berhasil diselesaikan.

```text
completed sessions / started sessions
```

---

## SM-02 — Parent Usability

Orang tua dapat:

- memulai sesi,
- memahami instruksi,
- mendampingi anak,
- dan menyelesaikan sesi

tanpa membutuhkan bantuan langsung dari tim SiapSapa.

---

## SM-03 — Independent Response Tracking

Sistem dapat membedakan antara:

- independent response,
- prompted response,
- no response,
- false response.

---

## SM-04 — Prompt Dependency Tracking

Sistem dapat menunjukkan seberapa banyak bantuan yang diperlukan anak dalam aktivitas tertentu.

---

## SM-05 — Learning Activity Progress

Sistem dapat menunjukkan perubahan performa aktivitas dari beberapa sesi, misalnya:

```text
lebih banyak independent response

atau

lebih sedikit prompt yang dibutuhkan
```

Interpretasi tersebut hanya berlaku dalam konteks aktivitas SiapSapa.

---

## SM-06 — Parent Understanding

Setelah sesi, orang tua dapat memahami:

- apa yang sedang dilatih,
- apa yang dilakukan anak,
- dan aktivitas apa yang akan dilanjutkan.

---

# 17. MVP Validation Goals

Hackathon MVP harus membuktikan bahwa:

### V-01

Orang tua dapat memahami konsep SiapSapa tanpa penjelasan panjang.

### V-02

Anak dapat berinteraksi dengan learning activity menggunakan UI sederhana.

### V-03

Prompting ladder dapat diterapkan dalam pengalaman game.

### V-04

Sistem dapat menyimpan hasil trial dan session.

### V-05

Sistem dapat menghasilkan progress berdasarkan aktivitas sebelumnya.

### V-06

Learning progression dapat berjalan menggunakan deterministic rule-based logic tanpa membutuhkan machine learning.

---

# 18. Safety & Product Boundaries

SiapSapa tidak boleh:

- memberikan diagnosis,
- menyimpulkan tingkat gangguan pendengaran,
- merekomendasikan pengaturan perangkat pendengaran,
- mengklaim peningkatan kemampuan pendengaran secara klinis,
- mengubah volume perangkat secara otomatis,
- merekam suara anak tanpa kebutuhan produk yang disetujui.

Jika ditemukan indikasi kesulitan selama aktivitas, produk hanya dapat memberikan arahan umum seperti:

> pertimbangkan untuk mendiskusikan perkembangan anak dengan profesional yang mendampingi.

---

# 19. Platform

MVP dikembangkan sebagai:

**Responsive Web Application**

Prioritas viewport:

1. mobile web,
2. tablet,
3. desktop.

Produk dapat dipersiapkan agar PWA-ready, tetapi kemampuan offline penuh bukan requirement MVP.

---

# 20. Product Constraints

MVP harus:

- dapat dijalankan pada browser modern,
- memiliki child-facing UI yang sederhana,
- mendukung touch interaction,
- tidak bergantung pada microphone,
- menggunakan audio sebagai learning stimulus,
- tidak memerlukan perangkat tambahan selain perangkat pendengaran yang memang biasa digunakan anak,
- tetap dapat dikembangkan setelah hackathon tanpa perlu melakukan rewrite arsitektur utama.

---

# 21. Key Assumptions

Beberapa asumsi yang masih perlu divalidasi:

- orang tua membutuhkan panduan tambahan untuk latihan di rumah,
- aktivitas berbasis permainan dapat meningkatkan keterlibatan anak,
- sesi singkat lebih sesuai untuk penggunaan rutin di rumah,
- parent observation dapat memberikan konteks tambahan terhadap data sistem,
- rule-based adaptation cukup untuk MVP,
- stimulus audio dan aktivitas perlu ditinjau bersama pihak yang memiliki kompetensi terkait sebelum digunakan dalam konteks nyata.

Asumsi tersebut bukan dianggap sebagai clinical evidence.

---

# 22. Future Direction

Setelah MVP tervalidasi, SiapSapa dapat berkembang menuju:

```text
Sound Detection
      ↓
Sound Discrimination
      ↓
Sound Association
      ↓
Sound Identification
      ↓
Listening Comprehension
      ↓
Early Spoken Language Practice
```

Kemungkinan pengembangan selanjutnya:

- richer home activities,
- professional collaboration,
- personalized learning plans,
- speech practice,
- therapist-supported programs,
- additional accessibility pathways.

Fitur tersebut bukan bagian dari MVP saat ini.

---

# 23. Related Documents

Detail implementasi tidak ditulis seluruhnya di PRD.

Gunakan dokumen berikut:

```text
docs/USER_FLOWS.md
```

Untuk detail perjalanan pengguna.

```text
docs/requirements/FRONTEND_REQUIREMENTS.md
```

Untuk frontend functional requirements.

```text
docs/requirements/BACKEND_REQUIREMENTS.md
```

Untuk backend functional requirements.

```text
docs/DATA_MODEL.md
```

Untuk entity, relationship, field, dan enum.

```text
docs/TECH_SPEC.md
```

Untuk technical architecture dan engineering conventions.

```text
docs/DECISIONS.md
```

Untuk keputusan produk dan engineering yang perlu dipertahankan lintas sesi.

---

# 24. MVP Definition of Success

MVP SiapSapa dianggap berhasil apabila tim dapat mendemonstrasikan end-to-end flow berikut:

```text
Parent creates child learning profile
        ↓
Parent prepares listening session
        ↓
Child completes Sound Detection activity
        ↓
Child receives progressive prompts when needed
        ↓
Child completes Discrimination / Association activities
        ↓
System records trial results
        ↓
Parent submits observation
        ↓
System generates session summary
        ↓
Progress is updated
        ↓
System determines an appropriate next learning activity
```

Keberhasilan MVP menunjukkan bahwa **product learning loop dapat berjalan secara end-to-end**, bukan bahwa SiapSapa telah membuktikan efektivitas klinis.