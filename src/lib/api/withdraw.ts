import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { WithdrawRequest, WithdrawResponse } from '@/store/modules/withdraw/types'

export interface WithdrawAPIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface WithdrawConfig {
  minWithdraw: number
  requiredReferrals: number
}

export class WithdrawAPI {
  // Submit withdrawal request
  static async submitWithdraw(withdrawData: WithdrawRequest): Promise<WithdrawAPIResponse<WithdrawResponse>> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({
            userId: withdrawData.userId,
            withdrawMethod: withdrawData.withdrawMethod,
            accountNumber: withdrawData.accountNumber,
            amount: withdrawData.amount
          }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/withdraw',
        method: 'POST',
        body
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response,
          message: response.response.message || 'Withdrawal request submitted successfully'
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'উইথড্র অনুরোধে সমস্যা হয়েছে'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'নেটওয়ার্ক সমস্যা! আবার চেষ্টা করুন।'
      }
    }
  }

  // Get withdrawal configuration (min amount, required referrals)
  static async getWithdrawConfig(): Promise<WithdrawAPIResponse<WithdrawConfig>> {
    try {
      const response = await API_CALL({
        baseURL,
        url: '/withdraw-config',
        method: 'GET'
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data || {
            minWithdraw: 1000,
            requiredReferrals: 20
          }
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to fetch withdrawal configuration'
        }
      }
    } catch (error: any) {
      // Return default values on error
      return {
        success: true,
        data: {
          minWithdraw: 1000,
          requiredReferrals: 20
        }
      }
    }
  }

  // Get withdrawal history (optional for future use)
  static async getWithdrawHistory(userId: number): Promise<WithdrawAPIResponse<any[]>> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/withdraw-history',
        method: 'POST',
        body
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data || []
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to fetch withdrawal history'
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
export const withdrawAPI = WithdrawAPI
