import { NextRequest, NextResponse } from 'next/server'

// We use a lazy-import pattern to avoid stale Prisma Client caching
let _db: any = null

async function getDb() {
  if (!_db) {
    try {
      const mod = await import('@/lib/db')
      _db = mod.db
    } catch {
      return null
    }
  }
  return _db
}

// GET /api/nxl — Get the NXL project (singleton)
export async function GET() {
  try {
    const db = await getDb()
    if (db && db.nxlProject) {
      const project = await db.nxlProject.findFirst()
      if (project) return NextResponse.json(project)
    }
    // Demo fallback when no project exists (or Prisma model not available)
    return NextResponse.json({
      id: 'demo',
      projectName: 'NXL BYLDR',
      businessName: 'Demo Business',
      ownerName: 'Demo Owner',
      ownerEmail: 'demo@example.com',
      phase: 'game_plan',
      alertState: 'action',
      alertMessage: 'ACTION REQUIRED: We need your OTP code for Facebook Ads',
      checklistStep: 4,
      completedSteps: '0,1,2,3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('GET /api/nxl error:', error)
    // Even on error, return demo data so the UI works
    return NextResponse.json({
      id: 'demo',
      projectName: 'NXL BYLDR',
      businessName: 'Demo Business',
      ownerName: 'Demo Owner',
      ownerEmail: 'demo@example.com',
      phase: 'game_plan',
      alertState: 'action',
      alertMessage: 'ACTION REQUIRED: We need your OTP code for Facebook Ads',
      checklistStep: 4,
      completedSteps: '0,1,2,3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
}

// POST /api/nxl — Create NXL project
export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    if (!db || !db.nxlProject) {
      return NextResponse.json({ error: 'NxlProject model not available' }, { status: 503 })
    }
    const body = await request.json()
    const project = await db.nxlProject.create({ data: body })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('POST /api/nxl error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// PUT /api/nxl — Update NXL project
export async function PUT(request: NextRequest) {
  try {
    const db = await getDb()
    if (!db || !db.nxlProject) {
      return NextResponse.json({ error: 'NxlProject model not available' }, { status: 503 })
    }
    const body = await request.json()
    const first = await db.nxlProject.findFirst()
    if (!first) {
      const project = await db.nxlProject.create({ data: body })
      return NextResponse.json(project)
    }
    const project = await db.nxlProject.update({
      where: { id: first.id },
      data: body,
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error('PUT /api/nxl error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
