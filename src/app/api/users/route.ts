import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // 👈 Pastikan password diambil dari body
    const { name, email, password, role = 'USER', bio = '', rating = 0 } = body 

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    // 👈 Enkripsi password menggunakan bcrypt!
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // 👈 Simpan password yang sudah diacak
        role, bio, rating
      }
    })

    // 👈 Jangan kembalikan password ke frontend demi keamanan
    const { password: _, ...userWithoutPassword } = user 
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
