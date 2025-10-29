import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { SpinPrize, SpinResult } from '@/store/modules/spinWheel/types'

export interface SpinConfigResponse {
  success: boolean
  data?: {
    prizes: SpinPrize[]
    canSpin: boolean
    nextSpinTime: number | null
    spinsToday: number
    maxSpinsPerDay: number
    freeSpinsUsed: number
    maxFreeSpins: number
    extraSpinsUnlocked: number
    maxExtraSpins: number
    spinTickets: number
    ticketPrice: number
  }
  error?: string
}

export interface SpinWheelResponse {
  success: boolean
  data?: {
    result: SpinResult
    newBalance: number
    nextSpinTime: number
    spinsToday: number
  }
  error?: string
}

export interface UnlockExtraSpinResponse {
  success: boolean
  data?: {
    extraSpinsUnlocked: number
    canSpin: boolean
  }
  error?: string
}

export interface PurchaseTicketResponse {
  success: boolean
  data?: {
    spinTickets: number
    newXP: number
    message: string
  }
  error?: string
}

export interface SpinWithTicketResponse {
  success: boolean
  data?: {
    result: SpinResult
    spinTickets: number
    newBalance: number
  }
  error?: string
}

export interface UserTicketsResponse {
  success: boolean
  data?: {
    userId: number
    ticketCount: number
    totalPurchased: number
    totalSpins: number
    totalWinnings: number
    lastPurchaseDate: string
  }
  error?: string
}

export class SpinWheelAPI {
  /**
   * Get spin wheel configuration and user's spin status
   */
  static async getSpinConfig(userId: number): Promise<SpinConfigResponse> {
    const params = generateSignature(
      JSON.stringify({ userId }),
      process.env.NEXT_PUBLIC_SECRET_KEY || ''
    )
    
    try {
      const response = await API_CALL({
        baseURL,
        url: `/spin-wheel/config`,
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
          error: response.response?.message || 'Failed to fetch spin configuration'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch spin configuration'
      }
    }
  }

  /**
   * Spin the wheel and get result
   */
  static async spin(userId: number): Promise<SpinWheelResponse> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/spin-wheel/spin',
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
          error: response.response?.message || 'Failed to spin the wheel'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to spin the wheel'
      }
    }
  }

  /**
   * Purchase spin tickets with XP
   */
  static async purchaseTicket(userId: number, quantity: number): Promise<PurchaseTicketResponse> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId, quantity }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/spin-wheel/purchase-ticket',
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
          error: response.response?.message || 'Failed to purchase ticket'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to purchase ticket'
      }
    }
  }

  /**
   * Spin the wheel using a ticket
   */
  static async spinWithTicket(userId: number): Promise<SpinWithTicketResponse> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/spin-wheel/spin-with-ticket',
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
          error: response.response?.message || 'Failed to spin with ticket'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to spin with ticket'
      }
    }
  }

  /**
   * Unlock an extra spin by watching an ad
   */
  static async unlockExtraSpin(userId: number): Promise<UnlockExtraSpinResponse> {
    try {
      const body = {
        ...generateSignature(
          JSON.stringify({ userId }),
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }

      const response = await API_CALL({
        baseURL,
        url: '/spin-wheel/unlock-extra-spin',
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
          error: response.response?.message || 'Failed to unlock extra spin'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to unlock extra spin'
      }
    }
  }

  /**
   * Get user's ticket information
   */
  static async getUserTickets(userId: number): Promise<UserTicketsResponse> {
    const params = generateSignature(
      JSON.stringify({ userId }),
      process.env.NEXT_PUBLIC_SECRET_KEY || ''
    )
    
    try {
      const response = await API_CALL({
        baseURL,
        url: `/spin-wheel/user-tickets/${userId}`,
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
          error: response.response?.message || 'Failed to fetch user tickets'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user tickets'
      }
    }
  }
}

// Export singleton instance
export const spinWheelAPI = SpinWheelAPI
