import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/activities — Return latest 50 activities with lead info
export async function GET() {
  try {
    const activities = await db.activity.findMany({
      include: { lead: { select: { id: true, name: true, businessName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(activities)
  } catch (error) {
    console.error('GET /api/activities error:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
