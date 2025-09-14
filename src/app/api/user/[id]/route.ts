import { NextRequest, NextResponse } from 'next/server'

// GET user data
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id

  try {
    // Simulate database query
    // Replace with your actual database call
    const userData = {
      id: userId,
      balanceTK: Math.floor(Math.random() * 1000),
      referralCount: Math.floor(Math.random() * 50),
      dailyAdLimit: 10,
      watchedToday: Math.floor(Math.random() * 10),
      telegramBonus: Math.floor(Math.random() * 100),
      youtubeBonus: Math.floor(Math.random() * 100),
      isBotVerified: Math.random() > 0.5 ? 1 : 0,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

// PUT update user data
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id

  try {
    const body = await req.json()
    
    // Update user data in database
    // Replace with your actual database update
    const updatedUser = {
      id: userId,
      ...body,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user data:', error)
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    )
  }
}
