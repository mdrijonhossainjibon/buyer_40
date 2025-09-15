import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'

interface WatchAdRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

export async function POST(request: NextRequest) {
  try {
    const body: WatchAdRequest = await request.json()
    const { userId, timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const isValidSignature = verifySignature({ timestamp, signature, hash }, secretKey)

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find user
    const user = await User.findOne({ userId })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is suspended
    if (user.status === 'suspend') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended!' },
        { status: 403 }
      )
    }

    // Check if user has reached daily limit
    if (user.watchedToday >= user.dailyAdLimit) {
      return NextResponse.json(
        { success: false, message: 'Daily ad limit reached!' },
        { status: 400 }
      )
    }

    // Ad earning amount
    const adEarning = 5

    // Update user stats
    user.watchedToday += 1
    user.balanceTK += adEarning
    user.totalEarned += adEarning
    user.lastAdWatch = new Date()
    await user.save()

    // Log activity
    await Activity.create({
      userId: user.userId,
      activityType: 'ad_watch',
      description: `Watched rewarded ad and earned ${adEarning} TK`,
      amount: adEarning,
      status: 'completed',
      metadata: {
        adId: `ad_${Date.now()}`,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: `Ad watched! You earned ${adEarning} TK!`,
      data: {
        earned: adEarning,
        newBalance: user.balanceTK,
        watchedToday: user.watchedToday,
        dailyAdLimit: user.dailyAdLimit
      }
    })

  } catch (error) {
    console.error('Watch ad API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
