# 🚀 Skill Swap Platform - Quick Start Guide

## 📋 Apa yang Baru Saja Dibangun?

Aplikasi **Skill Swap Platform** - sistem barter keahlian lengkap dengan:

✅ **Two-Way Matching Algorithm** - Cari pengguna yang cocok secara dua arah
✅ **State-Based Workflow** - Kelola pertukaran dari PROPOSED hingga COMPLETED
✅ **Dashboard Pengguna** - Kelola keahlian dan pertukaran
✅ **Dashboard Admin** - Monitor dan kelola platform
✅ **Database Terseeding** - Siap pakai dengan data contoh
✅ **UI Modern** - Desain minimalis dengan warna indigo/putih

---

## 🎯 Cara Memulai (3 Langkah Mudah)

### Step 1: Buka Aplikasi
Aplikasi akan otomatis:
- Seeding database dengan data contoh (6 pengguna, 15+ keahlian)
- Login otomatis sebagai user pertama: **Budi Santoso**

### Step 2: Explore Dashboard

#### Dashboard Utama
Lihat statistik:
- Keahlian yang Anda tawarkan
- Keahlian yang Anda butuhkan
- Pertukaran aktif dan selesai

#### Keahlian Saya
Tambah keahlian baru:
1. Klik "Tambah Keahlian"
2. Isi nama keahlian, kategori, tingkat, dan tipe
3. Simpan

#### Cari Cocok
Temukan partner pertukaran:
1. Klik "Cari Pertandingan"
2. Sistem mencari pengguna dengan keahlian yang cocok
3. Lihat match score (0-100%)
4. Kirim permintaan pertukaran

#### Pertukaran
Kelola semua pertukaran:
- **Menunggu**: Terima atau tolak permintaan baru
- **Aktif**: Mulai atau selesaikan pertukaran
- **Selesai**: Lihat history

### Step 3: Switch ke Admin
Klik tombol "Switch to Admin" di sidebar bawah untuk:
- Lihat semua pengguna
- Monitor statistik platform
- Kelola pertukaran sebagai admin

---

## 🎮 Scenario Contoh: Coba Fitur Matching

### 1. Login sebagai Budi (Default)
- Keahlian ditawarkan: JavaScript (Expert), React (Expert)
- Keahlian dicari: UI Design (Beginner)

### 2. Cari Pertandingan
1. Masuk menu "Cari Cocok"
2. Klik "Cari Pertandingan"
3. Hasil: Siti Rahayu (Match Score: ~95%)
   - Budi tawarkan: JavaScript
   - Siti tawarkan: UI Design

### 3. Kirim Permintaan
1. Klik "Kirim Permintaan Pertukaran"
2. State: PROPOSED

### 4. Switch User untuk Simulasi
1. Klik "Switch to Admin"
2. Klik "Switch to User" kembali
3. Sekarang sebagai user lain (mungkin Siti)

### 5. Terima Permintaan
1. Buka menu "Pertukaran"
2. Lihat permintaan dari Budi
3. Klik "Terima"
4. State: ACCEPTED

### 6. Selesaikan Workflow
1. Budi mulai pertukaran → State: IN_PROGRESS
2. Siti selesaikan → State: COMPLETED

---

## 📊 Data yang Tersedia

### Pengguna (6 orang)
1. **Budi Santoso** - Web developer (Rating: 4.7)
   - Tawarkan: JavaScript, React
   - Cari: UI Design

2. **Siti Rahayu** - Desainer grafis (Rating: 4.9)
   - Tawarkan: UI Design, Figma
   - Cari: JavaScript

3. **Ahmad Wijaya** - Digital marketer (Rating: 4.5)
   - Tawarkan: SEO, Content Writing
   - Cari: Photography

4. **Dewi Kartika** - Data scientist (Rating: 4.8)
   - Tawarkan: Python, Machine Learning
   - Cari: Digital Marketing

5. **Rudi Hermawan** - Fotografer (Rating: 4.6)
   - Tawarkan: Photography, Video Editing
   - Cari: SEO

6. **Admin Platform** - Administrator (Rating: 5.0)

### Kategori Keahlian
- Programming (JavaScript, React, Python)
- Design (UI Design, Figma)
- Marketing (SEO, Content Writing, Digital Marketing)
- Data Science (Machine Learning)
- Art (Photography, Video Editing)

---

## 🎨 Fitur UI

### Warna & Theme
- **Primary**: Indigo (#4F46E5) - Professional & Kolaboratif
- **Secondary**: Emerald, Amber, Red untuk status
- **Background**: White & Light Gray

### Komponen
- Card dengan border radius halus
- Avatar dengan initial nama
- Badge untuk status dan kategori
- Icons dari Lucide
- Responsive untuk mobile & desktop

---

## 🔧 API Endpoints (Untuk Developer)

### Users
```
GET  /api/users          # Get all users
POST /api/users          # Create user
```

### Skills
```
GET    /api/skills           # Get all skills
POST   /api/skills           # Create skill
DELETE /api/skills/[id]      # Delete skill
```

### Swap Requests
```
GET    /api/swaps            # Get swap requests
POST   /api/swaps            # Create swap request
PATCH  /api/swaps/[id]       # Update swap state
DELETE /api/swaps/[id]       # Delete swap
```

### Matching
```
GET /api/matches?userId=X    # Find matches for user
```

---

## 💡 Tips Penggunaan

### Untuk Demo Presentasi
1. Login sebagai Budi
2. Tambah skill baru (offered & needed)
3. Cari pertandingan
4. Kirim permintaan
5. Switch user, terima permintaan
6. Selesaikan workflow

### Untuk Testing Matching
- Pastikan punya minimal 1 skill OFFERED dan 1 NEEDED
- System akan match dengan user yang:
  - Menawarkan skill yang Anda cari
  - Mencari skill yang Anda tawarkan

### Untuk Admin Demo
1. Switch ke Admin mode
2. Lihat semua user di "Kelola Pengguna"
3. Monitor pertukaran di "Statistik Platform"
4. Approve swap requests sebagai admin

---

## 🐛 Troubleshooting

### Data tidak muncul?
- Refresh halaman (F5)
- Data akan otomatis di-seed saat pertama load

### API error?
- Cek dev console (F12)
- Pastikan server berjalan di localhost:3000

### Match tidak ditemukan?
- Tambah lebih banyak skill
- Coba kategori yang berbeda
- Pastikan ada user lain dengan skill yang relevan

---

## 📚 Dokumentasi Lengkap

Baca `SKILLSWAP_README.md` untuk:
- Penjelasan Two-Way Matching Algorithm
- Detail State-Based Workflow
- Struktur Database
- Customization Guide

---

## ✅ Checklist Fitur yang Sudah Berjalan

- [x] Two-Way Matching Algorithm
- [x] State-Based Workflow (5 states)
- [x] User Dashboard (4 sections)
- [x] Admin Dashboard (2 sections)
- [x] CRUD Skills
- [x] CRUD Swap Requests
- [x] Auto-seeding Database
- [x] User/Admin Switching
- [x] Responsive UI
- [x] Modern Design (Indigo theme)
- [x] Toast Notifications
- [x] Loading States
- [x] Error Handling

---

## 🎉 Siap Digunakan!

Aplikasi sudah **production-ready** untuk demo dan development. Data sample sudah tersedia, fitur lengkap berjalan, dan UI/UX sudah polished.

**Selamat mencoba!** 🚀
