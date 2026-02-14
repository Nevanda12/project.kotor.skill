# Skill Swap Platform - Sistem Barter Keahlian

Aplikasi web full-stack lengkap untuk sistem barter keahlian berbasis **Two-Way Matching Algorithm** dengan **State-Based Workflow**.

## 🌟 Fitur Utama

### 1. **Two-Way Matching Algorithm**
- Algoritma pencocokan dua arah yang menghubungkan pengguna berdasarkan keahlian yang ditawarkan dan dicari
- Menghitung skor kecocokan (match score) berdasarkan:
  - Nama keahlian (perfect match atau similar)
  - Kategori keahlian
  - Tingkat keahlian (skill level compatibility)
  - Reciprocal matching (saling membutuhkan)

### 2. **State-Based Workflow**
Sistem pertukaran keahlian mengikuti alur state:
- **PROPOSED** → Permintaan pertukaran diajukan
- **ACCEPTED** → Permintaan diterima oleh pengguna lain
- **IN_PROGRESS** → Pertukaran sedang berjalan
- **COMPLETED** → Pertukaran selesai
- **REJECTED** → Permintaan ditolak

### 3. **Dashboard Pengguna**
- **Overview Dashboard**: Statistik keahlian, pertukaran aktif, dan selesai
- **Kelola Keahlian**: Tambah, lihat, dan hapus keahlian (Ditawarkan/Dicari)
- **Cari Cocok**: Temukan pengguna dengan keahlian yang cocok
- **Daftar Pertukaran**: Kelola semua pertukaran dengan filter status

### 4. **Dashboard Admin**
- **Kelola Pengguna**: Lihat semua pengguna platform
- **Statistik Platform**: Monitor aktivitas dan statistik pertukaran

## 🎨 Desain UI/UX

### Tema Warna
- **Dominan**: Biru tua/Indigo (#4F46E5) - kesan profesional & kolaboratif
- **Aksen**: 
  - Emerald untuk keahlian dicari dan status diterima
  - Amber untuk status menunggu
  - Red untuk status ditolak
- **Background**: Putih dan abu-abu muda untuk keterbacaan

### Layout
- **Responsive**: Desktop dan mobile-friendly
- **Card-based**: Kartu dengan border radius halus
- **Sidebar Navigation**: Navigasi samping yang intuitif
- **Sticky Footer**: User profile card di bawah sidebar

## 🗄️ Struktur Database

### Users
- `id`: Unique identifier
- `name`: Nama lengkap pengguna
- `email`: Email (unique)
- `role`: USER atau ADMIN
- `bio`: Bio singkat
- `rating`: Rating pengguna (0-5)

### Skills
- `id`: Unique identifier
- `userId`: ID pengguna pemilik keahlian
- `skillName`: Nama keahlian
- `skillCategory`: Kategori keahlian
- `skillLevel`: Beginner, Intermediate, atau Expert
- `type`: OFFERED (ditawarkan) atau NEEDED (dicari)

### Swap_Requests
- `id`: Unique identifier
- `userAId`: ID pengguna pengirim
- `userBId`: ID pengguna penerima
- `skillAId`: ID keahlian yang ditawarkan UserA
- `skillBId`: ID keahlian yang diminta UserA (ditawarkan UserB)
- `matchScore`: Skor kecocokan (0-1)
- `state`: Status pertukaran
- `message`: Pesan tambahan

## 🚀 Teknologi

### Frontend
- **Next.js 16** dengan App Router
- **TypeScript 5**
- **Tailwind CSS 4**
- **shadcn/ui** - Komponen UI modern
- **Lucide Icons**

### Backend
- **Next.js API Routes** (RESTful API)
- **Prisma ORM** dengan SQLite
- **State Management**: React Hooks

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   └── route.ts          # GET/POST users
│   │   ├── skills/
│   │   │   ├── route.ts          # GET/POST skills
│   │   │   └── [id]/
│   │   │       └── route.ts      # DELETE skill
│   │   ├── swaps/
│   │   │   ├── route.ts          # GET/POST swap requests
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH/DELETE swap
│   │   ├── matches/
│   │   │   └── route.ts          # Two-way matching
│   │   └── seed/
│   │       └── route.ts          # Seed database
│   ├── page.tsx                  # Main page
│   └── globals.css
├── components/
│   ├── DataInitializer.tsx        # Auto-seed component
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── db.ts                     # Prisma client
│   └── utils.ts                  # Utility functions
└── hooks/
    ├── use-mobile.ts
    └── use-toast.ts
```

## 🔌 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### Skills
- `GET /api/users?userId=X&type=Y` - Get skills with filters
- `POST /api/skills` - Create new skill
- `DELETE /api/skills/[id]` - Delete skill

### Swap Requests
- `GET /api/swaps?userId=X` - Get swap requests
- `POST /api/swaps` - Create new swap request
- `PATCH /api/swaps/[id]` - Update swap state
- `DELETE /api/swaps/[id]` - Delete swap request

### Matching
- `GET /api/matches?userId=X` - Find matches for user

### Seed
- `POST /api/seed` - Seed database with sample data

## 💡 Cara Menggunakan

### 1. **Login Simulation**
Aplikasi otomatis login sebagai pengguna pertama di database. Klik tombol "Switch to Admin" di sidebar untuk beralih ke mode Admin.

### 2. **Menambah Keahlian**
1. Buka menu "Keahlian Saya"
2. Klik tombol "Tambah Keahlian"
3. Isi form:
   - Nama Keahlian (contoh: JavaScript)
   - Kategori (contoh: Programming)
   - Tingkat (Pemula/Menengah/Ahli)
   - Tipe (Ditawarkan/Dicari)
4. Klik "Simpan Keahlian"

### 3. **Mencari Pertandingan**
1. Buka menu "Cari Cocok"
2. Klik tombol "Cari Pertandingan"
3. Sistem akan menampilkan daftar pengguna dengan keahlian yang cocok
4. Lihat match score (0-100%)
5. Klik "Kirim Permintaan Pertukaran" untuk mengajukan

### 4. **Mengelola Pertukaran**
1. Buka menu "Pertukaran"
2. Lihat semua pertukaran dengan filter status:
   - Semua
   - Menunggu (PROPOSED)
   - Aktif (ACCEPTED, IN_PROGRESS)
   - Selesai (COMPLETED, REJECTED)
3. Lakukan aksi berdasarkan status:
   - **Terima/Tolak** untuk permintaan baru
   - **Mulai Pertukaran** untuk yang sudah diterima
   - **Selesaikan** untuk yang sedang berjalan

### 5. **Admin Features**
1. Switch ke mode Admin
2. Buka "Kelola Pengguna" untuk melihat semua user
3. Buka "Statistik Platform" untuk melihat overview

## 🔄 Workflow Contoh

### Scenario: Budi ingin bertukar JavaScript dengan UI Design

1. **Budi** menambahkan skill:
   - JavaScript (OFFERED, Expert)
   - UI Design (NEEDED, Beginner)

2. **Siti** menambahkan skill:
   - UI Design (OFFERED, Expert)
   - JavaScript (NEEDED, Intermediate)

3. **Budi** klik "Cari Pertandingan"
   - Sistem menemukan Siti dengan match score ~95%
   - Menampilkan: Budi tawarkan JavaScript ↔ Siti tawarkan UI Design

4. **Budi** mengirim permintaan pertukaran ke Siti
   - State: PROPOSED

5. **Siti** menerima permintaan
   - State: ACCEPTED

6. **Budi** memulai pertukaran
   - State: IN_PROGRESS

7. **Siti** menyelesaikan pertukaran
   - State: COMPLETED

## 📊 Two-Way Matching Algorithm

Algoritma ini memastikan pertukaran saling menguntungkan:

### Step 1: Direct Matching
Cari pengguna lain yang:
- Menawarkan keahlian yang saya butuhkan
- Saya menawarkan keahlian yang mereka butuhkan

### Step 2: Score Calculation
```
Match Score = (
  (NameMatch × 0.4) +
  (CategoryMatch × 0.2) +
  (LevelCompatibility × 0.2) +
  (ReverseNameMatch × 0.3) +
  (ReverseCategoryMatch × 0.15) +
  (ReverseLevelCompatibility × 0.15)
) / 1.4
```

### Step 3: Filtering
- Minimum score threshold: 40%
- Remove duplicates
- Sort by score descending
- Return top 20 matches

## 🎯 State Machine Diagram

```
[PROPOSED] --(terima)--> [ACCEPTED] --(mulai)--> [IN_PROGRESS] --(selesai)--> [COMPLETED]
    |                         |                         |
    +-----(tolak)----------> [REJECTED]               +-----(selesai)---> [COMPLETED]
```

## 🔐 Authentication

Saat ini menggunakan simulasi authentication:
- User dapat switch antara USER dan ADMIN
- Data user disimpan di database
- Tidak ada password/real auth (untuk demo)

## 📝 Data Sample

Database akan otomatis di-seed dengan:
- 6 Pengguna (5 user + 1 admin)
- 15+ Keahlian dengan berbagai kategori
- Siap untuk digunakan langsung

## 🚀 Quick Start

Aplikasi sudah siap digunakan:
1. Database otomatis di-seed saat pertama kali dibuka
2. Login sebagai user pertama (Budi Santoso)
3. Explore fitur-fitur yang tersedia

## 🎨 Customization

### Ubah Warna Dominan
Edit file `page.tsx` dan ganti class `indigo-600` dengan warna lain:
- `blue-600` - Biru
- `purple-600` - Ungu
- `emerald-600` - Hijau
- `rose-600` - Merah muda

### Ubah Matching Threshold
Edit file `/api/matches/route.ts`:
```typescript
const topMatches = uniqueMatches.filter(m => m.matchScore >= 0.4).slice(0, 20)
```
Ubah `0.4` (40%) ke threshold yang diinginkan.

## 📚 Next Steps

Untuk pengembangan lebih lanjut:
1. Tambah real authentication (NextAuth.js)
2. Implement rating system
3. Tambah messaging/chat antar user
4. Upload avatar
5. Export data ke Excel/PDF
6. Analytics dashboard
7. Email notifications
8. Mobile app (React Native)

## 🙏 Kontribusi

Project ini adalah implementasi referensi untuk sistem barter keahlian dengan two-way matching algorithm dan state-based workflow.
