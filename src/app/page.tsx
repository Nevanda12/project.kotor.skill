'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ArrowRightLeft, 
  Settings,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Search,
  Star
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import DataInitializer from '@/components/DataInitializer'

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  bio?: string
  rating: number
}

interface Skill {
  id: string
  userId: string
  skillName: string
  skillCategory: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Expert'
  type: 'OFFERED' | 'NEEDED'
  userName?: string
}

interface SwapRequest {
  id: string
  userAId: string
  userBId: string
  skillAId: string
  skillBId: string
  matchScore: number
  state: 'PROPOSED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  message?: string
  userAName?: string
  userBName?: string
  skillAName?: string
  skillBName?: string
}

// ==========================================
// COMPONENT: LOGIN & REGISTER PAGE
// ==========================================
function LoginPage({ onLogin, loadData }: { onLogin: (email: string, pass: string) => void, loadData: () => void }) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (isLoginMode) {
      // PROSES LOGIN (Kirim email dan password ke komponen utama)
      onLogin(email, password)
      setIsLoading(false)
    } else {
      // PROSES REGISTER
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: 'USER' })
        })
        const data = await res.json()

        if (res.ok) {
          toast({
            title: 'Pendaftaran Berhasil!',
            description: 'Akun Anda telah dibuat. Silakan login dengan password Anda.',
          })
          setIsLoginMode(true) // Kembali ke halaman login
          setPassword('')      // Kosongkan field password untuk keamanan
          loadData()           // Refresh data user
        } else {
          toast({
            title: 'Pendaftaran Gagal',
            description: data.error || 'Email mungkin sudah digunakan.',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Register error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-indigo-600">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ArrowRightLeft className="w-6 h-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLoginMode ? 'Masuk ke SkillSwap' : 'Daftar Akun Baru'}
          </CardTitle>
          <CardDescription>
            {isLoginMode ? 'Platform barter keahlian untuk mahasiswa.' : 'Bergabunglah untuk mulai bertukar keahlian.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  required={!isLoginMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Kampus / Umum</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : (isLoginMode ? 'Masuk Sekarang' : 'Daftar Akun')}
            </Button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              {isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
              <button 
                type="button" 
                onClick={() => {
                  setIsLoginMode(!isLoginMode)
                  setPassword('') // Reset password saat ganti tab
                }}
                className="text-indigo-600 font-semibold hover:underline"
              >
                {isLoginMode ? "Daftar di sini" : "Login di sini"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function SkillSwapPlatform() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')
  const [skills, setSkills] = useState<Skill[]>([])
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const skillsRes = await fetch('/api/skills')
      if (skillsRes.ok) setSkills(await skillsRes.json())

      const swapsRes = await fetch('/api/swaps')
      if (swapsRes.ok) setSwapRequests(await swapsRes.json())

      const usersRes = await fetch('/api/users')
      if (usersRes.ok) setUsers(await usersRes.json())
      
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  // FUNGSI LOGIN AMAN KE BACKEND
  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setCurrentUser(data)
        setRole(data.role)
        setIsAuthenticated(true)
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang kembali, ${data.name}!`,
        })
      } else {
        toast({
          title: 'Login Gagal',
          description: data.error || 'Email atau password salah.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal terhubung ke server.',
        variant: 'destructive'
      })
    }
  }

  const switchRole = () => {
    setRole(role === 'USER' ? 'ADMIN' : 'USER')
    if (role === 'USER' && users.find(u => u.role === 'ADMIN')) {
      setCurrentUser(users.find(u => u.role === 'ADMIN') || null)
    } else if (role === 'ADMIN') {
      setCurrentUser(users.find(u => u.role === 'USER') || null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Skill Swap Platform...</p>
        </div>
      </div>
    )
  }

  // PROTEKSI APLIKASI
  if (!isAuthenticated) {
    return (
      <>
        <DataInitializer />
        <LoginPage onLogin={handleLogin} loadData={loadInitialData} />
      </>
    )
  }

  return (
    <>
      <DataInitializer />
      <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        {/* Sidebar Navigation */}
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">SkillSwap</h1>
                <p className="text-xs text-gray-500">Platform Tukar Keahlian</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
                      <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>
                      <BookOpen className="w-5 h-5" /><span>Keahlian Saya</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'matches'} onClick={() => setActiveTab('matches')}>
                      <Search className="w-5 h-5" /><span>Cari Cocok</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'swaps'} onClick={() => setActiveTab('swaps')}>
                      <ArrowRightLeft className="w-5 h-5" /><span>Pertukaran</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {role === 'ADMIN' && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === 'admin-dashboard'} onClick={() => setActiveTab('admin-dashboard')}>
                          <LayoutDashboard className="w-5 h-5" /><span>Dashboard Admin</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === 'admin-users'} onClick={() => setActiveTab('admin-users')}>
                          <Users className="w-5 h-5" /><span>Kelola Pengguna</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === 'admin-swaps'} onClick={() => setActiveTab('admin-swaps')}>
                          <TrendingUp className="w-5 h-5" /><span>Monitoring Swap</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-gray-200">
            <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-0 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-white/20">
                    <AvatarFallback className="bg-indigo-500 text-white font-semibold">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{currentUser?.name}</p>
                    <p className="text-xs text-indigo-200">{role === 'USER' ? 'User' : 'Admin'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white mb-2" onClick={switchRole}>
                  Switch to {role === 'USER' ? 'Admin' : 'User'}
                </Button>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => { setIsAuthenticated(false); setCurrentUser(null); }}>
                  Keluar (Logout)
                </Button>
              </CardContent>
            </Card>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {role === 'USER' ? 'Dashboard Pengguna' : 'Dashboard Admin'}
              </h2>
            </div>

            {role === 'USER' && (
              <UserDashboard
                currentUser={currentUser}
                activeTab={activeTab}
                skills={skills}
                swapRequests={swapRequests}
                users={users}
                setActiveTab={setActiveTab}
                loadData={loadInitialData}
              />
            )}

            {role === 'ADMIN' && (
              <AdminDashboard
                activeTab={activeTab}
                skills={skills}
                swapRequests={swapRequests}
                users={users}
                setActiveTab={setActiveTab}
                loadData={loadInitialData}
              />
            )}
          </div>
        </main>
      </div>
      </SidebarProvider>
    </>
  )
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function UserDashboard({ currentUser, activeTab, skills, swapRequests, users, setActiveTab, loadData }: any) {
  const userSkills = skills.filter((s: Skill) => s.userId === currentUser?.id)
  const offeredSkills = userSkills.filter((s: Skill) => s.type === 'OFFERED')
  const neededSkills = userSkills.filter((s: Skill) => s.type === 'NEEDED')
  
  const userSwaps = swapRequests.filter((s: SwapRequest) => s.userAId === currentUser?.id || s.userBId === currentUser?.id)
  const pendingSwaps = userSwaps.filter((s: SwapRequest) => s.state === 'PROPOSED' && s.userBId === currentUser?.id)
  const activeSwaps = userSwaps.filter((s: SwapRequest) => ['ACCEPTED', 'IN_PROGRESS'].includes(s.state))
  const completedSwaps = userSwaps.filter((s: SwapRequest) => s.state === 'COMPLETED')

  const handleSwapAction = async (swapId: string, action: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: action })
      })
      if (res.ok) {
        toast({ title: 'Status diperbarui', description: `Pertukaran telah ${action === 'ACCEPTED' ? 'Diterima' : 'Ditolak'}` })
        loadData() 
      }
    } catch (error) { console.error(error) }
  }

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-indigo-600"><CardHeader className="pb-2"><CardDescription>Keahlian Ditawarkan</CardDescription><CardTitle className="text-3xl">{offeredSkills.length}</CardTitle></CardHeader></Card>
          <Card className="border-l-4 border-emerald-600"><CardHeader className="pb-2"><CardDescription>Keahlian Dicari</CardDescription><CardTitle className="text-3xl">{neededSkills.length}</CardTitle></CardHeader></Card>
          <Card className="border-l-4 border-amber-600"><CardHeader className="pb-2"><CardDescription>Pertukaran Aktif</CardDescription><CardTitle className="text-3xl">{activeSwaps.length}</CardTitle></CardHeader></Card>
          <Card className="border-l-4 border-blue-600"><CardHeader className="pb-2"><CardDescription>Selesai</CardDescription><CardTitle className="text-3xl">{completedSwaps.length}</CardTitle></CardHeader></Card>
        </div>

        {pendingSwaps.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-600" />Permintaan Menunggu ({pendingSwaps.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingSwaps.map((swap: SwapRequest) => {
                  const requester = users.find((u: User) => u.id === swap.userAId)
                  return (
                    <div key={swap.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12"><AvatarFallback>{requester?.name?.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-semibold">{requester?.name}</p>
                          <p className="text-sm">Tukar <span className="font-medium text-indigo-600">{swap.skillAName}</span> dgn <span className="font-medium text-emerald-600">{swap.skillBName}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600" onClick={() => handleSwapAction(swap.id, 'ACCEPTED')}><CheckCircle2 className="w-4 h-4 mr-1" />Terima</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleSwapAction(swap.id, 'REJECTED')}><XCircle className="w-4 h-4 mr-1" />Tolak</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Aktivitas Terbaru</CardTitle></CardHeader>
          <CardContent>
            {userSwaps.length === 0 ? (
              <div className="text-center py-8 text-gray-500"><p>Belum ada pertukaran</p></div>
            ) : (
              <div className="space-y-3">{userSwaps.slice(0, 5).map((swap: SwapRequest) => (<SwapRequestCard key={swap.id} swap={swap} currentUser={currentUser} users={users} onUpdateState={handleSwapAction} />))}</div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeTab === 'skills') return <SkillsManagement currentUser={currentUser} skills={skills} loadData={loadData} />
  if (activeTab === 'matches') return <MatchingSystem currentUser={currentUser} skills={skills} users={users} swapRequests={swapRequests} loadData={loadData} />
  if (activeTab === 'swaps') return <SwapRequestsList currentUser={currentUser} swapRequests={swapRequests} users={users} loadData={loadData} />
  return null
}

function AdminDashboard({ activeTab, loadData }: any) {
  const [users, setUsers] = useState<any[]>([])
  const [swaps, setSwaps] = useState<any[]>([])
  const [swapFilter, setSwapFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAdminData() }, [swapFilter])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const usersRes = await fetch('/api/admin/users?includeSkills=true')
      if (usersRes.ok) setUsers(await usersRes.json())

      const swapsRes = await fetch(`/api/admin/swaps?state=${swapFilter}`)
      if (swapsRes.ok) setSwaps(await swapsRes.json())
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  const handleDeleteSwap = async (swapId: string) => {
    if (!confirm('Hapus pertukaran ini?')) return
    try {
      const res = await fetch(`/api/swaps/${swapId}`, { method: 'DELETE' })
      if (res.ok) { toast({ title: 'Dihapus' }); loadAdminData() }
    } catch (error) { console.error(error) }
  }

  if (loading) return <div className="p-8 text-center">Loading Admin Data...</div>

  if (activeTab === 'admin-users') {
    return (
      <Card><CardContent className="p-0">
        <table className="w-full text-left">
          <thead className="bg-gray-50"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th></tr></thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-4">{u.name}<br/><span className="text-sm text-gray-500">{u.email}</span></td>
                <td className="p-4"><Badge>{u.role}</Badge></td>
                <td className="p-4"><Badge variant={u.isActive ? "default" : "destructive"}>{u.isActive ? 'Aktif' : 'Suspend'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    )
  }

  if (activeTab === 'admin-swaps') {
    return (
      <div className="space-y-4">
        <select className="p-2 border" value={swapFilter} onChange={e => setSwapFilter(e.target.value)}>
          <option value="ALL">Semua</option><option value="PROPOSED">Diajukan</option><option value="ACCEPTED">Diterima</option>
        </select>
        <Card><CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50"><tr><th className="p-4">Users</th><th className="p-4">Skills</th><th className="p-4">State</th><th className="p-4">Action</th></tr></thead>
            <tbody className="divide-y">
              {swaps.map(s => (
                <tr key={s.id}>
                  <td className="p-4">{s.userAName} & {s.userBName}</td>
                  <td className="p-4">{s.skillAName} ↔ {s.skillBName}</td>
                  <td className="p-4"><SwapStateBadge state={s.state} /></td>
                  <td className="p-4"><Button variant="destructive" size="sm" onClick={() => handleDeleteSwap(s.id)}>Hapus</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent></Card>
      </div>
    )
  }
}

function SkillsManagement({ currentUser, skills, loadData }: any) {
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [formData, setFormData] = useState({ skillName: '', skillCategory: '', skillLevel: 'Beginner' as any, type: 'OFFERED' as any })
  const userSkills = skills.filter((s: Skill) => s.userId === currentUser?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, userId: currentUser?.id }) })
      if (res.ok) { toast({ title: 'Keahlian ditambahkan' }); setFormData({ skillName: '', skillCategory: '', skillLevel: 'Beginner', type: 'OFFERED' }); setShowAddSkill(false); loadData() }
    } catch (error) { console.error(error) }
  }

  const handleDelete = async (skillId: string) => {
    try {
      const res = await fetch(`/api/skills/${skillId}`, { method: 'DELETE' })
      if (res.ok) { toast({ title: 'Keahlian dihapus' }); loadData() }
    } catch (error) { console.error(error) }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-2xl font-bold">Kelola Keahlian</h3><Button onClick={() => setShowAddSkill(!showAddSkill)}><Plus className="w-4 h-4 mr-2" />Tambah Keahlian</Button></div>
      {showAddSkill && (
        <Card><CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm block">Nama Keahlian</label><input type="text" className="w-full p-2 border rounded" value={formData.skillName} onChange={e => setFormData({...formData, skillName: e.target.value})} required /></div>
                <div><label className="text-sm block">Kategori</label><input type="text" className="w-full p-2 border rounded" value={formData.skillCategory} onChange={e => setFormData({...formData, skillCategory: e.target.value})} required /></div>
                <div><label className="text-sm block">Tingkat</label><select className="w-full p-2 border rounded" value={formData.skillLevel} onChange={e => setFormData({...formData, skillLevel: e.target.value as any})}><option value="Beginner">Pemula</option><option value="Intermediate">Menengah</option><option value="Expert">Ahli</option></select></div>
                <div><label className="text-sm block">Tipe</label><select className="w-full p-2 border rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}><option value="OFFERED">Ditawarkan</option><option value="NEEDED">Dicari</option></select></div>
              </div>
              <div className="flex gap-2"><Button type="submit">Simpan</Button><Button type="button" variant="outline" onClick={() => setShowAddSkill(false)}>Batal</Button></div>
          </form>
        </CardContent></Card>
      )}
      <div className="grid grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle><Badge className="bg-indigo-600">Ditawarkan</Badge></CardTitle></CardHeader><CardContent>{userSkills.filter((s: Skill) => s.type === 'OFFERED').map((skill: Skill) => (<SkillCard key={skill.id} skill={skill} onDelete={handleDelete} />))}</CardContent></Card>
        <Card><CardHeader><CardTitle><Badge className="bg-emerald-600">Dicari</Badge></CardTitle></CardHeader><CardContent>{userSkills.filter((s: Skill) => s.type === 'NEEDED').map((skill: Skill) => (<SkillCard key={skill.id} skill={skill} onDelete={handleDelete} />))}</CardContent></Card>
      </div>
    </div>
  )
}

function MatchingSystem({ currentUser, users, swapRequests, loadData }: any) {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const findMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/matches?userId=${currentUser?.id}`)
      if (res.ok) setMatches(await res.json())
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  const sendSwapRequest = async (match: any) => {
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAId: currentUser?.id, userBId: match.userBId, skillAId: match.mySkillId, skillBId: match.theirSkillId, matchScore: match.matchScore })
      })
      if (res.ok) { toast({ title: 'Permintaan dikirim' }); loadData() }
    } catch (error) { console.error(error) }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-2xl font-bold">Cari Cocok</h3><Button onClick={findMatches} disabled={loading}>{loading ? 'Mencari...' : 'Cari Pertandingan'}</Button></div>
      <div className="space-y-4">{matches.map((match: any, index: number) => (<MatchCard key={index} match={match} currentUser={currentUser} users={users} onRequestSwap={sendSwapRequest} existingRequests={swapRequests} />))}</div>
    </div>
  )
}

function SwapRequestsList({ currentUser, swapRequests, users, loadData }: any) {
  const userSwaps = swapRequests.filter((s: SwapRequest) => s.userAId === currentUser?.id || s.userBId === currentUser?.id)
  const handleUpdateState = async (swapId: string, newState: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: newState }) })
      if (res.ok) { toast({ title: 'Status diperbarui' }); loadData() }
    } catch (error) { console.error(error) }
  }
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Pertukaran Saya</h3>
      <Tabs defaultValue="all" className="w-full">
        <TabsList><TabsTrigger value="all">Semua</TabsTrigger><TabsTrigger value="pending">Menunggu</TabsTrigger><TabsTrigger value="active">Aktif</TabsTrigger><TabsTrigger value="completed">Selesai</TabsTrigger></TabsList>
        <TabsContent value="all" className="space-y-3">{userSwaps.map((swap: SwapRequest) => (<SwapRequestCard key={swap.id} swap={swap} currentUser={currentUser} users={users} onUpdateState={handleUpdateState} />))}</TabsContent>
        <TabsContent value="pending" className="space-y-3">{userSwaps.filter((s: SwapRequest) => s.state === 'PROPOSED').map((swap: SwapRequest) => (<SwapRequestCard key={swap.id} swap={swap} currentUser={currentUser} users={users} onUpdateState={handleUpdateState} />))}</TabsContent>
        <TabsContent value="active" className="space-y-3">{userSwaps.filter((s: SwapRequest) => ['ACCEPTED', 'IN_PROGRESS'].includes(s.state)).map((swap: SwapRequest) => (<SwapRequestCard key={swap.id} swap={swap} currentUser={currentUser} users={users} onUpdateState={handleUpdateState} />))}</TabsContent>
        <TabsContent value="completed" className="space-y-3">{userSwaps.filter((s: SwapRequest) => ['COMPLETED', 'REJECTED'].includes(s.state)).map((swap: SwapRequest) => (<SwapRequestCard key={swap.id} swap={swap} currentUser={currentUser} users={users} />))}</TabsContent>
      </Tabs>
    </div>
  )
}

function SkillCard({ skill, onDelete }: { skill: Skill, onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div><h4 className="font-semibold">{skill.skillName}</h4><div className="flex gap-2 mt-1"><Badge className="text-xs">{skill.skillCategory}</Badge></div></div>
      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => onDelete(skill.id)}>Hapus</Button>
    </div>
  )
}

function MatchCard({ match, currentUser, users, onRequestSwap, existingRequests }: any) {
  const userB = users.find((u: User) => u.id === match.userBId)
  const existingRequest = existingRequests.find((r: SwapRequest) => (r.userAId === currentUser?.id && r.userBId === match.userBId && r.skillAId === match.mySkillId && r.skillBId === match.theirSkillId))
  return (
    <Card><CardContent className="p-6">
        <div className="flex justify-between mb-4"><div className="flex items-center gap-4"><Avatar><AvatarFallback>{userB?.name?.charAt(0)}</AvatarFallback></Avatar><div><h4 className="font-semibold">{userB?.name}</h4></div></div><Badge>{(match.matchScore * 100).toFixed(0)}% Cocok</Badge></div>
        <div className="bg-gray-50 p-4 mb-4 flex justify-between"><div><p className="text-sm">Anda tawarkan:</p><p className="font-medium text-indigo-600">{match.mySkillName}</p></div><div><p className="text-sm">Mereka tawarkan:</p><p className="font-medium text-emerald-600">{match.theirSkillName}</p></div></div>
        {existingRequest ? (<Button className="w-full" disabled>Menunggu Respons</Button>) : (<Button className="w-full" onClick={() => onRequestSwap(match)}>Kirim Permintaan</Button>)}
    </CardContent></Card>
  )
}

function SwapStateBadge({ state }: { state: string }) { return <Badge className="bg-gray-200 text-gray-800">{state}</Badge> }

function SwapRequestCard({ swap, currentUser, users, onUpdateState }: any) {
  const userA = users.find((u: User) => u.id === swap.userAId)
  const userB = users.find((u: User) => u.id === swap.userBId)
  const isCurrentUserA = swap.userAId === currentUser?.id
  const isCurrentUserB = swap.userBId === currentUser?.id
  const canAcceptReject = isCurrentUserB && swap.state === 'PROPOSED'
  const canProgress = (isCurrentUserA || isCurrentUserB) && swap.state === 'ACCEPTED'
  const canComplete = (isCurrentUserA || isCurrentUserB) && swap.state === 'IN_PROGRESS'

  return (
    <Card className="border-l-4 border-indigo-500">
      <CardContent className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex gap-3"><Avatar><AvatarFallback>{userA?.name?.charAt(0)}</AvatarFallback></Avatar>
            <div><p className="font-semibold">{userA?.name}</p><p className="text-sm">Tawar: {swap.skillAName} | Cari: {swap.skillBName}</p></div>
          </div>
          <Badge>{swap.state}</Badge>
        </div>

        {['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(swap.state) && (
          <div className="mt-3 mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
            <p className="text-xs text-gray-500 font-medium mb-1">Kontak Partner Swap:</p>
            <span className="text-sm font-medium text-indigo-700">{isCurrentUserA ? userB?.email : userA?.email}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Badge variant="outline">Match: {(swap.matchScore * 100).toFixed(0)}%</Badge>
          <div className="flex gap-2">
            {canAcceptReject && (<><Button size="sm" className="bg-emerald-600" onClick={() => onUpdateState(swap.id, 'ACCEPTED')}>Terima</Button><Button size="sm" variant="destructive" onClick={() => onUpdateState(swap.id, 'REJECTED')}>Tolak</Button></>)}
            {canProgress && (<Button size="sm" className="bg-blue-600" onClick={() => onUpdateState(swap.id, 'IN_PROGRESS')}>Mulai Swap</Button>)}
            {canComplete && (<Button size="sm" className="bg-green-600" onClick={() => onUpdateState(swap.id, 'COMPLETED')}>Selesaikan</Button>)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}