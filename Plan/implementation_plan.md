# Implementation Plan: Website Tes 4 Persona Vundiego

Platform tes kepribadian berbasis 4 elemen (Api, Air, Angin, Tanah) yang berfungsi
sebagai alat lead generation dan konversi penjualan parfum Vundiego. Dibangun dengan
arsitektur fullstack modern: React (Frontend) + NestJS (Backend) + PostgreSQL.

---

## User Review Required

> [!IMPORTANT]
> **Konfirmasi Mapping Parfum ke Elemen**
> Mapping berikut dibuat berdasarkan analisis karakteristik parfum. Mohon dikonfirmasi sebelum konten ditulis:
> - 🔥 **API** → Choleric *(Bold, Intense, Passionate)*
> - 💧 **AIR** → Melancholic *(Deep, Poetic, Introspective)*
> - 🌬 **ANGIN** → Sanguine *(Bright, Zesty, Uplifting)*
> - 🌿 **TANAH** → Phlegmatic *(Calm, Soothing, Balanced)*

> [!WARNING]
> **Konten Belum Tersedia**
> Seluruh konten (bank soal, deskripsi persona, link toko, teks email) **belum ada**.
> Development akan berjalan dengan *placeholder content* terlebih dahulu. Konten final
> diisi melalui Admin CMS setelah backend siap.

---

## Open Questions

> [!IMPORTANT]
> **Statistik "Total Pengunjung"** — Apakah menggunakan:
> - (A) Counter server-side sederhana di NestJS (simpel, akurat untuk unique sessions), atau
> - (B) Integrasi analytics pihak ketiga seperti Plausible/Umami (lebih detail, butuh setup tambahan)?
> Rekomendasi: pilihan **(A)** untuk efisiensi, bisa upgrade nanti.

> [!IMPORTANT]
> **Fitur Share Social Media** — Apakah kartu visual share:
> - (A) Di-generate di *frontend* (html2canvas → download/share), lebih sederhana, atau
> - (B) Di-generate di *backend* sebagai gambar PNG via API endpoint, lebih robust untuk OG meta?
> Rekomendasi: pilihan **(A)** untuk fase pertama, upgrade ke (B) jika dibutuhkan.

> [!NOTE]
> **Soal Penutup (Soal ke-25)** — Teks soal survei final masih perlu dikonfirmasi tim.
> Sementara akan menggunakan placeholder yang bisa diedit via admin panel.

---

## Proposed Changes

Pengerjaan dibagi menjadi **8 Fase** dengan pendekatan **fullstack paralel per fitur**
(Frontend dan Backend dikerjakan bersamaan untuk setiap fitur/halaman).

```
Timeline Fase:
Fase 0 → Setup & Konfigurasi
Fase 1 → Design System & Layout Dasar
Fase 2 → Autentikasi (Auth)
Fase 3 → Homepage
Fase 4 → Antarmuka Tes (Test Interface)
Fase 5 → Skoring, Teaser & Laporan (Report)
Fase 6 → Admin Dashboard
Fase 7 → Fitur Tambahan & Polish
Fase 8 → Deployment & Finalisasi
```

---

### Struktur Folder Proyek

```
4Persona/
├── Plan/                          ← Dokumen perencanaan (sudah ada)
├── frontend/                      ← React App (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                ← Gambar, icon, font
│   │   ├── components/            ← Komponen reusable
│   │   │   ├── ui/                ← Button, Input, Card, Modal, dll
│   │   │   ├── layout/            ← Navbar, Footer, PageWrapper
│   │   │   └── charts/            ← RadarChart
│   │   ├── pages/                 ← Halaman-halaman utama
│   │   │   ├── HomePage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── TestPage.jsx
│   │   │   ├── TeaserPage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminQuestions.jsx
│   │   │       └── AdminReports.jsx
│   │   ├── hooks/                 ← Custom React hooks
│   │   ├── contexts/              ← AuthContext, dll
│   │   ├── services/              ← API call functions (axios)
│   │   ├── utils/                 ← Helper functions
│   │   ├── styles/                ← index.css, tokens, global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/                       ← NestJS App
    ├── src/
    │   ├── auth/                  ← Module autentikasi
    │   │   ├── auth.module.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── strategies/
    │   │   │   ├── jwt.strategy.ts
    │   │   │   └── google.strategy.ts
    │   │   └── guards/
    │   ├── users/                 ← Module user
    │   ├── questions/             ← Module bank soal
    │   ├── tests/                 ← Module tes & skoring
    │   ├── reports/               ← Module rapot & template
    │   ├── admin/                 ← Module admin
    │   ├── email/                 ← Module Brevo email
    │   ├── storage/               ← Module Supabase Storage
    │   ├── metrics/               ← Module statistik homepage
    │   ├── prisma/                ← PrismaService
    │   ├── common/                ← Guards, decorators, interceptors
    │   ├── app.module.ts
    │   └── main.ts
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts                ← Seed data awal
    ├── .env
    └── package.json
```

---

### FASE 0 — Project Setup & Konfigurasi

**Tujuan**: Menyiapkan seluruh boilerplate, environment, dan koneksi layanan eksternal.

---

#### [NEW] `frontend/` — Inisialisasi React App dengan Vite
- `npx create-vite@latest frontend --template react`
- Install dependencies:
  - `axios` (HTTP client)
  - `react-router-dom` (routing)
  - `framer-motion` (animasi UI tes & transisi)
  - `three` + `@react-three/fiber` + `@react-three/drei` (animasi 3D homepage)
  - `recharts` atau `chart.js` (Radar Chart di rapot)
  - `react-hook-form` (form handling)
  - `html2canvas` (share social media — opsi A)

#### [NEW] `backend/` — Inisialisasi NestJS App
- `npx @nestjs/cli new backend`
- Install dependencies:
  - `@nestjs/passport`, `passport`, `passport-jwt`, `passport-google-oauth20`
  - `@nestjs/jwt`
  - `@prisma/client`, `prisma`
  - `bcrypt` (hashing password)
  - `@nestjs-modules/mailer`, `nodemailer` (email via Brevo SMTP)
  - `@supabase/supabase-js` (Supabase Storage)
  - `class-validator`, `class-transformer` (validasi DTO)
  - `uuid`, `crypto` (generate token rapot)

#### [NEW] `backend/prisma/schema.prisma` — Skema Database Lengkap

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ElementType {
  API
  AIR
  ANGIN
  TANAH
}

model User {
  id          String       @id @default(uuid())
  email       String       @unique
  name        String
  googleId    String?      @unique
  password    String?
  isAdmin     Boolean      @default(false)
  createdAt   DateTime     @default(now())
  testResults TestResult[]
}

model Question {
  id        String         @id @default(uuid())
  text      String
  element   ElementType
  isActive  Boolean        @default(true)
  options   AnswerOption[]
  createdAt DateTime       @default(now())
}

model AnswerOption {
  id         String      @id @default(uuid())
  questionId String
  question   Question    @relation(fields: [questionId], references: [id], onDelete: Cascade)
  text       String
  targetType ElementType
}

model TestResult {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  scoreApi        Int
  scoreAir        Int
  scoreAngin      Int
  scoreTanah      Int
  personaPrimer   ElementType
  personaSekunder ElementType
  surveySource    String
  surveyRelate    String?
  feedbackRating  Int?
  feedbackText    String?
  reportToken     String      @unique
  reportTokenExp  DateTime
  createdAt       DateTime    @default(now())
}

model SystemMetric {
  id               Int @id @default(1)
  manualSalesCount Int @default(0)
  totalVisitors    Int @default(0)
}

model ReportTemplate {
  id               ElementType @id
  parfumName       String
  descriptionPlus  String      @db.Text
  descriptionMinus String      @db.Text
  backgroundImage  String
  shopeeLink       String?
  tiktokLink       String?
  instagramLink    String?
  updatedAt        DateTime    @updatedAt
}
```

#### [NEW] `backend/.env` — Environment Variables
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
BREVO_API_KEY=...
BREVO_FROM_EMAIL=noreply@vundiego.com
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
FRONTEND_URL=http://localhost:5173
REPORT_TOKEN_EXPIRY_DAYS=30
```

---

### FASE 1 — Design System & Layout Dasar

**Tujuan**: Membangun fondasi visual yang konsisten dengan brand Vundiego (Quiet Luxury).

---

#### [NEW] `frontend/src/styles/index.css` — Design Tokens & Global Styles

Token warna, tipografi, spacing, dan animasi global:
```css
:root {
  /* Brand Colors */
  --color-bg: #f9f8f6;        /* Cream (dari vundiego.com) */
  --color-surface: #f0ede8;
  --color-dark: #1a1a1a;
  --color-text: #2d2d2d;
  --color-muted: #6b6b6b;
  --color-border: rgba(0,0,0,0.08);

  /* Elemen Colors */
  --color-api: #c0392b;       /* Api — Merah bara */
  --color-api-light: #f5e6e4;
  --color-air: #1a3a5c;       /* Air — Biru tua */
  --color-air-light: #e4ecf5;
  --color-angin: #c8a84b;     /* Angin — Kuning lembut/gold */
  --color-angin-light: #f7f2e4;
  --color-tanah: #4a6741;     /* Tanah — Hijau tua */
  --color-tanah-light: #e8f0e6;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Playfair Display', serif;
  --tracking-wide: 0.15em;

  /* Spacing & Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-card: 20px;
}
```

#### [NEW] `frontend/src/components/ui/` — Komponen UI Dasar
- `Button.jsx` — Primary, Secondary, Ghost variants + loading state
- `Input.jsx` — Text, Email, Password dengan label & error state
- `Card.jsx` — Surface card dengan shadow & hover effect
- `Modal.jsx` — Overlay modal dengan animasi masuk/keluar
- `Badge.jsx` — Label elemen (Api/Air/Angin/Tanah) dengan warna masing-masing
- `LoadingScreen.jsx` — Loading screen tematik elemen (digunakan saat transisi)
- `Spinner.jsx` — Loading spinner animasi

#### [NEW] `frontend/src/components/layout/` — Layout Komponen
- `Navbar.jsx` — Header dengan logo Vundiego + navigasi + avatar user
- `Footer.jsx` — Footer minimal sesuai brand
- `PageWrapper.jsx` — Wrapper dengan padding & max-width konsisten

---

### FASE 2 — Autentikasi (Auth)

**Tujuan**: Sistem login/daftar dual-method (Email+Password & Google OAuth) dengan JWT.

---

#### Backend — Auth Module

#### [NEW] `backend/src/auth/auth.module.ts`
Konfigurasi Passport strategies, JWT module, dan Google OAuth.

#### [NEW] `backend/src/auth/auth.controller.ts`
Endpoint:
```
POST /auth/register          → Daftar email+password
POST /auth/login             → Login email+password → return JWT
GET  /auth/google            → Redirect ke Google OAuth
GET  /auth/google/callback   → Callback dari Google → return JWT
GET  /auth/me                → Get profil user saat ini (butuh JWT)
POST /auth/logout            → (Opsional) invalidate token
```

#### [NEW] `backend/src/auth/auth.service.ts`
- `register()`: validasi email unik → hash password (bcrypt) → simpan User → return JWT
- `login()`: cari user by email → verify password → return JWT
- `googleCallback()`: cari/buat user berdasarkan googleId → merge akun jika email sama → return JWT
- `getProfile()`: decode JWT → return data user

#### [NEW] `backend/src/auth/strategies/jwt.strategy.ts`
Validasi JWT token di setiap request yang membutuhkan autentikasi.

#### [NEW] `backend/src/auth/strategies/google.strategy.ts`
Konfigurasi Passport Google OAuth2 dengan scope email & profile.

#### [NEW] `backend/src/auth/guards/`
- `JwtAuthGuard` — Guard untuk protected routes
- `AdminGuard` — Guard khusus admin (cek field `isAdmin` di User)

---

#### Frontend — Auth Pages

#### [NEW] `frontend/src/pages/AuthPage.jsx`
- Tab **"Masuk"** dan **"Daftar"** dalam satu halaman
- Form Daftar: Nama, Email, Password, Konfirmasi Password
- Form Masuk: Email, Password
- Tombol "Lanjutkan dengan Google" (trigger OAuth flow)
- Desain: Minimalis luxury, konsisten dengan brand
- Validasi form real-time (react-hook-form)
- Error handling: tampilkan pesan error dari API

#### [NEW] `frontend/src/contexts/AuthContext.jsx`
- Global state: user data, token, isLoggedIn
- Helper: `login()`, `logout()`, `refreshUser()`
- Auto-read token dari localStorage saat app load

#### [NEW] `frontend/src/services/authService.js`
- `register(data)` → `POST /auth/register`
- `login(data)` → `POST /auth/login`
- `getMe()` → `GET /auth/me`
- `loginWithGoogle()` → redirect ke `GET /auth/google`

---

### FASE 3 — Homepage

**Tujuan**: Halaman utama yang visually stunning dengan animasi 4 elemen & statistik real-time.

---

#### Backend — Metrics API

#### [NEW] `backend/src/metrics/metrics.controller.ts`
```
GET /metrics/public    → Return semua 4 statistik homepage (public, no auth)
```

#### [NEW] `backend/src/metrics/metrics.service.ts`
- `getPublicMetrics()`:
  - `totalVisitors`: baca dari `SystemMetric.totalVisitors`
  - `totalTests`: `prisma.testResult.count()`
  - `totalSales`: `SystemMetric.manualSalesCount`
  - `dominantElement`: query groupBy `personaPrimer`, ambil yang terbanyak
- Hasil di-cache 5 menit (menggunakan in-memory cache sederhana atau `@nestjs/cache-manager`)

#### [MODIFY] `backend/src/app.module.ts`
- Tambahkan middleware counter visitor: setiap request ke `/` increment `SystemMetric.totalVisitors`

---

#### Frontend — Homepage

#### [NEW] `frontend/src/pages/HomePage.jsx`
Struktur section:

1. **Hero Section** — Full-screen, Three.js canvas background
2. **Statistics Section** — 4 kartu statistik
3. **CTA Section** — Tombol "Cek Persona Kamu Secara Gratis"
4. **Teaser Elemen Section** — Preview 4 persona (Api, Air, Angin, Tanah)

#### [NEW] `frontend/src/components/ElementBackground.jsx`
- Three.js / React Three Fiber canvas sebagai background Hero
- Animasi partikel/abstrak 4 elemen secara interaktif
- Fallback: animasi CSS/gradient jika Three.js terlalu berat
- Responsif dan tidak memblokir interaksi UI

#### [NEW] `frontend/src/components/StatsCard.jsx`
- Kartu statistik dengan animasi angka counting-up saat pertama muncul
- 4 varian: Pengunjung, Pengguna Tes, Pembelian Parfum, Elemen Dominan
- Data di-fetch dari `GET /metrics/public`

---

### FASE 4 — Antarmuka Tes (Test Interface)

**Tujuan**: Experience tes yang immersive dengan visual tumpukan kartu folder + animasi Framer Motion.

---

#### Backend — Questions Module

#### [NEW] `backend/src/questions/questions.controller.ts`
```
GET  /questions/session     → Tarik 25 soal untuk sesi tes (butuh JWT user)
GET  /questions             → List semua soal (butuh JWT admin)
POST /questions             → Buat soal baru (butuh JWT admin)
PUT  /questions/:id         → Edit soal (butuh JWT admin)
DELETE /questions/:id       → Hapus soal (butuh JWT admin)
PATCH /questions/:id/toggle → Toggle isActive (butuh JWT admin)
```

#### [NEW] `backend/src/questions/questions.service.ts`
- `getSessionQuestions()`:
  ```
  1. Tarik 6 soal random WHERE element=API AND isActive=true
  2. Tarik 6 soal random WHERE element=AIR AND isActive=true
  3. Tarik 6 soal random WHERE element=ANGIN AND isActive=true
  4. Tarik 6 soal random WHERE element=TANAH AND isActive=true
  5. Tambahkan 1 soal penutup (hardcoded atau dari tabel khusus)
  6. Shuffle seluruh 24 soal kepribadian
  7. Append soal penutup di posisi terakhir (ke-25)
  8. Return array 25 soal
  ```
- CRUD operations untuk admin

#### [NEW] `backend/src/questions/dto/`
- `CreateQuestionDto`: text, element, options[]
- `UpdateQuestionDto`: partial dari CreateQuestionDto

---

#### Frontend — Test Interface

#### [NEW] `frontend/src/pages/TestPage.jsx`
- Protected route: cek JWT, redirect ke `/auth` jika belum login
- Fetch soal dari `GET /questions/session` saat halaman load
- Kelola state: soal saat ini (index), jawaban yang terkumpul

#### [NEW] `frontend/src/components/QuestionCard.jsx`
Komponen kartu soal individual:
- Tampilkan teks pertanyaan
- 4 opsi jawaban (tombol pilihan)
- Nomor soal & progress bar
- Desain: kartu fisik dengan shadow, texture kertas halus

#### [NEW] `frontend/src/components/CardStack.jsx`
Komponen tumpukan kartu (core visual):
- Render 3-4 kartu teratas dari tumpukan
- Kartu terdepan: aktif, fully visible
- Kartu di belakang: sedikit offset dan scaled-down
- Animasi saat jawaban dipilih:
  - Kartu aktif slide keluar (ke kiri/kanan/atas)
  - Kartu berikutnya naik ke posisi terdepan
  - Framer Motion `AnimatePresence` + `motion.div`

#### [NEW] `frontend/src/components/LoadingTransition.jsx`
Loading screen tematik elemen:
- Muncul setelah login sebelum soal pertama tampil
- Animasi partikel/elemen yang relevan dengan brand
- Durasi: ~2 detik

---

### FASE 5 — Skoring, Teaser & Halaman Rapot

**Tujuan**: Proses hasil tes, kirim email, tampilkan teaser, dan render halaman rapot lengkap.

---

#### Backend — Tests Module

#### [NEW] `backend/src/tests/tests.controller.ts`
```
POST /tests/submit          → Submit jawaban, hitung skor (butuh JWT user)
GET  /tests/report/:token   → Ambil data rapot via token (public, cek expiry)
GET  /tests/history         → Riwayat tes user yang login (butuh JWT user)
```

#### [NEW] `backend/src/tests/tests.service.ts`

`submitTest(userId, answers[])`:
```
1. Validasi: 25 jawaban masuk semua
2. Hitung skor:
   - scoreApi = count(answers where targetType=API)
   - scoreAir = count(answers where targetType=AIR)
   - scoreAngin = count(answers where targetType=ANGIN)
   - scoreTanah = count(answers where targetType=TANAH)
3. Tentukan personaPrimer (skor tertinggi)
4. Tentukan personaSekunder (skor tertinggi kedua)
5. Tie-breaker: jika skor sama → urutan hierarki: API > AIR > ANGIN > TANAH
6. Generate reportToken (crypto.randomUUID())
7. Set reportTokenExp = now + 30 hari
8. Simpan TestResult ke database
9. Trigger emailService.sendReportEmail(user.email, reportToken)
10. Return { personaPrimer, personaSekunder, reportToken }
```

`getReport(token)`:
```
1. Cari TestResult WHERE reportToken=token
2. Cek apakah reportTokenExp > now (belum expired)
3. Jika expired → throw 410 Gone
4. Fetch ReportTemplate untuk personaPrimer dan personaSekunder
5. Return data rapot lengkap
```

#### [NEW] `backend/src/email/email.service.ts`
- `sendReportEmail(email, reportToken)`:
  - Buat URL: `${FRONTEND_URL}/report/${reportToken}`
  - Kirim via Brevo SMTP/API
  - Template: HTML email dengan link rapot yang jelas & branded

---

#### Frontend — Teaser & Report

#### [NEW] `frontend/src/pages/TeaserPage.jsx`
- Muncul segera setelah submit berhasil
- Tampilkan animasi reveal nama persona primer
- Teks: *"Selamat! Persona utamamu adalah [ELEMEN]. Cek email kamu sekarang!"*
- Tombol: "Lihat Profil" + "Tes Lagi"
- Warna background menyesuaikan elemen persona

#### [NEW] `frontend/src/pages/ReportPage.jsx`
- Route: `/report/:token`
- Fetch data dari `GET /tests/report/:token`
- Handle state: loading, expired (tampilkan halaman expired + CTA login), error

Konten Rapot:
1. **Header** — Nama persona + elemen + ilustrasi
2. **Radar Chart** — Visualisasi skor 4 elemen
3. **Blok Persona Primer** — Nama parfum, kelebihan, kekurangan
4. **Blok Persona Sekunder** — Struktur sama
5. **Tombol Beli** — TikTok, Instagram, Shopee (dari ReportTemplate)
6. **Form Feedback** — Rating 1-5 + komentar teks
7. **Tombol Share** — Share ke social media

#### [NEW] `frontend/src/components/charts/RadarChart.jsx`
- Library: Recharts `RadarChart` atau Chart.js
- Data: { api, air, angin, tanah } dari hasil tes
- Desain: Warna masing-masing elemen, tanpa gridlines berlebihan

#### [NEW] `frontend/src/components/ShareCard.jsx`
- Generate kartu visual untuk di-share ke social media
- Menggunakan html2canvas untuk export sebagai gambar PNG
- Konten kartu: Logo Vundiego + nama persona + elemen + kutipan singkat

---

### FASE 6 — Admin Dashboard

**Tujuan**: Panel kontrol penuh untuk admin mengelola soal, rapot, dan memantau statistik.

---

#### Backend — Admin Module

#### [NEW] `backend/src/admin/admin.controller.ts`
```
GET  /admin/stats              → Statistik dashboard (grafik, total, dll)
PUT  /admin/metrics/sales      → Update angka penjualan manual
```

#### [NEW] `backend/src/reports/reports.controller.ts`
```
GET  /reports/templates        → Ambil semua ReportTemplate (4 elemen)
PUT  /reports/templates/:element → Update teks deskripsi persona
POST /reports/templates/:element/image → Upload gambar latar
```

#### [NEW] `backend/src/storage/storage.service.ts`
- `uploadImage(file, bucket)`: Upload ke Supabase Storage → return public URL
- Validasi: hanya menerima file gambar (jpg, png, webp), max 5MB

---

#### Frontend — Admin Pages

#### [NEW] `frontend/src/pages/admin/AdminDashboard.jsx`
- Protected: hanya user dengan `isAdmin=true`
- Komponen:
  - Grafik pendaftar harian (line chart)
  - Kartu total: user, tes selesai, elemen dominan
  - Pie chart perbandingan elemen
  - Input angka penjualan manual + tombol simpan

#### [NEW] `frontend/src/pages/admin/AdminQuestions.jsx`
- Tabel daftar soal dengan filter per elemen + toggle aktif/nonaktif
- Tombol Tambah Soal → modal/form
- Form soal:
  - Textarea teks pertanyaan
  - Dropdown pilih elemen (API/AIR/ANGIN/TANAH)
  - 4 input opsi jawaban + dropdown elemen target per opsi
  - Tombol Simpan / Batal
- Tombol Edit & Hapus per soal

#### [NEW] `frontend/src/pages/admin/AdminReports.jsx`
- 4 tab/kartu (satu per elemen)
- Per elemen:
  - Nama parfum (display only, bisa diedit)
  - Textarea kelebihan persona (editable)
  - Textarea kekurangan persona (editable)
  - Input link Shopee, TikTok, Instagram
  - Upload foto latar rapot (preview + tombol upload)
  - Tombol Simpan

---

### FASE 7 — Fitur Tambahan & Polish

**Tujuan**: Menambahkan fitur form feedback, share social media, halaman profil user, dan polish visual.

---

#### [NEW] `frontend/src/pages/ProfilePage.jsx`
- Protected route (butuh login)
- Tampilkan:
  - Nama & email user
  - Daftar riwayat tes (tanggal + persona primer + persona sekunder)
  - Tiap riwayat: tombol "Lihat Rapot" → link ke `/report/:token`
  - Jika token expired: arahkan ke halaman rapot dengan pesan expired

#### [MODIFY] `frontend/src/pages/ReportPage.jsx`
- Integrasi Form Feedback:
  - Rating bintang 1-5
  - Textarea komentar opsional
  - Submit ke `PATCH /tests/:id/feedback`
  - Setelah submit: sembunyikan form, tampilkan ucapan terima kasih

#### [NEW] `backend/src/tests/tests.controller.ts`
```
PATCH /tests/:id/feedback   → Simpan feedback rating & teks (butuh JWT user)
```

#### Polish Visual — Keseluruhan
- Loading skeleton untuk semua halaman yang fetch data
- Error boundary untuk handle crash gracefully
- Animasi page transition (Framer Motion `AnimatePresence` di level router)
- Responsive design: Mobile-first, breakpoint tablet & desktop
- Preloader animasi saat pertama buka website (mengikuti gaya vundiego.com)
- Scroll progress bar (opsional, sesuai brand vundiego.com)

---

### FASE 8 — Deployment & Finalisasi

**Tujuan**: Deploy ke production, setup CI/CD, dan final testing.

---

#### [NEW] `frontend/vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### Setup Vercel (Frontend)
- Connect repo GitHub → auto deploy dari branch `main`
- Set environment variable: `VITE_API_URL=https://api.vundiego-test.com`

#### Setup Railway/Render (Backend)
- Deploy NestJS dari repo
- Set semua environment variables
- Run `prisma migrate deploy` saat startup

#### Setup Database (Neon.tech atau Supabase)
- Buat project PostgreSQL
- Jalankan `prisma migrate dev` → buat semua tabel
- Jalankan `prisma db seed` → isi data awal (4 ReportTemplate placeholder, SystemMetric)

#### Setup Brevo
- Buat akun Brevo → dapatkan API key
- Verifikasi domain pengirim email
- Buat template email HTML untuk rapot

#### [NEW] `backend/prisma/seed.ts`
Data awal yang diperlukan:
- 4 `ReportTemplate` (satu per elemen) dengan teks & image placeholder
- 1 `SystemMetric` (id=1, manualSalesCount=0, totalVisitors=0)
- 1 User admin: `{ email: admin@vundiego.com, isAdmin: true }`

---

## Verification Plan

### Automated / Manual Testing Per Fase

#### Auth
- [ ] Register dengan email baru → JWT diterima
- [ ] Login email yang sudah ada → JWT diterima
- [ ] Login Google → redirect & JWT diterima
- [ ] Daftar email yang sama dua kali → error 409
- [ ] Akses protected route tanpa JWT → 401 Unauthorized
- [ ] Akses admin route sebagai user biasa → 403 Forbidden

#### Test Flow
- [ ] Fetch `/questions/session` → terima 25 soal (24 kepribadian + 1 penutup)
- [ ] Cek proporsi: 6 soal per elemen (API/AIR/ANGIN/TANAH)
- [ ] Submit semua jawaban → TestResult tersimpan di DB
- [ ] Email terkirim ke inbox user setelah submit
- [ ] Link di email mengarah ke `/report/:token` yang valid

#### Scoring
- [ ] Jawab semua 24 soal dengan elemen API → personaPrimer=API
- [ ] Tie-breaker: skor API=6, AIR=6 → personaPrimer=API (sesuai hierarki)
- [ ] Report token expired setelah 30 hari → endpoint return 410

#### Report Page
- [ ] Buka link dengan token valid → rapot tampil lengkap
- [ ] Radar Chart render dengan data yang benar
- [ ] Link Shopee/TikTok/Instagram mengarah ke URL yang benar
- [ ] Submit feedback → tersimpan di database
- [ ] Share button → generate gambar PNG dapat didownload

#### Admin Dashboard
- [ ] Login sebagai admin → akses `/admin`
- [ ] Tambah soal baru → muncul di daftar soal
- [ ] Toggle soal nonaktif → tidak muncul di session tes
- [ ] Update angka penjualan → update di homepage
- [ ] Upload gambar latar → URL baru tersimpan, preview rapot berubah

#### Responsive
- [ ] Homepage tampil baik di mobile (375px), tablet (768px), desktop (1280px)
- [ ] Antarmuka tes dapat dimainkan di mobile
- [ ] Halaman rapot mudah dibaca di mobile

### Performance Check
- [ ] Waktu load homepage < 3 detik
- [ ] Animasi Three.js tidak drop frame di device mid-range
- [ ] Query fetch soal < 500ms

---

## Urutan Pengerjaan yang Direkomendasikan

```
Fase 0: Setup (1-2 hari)
  ↓
Fase 1: Design System (1-2 hari)
  ↓
Fase 2: Auth (2-3 hari)         ← Fondasi, semua fitur lain bergantung ini
  ↓
Fase 3: Homepage (2-3 hari)     ← Bisa demo ke klien
  ↓
Fase 4: Test Interface (3-4 hari) ← Core fitur utama
  ↓
Fase 5: Scoring & Rapot (3-4 hari) ← Alur konversi utama
  ↓
Fase 6: Admin Dashboard (3-4 hari) ← Bisa mulai isi konten
  ↓
Fase 7: Polish & Fitur Tambahan (2-3 hari)
  ↓
Fase 8: Deployment (1-2 hari)
```

**Estimasi Total**: ~20-25 hari kerja (pengerjaan penuh, satu developer)
