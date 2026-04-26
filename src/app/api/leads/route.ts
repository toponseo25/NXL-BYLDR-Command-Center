import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  phone: z.string().optional().default(''),
  email: z.string().email('Invalid email').optional().default(''),
  serviceType: z.string().min(1, 'Service type is required'),
})

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

    const result = createLeadSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const data = result.data

    const lead = await db.lead.create({
      data: {
        name: data.name,
        businessName: data.businessName,
        phone: data.phone,
        email: data.email,
        serviceType: data.serviceType,
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
