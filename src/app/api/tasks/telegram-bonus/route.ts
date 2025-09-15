import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'

interface TelegramBonusRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramBonusRequest = await request.json()
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

    // Check if user already claimed telegram bonus
    if (user.telegramBonus > 0) {
      return NextResponse.json(
        { success: false, message: 'Telegram bonus already claimed!' },
        { status: 400 }
      )
    }

    // Telegram bonus amount
    const bonusAmount = 50

    // Update user stats
    user.telegramBonus = bonusAmount
    user.balanceTK += bonusAmount
    user.totalEarned += bonusAmount
    await user.save()

    // Log activity
    await Activity.create({
      userId: user.userId,
      activityType: 'bonus',
      description: `Claimed Telegram channel bonus and earned ${bonusAmount} TK`,
      amount: bonusAmount,
      status: 'completed',
      metadata: {
        taskId: 'telegram_channel_join',
        bonusType: 'telegram',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: `Channel bonus claimed! You earned ${bonusAmount} TK!`,
      data: {
        earned: bonusAmount,
        newBalance: user.balanceTK,
        telegramBonus: user.telegramBonus
      }
    })

  } catch (error) {
    console.error('Telegram bonus API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
