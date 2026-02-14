# Manajemen & Monitoring – Dashboard Admin

## 📋 Dokumentasi Lengkap

---

## 1. Dashboard Ringkasan Admin

### 1.1 Metrik yang Ditampilkan

Dashboard admin menampilkan 4 metrik utama:

#### Total User Terdaftar
- **Deskripsi**: Jumlah seluruh pengguna yang terdaftar di platform
- **Detail**:
  - Jumlah user aktif (badge emerald)
  - Jumlah user disuspend (badge merah)
- **API**: `GET /api/admin/metrics`
- **Data**: `metrics.totalUsers`, `metrics.activeUsers`, `metrics.suspendedUsers`

#### Total Skill Aktif
- **Deskripsi**: Jumlah seluruh keahlian yang terdaftar di platform
- **Detail**:
  - Jumlah skill ditawarkan (badge indigo)
  - Jumlah skill dicari (badge biru)
- **API**: `GET /api/admin/metrics`
- **Data**: `metrics.totalSkills`, `metrics.offeredSkills`, `metrics.neededSkills`

#### Total Swap Berlangsung
- **Deskripsi**: Jumlah pertukaran yang sedang aktif (bukan COMPLETED/REJECTED)
- **Detail**:
  - PROPOSED: Badge biru
  - ACCEPTED: Badge emerald
  - IN PROGRESS: Badge ungu
- **API**: `GET /api/admin/metrics`
- **Data**: `metrics.activeSwaps`, `metrics.swapsByState.PROPOSED`, `metrics.swapsByState.ACCEPTED`, `metrics.swapsByState.IN_PROGRESS`

#### Total Swap Selesai (Completed)
- **Deskripsi**: Jumlah pertukaran yang sudah selesai
- **Detail**:
  - REJECTED: Badge emerald
  - Recent (7 hari): Jumlah swap dalam 7 hari terakhir
- **API**: `GET /api/admin/metrics`
- **Data**: `metrics.completedSwaps`, `metrics.swapsByState.REJECTED`, `metrics.recentSwaps`

### 1.2 API Endpoint

```typescript
// GET /api/admin/metrics
// Returns comprehensive admin metrics
{
  "totalUsers": 6,
  "totalSkills": 15,
  "activeSwaps": 2,
  "completedSwaps": 8,
  "activeUsers": 5,
  "suspendedUsers": 1,
  "recentSwaps": 3,
  "offeredSkills": 9,
  "neededSkills": 6,
  "swapsByState": {
    "PROPOSED": 1,
    "ACCEPTED": 1,
    "IN_PROGRESS": 0,
    "COMPLETED": 8,
    "REJECTED": 0
  }
}
```

### 1.3 UI Implementation

**Component**: `AdminDashboard` → `activeTab === 'admin-dashboard'`

**Layout**:
- 4 Cards dalam grid 2x2 (mobile: 1x4)
- Setiap card dengan border-left color coding
- Icon dan title di header
- Detail metrics di body
- Quick actions di bawah

**Visual Indicators**:
- **Total Users**: Border-left indigo
- **Total Skills**: Border-left emerald
- **Active Swaps**: Border-left amber
- **Completed Swaps**: Border-left blue

---

## 2. Manajemen User

### 2.1 Fitur Utama

#### Tabel Daftar Users
Menampilkan semua pengguna dalam format tabel dengan kolom:
- **User**: Avatar, nama, email, bio
- **Role**: Badge USER/ADMIN
- **Rating**: Star icon + rating (0-5)
- **Skills**: Jumlah offered/needed, list skill names
- **Status**: Badge Aktif/Suspend
- **Actions**: Button Suspend/Activate

#### Lihat Detail Skill yang Dimiliki User
- Menampilkan jumlah skill offered dan needed
- List nama skill yang ditawarkan (max 3 visible)
- Badge untuk setiap skill dengan type

#### Opsi Simulasi Suspend / Activate User
- **Suspend**: Menonaktifkan user (isActive = false)
- **Activate**: Mengaktifkan user (isActive = true)
- Admin tidak bisa di-suspend (disabled button)

### 2.2 API Endpoints

```typescript
// GET /api/admin/users?includeSkills=true
// Returns all users with their skills
[
  {
    "id": "user_id",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "USER",
    "bio": "...",
    "rating": 4.7,
    "isActive": true,
    "skills": {
      "offered": [
        {
          "id": "skill_id",
          "skillName": "JavaScript",
          "skillCategory": "Programming",
          "skillLevel": "Expert",
          "type": "OFFERED"
        }
      ],
      "needed": [...]
    }
  }
]

// PATCH /api/admin/users/[id]
// Toggle user status
{
  "isActive": true  // true = activate, false = suspend
}
```

### 2.3 State Management

#### Suspend Flow
1. Admin klik "Suspend" pada user
2. Confirm dialog muncul (opsional)
3. API call: `PATCH /api/admin/users/[id]` dengan `isActive: false`
4. Toast: "User ditangguhkan"
5. UI refresh: Badge berubah ke merah "Suspend"
6. User di-suspend tidak dapat membuat swap request baru

#### Activate Flow
1. Admin klik "Activate" pada user yang disuspend
2. API call: `PATCH /api/admin/users/[id]` dengan `isActive: true`
3. Toast: "User diaktifkan"
4. UI refresh: Badge berubah ke emerald "Aktif"
5. User dapat kembali beraktivitas

### 2.4 UI Implementation

**Component**: `AdminDashboard` → `activeTab === 'admin-users'`

**Table Features**:
- **Responsive**: Scrollable pada mobile
- **Hover Effect**: Row berubah background saat hover
- **Sort**: Default sort by createdAt (newest first)
- **Pagination**: (future feature)

**Column Details**:

| Kolom | Width | Content |
|-------|-------|---------|
| User | 250px | Avatar, nama, email, bio (50 chars) |
| Role | 80px | Badge USER/ADMIN |
| Rating | 80px | Star icon + number |
| Skills | 200px | 2 badges + skill names |
| Status | 80px | Badge Aktif/Suspend |
| Actions | 100px | Button |

---

## 3. Monitoring Skill Swap

### 3.1 Fitur Utama

#### Tabel Semua Swap_Requests
Menampilkan semua swap requests dalam format tabel dengan kolom:
- **Swap ID**: ID unik (first 8 chars + ...)
- **User A**: Nama user + status badge
- **User B**: Nama user + status badge
- **Skills**: Skill A ↔ Skill B dengan color coding
- **Match Score**: Badge persentase (0-100%)
- **State**: Badge dengan icon dan label
- **Actions**: Buttons berdasarkan state

#### Filter Berdasarkan State
Dropdown filter untuk memilih:
- **ALL**: Semua swaps
- **PROPOSED**: Hanya yang diajukan
- **ACCEPTED**: Hanya yang diterima
- **IN_PROGRESS**: Hanya yang sedang berjalan
- **COMPLETED**: Hanya yang selesai
- **REJECTED**: Hanya yang ditolak

#### Admin Actions

##### Mengubah State (Simulasi Moderasi)
Admin dapat mengubah state swap terlepas dari normal workflow:

**PROPOSED** → Admin dapat:
- **Accept**: Mengubah ke ACCEPTED
- **Reject**: Mengubah ke REJECTED

**ACCEPTED** → Admin dapat:
- **Start**: Mengubah ke IN_PROGRESS

**IN_PROGRESS** → Admin dapat:
- **Complete**: Mengubah ke COMPLETED

**COMPLETED/REJECTED** → Tidak ada action (final state)

##### Menghapus Swap Bermasalah
- Hapus swap dari database
- Confirm dialog: "Apakah Anda yakin ingin menghapus pertukaran ini?"
- Button "Hapus" disabled untuk COMPLETED/REJECTED

### 3.2 API Endpoints

```typescript
// GET /api/admin/swaps?state=ALL
// Returns all swaps with optional state filter
[
  {
    "id": "swap_id",
    "userAId": "user_a_id",
    "userBId": "user_b_id",
    "userAName": "Budi Santoso",
    "userBName": "Siti Rahayu",
    "userAActive": true,
    "userBActive": true,
    "skillAId": "skill_a_id",
    "skillBId": "skill_b_id",
    "skillAName": "JavaScript",
    "skillBName": "UI Design",
    "matchScore": 0.957,
    "state": "PROPOSED",
    "message": "...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]

// PATCH /api/swaps/[id]
// Update swap state (same API as user)
{
  "state": "ACCEPTED"  // or any valid state
}

// DELETE /api/swaps/[id]
// Delete swap (admin only for problematic swaps)
```

### 3.3 State Transition Matrix (Admin View)

| Current State | Admin Can | New State | Result |
|--------------|-----------|------------|--------|
| PROPOSED | Accept | ACCEPTED | Swap diterima admin |
| PROPOSED | Reject | REJECTED | Swap ditolak admin |
| PROPOSED | Delete | - | Swap dihapus |
| ACCEPTED | Start | IN_PROGRESS | Swap dimulai admin |
| ACCEPTED | Delete | - | Swap dihapus |
| IN_PROGRESS | Complete | COMPLETED | Swap diselesaikan admin |
| IN_PROGRESS | Delete | - | Swap dihapus |
| COMPLETED | - | - | Final state, no action |
| REJECTED | - | - | Final state, no action |

### 3.4 UI Implementation

**Component**: `AdminDashboard` → `activeTab === 'admin-swaps'`

**Table Features**:
- **Responsive**: Scrollable, max-height 600px
- **Sticky Header**: Header tetap saat scroll
- **State Filter**: Dropdown di atas kanan
- **Row Hover**: Background berubah saat hover
- **Actions Column**: 2 buttons vertikal

**Visual Indicators**:

| State | Badge Style | Icon |
|-------|------------|-------|
| PROPOSED | Amber | Clock |
| ACCEPTED | Emerald | CheckCircle2 |
| IN_PROGRESS | Blue | Clock |
| COMPLETED | Green | CheckCircle2 |
| REJECTED | Red | XCircle |

---

## 4. Complete Workflow Examples

### Example 1: Suspend Problematic User

**Scenario**: User melanggar aturan platform

1. Admin buka menu "Kelola Pengguna"
2. Admin scroll ke user bermasalah
3. Admin klik button "Suspend"
4. System:
   - API call: `PATCH /api/admin/users/[id]`
   - Body: `{ "isActive": false }`
   - Database: Update user.isActive = false
5. UI:
   - Toast: "User ditangguhkan"
   - Badge berubah: "Aktif" (emerald) → "Suspend" (merah)
   - Avatar background: indigo → gray
6. Effect:
   - User tidak bisa login/membuat swap baru
   - Existing swaps tetap berjalan

### Example 2: Restore Suspended User

**Scenario**: User memohon untuk di-activate kembali

1. Admin buka menu "Kelola Pengguna"
2. Admin cari user yang disuspend
3. Admin klik button "Activate"
4. System:
   - API call: `PATCH /api/admin/users/[id]`
   - Body: `{ "isActive": true }`
   - Database: Update user.isActive = true
5. UI:
   - Toast: "User diaktifkan"
   - Badge berubah: "Suspend" (merah) → "Aktif" (emerald)
   - Avatar background: gray → indigo
6. Effect:
   - User dapat kembali beraktivitas
   - User dapat membuat swap baru

### Example 3: Admin Moderates Swap

**Scenario**: Laporan bermasalah pada swap tertentu

1. Admin buka menu "Monitoring Swap"
2. Admin filter state: "PROPOSED"
3. Admin cari swap bermasalah
4. Admin klik button "Reject"
5. System:
   - API call: `PATCH /api/swaps/[id]`
   - Body: `{ "state": "REJECTED" }`
   - Database: Update swap.state = "REJECTED"
6. UI:
   - Toast: "Status diperbarui"
   - Badge berubah: Amber → Merah
   - Button hilang (final state)
7. Effect:
   - User tidak bisa melanjutkan swap
   - User dapat membuat swap request baru dengan user lain

### Example 4: Delete Problematic Swap

**Scenario**: Swap bermasalah dan perlu dihapus

1. Admin buka menu "Monitoring Swap"
2. Admin cari swap bermasalah
3. Admin klik button "Hapus"
4. System:
   - Confirm dialog: "Apakah Anda yakin...?"
   - API call: `DELETE /api/swaps/[id]`
   - Database: Delete swap record
5. UI:
   - Toast: "Pertukaran dihapus"
   - Row hilang dari tabel
6. Effect:
   - Swap benar-benar dihapus
   - Tidak bisa dikembalikan

---

## 5. Testing Checklist

### Dashboard Metrics
- [ ] Total user terdaftar tampil benar
- [ ] Active/suspended count accurate
- [ ] Total skill dengan breakdown offered/needed
- [ ] Active swap dengan breakdown by state
- [ ] Completed swap dengan rejected count
- [ ] Recent swaps (7 hari) accurate

### User Management
- [ ] Table menampilkan semua users
- [ ] User details lengkap (avatar, name, email, bio)
- [ ] Role badge tampil dengan warna berbeda
- [ ] Rating dengan star icon
- [ ] Skills count dan list tampil
- [ ] Status badge Aktif/Suspend
- [ ] Suspend button bekerja
- [ ] Activate button bekerja
- [ ] Admin tidak bisa di-suspend
- [ ] Toast notification muncul
- [ ] UI refresh setelah action

### Swap Monitoring
- [ ] Table menampilkan semua swaps
- [ ] State filter dropdown bekerja
- [ ] Filter ALL menampilkan semua
- [ ] Filter PROPOSED hanya menampilkan proposed
- [ ] Swap ID tampil (truncated)
- [ ] User A dan User B dengan status badge
- [ ] Skills tampil dengan color coding
- [ ] Match score tampil
- [ ] State badge dengan icon
- [ ] Action buttons sesuai state:
  - [ ] PROPOSED: Accept + Reject + Delete
  - [ ] ACCEPTED: Start + Delete
  - [ ] IN_PROGRESS: Complete + Delete
  - [ ] COMPLETED: No buttons
  - [ ] REJECTED: No buttons
- [ ] Delete disabled untuk COMPLETED/REJECTED
- [ ] Confirm dialog untuk delete
- [ ] Toast notification muncul
- [ ] UI refresh setelah action

---

## 6. Database Schema Updates

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      String   @default("USER")
  bio       String?
  rating    Float    @default(0)
  avatar    String?
  isActive  Boolean  @default(true)  // NEW!
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  skills       Skill[]
  swapRequestsAsUserA SwapRequest[]
  swapRequestsAsUserB SwapRequest[]
}
```

**Field Baru**: `isActive`
- Type: Boolean
- Default: true
- Purpose: Control user account status

---

## 7. Security Considerations

### User Management
- Admin tidak bisa di-suspend (validasi di backend dan frontend)
- Suspend/Activate hanya bisa dilakukan oleh role ADMIN
- User yang disuspend tetap bisa dilihat di table tapi dengan status berbeda

### Swap Moderation
- Admin dapat mengubah state swap terlepas normal workflow
- Delete hanya untuk swap bermasalah (COMPLETED/REJECTED disable)
- Confirm dialog untuk prevent accidental delete
- Audit trail: updatedAt field tracks changes

---

## 8. Performance Optimization

### Metrics API
- Single query untuk semua metrics
- Menggunakan aggregate queries (count)
- Caching: 5-10 menit (future)

### Users API
- Lazy loading skills dengan `includeSkills` query param
- Pagination (future: limit/offset)
- Index pada `isActive` field

### Swaps API
- State filter di database query
- Sticky header untuk better UX saat scroll
- Max-height table untuk performance

---

## 9. Future Enhancements

### Dashboard Metrics
- [ ] Trend graph (users/skills/swaps over time)
- [ ] User retention rate
- [ ] Average swap completion time
- [ ] Most popular skills
- [ ] User demographics

### User Management
- [ ] Search/filter users
- [ ] Sort by name/email/rating
- [ ] Export user list to CSV
- [ ] Bulk suspend/activate
- [ ] User activity log
- [ ] Edit user profile

### Swap Monitoring
- [ ] Advanced filtering (date range, user, skill)
- [ ] Sort by any column
- [ ] Export swap data to CSV
- [ ] Swap activity timeline
- [ ] Flag problematic swaps
- [ ] Admin notes/comments

---

## 10. API Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/metrics` | GET | Get all admin metrics |
| `/api/admin/users` | GET | Get users (with skills) |
| `/api/admin/users/[id]` | PATCH | Toggle user status |
| `/api/admin/swaps` | GET | Get swaps (with filter) |
| `/api/swaps/[id]` | PATCH | Update swap state |
| `/api/swaps/[id]` | DELETE | Delete swap (admin) |

---

## ✅ Status Implementation

Semua fitur manajemen & monitoring admin sudah diimplementasikan:

✅ **Dashboard Ringkasan Admin**
   - Total user terdaftar + active/suspended count
   - Total skill aktif + offered/needed breakdown
   - Total swap berlangsung + state breakdown
   - Total swap selesai + rejected + recent

✅ **Manajemen User**
   - Tabel daftar users lengkap
   - Detail skill yang dimiliki user
   - Opsi suspend/activate user
   - Avatar dengan status color coding
   - Role dan rating display

✅ **Monitoring Skill Swap**
   - Tabel semua swap requests
   - Filter berdasarkan state
   - Admin dapat mengubah state (simulasi moderasi)
   - Admin dapat menghapus swap bermasalah
   - Sticky header untuk scroll
   - Action buttons sesuai state

**Aplikasi siap untuk testing!** 🚀
