# Sistem Voucher Shopee — Implementasi Detail

## Overview
Setelah user menyelesaikan tes kepribadian 4Persona, mereka otomatis mendapatkan **1 voucher diskon Shopee** (Potongan Rp4.000, harga 39k → 35k) untuk produk **SOUL PERSONALITY Vun Diego**. Voucher bersifat **sekali seumur akun** — tes ulang tidak menghasilkan voucher baru.

---

## Spesifikasi Detail

### Harga & Diskon
- Harga normal parfum: **Rp39.000**
- Harga dengan voucher: **Rp35.000**
- Label diskon: **"Potongan Rp4.000"**

### Link Shopee
- URL: `https://shopee.co.id/vundiego?categoryId=100630&entryPoint=ShopByPDP&itemId=51311595656&upstream=search`
- Desktop: buka URL di tab baru
- Mobile: coba deep link Shopee app (`shopeeid://product/{itemId}`), fallback ke browser

### Batasan Voucher
- 1 voucher per akun (seumur hidup)
- Stok terbatas (diatur admin)
- Masa berlaku 3 hari (72 jam) setelah diperoleh
- Hanya berlaku untuk produk SOUL PERSONALITY Vun Diego

### Cara Pakai (3 Langkah)
1. Ikuti Tes Kepribadian — gratis, 5 menit
2. Dapatkan Voucher — otomatis muncul di profil setelah tes selesai
3. Pakai di Shopee — buka aplikasi Shopee, masukkan SOUL PERSONALITY ke keranjang, tempel kode di "Masukkan Kode Voucher" saat checkout

---

## File yang Dimodifikasi/Dibuat

### Database
| Tipe | File | Perubahan |
|------|------|-----------|
| MODIFY | `backend/prisma/schema.prisma` | +2 model baru (VoucherConfig, VoucherClaim) + relasi di User |

### Backend (NestJS)
| Tipe | File | Perubahan |
|------|------|-----------|
| NEW | `backend/src/vouchers/vouchers.module.ts` | Module NestJS |
| NEW | `backend/src/vouchers/vouchers.service.ts` | Service: claim, config, public info |
| NEW | `backend/src/vouchers/vouchers.controller.ts` | REST endpoints (public + user + admin) |
| NEW | `backend/src/vouchers/dto/update-config.dto.ts` | DTO validasi |
| MODIFY | `backend/src/tests/tests.service.ts` | Auto-claim voucher setelah submit tes |
| MODIFY | `backend/src/tests/tests.module.ts` | Import VouchersModule |
| MODIFY | `backend/src/app.module.ts` | Import VouchersModule |

### Frontend (React + Vite)
| Tipe | File | Perubahan |
|------|------|-----------|
| NEW | `frontend/src/services/voucherService.js` | API public + user voucher |
| MODIFY | `frontend/src/services/adminService.js` | +3 fungsi admin voucher |
| NEW | `frontend/src/components/VoucherCard.jsx` | Kartu voucher di profil |
| NEW | `frontend/src/pages/admin/AdminVouchers.jsx` | Halaman admin kelola voucher |
| MODIFY | `frontend/src/pages/admin/AdminLayout.jsx` | +nav "Kelola Voucher" |
| MODIFY | `frontend/src/App.jsx` | +route /admin/vouchers |
| MODIFY | `frontend/src/pages/ProfilePage.jsx` | Sisipkan VoucherCard |
| MODIFY | `frontend/src/pages/HomePage.jsx` | Section promo voucher conditional |
| MODIFY | `frontend/src/pages/TestPage.jsx` | Pass hasVoucher ke teaser |
| MODIFY | `frontend/src/pages/TeaserPage.jsx` | Notifikasi voucher |

---

## API Endpoints

| Route | Method | Guard | Deskripsi |
|-------|--------|-------|-----------|
| `/api/vouchers/public` | GET | — | Info publik: enabled, sisa stok, label diskon |
| `/api/vouchers/my` | GET | JWT | Voucher milik user (kode + status + expiry) |
| `/api/admin/vouchers/config` | GET | JWT + Admin | Full config |
| `/api/admin/vouchers/config` | PUT | JWT + Admin | Update config |
| `/api/admin/vouchers/claims` | GET | JWT + Admin | Daftar user yang sudah claim |

---

## Alur Kerja

### User Flow
1. User menyelesaikan tes → `submitTest()` otomatis panggil `claimVoucher(userId)`
2. Jika eligible (fitur ON, stok ada, belum pernah claim) → VoucherClaim dibuat
3. TeaserPage menampilkan notifikasi "🎁 Voucher diskon sudah menunggumu di Profil"
4. Di ProfilePage, VoucherCard muncul dengan kode ter-mask, countdown, tombol salin & redirect Shopee
5. Setelah 3 hari → badge EXPIRED merah, tombol dinonaktifkan

### Admin Flow
1. Login → Admin Panel → "Kelola Voucher"
2. Toggle ON/OFF → langsung mengaktifkan/menonaktifkan sistem
3. Isi kode voucher, label diskon, stok, masa berlaku, URL Shopee → Simpan
4. Lihat progress bar stok dan daftar klaim user
