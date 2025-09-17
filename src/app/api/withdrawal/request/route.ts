import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
 
import User from '@/lib/models/User'
import Withdrawal from '@/lib/models/Withdrawal'
import Activity from '@/lib/models/Activity'
import dbConnect from '@/lib/mongodb'
import { authOptions } from '@/lib/authOptions'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 })
    }

    const body = await request.json()
    const { amount, method, accountDetails } = body

    // Validation
    if (!amount || !method || !accountDetails) {
      return NextResponse.json({
        success: false,
        message: 'Amount, method, and account details are required'
      }, { status: 400 })
    }

    if (amount < 10) {
      return NextResponse.json({
        success: false,
        message: 'Minimum withdrawal amount is 10 TK'
      }, { status: 400 })
    }

    if (amount > 50000) {
      return NextResponse.json({
        success: false,
        message: 'Maximum withdrawal amount is 50,000 TK'
      }, { status: 400 })
    }

    const validMethods = ['bkash', 'nagad', 'rocket', 'bank']
    if (!validMethods.includes(method)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid withdrawal method'
      }, { status: 400 })
    }

    // Get user and check balance
    const user = await User.findOne({ userId: parseInt(session.user.id) })
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }

    if (user.balanceTK < amount) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient balance'
      }, { status: 400 })
    }

    // Check for pending withdrawals
    const pendingWithdrawal = await Withdrawal.findOne({
      userId: user.userId,
      status: 'pending'
    })

    if (pendingWithdrawal) {
      return NextResponse.json({
        success: false,
        message: 'You already have a pending withdrawal request'
      }, { status: 400 })
    }

    // Create withdrawal request
    const withdrawal = new Withdrawal({
      userId: user.userId,
      amount,
      method,
      accountDetails: {
        accountNumber: accountDetails.accountNumber,
        accountName: accountDetails.accountName,
        bankName: accountDetails.bankName,
        branchName: accountDetails.branchName
      },
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent')
      }
    })

    await withdrawal.save()

    // Deduct amount from user balance (hold it)
    user.balanceTK -= amount
    await user.save()

    // Log activity
    await Activity.create({
      userId: user.userId,
      activityType: 'withdrawal',
      description: `Withdrawal request of ${amount} TK via ${method}`,
      amount: amount,
      metadata: {
        withdrawalId: withdrawal.withdrawalId,
        withdrawalMethod: method
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        withdrawalId: withdrawal.withdrawalId,
        amount: withdrawal.amount,
        netAmount: withdrawal.netAmount,
        fees: withdrawal.fees,
        method: withdrawal.method,
        status: withdrawal.status
      },
      message: 'Withdrawal request submitted successfully'
    })

  } catch (error) {
    console.error('Withdrawal request error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
