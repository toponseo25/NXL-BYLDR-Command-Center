import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leads/[id] — Return a single lead with tasks and activities
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

// PUT /api/leads/[id] — Update a lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { stage, assignedTo, mockupReady, automationStarted, automationDay, notes } = body

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...(stage !== undefined && { stage }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(mockupReady !== undefined && { mockupReady }),
        ...(automationStarted !== undefined && { automationStarted }),
        ...(automationDay !== undefined && { automationDay }),
        ...(notes !== undefined && { notes }),
      },
      include: { tasks: true, activities: true },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('PUT /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

// DELETE /api/leads/[id] — Remove a lead
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.lead.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
