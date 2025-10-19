import { API_CALL } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { WithdrawalRequest } from '@/store/modules/adminWithdrawals/types'

// Generate signature function
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
interface WithdrawalsResponse {
  success: boolean
  data: {
    withdrawals: WithdrawalRequest[]
    totalCount: number
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    totalAmount: number
    pendingAmount: number
  }
  message?: string
}

interface ProcessWithdrawalResponse {
  success: boolean
  data: {
    withdrawalId: string
    status: string
    message: string
  }
  message?: string
}

interface BulkProcessResponse {
  success: boolean
  data: {
    processedCount: number
    failedCount: number
    results: Array<{
      withdrawalId: string
      success: boolean
      message: string
    }>
  }
  message?: string
}

// Admin Withdrawals API client
export const AdminWithdrawalsAPI = {
  // Get all withdrawal requests
  async getWithdrawals(): Promise<WithdrawalsResponse> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/withdrawals',
        method: 'POST',
        body: JSON.stringify({
          action: 'list-withdrawals',
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
        })
      })

      if (status === 200 && response.success) {
        return {
          success: true,
          data: {
            withdrawals: response.data.withdrawals || [],
            totalCount: response.data.totalCount || 0,
            pendingCount: response.data.pendingCount || 0,
            approvedCount: response.data.approvedCount || 0,
            rejectedCount: response.data.rejectedCount || 0,
            totalAmount: response.data.totalAmount || 0,
            pendingAmount: response.data.pendingAmount || 0
          }
        }
      } else {
        throw new Error(response.message || 'Failed to fetch withdrawals')
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
      throw error
    }
  },

  // Process a single withdrawal (approve/reject)
  async processWithdrawal(
    withdrawalId: string,
    action: 'approve' | 'reject',
    adminNote?: string,
    transactionId?: string
  ): Promise<ProcessWithdrawalResponse> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/withdrawal-action',
        method: 'POST',
        body: JSON.stringify({
          withdrawalId,
          action,
          adminNote,
          transactionId,
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
        })
      })

      if (status === 200 && response.success) {
        return {
          success: true,
          data: {
            withdrawalId,
            status: action === 'approve' ? 'approved' : 'rejected',
            message: response.message || `Withdrawal ${action}d successfully`
          }
        }
      } else {
        throw new Error(response.message || `Failed to ${action} withdrawal`)
      }
    } catch (error) {
      console.error(`Error ${action}ing withdrawal:`, error)
      throw error
    }
  },

  // Bulk process multiple withdrawals
  async bulkProcessWithdrawals(
    withdrawalIds: string[],
    action: 'approve' | 'reject',
    adminNote?: string
  ): Promise<BulkProcessResponse> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/bulk-withdrawal-action',
        method: 'POST',
        body: JSON.stringify({
          withdrawalIds,
          action,
          adminNote,
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
        })
      })

      if (status === 200 && response.success) {
        return {
          success: true,
          data: {
            processedCount: response.data.processedCount || 0,
            failedCount: response.data.failedCount || 0,
            results: response.data.results || []
          }
        }
      } else {
        throw new Error(response.message || `Failed to bulk ${action} withdrawals`)
      }
    } catch (error) {
      console.error(`Error bulk ${action}ing withdrawals:`, error)
      throw error
    }
  },

  // Get withdrawal statistics
  async getWithdrawalStatistics(): Promise<{
    totalCount: number
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    totalAmount: number
    pendingAmount: number
  }> {
    try {
      const { response, status } = await API_CALL({
        baseURL,
        url: '/admin/withdrawal-statistics',
        method: 'POST',
        body: JSON.stringify({
          action: 'get-statistics',
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
        })
      })

      if (status === 200 && response.success) {
        return {
          totalCount: response.data.totalCount || 0,
          pendingCount: response.data.pendingCount || 0,
          approvedCount: response.data.approvedCount || 0,
          rejectedCount: response.data.rejectedCount || 0,
          totalAmount: response.data.totalAmount || 0,
          pendingAmount: response.data.pendingAmount || 0
        }
      } else {
        throw new Error(response.message || 'Failed to fetch withdrawal statistics')
      }
    } catch (error) {
      console.error('Error fetching withdrawal statistics:', error)
      throw error
    }
  }
}
