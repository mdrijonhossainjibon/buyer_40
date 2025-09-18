import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import { getYouTubeSubscriberCount } from '@/lib/youtubeApi'

interface YoutubeBonusRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

export async function POST(request: NextRequest) {
  try {
    const body: YoutubeBonusRequest = await request.json()
    const {   timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const  { success , data } = verifySignature({ timestamp, signature, hash }, secretKey)

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find user
    const user = await User.findOne({ userId  : data })
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

    // Check if user already claimed YouTube bonus
    if (user.youtubeBonus > 0) {
      return NextResponse.json(
        { success: false, message: 'YouTube bonus already claimed!' },
        { status: 400 }
      )
    }

    // Get real subscriber count from YouTube API
    const channelId = 'UCIZAXemyhC5YC8f3vk7vJ1w' // Replace with actual channel ID
    const youtubeResult = await getYouTubeSubscriberCount(channelId)
    
    if (!youtubeResult.success) {
      return NextResponse.json(
        { success: false, message: `Failed to verify YouTube channel: ${youtubeResult.error}` },
        { status: 400 }
      )
    }

    const subscriberCount = youtubeResult.subscriberCount || 0

    // YouTube bonus amount
    const bonusAmount = 15

    // Update user stats
    user.youtubeBonus = bonusAmount
    user.balanceTK += bonusAmount
    await user.save()

    // Log activity
    await Activity.create({
      userId: user.userId,
      activityType: 'bonus',
      description: `Claimed YouTube subscription bonus and earned ${bonusAmount} BDT`,
      amount: bonusAmount,
      status: 'completed',
      metadata: {
        taskId: 'youtube_subscribe',
        bonusType: 'youtube',
        subscriberCount: subscriberCount,
        channelId: channelId,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: `YouTube bonus claimed! You earned ${bonusAmount} BDT!`,
      data: {
        earned: bonusAmount,
        newBalance: user.balanceTK,
        youtubeBonus: user.youtubeBonus,
        subscriberCount: subscriberCount
      }
    })

  } catch (error) {
    console.error('YouTube bonus API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
