import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/swaps - Get all swap requests with user and skill info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where: any = {}
    if (userId) {
      where.OR = [
        { userAId: userId },
        { userBId: userId }
      ]
    }

    const swaps = await db.swapRequest.findMany({
      where,
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get skill details separately
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
        skillBName: skillB?.skillName || 'Unknown'
      }
    })

    return NextResponse.json(transformedSwaps)
  } catch (error) {
    console.error('Error fetching swap requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch swap requests' },
      { status: 500 }
    )
  }
}

// POST /api/swaps - Create a new swap request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userAId, userBId, skillAId, skillBId, matchScore, message } = body

    if (!userAId || !userBId || !skillAId || !skillBId || matchScore === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Check if swap request already exists
    const existing = await db.swapRequest.findFirst({
      where: {
        userAId,
        userBId,
        skillAId,
        skillBId,
        state: { in: ['PROPOSED', 'ACCEPTED', 'IN_PROGRESS'] }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Swap request already exists' },
        { status: 409 }
      )
    }

    const swap = await db.swapRequest.create({
      data: {
        userAId,
        userBId,
        skillAId,
        skillBId,
        matchScore,
        state: 'PROPOSED',
        message: message || null
      }
    })

    return NextResponse.json(swap, { status: 201 })
  } catch (error) {
    console.error('Error creating swap request:', error)
    return NextResponse.json(
      { error: 'Failed to create swap request' },
      { status: 500 }
    )
  }
}
