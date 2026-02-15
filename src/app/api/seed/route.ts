import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST /api/seed - Seed database with sample data
export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    await db.swapRequest.deleteMany({})
    await db.skill.deleteMany({})
    await db.user.deleteMany({})

    // Buat satu password default untuk semua akun dummy: 'password123'
    const defaultPassword = await bcrypt.hash('password123', 10)

    // Create sample users
    const users = await Promise.all([
      db.user.create({
        data: {
          name: 'Budi Santoso',
          email: 'budi@example.com',
          password: defaultPassword, 
          role: 'USER',
          bio: 'Web developer dengan pengalaman 5 tahun. Suka berbagi ilmu pemrograman.',
          rating: 4.7,
          isActive: true
        }
      }),
      db.user.create({
        data: {
          name: 'Siti Rahayu',
          email: 'siti@example.com',
          password: defaultPassword, 
          role: 'USER',
          bio: 'Desainer grafis profesional. Ahli dalam UI/UX design.',
          rating: 4.9,
          isActive: true
        }
      }),
      db.user.create({
        data: {
          name: 'Ahmad Wijaya',
          email: 'ahmad@example.com',
          password: defaultPassword, 
          role: 'USER',
          bio: 'Digital marketer dan content writer. Berpengalaman dalam SEO.',
          rating: 4.5,
          isActive: true
        }
      }),
      db.user.create({
        data: {
          name: 'Dewi Kartika',
          email: 'dewi@example.com',
          password: defaultPassword, 
          role: 'USER',
          bio: 'Data scientist dan machine learning enthusiast.',
          rating: 4.8,
          isActive: true
        }
      }),
      db.user.create({
        data: {
          name: 'Rudi Hermawan',
          email: 'rudi@example.com',
          password: defaultPassword, 
          role: 'USER',
          bio: 'Fotografer dan video editor profesional.',
          rating: 4.6,
          isActive: true
        }
      }),
      db.user.create({
        data: {
          name: 'Admin Platform',
          email: 'admin@skillswap.com',
          password: defaultPassword, 
          role: 'ADMIN',
          bio: 'Administrator platform SkillSwap.',
          rating: 5.0,
          isActive: true
        }
      })
    ])

    // PERBAIKAN: Beri tahu TypeScript bahwa array ini akan menampung Promise/Data apa saja
    const skills: any[] = []

    // Budi's skills
    skills.push(
      db.skill.create({
        data: {
          userId: users[0].id,
          skillName: 'JavaScript',
          skillCategory: 'Programming',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[0].id,
          skillName: 'React',
          skillCategory: 'Programming',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[0].id,
          skillName: 'UI Design',
          skillCategory: 'Design',
          skillLevel: 'Beginner',
          type: 'NEEDED'
        }
      })
    )

    // Siti's skills
    skills.push(
      db.skill.create({
        data: {
          userId: users[1].id,
          skillName: 'UI Design',
          skillCategory: 'Design',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[1].id,
          skillName: 'Figma',
          skillCategory: 'Design',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[1].id,
          skillName: 'JavaScript',
          skillCategory: 'Programming',
          skillLevel: 'Intermediate',
          type: 'NEEDED'
        }
      })
    )

    // Ahmad's skills
    skills.push(
      db.skill.create({
        data: {
          userId: users[2].id,
          skillName: 'SEO',
          skillCategory: 'Marketing',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[2].id,
          skillName: 'Content Writing',
          skillCategory: 'Marketing',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[2].id,
          skillName: 'Photography',
          skillCategory: 'Art',
          skillLevel: 'Beginner',
          type: 'NEEDED'
        }
      })
    )

    // Dewi's skills
    skills.push(
      db.skill.create({
        data: {
          userId: users[3].id,
          skillName: 'Python',
          skillCategory: 'Programming',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[3].id,
          skillName: 'Machine Learning',
          skillCategory: 'Data Science',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[3].id,
          skillName: 'Digital Marketing',
          skillCategory: 'Marketing',
          skillLevel: 'Beginner',
          type: 'NEEDED'
        }
      })
    )

    // Rudi's skills
    skills.push(
      db.skill.create({
        data: {
          userId: users[4].id,
          skillName: 'Photography',
          skillCategory: 'Art',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[4].id,
          skillName: 'Video Editing',
          skillCategory: 'Art',
          skillLevel: 'Expert',
          type: 'OFFERED'
        }
      }),
      db.skill.create({
        data: {
          userId: users[4].id,
          skillName: 'SEO',
          skillCategory: 'Marketing',
          skillLevel: 'Intermediate',
          type: 'NEEDED'
        }
      })
    )

    await Promise.all(skills)

    return NextResponse.json({
      message: 'Database seeded successfully',
      usersCount: users.length,
      skillsCount: skills.length
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}