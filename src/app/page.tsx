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

// Types
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

export default function SkillSwapPlatform() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')
  const [skills, setSkills] = useState<Skill[]>([])
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Load skills
      const skillsRes = await fetch('/api/skills')
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json()
        setSkills(skillsData)
      }

      // Load swap requests
      const swapsRes = await fetch('/api/swaps')
      if (swapsRes.ok) {
        const swapsData = await swapsRes.json()
        setSwapRequests(swapsData)
      }

      // Load users
      const usersRes = await fetch('/api/users')
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
        // Set current user as first user for demo
        if (usersData.length > 0) {
          setCurrentUser(usersData[0])
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchRole = () => {
    setRole(role === 'USER' ? 'ADMIN' : 'USER')
    if (role === 'USER' && users.find(u => u.role === 'ADMIN')) {
      setCurrentUser(users.find(u => u.role === 'ADMIN') || null)
    } else if (role === 'ADMIN') {
      setCurrentUser(users.find(u => u.role === 'USER') || null)
    }
    toast({
      title: `Switched to ${role === 'USER' ? 'Admin' : 'User'} Dashboard`,
      description: `Viewing as ${role === 'USER' ? 'Administrator' : 'Regular User'}`,
    })
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

  return (
    <>
      <DataInitializer />
      <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
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
                    <SidebarMenuButton 
                      isActive={activeTab === 'dashboard'}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'skills'}
                      onClick={() => setActiveTab('skills')}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Keahlian Saya</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'matches'}
                      onClick={() => setActiveTab('matches')}
                    >
                      <Search className="w-5 h-5" />
                      <span>Cari Cocok</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'swaps'}
                      onClick={() => setActiveTab('swaps')}
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                      <span>Pertukaran</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {role === 'ADMIN' && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'admin-dashboard' || !activeTab}
                          onClick={() => setActiveTab('admin-dashboard')}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Dashboard Admin</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'admin-users'}
                          onClick={() => setActiveTab('admin-users')}
                        >
                          <Users className="w-5 h-5" />
                          <span>Kelola Pengguna</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeTab === 'admin-swaps'}
                          onClick={() => setActiveTab('admin-swaps')}
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span>Monitoring Swap</span>
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
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                  onClick={switchRole}
                >
                  Switch to {role === 'USER' ? 'Admin' : 'User'}
                </Button>
              </CardContent>
            </Card>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {role === 'USER' ? 'Dashboard Pengguna' : 'Dashboard Admin'}
              </h2>
              <p className="text-gray-600">
                {role === 'USER' 
                  ? 'Kelola keahlian Anda dan temukan pertukaran yang cocok' 
                  : 'Kelola pengguna dan pantau aktivitas platform'}
              </p>
            </div>

            {/* User Dashboard Content */}
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

            {/* Admin Dashboard Content */}
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

// User Dashboard Component
function UserDashboard({ currentUser, activeTab, skills, swapRequests, users, setActiveTab, loadData }: any) {
  const userSkills = skills.filter(s => s.userId === currentUser?.id)
  const offeredSkills = userSkills.filter(s => s.type === 'OFFERED')
  const neededSkills = userSkills.filter(s => s.type === 'NEEDED')
  
  const userSwaps = swapRequests.filter(
    s => s.userAId === currentUser?.id || s.userBId === currentUser?.id
  )

  const pendingSwaps = userSwaps.filter(s => s.state === 'PROPOSED' && s.userBId === currentUser?.id)
  const activeSwaps = userSwaps.filter(s => ['ACCEPTED', 'IN_PROGRESS'].includes(s.state))
  const completedSwaps = userSwaps.filter(s => s.state === 'COMPLETED')

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-indigo-600">
            <CardHeader className="pb-2">
              <CardDescription>Keahlian Ditawarkan</CardDescription>
              <CardTitle className="text-3xl">{offeredSkills.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-emerald-600">
            <CardHeader className="pb-2">
              <CardDescription>Keahlian Dicari</CardDescription>
              <CardTitle className="text-3xl">{neededSkills.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-amber-600">
            <CardHeader className="pb-2">
              <CardDescription>Pertukaran Aktif</CardDescription>
              <CardTitle className="text-3xl">{activeSwaps.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-blue-600">
            <CardHeader className="pb-2">
              <CardDescription>Selesai</CardDescription>
              <CardTitle className="text-3xl">{completedSwaps.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingSwaps.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Permintaan Pertukaran Menunggu ({pendingSwaps.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingSwaps.map((swap: SwapRequest) => {
                  const requester = users.find(u => u.id === swap.userAId)
                  return (
                    <div key={swap.id} className="bg-white p-4 rounded-lg border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                            {requester?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{requester?.name}</p>
                          <p className="text-sm text-gray-600">
                            Ingin bertukar <span className="font-medium text-indigo-600">{swap.skillAName}</span> dengan <span className="font-medium text-emerald-600">{swap.skillBName}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">Match Score: {(swap.matchScore * 100).toFixed(0)}%</Badge>
                            {swap.message && <p className="text-xs text-gray-500">"{swap.message}"</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleSwapAction(swap.id, 'ACCEPT')}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Terima
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleSwapAction(swap.id, 'REJECTED')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {userSwaps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada pertukaran</p>
                <p className="text-sm mt-2">Tambahkan keahlian untuk mulai mencari pertukaran</p>
                <Button 
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setActiveTab('skills')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Keahlian
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userSwaps.slice(0, 5).map((swap: SwapRequest) => (
                  <SwapRequestCard key={swap.id} swap={swap} currentUser={currentUser} users={users} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeTab === 'skills') {
    return (
      <SkillsManagement
        currentUser={currentUser}
        skills={skills}
        loadData={loadData}
      />
    )
  }

  if (activeTab === 'matches') {
    return (
      <MatchingSystem
        currentUser={currentUser}
        skills={skills}
        users={users}
        swapRequests={swapRequests}
        loadData={loadData}
      />
    )
  }

  if (activeTab === 'swaps') {
    return (
      <SwapRequestsList
        currentUser={currentUser}
        swapRequests={swapRequests}
        users={users}
        loadData={loadData}
      />
    )
  }

  return null
}

// Admin Dashboard Component
function AdminDashboard({ activeTab, loadData }: any) {
  const [metrics, setMetrics] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [swaps, setSwaps] = useState<any[]>([])
  const [swapFilter, setSwapFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Load metrics
      const metricsRes = await fetch('/api/admin/metrics')
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }

      // Load users with skills
      const usersRes = await fetch('/api/admin/users?includeSkills=true')
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      // Load swaps
      const swapsRes = await fetch(`/api/admin/swaps?state=${swapFilter}`)
      if (swapsRes.ok) {
        const swapsData = await swapsRes.json()
        setSwaps(swapsData)
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      if (res.ok) {
        toast({
          title: isActive ? 'User diaktifkan' : 'User ditangguhkan',
          description: isActive ? 'User sekarang aktif' : 'User telah disuspend',
        })
        loadAdminData()
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const handleSwapAction = async (swapId: string, newState: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      })

      if (res.ok) {
        toast({
          title: 'Status diperbarui',
          description: `Pertukaran diperbarui ke ${newState}`,
        })
        loadAdminData()
      }
    } catch (error) {
      console.error('Error updating swap:', error)
    }
  }

  const handleDeleteSwap = async (swapId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pertukaran ini?')) {
      return
    }

    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({
          title: 'Pertukaran dihapus',
          description: 'Pertukaran telah dihapus dari platform',
        })
        loadAdminData()
      }
    } catch (error) {
      console.error('Error deleting swap:', error)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [swapFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (activeTab === 'admin-users') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Manajemen User</h3>
          <p className="text-gray-600">Kelola semua pengguna dan lihat detail keahlian mereka</p>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Skills</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={user.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.bio && <p className="text-xs text-gray-500 mt-1">{user.bio.substring(0, 50)}...</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{user.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {user.skills?.offered?.length || 0} Offered
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.skills?.needed?.length || 0} Needed
                            </Badge>
                          </div>
                          {user.skills && user.skills.offered.length > 0 && (
                            <div className="text-xs text-gray-600">
                              {user.skills.offered.map(s => s.skillName).join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                          {user.isActive ? 'Aktif' : 'Suspend'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          size="sm"
                          variant={user.isActive ? 'outline' : 'default'}
                          onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                          disabled={user.role === 'ADMIN'}
                        >
                          {user.isActive ? 'Suspend' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeTab === 'admin-swaps') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Monitoring Skill Swap</h3>
            <p className="text-gray-600">Pantau dan kelola semua pertukaran keahlian</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter State:</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={swapFilter}
              onChange={(e) => setSwapFilter(e.target.value)}
            >
              <option value="ALL">Semua</option>
              <option value="PROPOSED">Diajukan</option>
              <option value="ACCEPTED">Diterima</option>
              <option value="IN_PROGRESS">Sedang Berjalan</option>
              <option value="COMPLETED">Selesai</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Swaps Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Swap ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User A</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User B</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Skills</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Match Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {swaps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        Tidak ada pertukaran
                      </td>
                    </tr>
                  ) : (
                    swaps.map((swap) => (
                      <tr key={swap.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-mono">{swap.id.substring(0, 8)}...</td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{swap.userAName}</p>
                            <Badge className={`mt-1 ${swap.userAActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {swap.userAActive ? 'Aktif' : 'Suspend'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{swap.userBName}</p>
                            <Badge className={`mt-1 ${swap.userBActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {swap.userBActive ? 'Aktif' : 'Suspend'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-indigo-600">{swap.skillAName}</div>
                            <div className="text-gray-600">↔</div>
                            <div className="font-medium text-emerald-600">{swap.skillBName}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className="bg-indigo-100 text-indigo-700">
                            {(swap.matchScore * 100).toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <SwapStateBadge state={swap.state} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-1">
                              {swap.state === 'PROPOSED' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleSwapAction(swap.id, 'ACCEPTED')}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleSwapAction(swap.id, 'REJECTED')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {swap.state === 'ACCEPTED' && (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleSwapAction(swap.id, 'IN_PROGRESS')}
                                >
                                  Start
                                </Button>
                              )}
                              {swap.state === 'IN_PROGRESS' && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleSwapAction(swap.id, 'COMPLETED')}
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSwap(swap.id)}
                              disabled={['COMPLETED', 'REJECTED'].includes(swap.state)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

// Skills Management Component
function SkillsManagement({ currentUser, skills, loadData }: any) {
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [formData, setFormData] = useState({
    skillName: '',
    skillCategory: '',
    skillLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
    type: 'OFFERED' as 'OFFERED' | 'NEEDED'
  })

  const userSkills = skills.filter((s: Skill) => s.userId === currentUser?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: currentUser?.id
        })
      })

      if (res.ok) {
        toast({
          title: 'Keahlian berhasil ditambahkan',
          description: `Keahlian "${formData.skillName}" telah ditambahkan ke profil Anda`,
        })
        setFormData({
          skillName: '',
          skillCategory: '',
          skillLevel: 'Beginner',
          type: 'OFFERED'
        })
        setShowAddSkill(false)
        loadData()
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const handleDelete = async (skillId: string) => {
    try {
      const res = await fetch(`/api/skills/${skillId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({
          title: 'Keahlian berhasil dihapus',
          description: 'Keahlian telah dihapus dari profil Anda',
        })
        loadData()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Kelola Keahlian</h3>
          <p className="text-gray-600">Tambahkan keahlian yang Anda tawarkan atau butuhkan</p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setShowAddSkill(!showAddSkill)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Keahlian
        </Button>
      </div>

      {showAddSkill && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Tambah Keahlian Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Keahlian</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Contoh: JavaScript, Desain Grafik"
                    value={formData.skillName}
                    onChange={(e) => setFormData({...formData, skillName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Kategori</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Contoh: Programming, Desain, Bisnis"
                    value={formData.skillCategory}
                    onChange={(e) => setFormData({...formData, skillCategory: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tingkat</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({...formData, skillLevel: e.target.value as any})}
                  >
                    <option value="Beginner">Pemula</option>
                    <option value="Intermediate">Menengah</option>
                    <option value="Expert">Ahli</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipe</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="OFFERED">Ditawarkan (Saya bisa mengajar)</option>
                    <option value="NEEDED">Dicari (Saya ingin belajar)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Simpan Keahlian
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddSkill(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offered Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-indigo-600">Ditawarkan</Badge>
              Keahlian Saya
            </CardTitle>
            <CardDescription>Keahlian yang Anda bisa ajarkan kepada orang lain</CardDescription>
          </CardHeader>
          <CardContent>
            {userSkills.filter((s: Skill) => s.type === 'OFFERED').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada keahlian ditawarkan</p>
                <p className="text-sm mt-2">Tambahkan keahlian untuk mulai bertukar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userSkills.filter((s: Skill) => s.type === 'OFFERED').map((skill: Skill) => (
                  <SkillCard key={skill.id} skill={skill} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Needed Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-emerald-600">Dicari</Badge>
              Keahlian yang Dibutuhkan
            </CardTitle>
            <CardDescription>Keahlian yang Anda ingin pelajari dari orang lain</CardDescription>
          </CardHeader>
          <CardContent>
            {userSkills.filter((s: Skill) => s.type === 'NEEDED').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada keahlian dicari</p>
                <p className="text-sm mt-2">Tambahkan keahlian untuk menemukan guru</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userSkills.filter((s: Skill) => s.type === 'NEEDED').map((skill: Skill) => (
                  <SkillCard key={skill.id} skill={skill} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Matching System Component
function MatchingSystem({ currentUser, skills, users, swapRequests, loadData }: any) {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const findMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/matches?userId=${currentUser?.id}`)
      if (res.ok) {
        const data = await res.json()
        setMatches(data)
      }
    } catch (error) {
      console.error('Error finding matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendSwapRequest = async (match: any) => {
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAId: currentUser?.id,
          userBId: match.userBId,
          skillAId: match.mySkillId,
          skillBId: match.theirSkillId,
          matchScore: match.matchScore,
          message: `Halo, saya tertarik untuk bertukar keahlian!`
        })
      })

      if (res.ok) {
        toast({
          title: 'Permintaan pertukaran dikirim',
          description: 'Menunggu respons dari pengguna lain',
        })
        loadData()
      }
    } catch (error) {
      console.error('Error sending swap request:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Cari Cocok</h3>
          <p className="text-gray-600">Temukan pengguna dengan keahlian yang cocok dengan kebutuhan Anda</p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={findMatches}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Mencari...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Cari Pertandingan
            </>
          )}
        </Button>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-semibold mb-2">Belum ada pencarian</h4>
            <p className="text-gray-600 mb-4">Klik tombol "Cari Pertandingan" untuk menemukan pengguna yang cocok</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match: any, index: number) => (
            <MatchCard 
              key={index} 
              match={match} 
              currentUser={currentUser}
              users={users}
              onRequestSwap={sendSwapRequest}
              existingRequests={swapRequests}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Swap Requests List Component
function SwapRequestsList({ currentUser, swapRequests, users, loadData }: any) {
  const userSwaps = swapRequests.filter(
    (s: SwapRequest) => s.userAId === currentUser?.id || s.userBId === currentUser?.id
  )

  const handleUpdateState = async (swapId: string, newState: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      })

      if (res.ok) {
        toast({
          title: 'Status berhasil diperbarui',
          description: `Status pertukaran telah berubah`,
        })
        loadData()
      }
    } catch (error) {
      console.error('Error updating swap state:', error)
    }
  }

  const handleSwapAction = async (swapId: string, action: 'ACCEPT' | 'REJECT') => {
    await handleUpdateState(swapId, action)
  }

  if (userSwaps.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ArrowRightLeft className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-semibold mb-2">Belum ada pertukaran</h4>
          <p className="text-gray-600">Mulai cari pertandingan untuk mengirim permintaan pertukaran</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Pertukaran Saya</h3>
        <p className="text-gray-600">Kelola semua pertukaran keahlian Anda</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Menunggu</TabsTrigger>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {userSwaps.map((swap: SwapRequest) => (
            <SwapRequestCard 
              key={swap.id} 
              swap={swap} 
              currentUser={currentUser} 
              users={users}
              onUpdateState={handleSwapAction}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          {userSwaps.filter((s: SwapRequest) => s.state === 'PROPOSED').map((swap: SwapRequest) => (
            <SwapRequestCard 
              key={swap.id} 
              swap={swap} 
              currentUser={currentUser} 
              users={users}
              onUpdateState={handleSwapAction}
            />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {userSwaps.filter((s: SwapRequest) => ['ACCEPTED', 'IN_PROGRESS'].includes(s.state)).map((swap: SwapRequest) => (
            <SwapRequestCard 
              key={swap.id} 
              swap={swap} 
              currentUser={currentUser} 
              users={users}
              onUpdateState={handleUpdateState}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {userSwaps.filter((s: SwapRequest) => ['COMPLETED', 'REJECTED'].includes(s.state)).map((swap: SwapRequest) => (
            <SwapRequestCard 
              key={swap.id} 
              swap={swap} 
              currentUser={currentUser} 
              users={users}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper Components
function SkillCard({ skill, onDelete }: { skill: Skill, onDelete: (id: string) => void }) {
  const levelColors = {
    Beginner: 'bg-gray-100 text-gray-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Expert: 'bg-purple-100 text-purple-700'
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-semibold">{skill.skillName}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge className="text-xs">{skill.skillCategory}</Badge>
          <Badge className={`text-xs ${levelColors[skill.skillLevel]}`}>
            {skill.skillLevel}
          </Badge>
        </div>
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => onDelete(skill.id)}
      >
        Hapus
      </Button>
    </div>
  )
}

function MatchCard({ match, currentUser, users, onRequestSwap, existingRequests }: any) {
  const userB = users.find((u: User) => u.id === match.userBId)
  const existingRequest = existingRequests.find((r: SwapRequest) => 
    (r.userAId === currentUser?.id && r.userBId === match.userBId && 
     r.skillAId === match.mySkillId && r.skillBId === match.theirSkillId)
  )

  return (
    <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                {userB?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{userB?.name}</h4>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">{userB?.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <Badge className="bg-indigo-600">
            {(match.matchScore * 100).toFixed(0)}% Cocok
          </Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Anda tawarkan:</p>
              <p className="font-medium text-indigo-600">{match.mySkillName}</p>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-gray-400 mx-4" />
            <div className="flex-1 text-right">
              <p className="text-sm text-gray-600 mb-1">Mereka tawarkan:</p>
              <p className="font-medium text-emerald-600">{match.theirSkillName}</p>
            </div>
          </div>
        </div>

        {existingRequest ? (
          <Button className="w-full" disabled>
            <Clock className="w-4 h-4 mr-2" />
            {existingRequest.state === 'PROPOSED' ? 'Menunggu Respons' : 'Sedang Diproses'}
          </Button>
        ) : (
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={() => onRequestSwap(match)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Kirim Permintaan Pertukaran
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Swap State Badge Component
function SwapStateBadge({ state }: { state: string }) {
  const stateConfig = {
    PROPOSED: { label: 'Diajukan', color: 'bg-amber-100 text-amber-700', icon: Clock },
    ACCEPTED: { label: 'Diterima', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    IN_PROGRESS: { label: 'Sedang Berjalan', color: 'bg-blue-100 text-blue-700', icon: Clock },
    COMPLETED: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle }
  }

  const config = stateConfig[state as keyof typeof stateConfig]
  const StateIcon = config.icon

  return (
    <Badge className={config.color}>
      <StateIcon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

function SwapRequestCard({ swap, currentUser, users, onUpdateState, isAdmin = false }: any) {
  const userA = users.find((u: User) => u.id === swap.userAId)
  const userB = users.find((u: User) => u.id === swap.userBId)
  
  const isCurrentUserA = swap.userAId === currentUser?.id
  const isCurrentUserB = swap.userBId === currentUser?.id

  const stateConfig = {
    PROPOSED: { label: 'Diajukan', color: 'bg-amber-100 text-amber-700', icon: Clock },
    ACCEPTED: { label: 'Diterima', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    IN_PROGRESS: { label: 'Sedang Berjalan', color: 'bg-blue-100 text-blue-700', icon: Clock },
    COMPLETED: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle }
  }

  const state = stateConfig[swap.state as keyof typeof stateConfig]
  const StateIcon = state.icon

  const canAcceptReject = isCurrentUserB && swap.state === 'PROPOSED'
  const canProgress = isCurrentUserA && swap.state === 'ACCEPTED'
  const canComplete = isCurrentUserB && swap.state === 'IN_PROGRESS'

  return (
    <Card className={`${state.color} border-0`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                {userA?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{userA?.name}</p>
              <p className="text-sm text-gray-600">
                {isCurrentUserA ? 'Anda' : 'Mereka'} tawarkan: <span className="font-medium text-indigo-600">{swap.skillAName}</span>
              </p>
              <p className="text-sm text-gray-600">
                {isCurrentUserB ? 'Anda' : 'Mereka'} tawarkan: <span className="font-medium text-emerald-600">{swap.skillBName}</span>
              </p>
            </div>
          </div>
          <Badge className={state.color}>
            <StateIcon className="w-3 h-3 mr-1" />
            {state.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Match: {(swap.matchScore * 100).toFixed(0)}%</Badge>
          </div>

          {canAcceptReject && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onUpdateState(swap.id, 'ACCEPTED')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Terima
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onUpdateState(swap.id, 'REJECTED')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Tolak
              </Button>
            </div>
          )}

          {canProgress && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onUpdateState(swap.id, 'IN_PROGRESS')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Mulai Pertukaran
            </Button>
          )}

          {canComplete && (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onUpdateState(swap.id, 'COMPLETED')}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Selesaikan
            </Button>
          )}

          {isAdmin && swap.state === 'PROPOSED' && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateState(swap.id, 'ACCEPTED')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function for swap actions
async function handleSwapAction(swapId: string, action: 'ACCEPT' | 'REJECT' | 'IN_PROGRESS' | 'COMPLETED') {
  try {
    const res = await fetch(`/api/swaps/${swapId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: action })
    })

    if (res.ok) {
      toast({
        title: 'Status berhasil diperbarui',
        description: `Pertukaran telah ${action === 'ACCEPTED' ? 'diterima' : action === 'REJECTED' ? 'ditolak' : action === 'IN_PROGRESS' ? 'dimulai' : 'diselesaikan'}`,
      })
    }
  } catch (error) {
    console.error('Error updating swap:', error)
  }
}
