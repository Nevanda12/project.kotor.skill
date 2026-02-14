import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/skills - Get all skills with user info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    const where: any = {}
    if (userId) {
      where.userId = userId
    }
    if (type) {
      where.type = type
    }

    const skills = await db.skill.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to include userName for easier use in frontend
    const transformedSkills = skills.map(skill => ({
      ...skill,
      userName: skill.user.name
    }))

    return NextResponse.json(transformedSkills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// POST /api/skills - Create a new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, skillName, skillCategory, skillLevel, type } = body

    if (!userId || !skillName || !skillCategory || !skillLevel || !type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!['Beginner', 'Intermediate', 'Expert'].includes(skillLevel)) {
      return NextResponse.json(
        { error: 'Invalid skill level. Must be Beginner, Intermediate, or Expert' },
        { status: 400 }
      )
    }

    if (!['OFFERED', 'NEEDED'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be OFFERED or NEEDED' },
        { status: 400 }
      )
    }

    const skill = await db.skill.create({
      data: {
        userId,
        skillName,
        skillCategory,
        skillLevel,
        type
      }
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}
