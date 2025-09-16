import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

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
     

      // Transform data to match expected format
      const transformedUsers = users.map(user => ({
        id: user._id,
        username: user.username,
        status: user.status || 'active',
        joinDate: user.createdAt,
        lastActive: user.lastActive || user.createdAt,
        totalEarnings: user.balanceTK || 0,
        totalWithdrawals: user.totalWithdrawals || 0,
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
      
      // Aggregate total earnings and withdrawals
      const earningsResult = await User.aggregate([
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$totalEarnings' },
            totalWithdrawals: { $sum: '$totalWithdrawals' }
          }
        }
      ])

      const { totalEarnings = 0, totalWithdrawals = 0 } = earningsResult[0] || {}

      return NextResponse.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          totalEarnings,
          totalWithdrawals,
          averageEarningsPerUser: totalUsers > 0 ? totalEarnings / totalUsers : 0
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
            totalEarnings: user.totalEarnings || 0,
            totalWithdrawals: user.totalWithdrawals || 0,
            referralCount: user.referralCount || 0
          },
          additionalStats: {
            tasksCompleted: user.tasksCompleted || 0,
            withdrawalRequests: user.withdrawalRequests || 0,
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
