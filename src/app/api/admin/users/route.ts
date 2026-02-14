import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/users - Get all users with their skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeSkills = searchParams.get('includeSkills') === 'true'

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    if (includeSkills) {
      // Get skills for all users
      const allSkills = await db.skill.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Group skills by user
      const skillsByUser = allSkills.reduce((acc: any, skill) => {
        if (!acc[skill.userId]) {
          acc[skill.userId] = {
            offered: [],
            needed: []
          }
        }
        if (skill.type === 'OFFERED') {
          acc[skill.userId].offered.push(skill)
        } else {
          acc[skill.userId].needed.push(skill)
        }
        return acc
      }, {})

      // Attach skills to users
      const usersWithSkills = users.map(user => ({
        ...user,
        skills: skillsByUser[user.id] || { offered: [], needed: [] }
      }))

      return NextResponse.json(usersWithSkills)
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    )
  }
}
