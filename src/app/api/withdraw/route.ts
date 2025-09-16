import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import Notification from '@/lib/models/Notification'

interface WithdrawRequest {
  userId: number
  withdrawMethod: string
  accountNumber: string
  amount: number
  timestamp: string
  signature: string
  hash: string
}

export async function POST(request: NextRequest) {
  try {
    const body: WithdrawRequest = await request.json()
    const { timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const result = verifySignature({ timestamp, signature, hash }, secretKey)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    const { userId, withdrawMethod, accountNumber, amount } = JSON.parse(result.data as string)

    // Connect to database
    await dbConnect()

    // Find user
    const user = await User.findOne({ userId })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' },
        { status: 404 }
      )
    }

    // Check if user is suspended
    if (user.status === 'suspend') {
      return NextResponse.json(
        { success: false, message: 'আপনার অ্যাকাউন্ট স্থগিত করা হয়েছে! উইথড্র করতে পারবেন না।' },
        { status: 403 }
      )
    }

    // Validation checks
    const minWithdraw = 2
    const requiredReferrals = 0

    if (user.balanceTK < minWithdraw) {
      return NextResponse.json(
        { success: false, message: `ন্যূনতম উইথড্র পরিমাণ ${minWithdraw} টাকা` },
        { status: 400 }
      )
    }

    if (user.referralCount < requiredReferrals) {
      return NextResponse.json(
        { success: false, message: `উইথড্র করতে কমপক্ষে ${requiredReferrals} টি রেফারেল প্রয়োজন` },
        { status: 400 }
      )
    }

    if (amount > user.balanceTK) {
      return NextResponse.json(
        { success: false, message: 'অপর্যাপ্ত ব্যালেন্স!' },
        { status: 400 }
      )
    }

    if (amount < minWithdraw) {
      return NextResponse.json(
        { success: false, message: `ন্যূনতম ${minWithdraw} টাকা প্রয়োজন` },
        { status: 400 }
      )
    }

    // Update user balance
    await User.findOneAndUpdate(
      { userId },
      { 
        $inc: { 
          balanceTK: -amount,
          withdrawnAmount: amount
        }
      }
    )

    // Create withdrawal activity
    await Activity.create({
      userId,
      activityType: 'withdrawal',
      description: `${withdrawMethod} এ ${amount} টাকা উইথড্র অনুরোধ`,
      amount: amount,
      status: 'pending',
      metadata: {
        withdrawMethod,
        accountNumber,
        requestTime: new Date().toISOString(),
        status: 'pending'
      }
    })

    // Create withdrawal notification
    await Notification.create({
      userId,
      title: '💰 উইথড্র অনুরোধ জমা দেওয়া হয়েছে',
      message: `আপনার ${amount} টাকার উইথড্র অনুরোধ সফলভাবে জমা দেওয়া হয়েছে। ${withdrawMethod} (${accountNumber}) এ পাঠানো হবে।`,
      type: 'info',
      priority: 'high',
      isRead: false,
      metadata: {
        withdrawMethod,
        accountNumber,
        amount,
        requestTime: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'উইথড্র অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!',
      data: {
        amount,
        withdrawMethod,
        accountNumber,
        status: 'pending',
        newBalance: user.balanceTK - amount
      }
    })

  } catch (error) {
    console.error('Withdraw API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
