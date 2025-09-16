import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Withdrawal from '@/lib/models/Withdrawal'
import dbConnect from '@/lib/mongodb'

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
    const { action, page = 1, limit = 20, status } = body

    if (action === 'get-history') {
      const skip = (page - 1) * limit
      const userId = parseInt(session.user.id)

      // Build filter
      const filter: any = { userId }
      if (status && status !== 'all') {
        filter.status = status
      }

      const [withdrawals, total] = await Promise.all([
        Withdrawal.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .select('-metadata.ipAddress -metadata.userAgent') // Hide sensitive data
          .exec(),
        Withdrawal.countDocuments(filter)
      ])

      // Calculate summary stats
      const stats = await Withdrawal.aggregate([
        { $match: { userId } },
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
        totalWithdrawn: 0,
        totalFees: 0
      }

      stats.forEach(stat => {
        summary.total += stat.count
        summary[stat._id as keyof typeof summary] = stat.count
        if (stat._id === 'completed') {
          summary.totalWithdrawn += stat.totalAmount
          summary.totalFees += stat.totalFees
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          withdrawals,
          summary,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      })
    }

    if (action === 'get-details') {
      const { withdrawalId } = body
      if (!withdrawalId) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal ID is required'
        }, { status: 400 })
      }

      const withdrawal = await Withdrawal.findOne({
        withdrawalId,
        userId: parseInt(session.user.id)
      }).select('-metadata.ipAddress -metadata.userAgent')

      if (!withdrawal) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: withdrawal
      })
    }

    if (action === 'cancel') {
      const { withdrawalId } = body
      if (!withdrawalId) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal ID is required'
        }, { status: 400 })
      }

      const withdrawal = await Withdrawal.findOne({
        withdrawalId,
        userId: parseInt(session.user.id),
        status: 'pending'
      })

      if (!withdrawal) {
        return NextResponse.json({
          success: false,
          message: 'Pending withdrawal not found'
        }, { status: 404 })
      }

      // Update withdrawal status
      withdrawal.status = 'cancelled'
      withdrawal.processedAt = new Date()
      await withdrawal.save()

      // Refund amount to user
      const User = require('@/lib/models/User').default
      const user = await User.findOne({ userId: withdrawal.userId })
      if (user) {
        user.balanceTK += withdrawal.amount
        await user.save()
      }

      return NextResponse.json({
        success: true,
        message: 'Withdrawal cancelled and amount refunded'
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Withdrawal history API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
