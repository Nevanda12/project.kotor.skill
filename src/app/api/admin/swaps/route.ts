import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/swaps - Get all swap requests with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')

    const where: any = {}
    if (state && state !== 'ALL') {
      where.state = state
    }

    const swaps = await db.swapRequest.findMany({
      where,
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            isActive: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get skill details
    const skillIds = new Set<string>()
    swaps.forEach(swap => {
      skillIds.add(swap.skillAId)
      skillIds.add(swap.skillBId)
    })

    const skills = await db.skill.findMany({
      where: { id: { in: Array.from(skillIds) } }
    })

    const skillMap = new Map(skills.map(s => [s.id, s]))

    // Transform to include skill and user names
    const transformedSwaps = swaps.map(swap => {
      const skillA = skillMap.get(swap.skillAId)
      const skillB = skillMap.get(swap.skillBId)

      return {
        ...swap,
        userAName: swap.userA.name,
        userBName: swap.userB.name,
        skillAName: skillA?.skillName || 'Unknown',
        skillBName: skillB?.skillName || 'Unknown',
        userAActive: swap.userA.isActive,
        userBActive: swap.userB.isActive
      }
    })

    return NextResponse.json(transformedSwaps)
  } catch (error) {
    console.error('Error fetching admin swaps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin swaps' },
      { status: 500 }
    )
  }
}
