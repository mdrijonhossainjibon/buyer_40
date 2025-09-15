import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

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
  }
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: UserRequest = await request.json()
    const { userId, timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const isValidSignature = verifySignature(timestamp, secretKey, signature, hash, 2000)
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find or create user
    let user = await User.findOne({ userId })
    
    if (!user) {
      // Create new user with default values
      user = new User({
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
        isActive: true,
        profile: {},
        settings: {
          notifications: true,
          language: 'en',
          timezone: 'Asia/Dhaka'
        }
      })
      await user.save()
    } else {
      // Update last login
      user.lastLogin = new Date()
      await user.save()
    }

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
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatar: user.profile.avatar
        },
        totalEarned: user.totalEarned,
        availableBalance: user.availableBalance
      }
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

// Handle GET requests for fetching user data without authentication (for development)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId parameter is required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const user = await User.findOne({ userId: parseInt(userId) })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

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
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatar: user.profile.avatar
        },
        totalEarned: user.totalEarned,
        availableBalance: user.availableBalance
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Users GET API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle PUT requests for updating user data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, timestamp, signature, hash, updateData } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const isValidSignature = verifySignature(timestamp, secretKey, signature, hash, 2000)
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    await dbConnect()
    const user = await User.findOne({ userId })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Update user data
    Object.assign(user, updateData)
    await user.save()

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
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatar: user.profile.avatar
        },
        totalEarned: user.totalEarned,
        availableBalance: user.availableBalance
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Users PUT API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
