import { NextRequest, NextResponse } from 'next/server'
import Activity, { IActivity } from '@/lib/models/Activity'
import dbConnect from '@/lib/mongodb'


// Extended interface for admin activities view
interface AdminActivity extends IActivity {
  username?: string
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const filterType = searchParams.get('type') || 'all'
    const filterStatus = searchParams.get('status') || 'all'

    // Build query filters
    const query: any = {}
    
    if (filterType !== 'all') {
      query.activityType = filterType
    }
    
    if (filterStatus !== 'all') {
      query.status = filterStatus
    }

    // Get total count for pagination
    const totalCount = await Activity.countDocuments(query)
    
    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalCount / limit)

    // Fetch activities with pagination and sorting
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as AdminActivity[]
 
    const activitiesWithUsernames = activities.map(activity => ({
      ...activity,
      username: `User ${activity.userId}` // Replace with actual user lookup
    }))

    const hasMore = page < totalPages

    return NextResponse.json({
      success: true,
      data: {
        activities: activitiesWithUsernames,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore
        },
        filters: {
          type: filterType,
          status: filterStatus
        }
      }
    })

  } catch (error) {
    console.error('Activities API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch activities',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'refresh') {
      // In a real app, this might trigger a cache refresh or database sync
      return NextResponse.json({
        success: true,
        message: 'Activities refreshed successfully'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Activities POST API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
