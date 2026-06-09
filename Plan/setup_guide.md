# 🔧 Panduan Setup Layanan Eksternal
## Website Tes 4 Persona Vundiego

Dokumen ini memandu kamu langkah demi langkah untuk mendapatkan semua
credential yang dibutuhkan untuk mengisi file `.env` backend.

---

> [!NOTE]
> **Urutan yang disarankan:**
> 1. Supabase (Database + Storage) — paling penting, tanpa ini database tidak bisa jalan
> 2. Google OAuth — untuk fitur "Login dengan Google"
> 3. Brevo — untuk fitur kirim email laporan otomatis

---

## BAGIAN 1 — Supabase (Database PostgreSQL + File Storage)

Supabase digunakan untuk **dua hal** dalam proyek ini:
- **Database PostgreSQL** — menyimpan semua data (user, soal, hasil tes, dll)
- **Storage** — menyimpan gambar latar rapot yang diupload oleh admin

### Langkah 1.1 — Buat Akun Supabase

1. Buka **https://supabase.com**
2. Klik tombol **"Start your project"** atau **"Sign Up"**
3. Daftar menggunakan akun **GitHub** (lebih cepat) atau email
4. Verifikasi email jika menggunakan email

### Langkah 1.2 — Buat Project Baru

1. Setelah login, kamu akan masuk ke **Dashboard Supabase**
2. Klik tombol **"New project"**
3. Isi form berikut:
   ```
   Organization    : (pilih organisasi default atau buat baru)
   Project name    : 4persona-vundiego
   Database Password : [buat password yang kuat, SIMPAN ini!]
   Region          : Southeast Asia (Singapore) — untuk latensi terbaik dari Indonesia
   ```
4. Klik **"Create new project"**
5. Tunggu 1-2 menit hingga database selesai dibuat (ada progress bar)

### Langkah 1.3 — Ambil DATABASE_URL (Connection String)

1. Di sidebar kiri, klik **"Project Settings"** (icon gear ⚙️)
2. Klik menu **"Database"**
3. Scroll ke bawah ke bagian **"Connection string"**
4. Di dropdown, pilih **"URI"**
5. Pastikan toggle **"Display connection pooling"** dalam keadaan **OFF**
   *(Kita pakai direct connection untuk Prisma migrations)*
6. Salin string yang muncul, contohnya:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefgh.supabase.co:5432/postgres
   ```
7. **Ganti `[YOUR-PASSWORD]`** dengan password yang kamu buat di langkah 1.2

> [!IMPORTANT]
> Jika kamu mendapat error "prepared statement" saat development, gunakan
> **Connection Pooler** dengan menambahkan `?pgbouncer=true&connection_limit=1`
> di akhir URL. Untuk migration, tetap gunakan direct connection (tanpa pooler).

### Langkah 1.4 — Ambil SUPABASE_URL dan SUPABASE_SERVICE_KEY

1. Tetap di **"Project Settings"**
2. Klik menu **"API"** di sidebar
3. Di bagian **"Project URL"**, salin URL yang ada (contoh: `https://abcdefgh.supabase.co`)
   → Ini adalah `SUPABASE_URL`
4. Di bagian **"Project API keys"**, salin nilai dari **"service_role"** (bukan anon!)
   → Ini adalah `SUPABASE_SERVICE_KEY`

> [!CAUTION]
> `service_role` key memiliki akses penuh ke database. **JANGAN pernah** expose
> key ini di frontend atau commit ke Git. Hanya gunakan di backend server.

### Langkah 1.5 — Buat Storage Bucket

1. Di sidebar kiri, klik **"Storage"**
2. Klik tombol **"New bucket"**
3. Isi:
   ```
   Bucket name  : report-assets
   Public bucket: ✅ ON (centang ini agar gambar bisa diakses publik)
   ```
4. Klik **"Save"**

### Langkah 1.6 — Isi .env Backend (Bagian Supabase & Database)

Buka file `backend/.env` dan isi bagian-bagian ini:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Supabase Storage
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc....(panjang)....
SUPABASE_STORAGE_BUCKET=report-assets
```

### Langkah 1.7 — Jalankan Database Migration

Setelah DATABASE_URL diisi, buka terminal di folder `backend/` dan jalankan:

```bash
# Buat dan jalankan migration pertama
npm run db:migrate

# Saat ditanya nama migration, ketik:
init_schema

# Setelah migration berhasil, seed data awal:
npm run db:seed
```

Kamu akan melihat output:
```
🌱 Seeding database...
✅ SystemMetric seeded
✅ ReportTemplates seeded (4 elemen)
✅ Admin user seeded (email: admin@vundiego.com)
🎉 Database seeding completed!
```

---

## BAGIAN 2 — Google OAuth2 (Login dengan Google)

### Langkah 2.1 — Buat Project di Google Cloud Console

1. Buka **https://console.cloud.google.com**
2. Login dengan akun Google kamu
3. Di bagian atas halaman, klik dropdown **"Select a project"**
4. Klik **"New Project"**
5. Isi:
   ```
   Project name : 4Persona Vundiego
   ```
6. Klik **"Create"**
7. Pastikan project yang baru dibuat sudah terpilih di dropdown atas

### Langkah 2.2 — Aktifkan Google+ API / People API

1. Di sidebar kiri, klik **"APIs & Services"** → **"Library"**
2. Di kotak pencarian, ketik **"Google People API"**
3. Klik **"Google People API"** dari hasil pencarian
4. Klik tombol **"Enable"**

### Langkah 2.3 — Setup OAuth Consent Screen

*Ini adalah halaman yang dilihat user saat mereka klik "Login dengan Google"*

1. Di sidebar kiri, klik **"APIs & Services"** → **"OAuth consent screen"**
2. Pilih **"External"** (untuk pengguna luar organisasi)
3. Klik **"Create"**
4. Isi form **"App information"**:
   ```
   App name          : 4Persona Vundiego
   User support email : [email kamu]
   App logo           : (opsional, skip dulu)
   ```
5. Di bagian **"App domain"** (opsional untuk development, bisa skip)
6. Di bagian **"Developer contact information"**, masukkan email kamu
7. Klik **"Save and Continue"**

8. Di halaman **"Scopes"**, klik **"Add or remove scopes"**
9. Centang scope berikut:
   - `openid`
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
10. Klik **"Update"** → **"Save and Continue"**

11. Di halaman **"Test users"**:
    - Klik **"Add users"**
    - Tambahkan email-email yang akan digunakan untuk testing
      *(saat mode "Testing", hanya email yang ditambahkan di sini yang bisa login)*
12. Klik **"Save and Continue"** → **"Back to Dashboard"**

> [!NOTE]
> Saat development, app kamu dalam mode **"Testing"**. Untuk production (publish
> ke semua user), kamu perlu klik "Publish App" dan mungkin perlu verifikasi
> dari Google (prosesnya bisa memakan waktu beberapa hari).

### Langkah 2.4 — Buat OAuth Client ID

1. Di sidebar kiri, klik **"APIs & Services"** → **"Credentials"**
2. Klik tombol **"+ Create Credentials"** → pilih **"OAuth client ID"**
3. Di dropdown **"Application type"**, pilih **"Web application"**
4. Isi **"Name"**: `4Persona Backend`
5. Di bagian **"Authorized JavaScript origins"**, klik **"Add URI"** dan tambahkan:
   ```
   http://localhost:5173
   ```
6. Di bagian **"Authorized redirect URIs"**, klik **"Add URI"** dan tambahkan:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
   *(Perhatikan ada `/api` prefix karena kita set global prefix di NestJS)*
7. Klik **"Create"**

8. Akan muncul popup dengan:
   - **Client ID** — contoh: `123456789-abcdefgh.apps.googleusercontent.com`
   - **Client Secret** — contoh: `GOCSPX-abcdefghijklmnop`
9. Salin keduanya (atau klik "Download JSON" untuk backup)

### Langkah 2.5 — Isi .env Backend (Bagian Google OAuth)

```env
GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

> [!IMPORTANT]
> Saat deploy ke production nanti, kamu perlu:
> 1. Tambahkan domain production ke "Authorized JavaScript origins"
> 2. Tambahkan callback URL production ke "Authorized redirect URIs"
> 3. Ubah `GOOGLE_CALLBACK_URL` di `.env` production

---

## BAGIAN 3 — Brevo (Email Otomatis)

Brevo (dulu bernama Sendinblue) digunakan untuk mengirim email otomatis
berisi link rapot kepada pengguna setelah mereka menyelesaikan tes.

### Langkah 3.1 — Buat Akun Brevo

1. Buka **https://app.brevo.com**
2. Klik **"Sign up for free"**
3. Daftar dengan email atau akun Google
4. Verifikasi email kamu
5. Isi informasi profil dasar yang diminta

### Langkah 3.2 — Verifikasi Domain Pengirim (Penting!)

Tanpa verifikasi domain, email kamu akan masuk ke folder SPAM penerima.

1. Di navbar atas, klik **"Senders & IP"** → **"Senders"**
   *(atau cari di menu: Settings → Senders & IP)*
2. Klik **"Add a new sender"**
3. Isi:
   ```
   From name  : 4Persona Vundiego
   From email : noreply@vundiego.com (atau email brand kamu)
   ```
4. Klik **"Save"**
5. Brevo akan meminta kamu untuk memverifikasi domain dengan menambahkan
   record DNS ke domain kamu:
   - **SPF Record**: Tambahkan ke DNS provider domain kamu
   - **DKIM Record**: Tambahkan ke DNS provider domain kamu
6. Setelah record ditambahkan, kembali ke Brevo dan klik **"Verify"**
   *(Propagasi DNS bisa memakan waktu 10 menit hingga 48 jam)*

> [!NOTE]
> **Untuk development/testing**, kamu bisa skip verifikasi domain dan
> gunakan email pribadi kamu sebagai sender sementara. Brevo membolehkan
> pengiriman ke email yang sudah terverifikasi tanpa domain verification.
>
> Untuk testing awal, cukup gunakan email kamu sendiri sebagai:
> `BREVO_FROM_EMAIL=emailkamu@gmail.com`

### Langkah 3.3 — Ambil API Key

1. Di pojok kanan atas, klik **nama akun kamu** → **"SMTP & API"**
   *(atau langsung buka: https://app.brevo.com/settings/keys/api)*
2. Klik tab **"API Keys"**
3. Klik **"Generate a new API key"**
4. Beri nama: `4Persona Backend`
5. Klik **"Generate"**
6. **SALIN API KEY YANG MUNCUL** — ini hanya ditampilkan sekali!
   Contoh: `xkeysib-abcdefghijklmnop1234567890-XYZ`

### Langkah 3.4 — Cek Batas Gratis Brevo

Paket gratis Brevo memberikan:
- **300 email/hari** — cukup untuk development dan launch awal
- Tidak perlu kartu kredit

Jika nanti traffic tinggi, upgrade ke paket berbayar.

### Langkah 3.5 — Isi .env Backend (Bagian Brevo)

```env
BREVO_API_KEY=xkeysib-abcdefghijklmnop1234567890-XYZ
BREVO_FROM_EMAIL=noreply@vundiego.com
BREVO_FROM_NAME=4Persona Vundiego
```

---

## HASIL AKHIR — File .env yang Sudah Terisi

Setelah semua langkah di atas selesai, file `backend/.env` kamu
seharusnya terlihat seperti ini (dengan nilai asli tentu saja):

```env
# ============================================================
#  BACKEND — Environment Variables (Development)
# ============================================================

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:PASSWORDMU@db.abcdefgh.supabase.co:5432/postgres"

# JWT
JWT_SECRET=4persona_vundiego_jwt_secret_dev_2026
JWT_EXPIRY=7d

# Google OAuth2
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Brevo Email
BREVO_API_KEY=xkeysib-xxxxx
BREVO_FROM_EMAIL=noreply@vundiego.com
BREVO_FROM_NAME=4Persona Vundiego

# Supabase Storage
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=report-assets

# Report Token
REPORT_TOKEN_EXPIRY_DAYS=30
```

---

## CHECKLIST VERIFIKASI

Setelah semua terisi, jalankan langkah-langkah ini untuk memverifikasi:

### ✅ Verifikasi Database
```bash
# Di folder backend/
npm run db:migrate   # Harus berhasil membuat semua tabel
npm run db:seed      # Harus print: 🎉 Database seeding completed!
npm run db:studio    # Buka Prisma Studio di browser untuk cek data
```

### ✅ Verifikasi Backend Bisa Jalan
```bash
# Di folder backend/
npm run start:dev

# Harus muncul:
# 🚀 Backend running on http://localhost:3000/api
```

### ✅ Verifikasi Frontend Bisa Jalan
```bash
# Di folder frontend/
npm run dev

# Buka http://localhost:5173 di browser
```

---

## CATATAN KEAMANAN PENTING

> [!CAUTION]
> **Jangan pernah:**
> - Commit file `.env` ke Git (sudah ada di `.gitignore` ✅)
> - Share `SUPABASE_SERVICE_KEY` ke siapapun
> - Expose `JWT_SECRET` di frontend
> - Gunakan password yang sama untuk semua layanan

> [!TIP]
> **Simpan semua credential ini** di password manager (Bitwarden, 1Password, dll)
> atau di tempat aman lainnya. Credential ini tidak bisa direcovery jika hilang
> (harus generate ulang).

---

## BANTUAN & TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| `DATABASE_URL` error saat migrate | Pastikan URL dikelilingi tanda kutip `"..."` di .env |
| Google OAuth redirect tidak cocok | Pastikan URL di Google Console PERSIS sama dengan `GOOGLE_CALLBACK_URL` |
| Email Brevo masuk spam | Lakukan verifikasi domain SPF/DKIM |
| Supabase connection timeout | Coba tambahkan `?connection_timeout=30` di akhir DATABASE_URL |
| `prisma generate` error | Jalankan ulang setelah DATABASE_URL diisi |

---

*Setelah semua credential terisi dan verifikasi berhasil,
beritahu saya dan kita lanjut ke Fase 1 (Design System)!*
