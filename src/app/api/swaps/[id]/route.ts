import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/swaps/[id] - Update swap request state
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { state } = body

    if (!state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      )
    }

    const validStates = ['PROPOSED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']
    if (!validStates.includes(state)) {
      return NextResponse.json(
        { error: 'Invalid state' },
        { status: 400 }
      )
    }

    const swap = await db.swapRequest.update({
      where: { id: params.id },
      data: { state }
    })

    return NextResponse.json(swap)
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
    await db.swapRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Swap request deleted successfully' })
  } catch (error) {
    console.error('Error deleting swap request:', error)
    return NextResponse.json(
      { error: 'Failed to delete swap request' },
      { status: 500 }
    )
  }
}
