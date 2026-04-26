import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/leads/[id]/automation — Start automation for a lead
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await db.lead.update({
      where: { id },
      data: {
        automationStarted: true,
        automationDay: 1,
      },
      include: { tasks: true, activities: true },
    })

    // Create activity log entry
    await db.activity.create({
      data: {
        type: 'automation_started',
        message: `14-day funnel started for ${lead.name} (${lead.businessName})`,
        leadId: lead.id,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('POST /api/leads/[id]/automation error:', error)
    return NextResponse.json({ error: 'Failed to start automation' }, { status: 500 })
  }
}
