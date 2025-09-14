import { NextRequest, NextResponse } from 'next/server'

// GET tasks
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const category = searchParams.get('category') || 'all'

  try {
    // Simulate database query for tasks
    const tasks = [
      {
        id: '1',
        title: 'Watch YouTube Video',
        description: 'Watch and like our latest video',
        reward: 50,
        type: 'youtube',
        completed: false,
        url: 'https://youtube.com/watch?v=example'
      },
      {
        id: '2',
        title: 'Join Telegram Channel',
        description: 'Join our official Telegram channel',
        reward: 30,
        type: 'telegram',
        completed: false,
        url: 'https://t.me/example'
      },
      {
        id: '3',
        title: 'Daily Check-in',
        description: 'Complete your daily check-in',
        reward: 10,
        type: 'daily',
        completed: false,
        url: null
      }
    ]

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST complete task
export async function POST(req: NextRequest) {
  try {
    const { taskId, userId } = await req.json()

    // Update task completion in database
    // Replace with your actual database update
    const completedTask = {
      id: taskId,
      userId,
      completedAt: new Date().toISOString(),
      reward: 50 // Example reward
    }

    return NextResponse.json(completedTask)
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}
