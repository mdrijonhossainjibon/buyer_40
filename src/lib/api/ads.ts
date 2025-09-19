import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { AdsSettings } from '@/store/modules/adsSettings/types'

export interface AdsAPIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export class AdsAPI {
  // Get ads settings
  static async getSettings(): Promise<AdsAPIResponse<AdsSettings>> {
    try {
      const response = await API_CALL({
        baseURL,
        url: '/ads-settings',
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
          error: response.response?.message || 'Failed to fetch ads settings'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }

  // Update ads settings
  static async updateSettings(settings: AdsSettings): Promise<AdsAPIResponse<AdsSettings>> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify(settings),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/ads-settings',
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
          error: response.response?.message || 'Failed to update ads settings'
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
export const adsAPI = AdsAPI
