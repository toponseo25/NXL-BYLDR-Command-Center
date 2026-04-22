import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leads — Return all leads with tasks and activities
export async function GET() {
  try {
    const leads = await db.lead.findMany({
      include: {
        tasks: true,
        activities: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('GET /api/leads error:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

// POST /api/leads — Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, businessName, phone, email, serviceType } = body

    if (!name || !businessName || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, businessName, serviceType' },
        { status: 400 }
      )
    }

    const lead = await db.lead.create({
      data: {
        name,
        businessName,
        phone,
        email,
        serviceType,
        stage: 'new_lead',
        assignedTo: 'Sal',
        tags: 'CA_BYLDR_LEAD',
      },
      include: { tasks: true, activities: true },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('POST /api/leads error:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
