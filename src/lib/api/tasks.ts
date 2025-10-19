import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { Task } from '@/store/modules/tasks/types'

export interface TasksAPIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export class TasksAPI {
  // Get all tasks for a user
  static async getTasks(userId: number): Promise<TasksAPIResponse<Task[]>> {
    const params = generateSignature(
          JSON.stringify({ userId }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
    try {
      const response = await API_CALL({
        baseURL,
        url: `/tasks`,
        method: 'GET',
        params
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to fetch tasks'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }

  // Claim a task reward
  static async claimTask(userId: number, taskId: string): Promise<TasksAPIResponse<{ reward: number }>> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId, taskId }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: `/tasks`,
        method: 'POST',
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
          error: response.response?.message || 'Failed to claim task'
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
export const tasksAPI = TasksAPI
