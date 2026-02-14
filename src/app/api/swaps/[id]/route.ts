import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Tambahkan mapping transisi yang diizinkan di luar fungsi
// agar variabel ini tidak perlu dibuat ulang setiap kali API dipanggil
const VALID_TRANSITIONS: Record<string, string[]> = {
  PROPOSED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['COMPLETED', 'REJECTED'],
  COMPLETED: [],
  REJECTED: []
};

// PATCH /api/swaps/[id] - Update swap request state
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { state } = body

    // Validasi dasar: Pastikan request body memiliki data 'state'
    if (!state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      )
    }

    // 1. Ambil state saat ini dari database
    const currentSwap = await db.swapRequest.findUnique({ 
      where: { id: params.id },
      // Optimasi: Karena kita hanya butuh mengecek state, kita tidak perlu menarik seluruh data
      select: { state: true } 
    });
    
    if (!currentSwap) {
      return NextResponse.json(
        { error: 'Swap request not found' }, 
        { status: 404 }
      );
    }

    // 2. Validasi transisi state (Cegah loncat state!)
    // Ambil daftar state tujuan yang diizinkan berdasarkan state saat ini
    const allowedNextStates = VALID_TRANSITIONS[currentSwap.state] || [];
    
    if (!allowedNextStates.includes(state)) {
      return NextResponse.json(
        { error: `Invalid transition from ${currentSwap.state} to ${state}` },
        { status: 400 }
      );
    }

    // 3. Lakukan update jika semua validasi lolos
    const updatedSwap = await db.swapRequest.update({
      where: { id: params.id },
      data: { state }
    })

    return NextResponse.json(updatedSwap)
  } catch (error) {
    console.error('Error updating swap request:', error)
    return NextResponse.json(
      { error: 'Failed to update swap request' },
      { status: 500 }
    )
  }
}

// DELETE /api/swaps/[id] - Delete a swap request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Opsional untuk Next.js 15: const { id } = await params;
    
    await db.swapRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Swap request deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting swap request:', error)
    
    // Cek jika errornya karena ID tidak ditemukan (Prisma Error P2025)
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Swap request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete swap request' },
      { status: 500 }
    )
  }
}