import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'

interface UserRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

interface UserResponse {
  success: boolean
  data?: {
    userId: number
    balanceTK: number
    referralCount: number
    dailyAdLimit: number
    watchedToday: number
    telegramBonus: number
    youtubeBonus: number
    isBotVerified: number
    username?: string
    profile: {
      firstName?: string
      lastName?: string
      avatar?: string
    }
    totalEarned: number
    availableBalance: number
    referralCode: string
    recentActivities: Array<{
      _id: string
      activityType: string
      description: string
      amount: number
      status: string
      createdAt: Date
      metadata?: any
    }>
    activityStats: {
      todayActivities: number
      totalActivities: number
      totalEarnings: number
    }
  }
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: UserRequest = await request.json()
    const {  timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const  result  = verifySignature({ timestamp, signature, hash } , secretKey)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }
       const { userId } = JSON.parse(result.data  as string)
    // Connect to database
    await dbConnect()

    // Find or create user
    let user = await User.findOne({ userId })

    if (!user) {
      // Create new user with default values
      user = await User.create({
        userId,
        balanceTK: 0,
        referralCount: 0,
        dailyAdLimit: 10,
        watchedToday: 0,
        telegramBonus: 0,
        youtubeBonus: 0,
        isBotVerified: 0,
        totalEarned: 0,
        withdrawnAmount: 0,
        profile: {},
        settings: {
          notifications: true,
          language: 'en',
          timezone: 'Asia/Dhaka'
        }
      })

      // Log user registration activity
      await Activity.create({
        userId,
        activityType: 'login',
        description: 'User registered and first login',
        amount: 0,
        status: 'completed',
        metadata: {
          isFirstLogin: true,
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      })
    } else {
      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Log login activity
      await Activity.create({
        userId,
        activityType: 'login',
        description: 'User login',
        amount: 0,
        status: 'completed',
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      })
    }

    // Get recent activities (last 10)
    const recentActivities = await Activity.getUserActivities(userId, 10)

    // Get today's activities count
    const todayActivities = await Activity.getTodayActivities(userId)

    // Get activity stats
    const activityStats = await Activity.getUserActivityStats(userId, 30)
    const totalEarnings = activityStats.reduce((sum: number, stat: any) => sum + stat.totalAmount, 0)

    const response: UserResponse = {
      success: true,
      data: {
        userId: user.userId,
        balanceTK: user.balanceTK,
        referralCount: user.referralCount,
        dailyAdLimit: user.dailyAdLimit,
        watchedToday: user.watchedToday,
        telegramBonus: user.telegramBonus,
        youtubeBonus: user.youtubeBonus,
        isBotVerified: user.isBotVerified,
        username: user.username,
        profile: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          avatar: user.profile?.avatar
        },
        totalEarned: user.totalEarned,
        availableBalance: user.balanceTK,
        referralCode: user.referralCode,
        recentActivities: recentActivities.map((activity: any) => ({
          _id: activity._id,
          activityType: activity.activityType,
          description: activity.description,
          amount: activity.amount,
          status: activity.status,
          createdAt: activity.createdAt,
          metadata: activity.metadata
        })),
        activityStats: {
          todayActivities: todayActivities.length,
          totalActivities: recentActivities.length,
          totalEarnings
        }
      },
      message: 'User data retrieved successfully'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
