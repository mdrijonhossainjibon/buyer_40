// API client functions for activities

export interface ActivityData {
  _id: string
  userId: number
  activityType: 'ad_watch' | 'task_complete' | 'referral' | 'bonus' | 'withdrawal' | 'login' | 'signup'
  description: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata?: {
    adId?: string
    taskId?: string
    referralUserId?: number
    withdrawalMethod?: string
    ipAddress?: string
    userAgent?: string
    adminNote?: string
    adminActionAt?: Date
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  user?: {
    userId: number
    username: string
    email: string
    phone?: string
  }
}

export interface ActivityListResponse {
  success: boolean
  data: {
    activities: ActivityData[]
    total: number
    hasMore: boolean
    stats?: {
      total: number
      pending: number
      completed: number
      failed: number
      cancelled: number
      totalAmount: number
    }
  }
  message?: string
}

export interface ActivityDetailsResponse {
  success: boolean
  data: {
    activity: ActivityData
  }
  message?: string
}

export interface ActivityStatsResponse {
  success: boolean
  data: {
    statusStats: Array<{
      _id: string
      count: number
      totalAmount: number
    }>
    typeStats: Array<{
      _id: string
      count: number
      totalAmount: number
    }>
    recentStats: Array<{
      _id: string
      count: number
      amount: number
    }>
  }
  message?: string
}

export interface ActivityUpdateResponse {
  success: boolean
  data?: {
    activity?: ActivityData
    modifiedCount?: number
  }
  message: string
}

// API client class
export class ActivityAPI {
  private static baseUrl = '/api/admin/activities'

  // List activities with filters and pagination
  static async listActivities(params: {
    search?: string
    status?: string
    activityType?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<ActivityListResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list-activities',
          ...params
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error listing activities:', error)
      return {
        success: false,
        data: {
          activities: [],
          total: 0,
          hasMore: false
        },
        message: 'Failed to fetch activities'
      }
    }
  }

  // Get activity details by ID
  static async getActivityDetails(activityId: string): Promise<ActivityDetailsResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-activity-details',
          activityId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting activity details:', error)
      return {
        success: false,
        data: {
          activity: {} as ActivityData
        },
        message: 'Failed to fetch activity details'
      }
    }
  }

  // Update activity status
  static async updateActivityStatus(
    activityId: string, 
    newStatus: 'pending' | 'completed' | 'failed' | 'cancelled',
    adminNote?: string
  ): Promise<ActivityUpdateResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-activity-status',
          activityId,
          newStatus,
          adminNote
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating activity status:', error)
      return {
        success: false,
        message: 'Failed to update activity status'
      }
    }
  }

  // Get activity statistics
  static async getActivityStats(): Promise<ActivityStatsResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-activity-stats'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting activity stats:', error)
      return {
        success: false,
        data: {
          statusStats: [],
          typeStats: [],
          recentStats: []
        },
        message: 'Failed to fetch activity statistics'
      }
    }
  }

  // Bulk update activities
  static async bulkUpdateActivities(
    activityIds: string[],
    newStatus: 'pending' | 'completed' | 'failed' | 'cancelled',
    adminNote?: string
  ): Promise<ActivityUpdateResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk-update-activities',
          activityIds,
          newStatus,
          adminNote
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error bulk updating activities:', error)
      return {
        success: false,
        message: 'Failed to bulk update activities'
      }
    }
  }

  // Get activities using GET method (for simple queries)
  static async getActivities(params: {
    limit?: number
    offset?: number
    status?: string
    activityType?: string
    search?: string
  } = {}): Promise<ActivityListResponse> {
    try {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString())
        }
      })

      const url = `${this.baseUrl}?${searchParams.toString()}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting activities:', error)
      return {
        success: false,
        data: {
          activities: [],
          total: 0,
          hasMore: false
        },
        message: 'Failed to fetch activities'
      }
    }
  }
}

// Export individual functions for convenience
export const {
  listActivities,
  getActivityDetails,
  updateActivityStatus,
  getActivityStats,
  bulkUpdateActivities,
  getActivities
} = ActivityAPI
