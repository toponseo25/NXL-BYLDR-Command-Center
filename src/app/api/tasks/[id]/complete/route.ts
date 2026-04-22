import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/tasks/[id]/complete — Mark a task as completed
export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current task for activity message
    const currentTask = await db.task.findUnique({
      where: { id },
      include: { lead: true },
    })

    if (!currentTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Update task status
    const task = await db.task.update({
      where: { id },
      data: { status: 'completed' },
      include: { lead: true },
    })

    // Create activity record
    const leadContext = currentTask.lead
      ? ` for ${currentTask.lead.name}` 
      : ''
    await db.activity.create({
      data: {
        type: 'task_completed',
        message: `Task "${currentTask.title}" completed by ${currentTask.assignedTo}${leadContext}`,
        leadId: currentTask.leadId,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('PUT /api/tasks/[id]/complete error:', error)
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 })
  }
}
