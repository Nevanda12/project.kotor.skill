# Sesi 2: Fungsionalitas Inti – Skill Swap & Two-Way Matching

## 📋 Dokumentasi Teknis Lengkap

---

## 1. Profil & Keahlian User

### 1.1 Struktur Data Skill

Setiap keahlian memiliki atribut berikut:

```typescript
interface Skill {
  id: string              // Unique identifier
  userId: string          // ID pemilik keahlian
  skillName: string       // Nama keahlian (contoh: "JavaScript")
  skillCategory: string   // Kategori (contoh: "Programming")
  skillLevel: string      // "Beginner" | "Intermediate" | "Expert"
  type: string           // "OFFERED" (ditawarkan) | "NEEDED" (dicari)
}
```

### 1.2 Menambah Keahlian

**Endpoint:** `POST /api/skills`

**Request Body:**
```json
{
  "userId": "user_id_here",
  "skillName": "JavaScript",
  "skillCategory": "Programming",
  "skillLevel": "Expert",
  "type": "OFFERED"
}
```

**Validasi:**
- Semua field wajib diisi
- skillLevel harus salah satu: "Beginner", "Intermediate", "Expert"
- type harus salah satu: "OFFERED" atau "NEEDED"

### 1.3 Menampilkan Daftar Skill

**Endpoint:** `GET /api/skills?userId=X&type=Y`

**Query Parameters (opsional):**
- `userId`: Filter berdasarkan pemilik
- `type`: Filter berdasarkan tipe (OFFERED/NEEDED)

**Response:**
```json
[
  {
    "id": "skill_id",
    "userId": "user_id",
    "skillName": "JavaScript",
    "skillCategory": "Programming",
    "skillLevel": "Expert",
    "type": "OFFERED",
    "userName": "Budi Santoso"
  }
]
```

### 1.4 Tampilan Kartu Skill (UI)

Komponen `SkillCard` menampilkan:
- Nama keahlian dengan font besar & bold
- Badge kategori dengan warna
- Badge level dengan color coding:
  - Beginner: abu-abu
  - Intermediate: biru
  - Expert: ungu
- Tombol hapus untuk skill yang sudah ada

---

## 2. Two-Way Matching Algorithm

### 2.1 Konsep Dasar

Two-Way Matching adalah algoritma yang mencocokkan pengguna jika dan hanya jika:

1. **User A** membutuhkan skill yang ditawarkan oleh **User B**
2. **User B** membutuhkan skill yang ditawarkan oleh **User A**

Ini memastikan pertukaran saling menguntungkan (win-win situation).

### 2.2 Algoritma Matching

**Endpoint:** `GET /api/matches?userId=X`

#### Langkah 1: Ambil Data Pengguna

```typescript
// Skill yang saya tawarkan (apa yang bisa saya ajarkan)
const userOfferedSkills = await db.skill.findMany({
  where: { userId, type: 'OFFERED' }
})

// Skill yang saya butuhkan (apa yang ingin saya pelajari)
const userNeededSkills = await db.skill.findMany({
  where: { userId, type: 'NEEDED' }
})
```

#### Langkah 2: Cari Pengguna Lain

```typescript
const otherUsersSkills = await db.skill.findMany({
  where: { userId: { not: userId } },
  include: { user: true }
})
```

#### Langkah 3: Direct Matching

Cari pengguna lain yang menawarkan skill yang saya butuhkan:

```typescript
for (const myNeeded of userNeededSkills) {
  for (const otherSkill of otherUsersSkills) {
    if (otherSkill.type === 'OFFERED') {
      // Cek nama atau kategori cocok
      const nameMatch = myNeeded.skillName.toLowerCase() === otherSkill.skillName.toLowerCase()
      const categoryMatch = myNeeded.skillCategory.toLowerCase() === otherSkill.skillCategory.toLowerCase()
      
      if (nameMatch || categoryMatch) {
        // Lanjut ke Langkah 4
      }
    }
  }
}
```

#### Langkah 4: Reciprocal Matching (Two-Way)

Cek apakah saya bisa menawarkan sesuatu yang mereka butuhkan:

```typescript
for (const otherNeeded of otherNeededSkills) {
  for (const myOffered of userOfferedSkills) {
    // Cek apakah saya menawarkan skill yang mereka butuhkan
    const reverseNameMatch = otherNeeded.skillName.toLowerCase() === myOffered.skillName.toLowerCase()
    const reverseCategoryMatch = otherNeeded.skillCategory.toLowerCase() === myOffered.skillCategory.toLowerCase()
    
    if (reverseNameMatch || reverseCategoryMatch) {
      // ✓ DUA ARAH MATCHING TERCAPAI!
      // Lanjut ke kalkulasi skor
    }
  }
}
```

#### Langkah 5: Hitung Match Score

Skor dihitung berdasarkan beberapa faktor:

```typescript
// 1. Skor nama skill
const nameScore = nameMatch ? 1 : 0.7

// 2. Skor kategori
const categoryScore = categoryMatch ? 1 : 0.5

// 3. Skor level compatibility
let levelScore = 1
if (otherSkill.skillLevel === 'Expert' && myNeeded.skillLevel === 'Beginner') {
  levelScore = 0.8  // Expert mengajar Beginner = optimal
} else if (otherSkill.skillLevel === 'Expert' && myNeeded.skillLevel === 'Intermediate') {
  levelScore = 0.9
}

// 4. Reverse factors (sama untuk arah sebaliknya)
const reverseNameScore = reverseNameMatch ? 1 : 0.7
const reverseCategoryScore = reverseCategoryMatch ? 1 : 0.5
let reverseLevelScore = 1
// ... logic sama

// 5. Weighted Average
const matchScore = (
  (nameScore * 0.4) +           // Nama skill cocok - Bobot tertinggi
  (categoryScore * 0.2) +        // Kategori cocok
  (levelScore * 0.2) +           // Level compatibility
  (reverseNameScore * 0.3) +      // Reverse nama - Penting!
  (reverseCategoryScore * 0.15) + // Reverse kategori
  (reverseLevelScore * 0.15)     // Reverse level
) / 1.4

// Normalisasi ke range 0-1
const finalScore = Math.min(1, Math.max(0, matchScore))
```

**Bobot Faktor:**
- **Nama Skill (Forward)**: 40% - Sangat penting
- **Nama Skill (Reverse)**: 30% - Penting (two-way!)
- **Kategori (Forward)**: 20%
- **Level (Forward)**: 20%
- **Kategori (Reverse)**: 15%
- **Level (Reverse)**: 15%

#### Langkah 6: Filter & Sort

```typescript
// Hapus duplikat
const uniqueMatches = matches.reduce((acc, match) => {
  const existing = acc.find(
    m => m.userBId === match.userBId && 
         m.mySkillId === match.mySkillId && 
         m.theirSkillId === match.theirSkillId
  )
  if (!existing || match.matchScore > existing.matchScore) {
    // Keep highest score
  }
  return acc
}, [])

// Sort by score descending
uniqueMatches.sort((a, b) => b.matchScore - a.matchScore)

// Filter minimum 40% dan return top 20
const topMatches = uniqueMatches
  .filter(m => m.matchScore >= 0.4)
  .slice(0, 20)
```

### 2.3 Response Format

```json
[
  {
    "userBId": "user_b_id",
    "userB": {
      "id": "user_b_id",
      "name": "Siti Rahayu",
      "email": "siti@example.com",
      "rating": 4.9,
      "bio": "Desainer grafis profesional..."
    },
    "mySkillId": "my_skill_id",
    "mySkillName": "JavaScript",
    "mySkillCategory": "Programming",
    "mySkillLevel": "Expert",
    "theirSkillId": "their_skill_id",
    "theirSkillName": "UI Design",
    "theirSkillCategory": "Design",
    "theirSkillLevel": "Expert",
    "matchScore": 0.957,      // 95.7%
    "matchType": "PERFECT"      // atau "SIMILAR"
  }
]
```

### 2.4 Contoh Scenarios

#### Scenario A: Perfect Match
```
User A (Budi):
  - OFFERED: JavaScript (Expert)
  - NEEDED: UI Design (Beginner)

User B (Siti):
  - OFFERED: UI Design (Expert)
  - NEEDED: JavaScript (Intermediate)

Hasil:
  - Match Score: ~95%
  - Match Type: PERFECT
  - Karena nama skill cocok kedua arah
```

#### Scenario B: Category Match
```
User A (Budi):
  - OFFERED: JavaScript (Expert)
  - NEEDED: Web Design (Beginner)

User B (Siti):
  - OFFERED: UX Design (Expert)
  - NEEDED: Programming (Beginner)

Hasil:
  - Match Score: ~65%
  - Match Type: SIMILAR
  - Hanya kategori yang cocok
```

---

## 3. Workflow Berbasis State

### 3.1 State Machine Diagram

```
         ┌─────────────┐
         │  PROPOSED   │  ← Match ditemukan, kirim request
         └──────┬──────┘
                │
           ┌────┴────┐
           │         │
      Accept      Reject
           │         │
           ▼         ▼
    ┌──────────┐  ┌───────────┐
    │ ACCEPTED │  │ REJECTED  │
    └────┬─────┘  └───────────┘
         │
         ▼
    ┌───────────┐
    │IN_PROGRESS│  ← Pertukaran sedang berjalan
    └─────┬─────┘
          │
     Complete
          │
          ▼
    ┌───────────┐
    │ COMPLETED │  ← Pertukaran selesai
    └───────────┘
```

### 3.2 Detail Setiap State

#### PROPOSED (Diajukan)
- **Trigger:** User mengirim swap request setelah menemukan match
- **Status:** Menunggu respons dari penerima (User B)
- **Action yang tersedia:**
  - User B: Accept atau Reject
  - User A: Tidak ada action (hanya view)
- **Durasi:** Sampai User B merespons

#### ACCEPTED (Diterima)
- **Trigger:** User B menerima request
- **Status:** Pertukaran disetujui, siap dimulai
- **Action yang tersedia:**
  - User A: Mulai pertukaran (In Progress)
  - User B: View status
- **Durasi:** Sampai User A memulai

#### IN_PROGRESS (Sedang Berjalan)
- **Trigger:** User A memulai pertukaran
- **Status:** Pertukaran aktif berlangsung
- **Action yang tersedia:**
  - User A: View status
  - User B: Selesaikan (Complete)
- **Durasi:** Sampai pertukaran selesai

#### COMPLETED (Selesai)
- **Trigger:** User B menyelesaikan pertukaran
- **Status:** Pertukaran selesai dan tertutup
- **Action yang tersedia:** Tidak ada (read-only)
- **Durasi:** Permanent

#### REJECTED (Ditolak)
- **Trigger:** User B menolak request
- **Status:** Pertukaran dibatalkan
- **Action yang tersedia:** Tidak ada (read-only)
- **Durasi:** Permanent

### 3.3 State Transitions

#### Create Swap Request
```typescript
// POST /api/swaps
{
  "userAId": "user_a_id",
  "userBId": "user_b_id",
  "skillAId": "skill_a_id",
  "skillBId": "skill_b_id",
  "matchScore": 0.95
}
// State otomatis: PROPOSED
```

#### Update State
```typescript
// PATCH /api/swaps/[id]
{
  "state": "ACCEPTED"  // atau "IN_PROGRESS", "COMPLETED", "REJECTED"
}
```

### 3.4 Validasi Transisi

#### Dari PROPOSED:
- ✅ → ACCEPTED (User B menerima)
- ✅ → REJECTED (User B menolak)
- ❌ → IN_PROGRESS (Tidak valid)
- ❌ → COMPLETED (Tidak valid)

#### Dari ACCEPTED:
- ✅ → IN_PROGRESS (User A memulai)
- ❌ → PROPOSED (Tidak bisa balik)
- ❌ → REJECTED (Sudah diterima)
- ❌ → COMPLETED (Belum dimulai)

#### Dari IN_PROGRESS:
- ✅ → COMPLETED (User B menyelesaikan)
- ❌ → PROPOSED (Tidak valid)
- ❌ → ACCEPTED (Tidak valid)
- ❌ → REJECTED (Sudah berjalan)

#### Dari COMPLETED:
- ❌ Semua transisi (Final state)

#### Dari REJECTED:
- ❌ Semua transisi (Final state)

### 3.5 Implementation di Frontend

#### Accept Request
```typescript
const handleAccept = async (swapId: string) => {
  await fetch(`/api/swaps/${swapId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: 'ACCEPTED' })
  })
  // State berubah ke ACCEPTED
  // User A dapat melihat tombol "Mulai Pertukaran"
}
```

#### Start Swap
```typescript
const handleStart = async (swapId: string) => {
  await fetch(`/api/swaps/${swapId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: 'IN_PROGRESS' })
  })
  // State berubah ke IN_PROGRESS
  // User B dapat melihat tombol "Selesaikan"
}
```

#### Complete Swap
```typescript
const handleComplete = async (swapId: string) => {
  await fetch(`/api/swaps/${swapId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: 'COMPLETED' })
  })
  // State berubah ke COMPLETED
  // Pertukaran selesai
}
```

### 3.6 UI State Indicators

Setiap state memiliki visual indicator yang berbeda:

| State | Color | Icon | Label |
|-------|-------|-------|-------|
| PROPOSED | Amber | Clock | "Diajukan" |
| ACCEPTED | Emerald | CheckCircle2 | "Diterima" |
| IN_PROGRESS | Blue | Clock | "Sedang Berjalan" |
| COMPLETED | Green | CheckCircle2 | "Selesai" |
| REJECTED | Red | XCircle | "Ditolak" |

---

## 4. End-to-End Workflow Example

### Scenario: Budi bertukar JavaScript dengan UI Design

#### Step 1: Setup Skills
```
Budi:
  - OFFERED: JavaScript (Expert)
  - NEEDED: UI Design (Beginner)

Siti:
  - OFFERED: UI Design (Expert)
  - NEEDED: JavaScript (Intermediate)
```

#### Step 2: Budi mencari match
```
GET /api/matches?userId=budi_id

Response:
[{
  "userBId": "siti_id",
  "mySkillName": "JavaScript",
  "theirSkillName": "UI Design",
  "matchScore": 0.957,
  "matchType": "PERFECT"
}]
```

#### Step 3: Budi kirim request
```
POST /api/swaps
{
  "userAId": "budi_id",
  "userBId": "siti_id",
  "skillAId": "budi_js_id",
  "skillBId": "siti_ui_id",
  "matchScore": 0.957
}

State: PROPOSED
```

#### Step 4: Siti melihat request
```
GET /api/swaps?userId=siti_id

Response:
[{
  "id": "swap_id",
  "userAId": "budi_id",
  "userBId": "siti_id",
  "userAName": "Budi Santoso",
  "skillAName": "JavaScript",
  "skillBName": "UI Design",
  "matchScore": 0.957,
  "state": "PROPOSED"
}]

Siti dapat: Accept atau Reject
```

#### Step 5: Siti accept
```
PATCH /api/swaps/swap_id
{
  "state": "ACCEPTED"
}

State: ACCEPTED
Budi dapat: Mulai Pertukaran
```

#### Step 6: Budi mulai pertukaran
```
PATCH /api/swaps/swap_id
{
  "state": "IN_PROGRESS"
}

State: IN_PROGRESS
Siti dapat: Selesaikan
```

#### Step 7: Siti selesaikan
```
PATCH /api/swaps/swap_id
{
  "state": "COMPLETED"
}

State: COMPLETED
Workflow selesai! ✓
```

---

## 5. API Summary

### Skill Management
```
GET    /api/skills          - Get all skills
POST   /api/skills          - Create skill
DELETE /api/skills/[id]     - Delete skill
```

### Matching
```
GET /api/matches?userId=X   - Find matches using Two-Way algorithm
```

### Swap Requests
```
GET    /api/swaps           - Get swap requests
POST   /api/swaps           - Create swap request (State: PROPOSED)
PATCH  /api/swaps/[id]      - Update state
DELETE /api/swaps/[id]      - Delete swap request
```

---

## 6. Testing Checklist

### Two-Way Matching
- [ ] Match hanya muncul jika kedua arah cocok
- [ ] Match score dihitung benar (0-100%)
- [ ] Perfect match vs Similar match terbedakan
- [ ] Duplikat dihilangkan
- [ ] Sorted by score (highest first)
- [ ] Minimum threshold 40% bekerja

### State Workflow
- [ ] PROPOSED saat request dibuat
- [ ] User B dapat Accept/Reject
- [ ] Accepted → In Progress (User A)
- [ ] In Progress → Completed (User B)
- [ ] Rejected dan Completed adalah final state
- [ ] Invalid transitions ditolak

### UI/UX
- [ ] Skill card tampil dengan jelas
- [ ] Match score ditampilkan
- [ ] State badges dengan warna berbeda
- [ ] Action buttons muncul sesuai role/state
- [ ] Toast notifications muncul
- [ ] Loading states berjalan
- [ ] Error handling benar

---

## 7. Troubleshooting

### Match tidak ditemukan?
- Pastikan punya minimal 1 OFFERED dan 1 NEEDED skill
- Cek apakah ada user lain dengan skill yang relevan
- Pastikan match score >= 40%

### State tidak berubah?
- Cek apakah user punya permission untuk transisi
- Pastikan state transition valid
- Lihat console untuk error messages

### Duplicate match?
- Sudah ada logic untuk remove duplicates
- Cek apakah skill ID berbeda (skill sama tapi ID beda)

---

## ✅ Status Implementasi

Saat ini SEMUA fungsionalitas inti Sesi 2 sudah diimplementasikan:

1. ✅ **Profil & Keahlian User**
   - Menambah keahlian ditawarkan
   - Menambah keahlian dibutuhkan
   - Tampilan kartu skill

2. ✅ **Two-Way Matching Algorithm**
   - Validasi dua arah (A butuh B, B butuh A)
   - Match score calculation
   - Filtering & sorting

3. ✅ **Workflow Berbasis State**
   - 5 states lengkap
   - Validasi transisi
   - UI state indicators

Aplikasi siap untuk testing dan demo! 🚀
