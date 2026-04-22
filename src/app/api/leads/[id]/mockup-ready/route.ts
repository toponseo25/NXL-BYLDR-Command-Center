import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/leads/[id]/mockup-ready — Mark mockup ready and start automation
export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current lead
    const lead = await db.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Update lead: set mockup ready, move to mockup_sent, start automation
    const updatedLead = await db.lead.update({
      where: { id },
      data: {
        mockupReady: true,
        stage: 'mockup_sent',
        automationStarted: true,
      },
      include: { tasks: true, activities: true },
    })

    // Create task for Geo to start 14-day funnel
    await db.task.create({
      data: {
        title: 'Start 14-day funnel',
        description: `Begin 14-day automation funnel for ${lead.name} (${lead.businessName})`,
        status: 'pending',
        priority: 'high',
        assignedTo: 'Geo',
        leadId: id,
      },
    })

    // Create activity record
    await db.activity.create({
      data: {
        type: 'mockup_ready',
        message: `Mockup marked as ready for ${lead.name}. Automation started, 14-day funnel task assigned to Geo.`,
        leadId: id,
      },
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error('PUT /api/leads/[id]/mockup-ready error:', error)
    return NextResponse.json({ error: 'Failed to mark mockup ready' }, { status: 500 })
  }
}
