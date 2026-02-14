import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/metrics - Get admin dashboard metrics
export async function GET() {
  try {
    // Total Users Terdaftar
    const totalUsers = await db.user.count()

    // Total Skill Aktif
    const totalSkills = await db.skill.count()

    // Total Swap Berlangsung (PROPOSED, ACCEPTED, IN_PROGRESS)
    const activeSwaps = await db.swapRequest.count({
      where: {
        state: { in: ['PROPOSED', 'ACCEPTED', 'IN_PROGRESS'] }
      }
    })

    // Total Swap Selesai
    const completedSwaps = await db.swapRequest.count({
      where: { state: 'COMPLETED' }
    })

    // Active Users
    const activeUsers = await db.user.count({
      where: { isActive: true }
    })

    // Suspended Users
    const suspendedUsers = await db.user.count({
      where: { isActive: false }
    })

    // Recent Swaps (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentSwaps = await db.swapRequest.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    })

    // Skills by Type
    const offeredSkills = await db.skill.count({
      where: { type: 'OFFERED' }
    })

    const neededSkills = await db.skill.count({
      where: { type: 'NEEDED' }
    })

    // Swaps by State
    const proposedSwaps = await db.swapRequest.count({
      where: { state: 'PROPOSED' }
    })

    const acceptedSwaps = await db.swapRequest.count({
      where: { state: 'ACCEPTED' }
    })

    const inProgressSwaps = await db.swapRequest.count({
      where: { state: 'IN_PROGRESS' }
    })

    const rejectedSwaps = await db.swapRequest.count({
      where: { state: 'REJECTED' }
    })

    return NextResponse.json({
      totalUsers,
      totalSkills,
      activeSwaps,
      completedSwaps,
      activeUsers,
      suspendedUsers,
      recentSwaps,
      offeredSkills,
      neededSkills,
      swapsByState: {
        PROPOSED: proposedSwaps,
        ACCEPTED: acceptedSwaps,
        IN_PROGRESS: inProgressSwaps,
        COMPLETED: completedSwaps,
        REJECTED: rejectedSwaps
      }
    })
  } catch (error) {
    console.error('Error fetching admin metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin metrics' },
      { status: 500 }
    )
  }
}
