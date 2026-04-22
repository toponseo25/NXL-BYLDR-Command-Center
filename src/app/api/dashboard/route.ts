import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard — Return dashboard stats
export async function GET() {
  try {
    const [
      totalLeads,
      newLeads,
      hotLeadCount,
      pendingTasks,
      urgentTasks,
      activeAutomations,
      recentActivities,
      leadsByStageData,
      allLeads,
    ] = await Promise.all([
      // Total leads count
      db.lead.count(),

      // New leads today
      db.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Hot leads count
      db.lead.count({
        where: { stage: 'hot_lead' },
      }),

      // Pending tasks
      db.task.count({
        where: { status: 'pending' },
      }),

      // Urgent tasks (priority = urgent and not completed)
      db.task.count({
        where: { priority: 'urgent', status: { not: 'completed' } },
      }),

      // Active automations
      db.lead.count({
        where: { automationStarted: true },
      }),

      // Recent 10 activities
      db.activity.findMany({
        include: { lead: { select: { id: true, name: true, businessName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Leads grouped by stage (raw data)
      db.lead.groupBy({
        by: ['stage'],
        _count: { stage: true },
      }),

      // All leads for stuck leads calculation
      db.lead.findMany({
        where: {
          stage: { notIn: ['closed_won', 'closed_lost'] },
        },
      }),
    ])

    // Build leadsByStage object
    const leadsByStage: Record<string, number> = {}
    for (const item of leadsByStageData) {
      leadsByStage[item.stage] = item._count.stage
    }

    // Calculate stuck leads (in same stage > 3 days)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const stuckLeads = allLeads.filter(
      (lead) => new Date(lead.updatedAt) < threeDaysAgo
    )

    // Conversion rate: closed_won / total
    const closedWonCount = leadsByStage['closed_won'] ?? 0
    const conversionRate = totalLeads > 0 ? closedWonCount / totalLeads : 0

    return NextResponse.json({
      totalLeads,
      newLeads,
      hotLeads: hotLeadCount,
      leadsByStage,
      pendingTasks,
      urgentTasks,
      activeAutomations,
      stuckLeads,
      recentActivities,
      conversionRate,
    })
  } catch (error) {
    console.error('GET /api/dashboard error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
