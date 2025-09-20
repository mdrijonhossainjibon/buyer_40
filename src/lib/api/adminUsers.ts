import { API_CALL } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { User } from '@/store/modules/adminUsers/types'

// Generate signature for admin operations
const generateSignature = (action: string, secretKey: string) => {
  const timestamp = Date.now().toString()
  const nonce = Math.random().toString(36).substring(2, 15)
  const hash = btoa(`${action}-${timestamp}-${nonce}`)
  const signature = btoa(`${hash}-${secretKey}`)
  
  return {
    timestamp,
    nonce,
    signature,
    hash
  }
}

// API response interfaces
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface UsersListResponse {
  users: User[]
}

interface UserUpdateResponse {
  user: User
}

// Admin Users API client
export class AdminUsersAPI {
  private static readonly SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'app'

  // Fetch all users
  static async getUsers(): Promise<User[]> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/users',
        method: 'POST',
        body: JSON.stringify({
          action: 'list-users',
          ...generateSignature('admin', this.SECRET_KEY)
        })
      })

      if (status !== 200) {
        throw new Error(`HTTP ${status}: Failed to fetch users`)
      }

      const data = response as ApiResponse<UsersListResponse>
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users')
      }

      return data.data.users || []
    } catch (error) {
      console.error('AdminUsersAPI.getUsers error:', error)
      throw error instanceof Error ? error : new Error('Failed to fetch users')
    }
  }

  // Update user status
  static async updateUserStatus(userId: string, newStatus: 'active' | 'suspend'): Promise<User> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/users',
        method: 'POST',
        body: JSON.stringify({
          action: 'update-user-status',
          userId,
          newStatus,
          ...generateSignature('admin', this.SECRET_KEY)
        })
      })

      if (status !== 200) {
        throw new Error(`HTTP ${status}: Failed to update user status`)
      }

      const data = response as ApiResponse<UserUpdateResponse>
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update user status')
      }

      return data.data.user
    } catch (error) {
      console.error('AdminUsersAPI.updateUserStatus error:', error)
      throw error instanceof Error ? error : new Error('Failed to update user status')
    }
  }

  // Update user balance
  static async updateUserBalance(userId: string, newBalance: number): Promise<User> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/users',
        method: 'POST',
        body: JSON.stringify({
          action: 'update-user-balance',
          userId,
          newBalance,
          ...generateSignature('admin', this.SECRET_KEY)
        })
      })

      if (status !== 200) {
        throw new Error(`HTTP ${status}: Failed to update user balance`)
      }

      const data = response as ApiResponse<UserUpdateResponse>
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update user balance')
      }

      return data.data.user
    } catch (error) {
      console.error('AdminUsersAPI.updateUserBalance error:', error)
      throw error instanceof Error ? error : new Error('Failed to update user balance')
    }
  }
}
