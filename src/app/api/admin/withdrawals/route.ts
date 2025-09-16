import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Withdrawal from '@/lib/models/Withdrawal'
import User from '@/lib/models/User'
import Admin from '@/lib/models/Admin'
import dbConnect from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 })
    }


    // Check if user is admin
    const admin = await Admin.findOne({ email:session.user.email})
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 })
    }

    const body = await request.json()
    const { action, status, limit = 50, offset = 0 } = body

    if (action === 'list-withdrawals') {
      // Build filter query
      const filter: any = {}
      if (status && status !== 'all') {
        filter.status = status
      }

      // Get withdrawals with user information
      const [withdrawals, total] = await Promise.all([
        Withdrawal.find(filter)
          .populate('userId', 'username profile.firstName profile.lastName')
          .sort({ requestedAt: -1 }) // Newest first
          .limit(limit)
          .skip(offset)
          .exec(),
        Withdrawal.countDocuments(filter)
      ])

      // Format response data
      const formattedWithdrawals = withdrawals.map(withdrawal => {
        const populatedUser = withdrawal.userId as any // User object after population
        return {
          id: withdrawal.withdrawalId,
          userId: populatedUser?.userId || withdrawal.userId,
          username: populatedUser?.username || `${populatedUser?.profile?.firstName || ''} ${populatedUser?.profile?.lastName || ''}`.trim() || 'Unknown User',
          amount: withdrawal.amount,
          netAmount: withdrawal.netAmount,
          fees: withdrawal.fees,
          method: withdrawal.method,
          accountNumber: withdrawal.accountDetails.accountNumber,
          accountName: withdrawal.accountDetails.accountName,
          bankName: withdrawal.accountDetails.bankName,
          branchName: withdrawal.accountDetails.branchName,
          status: withdrawal.status,
          requestTime: withdrawal.requestedAt,
          processedTime: withdrawal.processedAt,
          processedBy: withdrawal.processedBy,
          rejectionReason: withdrawal.rejectionReason,
          transactionId: withdrawal.transactionId,
          adminNote: withdrawal.metadata?.adminNotes || null
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          withdrawals: formattedWithdrawals,
          total,
          hasMore: offset + limit < total
        },
        message: 'Withdrawals retrieved successfully'
      })
    }

    if (action === 'get-stats') {
      const stats = await Withdrawal.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalFees: { $sum: '$fees' }
          }
        }
      ])

      const summary = {
        total: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        rejected: 0,
        cancelled: 0,
        totalAmount: 0,
        totalFees: 0
      }

      stats.forEach(stat => {
        summary.total += stat.count
        summary[stat._id as keyof typeof summary] = stat.count
        summary.totalAmount += stat.totalAmount
        summary.totalFees += stat.totalFees
      })

      return NextResponse.json({
        success: true,
        data: summary,
        message: 'Withdrawal statistics retrieved successfully'
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Admin withdrawals API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
