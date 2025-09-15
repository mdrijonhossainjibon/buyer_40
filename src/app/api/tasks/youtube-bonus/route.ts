import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'

interface YoutubeBonusRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

export async function POST(request: NextRequest) {
  try {
    const body: YoutubeBonusRequest = await request.json()
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

    // Check if user already claimed YouTube bonus
    if (user.youtubeBonus > 0) {
      return NextResponse.json(
        { success: false, message: 'YouTube bonus already claimed!' },
        { status: 400 }
      )
    }

    // YouTube bonus amount
    const bonusAmount = 75

    // Update user stats
    user.youtubeBonus = bonusAmount
    user.balanceTK += bonusAmount
    user.totalEarned += bonusAmount
    await user.save()

    // Log activity
    await Activity.create({
      userId: user.userId,
      activityType: 'bonus',
      description: `Claimed YouTube subscription bonus and earned ${bonusAmount} TK`,
      amount: bonusAmount,
      status: 'completed',
      metadata: {
        taskId: 'youtube_subscribe',
        bonusType: 'youtube',
        subscriberCount: 1250, // Mock data
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: `YouTube bonus claimed! You earned ${bonusAmount} TK!`,
      data: {
        earned: bonusAmount,
        newBalance: user.balanceTK,
        youtubeBonus: user.youtubeBonus,
        subscriberCount: 1250
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
