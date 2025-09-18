import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity';
import { BotConfig } from '@/lib/models/BotConfig'
import { checkTelegramChannelJoin } from '@/services/webhook';

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
    const { success , data } = verifySignature({ timestamp, signature, hash }, secretKey)

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()
 
    // Find user
    const user = await User.findOne({ userId : data  })
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

    // Check if user already claimed telegram bonus
    if (user.telegramBonus > 0) {
      return NextResponse.json(
        { success: false, message: 'Telegram bonus already claimed!' },
        { status: 400 }
      )
    }

    // Get bot configuration
    const botConfig = await BotConfig.findOne({ Status: 'online' })
    if (!botConfig) {
      return NextResponse.json(
        { success: false, message: 'Bot is currently offline' },
        { status: 503 } // service unavailable
      )
    }

    // Verify user has joined the Telegram channel
    // You should configure the channel ID in your environment or bot config
    const channelId = '@earnfromads1'
    const membershipCheck = await checkTelegramChannelJoin(
      botConfig.botToken,
      channelId,
      userId
    )

    if (!membershipCheck.success) {
      return NextResponse.json(
        { success: false, message: 'Unable to verify channel membership. Please try again.' },
        { status: 500 }
      )
    }

    if (!membershipCheck.isMember) {
      return NextResponse.json(
        { success: false, message: 'You must join our Telegram channel first to claim this bonus!' },
        { status: 400 }
      )
    }

    // Telegram bonus amount
    const bonusAmount = 10

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
