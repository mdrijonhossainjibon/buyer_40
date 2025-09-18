import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import AdsSettings from '@/lib/models/AdsSettings'
interface WatchAdRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
  ipAddress: string
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

    // Get ads settings for ad watch configuration
    const adsConfig = await AdsSettings.findOne().sort({ createdAt: -1 })
    if (!adsConfig) {
      return NextResponse.json(
        { success: false, message: 'Ads settings not found' },
        { status: 500 }
      )
    }

    
    // Check daily ad limit using activities and bot config
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAdWatchCount = await Activity.countDocuments({
      userId: user.userId,
      activityType: 'ad_watch',
      status: 'completed',
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    })

    if (todayAdWatchCount >= adsConfig.adsWatchLimit) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Daily ad limit reached! You can watch ${adsConfig.adsWatchLimit} ads per day. Try again tomorrow.`,
          data: {
            watchedToday: todayAdWatchCount,
            dailyAdLimit: adsConfig.adsWatchLimit,
            nextResetTime: tomorrow.toISOString()
          }
        },
        { status: 429 }
      )
    }

    // Ad earning amount from ads config
    const adEarning = adsConfig.defaultAdsReward
 
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
      description: `Watched rewarded ad and earned ${adEarning} BDT`,
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
      message: `Ad watched! You earned ${adEarning} BDT!`,
      data: {
        earned: adEarning,
        newBalance: user.balanceTK,
        watchedToday: todayAdWatchCount + 1, // +1 because we just added a new activity
        dailyAdLimit: adsConfig.adsWatchLimit
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
