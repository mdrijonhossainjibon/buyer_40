import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Withdrawal from '@/lib/models/Withdrawal';

// Utility function to format numbers (1k, 2.5k, etc.)
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return num.toString()
}
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { action, status, search, limit = 20, offset = 0 } = body

    if (action === 'list-users') {
      // Build query filter
      const query: any = {}
      
      // Filter by status if provided
      if (status && status !== 'all') {
        query.status = status
      }

      // Filter by search query if provided
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i')
        query.$or = [
          { username: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      }

      // Get total count for pagination
      const total = await User.countDocuments(query)

      // Fetch users with pagination
      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
     

      // Get withdrawal totals for all users
      const withdrawalTotals = await Withdrawal.aggregate([
        {
          $match: { status: 'approved' }
        },
        {
          $group: {
            _id: '$userId',
            totalWithdrawals: { $sum: '$amount' }
          }
        }
      ])

      // Create a map for quick lookup
      const withdrawalMap = new Map()
      withdrawalTotals.forEach(item => {
        withdrawalMap.set(item._id.toString(), item.totalWithdrawals)
      })
 
      // Transform data to match expected format
      const transformedUsers = users.map(user => ({
        id: user._id,
        username: user.username,
        status: user.status || 'active',
        joinDate: user.createdAt,
        lastActive: user.lastActive || user.createdAt,
        totalEarnings: formatNumber(user.balanceTK || 0),
        totalWithdrawals: formatNumber(withdrawalMap.get(user.userId.toString()) || 0),
        referralCount: user.referralCount || 0
      }))

      // Get stats for all users
      const allUsers = await User.find({}).select('status').lean()
      const stats = {
        total: allUsers.length,
        active: allUsers.filter(u => (u.status || 'active') === 'active').length,
        inactive: allUsers.filter(u => u.status === 'inactive').length,
        suspend: allUsers.filter(u => u.status === 'suspend').length
      }

      return NextResponse.json({
        success: true,
        data: {
          users: transformedUsers,
          total,
          hasMore: offset + limit < total,
          stats
        }
      })
    }

    if (action === 'get-user-stats') {
      const totalUsers = await User.countDocuments({})
      const activeUsers = await User.countDocuments({ status: 'active' })
      
      // Aggregate total earnings from User model
      const earningsResult = await User.aggregate([
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$balanceTK' }
          }
        }
      ])

      // Aggregate total withdrawals from Withdrawal model
      const withdrawalsResult = await Withdrawal.aggregate([
        {
          $match: { status: 'approved' }
        },
        {
          $group: {
            _id: null,
            totalWithdrawals: { $sum: '$amount' }
          }
        }
      ])

      const totalEarnings = earningsResult[0]?.totalEarnings || 0
      const totalWithdrawals = withdrawalsResult[0]?.totalWithdrawals || 0

      return NextResponse.json({
        success: true,
        data: {
          totalUsers: formatNumber(totalUsers),
          activeUsers: formatNumber(activeUsers),
          totalEarnings: formatNumber(totalEarnings),
          totalWithdrawals: formatNumber(totalWithdrawals),
          averageEarningsPerUser: formatNumber(totalUsers > 0 ? totalEarnings / totalUsers : 0)
        }
      })
    }

    if (action === 'update-user-status') {
      const { userId, newStatus } = body
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { status: newStatus, updatedAt: new Date() },
        { new: true }
      )

      if (!updatedUser) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        message: `User status updated to ${newStatus}`,
        data: { userId, newStatus }
      })
    }

    if (action === 'update-user-balance') {
      const { userId, newBalance } = body
      
      if (typeof newBalance !== 'number' || newBalance < 0) {
        return NextResponse.json({
          success: false,
          message: 'Invalid balance amount'
        }, { status: 400 })
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { balanceTK : newBalance, updatedAt: new Date() },
        { new: true }
      )

      if (!updatedUser) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        message: `User balance updated to ৳${newBalance}`,
        data: { userId, newBalance }
      })
    }

    if (action === 'get-user-details') {
      const { userId } = body
      
      const user = await User.findById(userId); 
      
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 })
      }

      // Calculate additional stats
      const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            phone: user.phone,
            status: user.status || 'active',
            joinDate: user.createdAt,
            lastActive: user.lastActive || user.createdAt,
            totalEarnings: formatNumber(user.totalEarnings || 0),
            totalWithdrawals: formatNumber(user.totalWithdrawals || 0),
            referralCount: user.referralCount || 0
          },
          additionalStats: {
            tasksCompleted: formatNumber(user.tasksCompleted || 0),
            withdrawalRequests: formatNumber(user.withdrawalRequests || 0),
            accountAge
          }
        }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
