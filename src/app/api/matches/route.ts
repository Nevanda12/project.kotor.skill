import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/matches?userId=X - Find matches for a user using Two-Way Matching Algorithm
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's offered skills (what they can teach)
    const userOfferedSkills = await db.skill.findMany({
      where: {
        userId,
        type: 'OFFERED'
      }
    })

    // Get user's needed skills (what they want to learn)
    const userNeededSkills = await db.skill.findMany({
      where: {
        userId,
        type: 'NEEDED'
      }
    })

    if (userOfferedSkills.length === 0 || userNeededSkills.length === 0) {
      return NextResponse.json([])
    }

    // Get all other users' skills
    const otherUsersSkills = await db.skill.findMany({
      where: {
        userId: { not: userId }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            rating: true,
            bio: true
          }
        }
      }
    })

    // Find matches using Two-Way Matching Algorithm
    const matches = []

    for (const myNeeded of userNeededSkills) {
      for (const otherSkill of otherUsersSkills) {
        // Match if other user offers what I need
        if (otherSkill.type === 'OFFERED') {
          // Check if skill names match or are similar
          const nameMatch = myNeeded.skillName.toLowerCase() === otherSkill.skillName.toLowerCase()
          const categoryMatch = myNeeded.skillCategory.toLowerCase() === otherSkill.skillCategory.toLowerCase()

          if (nameMatch || categoryMatch) {
            // Now check if I can offer something they need (Two-Way)
            const otherUserId = otherSkill.userId
            const otherNeededSkills = otherUsersSkills.filter(
              s => s.userId === otherUserId && s.type === 'NEEDED'
            )

            for (const otherNeeded of otherNeededSkills) {
              for (const myOffered of userOfferedSkills) {
                // Check if I offer what they need
                const reverseNameMatch = otherNeeded.skillName.toLowerCase() === myOffered.skillName.toLowerCase()
                const reverseCategoryMatch = otherNeeded.skillCategory.toLowerCase() === myOffered.skillCategory.toLowerCase()

                if (reverseNameMatch || reverseCategoryMatch) {
                  // Calculate match score based on multiple factors
                  const nameScore = nameMatch ? 1 : 0.7
                  const reverseNameScore = reverseNameMatch ? 1 : 0.7
                  const categoryScore = categoryMatch ? 1 : 0.5
                  const reverseCategoryScore = reverseCategoryMatch ? 1 : 0.5

                  // Skill level compatibility score
                  let levelScore = 1
                  if (otherSkill.skillLevel === 'Expert' && myNeeded.skillLevel === 'Beginner') {
                    levelScore = 0.8
                  } else if (otherSkill.skillLevel === 'Expert' && myNeeded.skillLevel === 'Intermediate') {
                    levelScore = 0.9
                  } else if (otherSkill.skillLevel === 'Intermediate' && myNeeded.skillLevel === 'Beginner') {
                    levelScore = 0.9
                  }

                  let reverseLevelScore = 1
                  if (myOffered.skillLevel === 'Expert' && otherNeeded.skillLevel === 'Beginner') {
                    reverseLevelScore = 0.8
                  } else if (myOffered.skillLevel === 'Expert' && otherNeeded.skillLevel === 'Intermediate') {
                    reverseLevelScore = 0.9
                  } else if (myOffered.skillLevel === 'Intermediate' && otherNeeded.skillLevel === 'Beginner') {
                    reverseLevelScore = 0.9
                  }

                  // Final match score (weighted average)
                  const matchScore = (
                    (nameScore * 0.4) +
                    (categoryScore * 0.2) +
                    (levelScore * 0.2) +
                    (reverseNameScore * 0.3) +
                    (reverseCategoryScore * 0.15) +
                    (reverseLevelScore * 0.15)
                  ) / 1.4

                  // Ensure score is between 0 and 1
                  const finalScore = Math.min(1, Math.max(0, matchScore))

                  matches.push({
                    userBId: otherUserId,
                    userB: otherSkill.user,
                    mySkillId: myOffered.id,
                    mySkillName: myOffered.skillName,
                    mySkillCategory: myOffered.skillCategory,
                    mySkillLevel: myOffered.skillLevel,
                    theirSkillId: otherSkill.id,
                    theirSkillName: otherSkill.skillName,
                    theirSkillCategory: otherSkill.skillCategory,
                    theirSkillLevel: otherSkill.skillLevel,
                    matchScore: finalScore,
                    matchType: nameMatch && reverseNameMatch ? 'PERFECT' : 'SIMILAR'
                  })
                }
              }
            }
          }
        }
      }
    }

    // Remove duplicates and sort by match score
    const uniqueMatches = matches.reduce((acc: any[], match: any) => {
      const existing = acc.find(
        m => m.userBId === match.userBId && 
             m.mySkillId === match.mySkillId && 
             m.theirSkillId === match.theirSkillId
      )
      if (!existing || match.matchScore > existing.matchScore) {
        if (existing) {
          const index = acc.indexOf(existing)
          acc[index] = match
        } else {
          acc.push(match)
        }
      }
      return acc
    }, [])

    // Sort by match score descending
    uniqueMatches.sort((a, b) => b.matchScore - a.matchScore)

    // Return top matches with minimum score threshold (0.4)
    const topMatches = uniqueMatches.filter(m => m.matchScore >= 0.4).slice(0, 20)

    return NextResponse.json(topMatches)
  } catch (error) {
    console.error('Error finding matches:', error)
    return NextResponse.json(
      { error: 'Failed to find matches' },
      { status: 500 }
    )
  }
}
