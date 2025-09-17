import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Activity from '@/lib/models/Activity'
import User from '@/lib/models/User'

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
    const { action, search, status, activityType, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = body

    if (action === 'list-activities') {
      // Build query filter
      const query: any = {}
      
      // Filter by status if provided
      if (status && status !== 'all') {
        query.status = status
      }

      // Filter by activity type if provided
      if (activityType && activityType !== 'all') {
        query.activityType = activityType
      }

      // Filter by search query if provided
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i')
        query.$or = [
          { description: searchRegex },
          { activityType: searchRegex },
          { userId: isNaN(Number(search)) ? undefined : Number(search) }
        ].filter(Boolean)
      }

      // Get total count for pagination
      const total = await Activity.countDocuments(query)

      // Build sort object
      const sortObj: any = {}
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1

      // Fetch activities with pagination
      const activities = await Activity.find(query)
        .sort(sortObj)
        .skip(offset)
        .limit(limit)
        .lean()

      // Get user information for activities
      const userIds = [...new Set(activities.map(activity => activity.userId))]
      const users = await User.find({ userId: { $in: userIds } }).select('userId username email').lean()
      const userMap = new Map(users.map(user => [user.userId, user]))

      // Transform data to include user information
      const transformedActivities = activities.map(activity => ({
        ...activity,
        _id: activity._id,
        user: userMap.get(activity.userId) || null
      }))

      // Get stats for all activities
      const stats = await Activity.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ])

      const statsObj = {
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        totalAmount: 0
      }

      stats.forEach(stat => {
        statsObj[stat._id as keyof typeof statsObj] = stat.count
        statsObj.total += stat.count
        statsObj.totalAmount += stat.totalAmount
      })

      return NextResponse.json({
        success: true,
        data: {
          activities: transformedActivities,
          total,
          hasMore: offset + limit < total,
          stats: statsObj
        }
      })
    }

    if (action === 'get-activity-details') {
      const { activityId } = body
      
      const activity = await Activity.findById(activityId)
      
      if (!activity) {
        return NextResponse.json({
          success: false,
          message: 'Activity not found'
        }, { status: 404 })
      }

      // Get user information
      const user = await User.findOne({ userId: activity.userId }).select('userId username email phone')

      return NextResponse.json({
        success: true,
        data: {
          activity: {
            ...activity,
            _id: activity._id.toString(),
            user
          }
        }
      })
    }

    if (action === 'update-activity-status') {
      const { activityId, newStatus, adminNote } = body
      
      if (!['pending', 'completed', 'failed', 'cancelled'].includes(newStatus)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid status'
        }, { status: 400 })
      }

      const updateData: any = {
        status: newStatus,
        updatedAt: new Date()
      }

      // Set completedAt if status is completed
      if (newStatus === 'completed') {
        updateData.completedAt = new Date()
      }

      // Add admin note to metadata if provided
      if (adminNote) {
        updateData.$set = {
          'metadata.adminNote': adminNote,
          'metadata.adminActionAt': new Date()
        }
      }

      const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        updateData,
        { new: true }
      )

      if (!updatedActivity) {
        return NextResponse.json({
          success: false,
          message: 'Activity not found'
        }, { status: 404 })
      }

      // If activity is completed and has amount, update user balance
      if (newStatus === 'completed' && updatedActivity.amount > 0) {
        await User.findOneAndUpdate(
          { userId: updatedActivity.userId },
          { $inc: { balanceTK: updatedActivity.amount } }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: `Activity status updated to ${newStatus}`,
        data: {
          activity: {
            ...updatedActivity,
            _id: updatedActivity._id.toString()
          }
        }
      })
    }

    if (action === 'get-activity-stats') {
      // Get comprehensive activity statistics
      const [statusStats, typeStats, recentStats] = await Promise.all([
        // Status statistics
        Activity.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' }
            }
          }
        ]),
        
        // Activity type statistics
        Activity.aggregate([
          {
            $group: {
              _id: '$activityType',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' }
            }
          }
        ]),
        
        // Recent activity (last 7 days)
        Activity.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 },
              amount: { $sum: '$amount' }
            }
          },
          { $sort: { _id: 1 } }
        ])
      ])

      return NextResponse.json({
        success: true,
        data: {
          statusStats,
          typeStats,
          recentStats
        }
      })
    }

    if (action === 'bulk-update-activities') {
      const { activityIds, newStatus, adminNote } = body
      
      if (!Array.isArray(activityIds) || activityIds.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Activity IDs are required'
        }, { status: 400 })
      }

      if (!['pending', 'completed', 'failed', 'cancelled'].includes(newStatus)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid status'
        }, { status: 400 })
      }

      const updateData: any = {
        status: newStatus,
        updatedAt: new Date()
      }

      if (newStatus === 'completed') {
        updateData.completedAt = new Date()
      }

      if (adminNote) {
        updateData['metadata.adminNote'] = adminNote
        updateData['metadata.adminActionAt'] = new Date()
      }

      const result = await Activity.updateMany(
        { _id: { $in: activityIds } },
        updateData
      )

      // If activities are completed, update user balances
      if (newStatus === 'completed') {
        const completedActivities = await Activity.find({
          _id: { $in: activityIds },
          amount: { $gt: 0 }
        })
        // Group by userId and sum amounts
        const userBalanceUpdates = new Map()
        completedActivities.forEach(activity => {
          const current = userBalanceUpdates.get(activity.userId) || 0
          userBalanceUpdates.set(activity.userId, current + activity.amount)
        })

        // Update user balances
        const balanceUpdatePromises = Array.from(userBalanceUpdates.entries()).map(([userId, amount]) =>
          User.findOneAndUpdate(
            { userId },
            { $inc: { balanceTK: amount } }
          )
        )

        await Promise.all(balanceUpdatePromises)
      }

      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} activities updated to ${newStatus}`,
        data: {
          modifiedCount: result.modifiedCount
        }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Admin activities API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'all'
    const activityType = searchParams.get('activityType') || 'all'
    const search = searchParams.get('search') || ''

    // Build query filter
    const query: any = {}
    
    if (status !== 'all') {
      query.status = status
    }

    if (activityType !== 'all') {
      query.activityType = activityType
    }

    if (search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i')
      query.$or = [
        { description: searchRegex },
        { activityType: searchRegex },
        { userId: isNaN(Number(search)) ? undefined : Number(search) }
      ].filter(Boolean)
    }

    // Get total count
    const total = await Activity.countDocuments(query)

    // Fetch activities
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      

    // Get user information
    const userIds = [...new Set(activities.map(activity => activity.userId))]
    const users = await User.find({ userId: { $in: userIds } }).select('userId username email').lean()
    const userMap = new Map(users.map(user => [user.userId, user]))

    // Transform data
    const transformedActivities = activities.map(activity => ({
      ...activity,
      _id: activity._id,
      user: userMap.get(activity.userId) || null
    }))

    return NextResponse.json({
      success: true,
      data: {
        activities: transformedActivities,
        total,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Admin activities GET API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
