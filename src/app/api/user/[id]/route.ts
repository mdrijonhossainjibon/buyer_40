import { NextRequest, NextResponse } from 'next/server'
import { cacheQuery, revalidateTag } from '@/lib/cache'

// GET user data with caching
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id

  try {
    // Cache user data for 5 minutes
    const userData = await cacheQuery(
      `user:${userId}`,
      async () => {
        // Simulate database query
        // Replace with your actual database call
        return {
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
      },
      300 // 5 minutes TTL
    )

    const response = NextResponse.json(userData)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    response.headers.set('X-Cache-Tags', `user,user:${userId}`)
    
    return response
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

// PUT update user data and invalidate cache
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

    // Invalidate related caches
    revalidateTag(`user:${userId}`)
    revalidateTag('user')

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user data:', error)
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    )
  }
}
