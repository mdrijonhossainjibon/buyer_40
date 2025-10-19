import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'

// Activity data interface
export interface ActivityData {
  _id: string
  userId: string
  username?: string
  activityType: string
  description: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  updatedAt: string
  completedAt?: string
  metadata?: {
    adId?: string
    taskId?: string
    referralUserId?: string
    withdrawalMethod?: string
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }
  user?: {
    username: string
    _id: string
  }
}

// Activity list request interface
export interface ActivityListRequest {
  search?: string
  status?: string
  activityType?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Activity list response interface
export interface ActivityListResponse {
  activities: ActivityData[]
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

// API response interface
export interface ActivityAPIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export class ActivityAPI {
  // List activities
  static async listActivities(params: ActivityListRequest): Promise<ActivityAPIResponse<ActivityListResponse>> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.search) queryParams.append('search', params.search)
      if (params.status && params.status !== 'all') queryParams.append('status', params.status)
      if (params.activityType && params.activityType !== 'all') queryParams.append('activityType', params.activityType)
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.offset) queryParams.append('offset', params.offset.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

      const url = `/admin/activities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await API_CALL({
        baseURL,
        url,
        method: 'GET'
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to fetch activities'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }

  // Get activity by ID
  static async getActivity(activityId: string): Promise<ActivityAPIResponse<ActivityData>> {
    try {
      const response = await API_CALL({
        baseURL,
        url: `/admin/activities/${activityId}`,
        method: 'GET'
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to fetch activity'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }

  // Update activity status
  static async updateActivityStatus(
    activityId: string, 
    status: ActivityData['status']
  ): Promise<ActivityAPIResponse<ActivityData>> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ status }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: `/admin/activities/${activityId}/status`,
        method: 'PUT',
        body
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to update activity status'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }
}

// Export singleton instance
export { ActivityAPI as default }
