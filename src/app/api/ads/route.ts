import { NextRequest, NextResponse } from 'next/server'

// GET available ads
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    // Simulate database query for available ads
    const ads = Array.from({ length: limit }, (_, i) => ({
      id: `ad_${i + 1}`,
      title: `Advertisement ${i + 1}`,
      description: `Watch this ad and earn coins`,
      reward: Math.floor(Math.random() * 20) + 5,
      duration: Math.floor(Math.random() * 30) + 15,
      url: `https://example.com/ad/${i + 1}`,
      thumbnail: `https://example.com/thumb/${i + 1}.jpg`,
      available: true
    }))

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

// POST watch ad completion
export async function POST(req: NextRequest) {
  try {
    const { adId, userId, watchDuration } = await req.json()

    // Record ad watch in database
    const adWatch = {
      id: `watch_${Date.now()}`,
      adId,
      userId,
      watchDuration,
      reward: Math.floor(Math.random() * 20) + 5,
      completedAt: new Date().toISOString()
    }

    return NextResponse.json(adWatch)
  } catch (error) {
    console.error('Error recording ad watch:', error)
    return NextResponse.json(
      { error: 'Failed to record ad watch' },
      { status: 500 }
    )
  }
}
