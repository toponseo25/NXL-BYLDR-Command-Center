import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const stageSchema = z.object({
  stage: z.string().min(1, 'Stage is required'),
})

// PUT /api/leads/[id]/stage — Change pipeline stage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = stageSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
    }
    const stage = result.data.stage

    // Get current lead for the activity message
    const currentLead = await db.lead.findUnique({ where: { id } })
    if (!currentLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const previousStage = currentLead.stage

    // Update lead stage
    const lead = await db.lead.update({
      where: { id },
      data: { stage },
      include: { tasks: true, activities: true },
    })

    // Create activity record
    await db.activity.create({
      data: {
        type: 'stage_change',
        message: `${lead.name} moved from "${previousStage}" to "${stage}"`,
        leadId: id,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('PUT /api/leads/[id]/stage error:', error)
    return NextResponse.json({ error: 'Failed to change stage' }, { status: 500 })
  }
}
