import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateLeadSchema = z.object({
  stage: z.string().optional(),
  assignedTo: z.string().optional(),
  mockupReady: z.boolean().optional(),
  automationStarted: z.boolean().optional(),
  automationDay: z.number().int().min(0).max(14).optional(),
  notes: z.string().optional(),
})

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

    const result = updateLeadSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const data = result.data

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...(data.stage !== undefined && { stage: data.stage }),
        ...(data.assignedTo !== undefined && { assignedTo: data.assignedTo }),
        ...(data.mockupReady !== undefined && { mockupReady: data.mockupReady }),
        ...(data.automationStarted !== undefined && { automationStarted: data.automationStarted }),
        ...(data.automationDay !== undefined && { automationDay: data.automationDay }),
        ...(data.notes !== undefined && { notes: data.notes }),
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
