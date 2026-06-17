# 🚀 Panduan Deploy 4Persona ke Internet

## Stack yang Perlu Di-deploy

| Komponen | Teknologi | Platform Rekomendasi |
|---|---|---|
| **Frontend** | React + Vite | **Vercel** (gratis) |
| **Backend** | NestJS | **Railway** (gratis $5/bln credit) |
| **Database** | PostgreSQL | **Supabase** (sudah ada, tetap) |

---

## Ringkasan Alur

```
User Browser
    │
    ▼
[Vercel] ← React/Vite build (frontend)
    │  fetch /api/...
    ▼
[Railway] ← NestJS backend
    │  Prisma ORM
    ▼
[Supabase] ← PostgreSQL database (sudah ada)
```

---

## TAHAP 1 — Deploy Backend ke Railway

### 1.1 Daftar Railway
1. Buka [https://railway.app](https://railway.app)
2. Login dengan GitHub account temenmu (yang akan publish)
3. Klik **New Project → Deploy from GitHub repo**
4. Pilih repo `Adamabdurrahman/4persona`
5. Railway akan otomatis mendeteksi folder `backend/`

### 1.2 Konfigurasi Root Directory
Di Railway project settings:
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`

### 1.3 Set Environment Variables di Railway
Pergi ke tab **Variables** dan isi semua ini:

```env
# Database (ambil dari Supabase → Project Settings → Database)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres

# JWT
JWT_SECRET=isi_dengan_string_random_panjang_minimal_32_karakter

# Frontend URL (isi setelah deploy Vercel — ganti nanti)
FRONTEND_URL=https://nama-project.vercel.app

# Email / Brevo (jika ada)
BREVO_API_KEY=xxx

# Google OAuth (jika dipakai)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://nama-backend.railway.app/api/auth/google/callback

# Node environment
NODE_ENV=production
```

> [!IMPORTANT]
> `DATABASE_URL` dan `DIRECT_URL` harus menggunakan URL dari Supabase yang sudah ada sebelumnya. Jangan buat database baru.

### 1.4 Catat URL Backend Railway
Setelah deploy selesai, Railway akan memberi URL seperti:
```
https://4persona-backend-production.railway.app
```
**Simpan URL ini** — akan dipakai di langkah selanjutnya.

---

## TAHAP 2 — Deploy Frontend ke Vercel

### 2.1 Daftar Vercel
1. Buka [https://vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **Add New → Project**
4. Import repo `Adamabdurrahman/4persona`

### 2.2 Konfigurasi di Vercel
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.3 Set Environment Variables di Vercel
Di tab **Environment Variables**:

```env
VITE_API_URL=https://4persona-backend-production.railway.app
```

> [!NOTE]
> Ini adalah URL backend Railway yang tadi dicatat. Variable dengan prefix `VITE_` akan ter-embed ke dalam build frontend.

### 2.4 Klik Deploy
Vercel akan build & deploy. Hasilnya URL seperti:
```
https://4persona.vercel.app
```

---

## TAHAP 3 — Update CORS di Railway

Setelah mendapat URL Vercel, **kembali ke Railway** dan update:

```env
FRONTEND_URL=https://4persona.vercel.app
```

Lalu redeploy backend (Railway otomatis redeploy saat variable berubah).

---

## TAHAP 4 — Cek Kode yang Perlu Diupdate

> [!WARNING]
> Ada 1 file yang perlu diupdate sebelum deploy agar API URL benar.

### File: `frontend/src/services/api.js`
Pastikan menggunakan environment variable, bukan hardcode `localhost`:

```javascript
// Sudah benar jika ada ini:
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Jika masih hardcode `localhost:3000`, perlu diubah dulu → commit → push → Vercel auto-redeploy.

---

## TAHAP 5 — Jalankan Prisma Migrate di Production

Setelah backend Railway running, jalankan migration sekali:

Di Railway → tab **Shell** (atau via Railway CLI):
```bash
npx prisma db push
# atau
npx prisma migrate deploy
```

---

## Checklist Sebelum Go-Live

- [ ] Backend Railway berhasil start (cek log tidak ada error)
- [ ] `https://[backend-url]/api` bisa diakses (harusnya return 404 atau JSON)
- [ ] Frontend Vercel bisa dibuka di browser
- [ ] Bisa register/login akun baru
- [ ] Bisa menyelesaikan tes hingga dapat hasil
- [ ] Email laporan terkirim (jika Brevo dikonfigurasi)
- [ ] Admin panel bisa diakses
- [ ] Google OAuth callback URL sudah diupdate di Google Cloud Console

---

## Biaya

| Platform | Biaya |
|---|---|
| **Vercel** | **Gratis** (Hobby plan, unlimited) |
| **Railway** | **Gratis** $5 credit/bulan (cukup untuk traffic kecil-menengah) |
| **Supabase** | **Gratis** (sudah berjalan) |

---

## Alternatif Platform Lain

Jika Railway dirasa terlalu terbatas:
- **Render.com** — gratis, tapi cold start ~30 detik
- **Fly.io** — lebih powerful, ada free tier
- **DigitalOcean App Platform** — berbayar ~$5/bulan, lebih stabil

