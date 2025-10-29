import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { ConversionRate, ConversionHistory, CurrencyType } from '@/store/modules/converter/types'

export interface GetRatesResponse {
  success: boolean
  data?: ConversionRate[]
  error?: string
}

export interface GetHistoryResponse {
  success: boolean
  data?: ConversionHistory[]
  error?: string
}

export interface ConvertResponse {
  success: boolean
  data?: {
    conversion: ConversionHistory
    newBalances: {
      xp?: number
      tickets?: number
      balance?: number
    }
  }
  message?: string
  error?: string
}

export class ConverterAPI {
  /**
   * Get all available conversion rates
   */
  static async getRates(): Promise<GetRatesResponse> {
    try {
      const response = await API_CALL({
        baseURL,
        url: '/converter/rates',
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
          error: response.response?.message || 'Failed to fetch conversion rates'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch conversion rates'
      }
    }
  }

  /**
   * Get conversion history for a user
   */
  static async getHistory(userId: number): Promise<GetHistoryResponse> {
    try {
      const params = generateSignature(
        JSON.stringify({ userId }),
        process.env.NEXT_PUBLIC_SECRET_KEY || ''
      )

      const response = await API_CALL({
        baseURL,
        url: `/converter/history/${userId}`,
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
          error: response.response?.message || 'Failed to fetch conversion history'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch conversion history'
      }
    }
  }

  /**
   * Convert currency
   */
  static async convert(
    userId: number,
    fromCurrency: CurrencyType,
    toCurrency: CurrencyType,
    amount: number
  ): Promise<ConvertResponse> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId, fromCurrency, toCurrency, amount }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/converter/convert',
        method: 'POST',
        body
      })

      if (response.status === 200 && response.response?.success) {
        return {
          success: true,
          data: response.response.data,
          message: response.response.message
        }
      } else {
        return {
          success: false,
          error: response.response?.message || 'Failed to convert currency'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to convert currency'
      }
    }
  }
}
