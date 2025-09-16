import { NextRequest, NextResponse } from 'next/server'
import User from '@/lib/models/User'
import Withdrawal from '@/lib/models/Withdrawal'
import dbConnect from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { action, signature, timestamp, nonce } = body
 
    if (action === 'get-stats') {
      // Get current date for filtering
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      // Fetch real statistics from database
      const [totalUsers, activeUsers, totalWithdrawals, pendingWithdrawals, totalEarnings] = await Promise.all([
        // Total users count
        User.countDocuments(),
        
        // Active users (logged in within last 30 days)
        User.countDocuments({
          lastLogin: { $gte: thirtyDaysAgo },
          status: 'active'
        }),
        
        // Total completed withdrawals
        Withdrawal.countDocuments({
          status: { $in: ['completed', 'approved'] }
        }),
        
        // Pending withdrawals
        Withdrawal.countDocuments({
          status: 'pending'
        }),
        
        // Total earnings (sum of all user balances)
        User.aggregate([
          {
            $group: {
              _id: null,
              totalEarnings: { $sum: '$balanceTK' }
            }
          }
        ])
      ])
      
      const stats = {
        totalUsers,
        activeUsers,
        totalWithdrawals,
        pendingWithdrawals,
        totalEarnings: totalEarnings[0]?.totalEarnings || 0
      }
      
      return NextResponse.json({
        success: true,
        data: stats,
        message: 'Stats retrieved successfully'
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
