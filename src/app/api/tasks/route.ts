import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional().default(null),
  status: z.enum(['pending', 'in_progress', 'completed']).optional().default('pending'),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional().default('medium'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  leadId: z.string().optional().default(null),
  dueDate: z.string().optional().default(null),
})

// GET /api/tasks — Return all tasks with lead info
export async function GET() {
  try {
    const tasks = await db.task.findMany({
      include: { lead: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/tasks — Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = createTaskSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const data = result.data

    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        leadId: data.leadId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: { lead: true },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('POST /api/tasks error:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
