// API client functions for bot management

export interface BotConfig {
  _id?: string
  botToken: string
  botUsername: string
  Status: 'online' | 'offline'
  webhookUrl: string
  lastUpdated: Date
  createdAt: Date
  updatedAt: Date
}

export interface BotStatus {
  _id?: string
  botUsername: string
  botStatus: 'online' | 'offline' | 'maintenance'
  botLastSeen: Date
  botVersion: string
  createdAt: Date
  updatedAt: Date
}

export interface BotConfigResponse {
  success: boolean
  data: {
    config: BotConfig
  }
  message?: string
}

export interface BotStatusResponse {
  success: boolean
  data: {
    status: BotStatus
  }
  message?: string
}

export interface BotDataResponse {
  success: boolean
  data: {
    config: BotConfig
    status: BotStatus
  }
  message?: string
}

export interface BotUpdateResponse {
  success: boolean
  data?: {
    config?: BotConfig
    status?: BotStatus
  }
  message: string
}

export interface WebhookResponse {
  success: boolean
  data?: {
    webhookUrl: string
    isSet: boolean
  }
  message: string
}

// API client class
export class BotAPI {
  private static baseUrl = '/api/admin/bots'

  // Get bot configuration
  static async getBotConfig(): Promise<BotConfigResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert date strings to Date objects
      if (result.data?.config) {
        result.data.config.lastUpdated = new Date(result.data.config.lastUpdated)
        result.data.config.createdAt = new Date(result.data.config.createdAt)
        result.data.config.updatedAt = new Date(result.data.config.updatedAt)
      }

      return result
    } catch (error) {
      console.error('Error getting bot config:', error)
      return {
        success: false,
        data: {
          config: {
            botToken: '',
            botUsername: '@earnfromadsbd_bot',
            Status: 'offline',
            webhookUrl: '',
            lastUpdated: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        message: 'Failed to fetch bot configuration'
      }
    }
  }

  // Get bot status
  static async getBotStatus(): Promise<BotStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert date strings to Date objects
      if (result.data?.status) {
        result.data.status.botLastSeen = new Date(result.data.status.botLastSeen)
        result.data.status.createdAt = new Date(result.data.status.createdAt)
        result.data.status.updatedAt = new Date(result.data.status.updatedAt)
      }

      return result
    } catch (error) {
      console.error('Error getting bot status:', error)
      return {
        success: false,
        data: {
          status: {
            botUsername: '@earnfromadsbd_bot',
            botStatus: 'offline',
            botLastSeen: new Date(),
            botVersion: 'v2.1.0',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        message: 'Failed to fetch bot status'
      }
    }
  }

  // Get both bot config and status in one call
  static async getBotData(): Promise<BotDataResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert date strings to Date objects
      if (result.data?.config) {
        result.data.config.lastUpdated = new Date(result.data.config.lastUpdated)
        result.data.config.createdAt = new Date(result.data.config.createdAt)
        result.data.config.updatedAt = new Date(result.data.config.updatedAt)
      }
      
      if (result.data?.status) {
        result.data.status.botLastSeen = new Date(result.data.status.botLastSeen)
        result.data.status.createdAt = new Date(result.data.status.createdAt)
        result.data.status.updatedAt = new Date(result.data.status.updatedAt)
      }

      return result
    } catch (error) {
      console.error('Error getting bot data:', error)
      return {
        success: false,
        data: {
          config: {
            botToken: '',
            botUsername: '@earnfromadsbd_bot',
            Status: 'offline',
            webhookUrl: '',
            lastUpdated: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: {
            botUsername: '@earnfromadsbd_bot',
            botStatus: 'offline',
            botLastSeen: new Date(),
            botVersion: 'v2.1.0',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        message: 'Failed to fetch bot data'
      }
    }
  }

  // Update bot configuration
  static async updateBotConfig(config: Partial<BotConfig>): Promise<BotUpdateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert date strings to Date objects
      if (result.data?.config) {
        result.data.config.lastUpdated = new Date(result.data.config.lastUpdated)
        result.data.config.createdAt = new Date(result.data.config.createdAt)
        result.data.config.updatedAt = new Date(result.data.config.updatedAt)
      }

      return result
    } catch (error) {
      console.error('Error updating bot config:', error)
      return {
        success: false,
        message: 'Failed to update bot configuration'
      }
    }
  }

  // Update bot status
  static async updateBotStatus(status: 'online' | 'offline' | 'maintenance'): Promise<BotUpdateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert date strings to Date objects
      if (result.data?.status) {
        result.data.status.botLastSeen = new Date(result.data.status.botLastSeen)
        result.data.status.createdAt = new Date(result.data.status.createdAt)
        result.data.status.updatedAt = new Date(result.data.status.updatedAt)
      }

      return result
    } catch (error) {
      console.error('Error updating bot status:', error)
      return {
        success: false,
        message: 'Failed to update bot status'
      }
    }
  }

  // Set webhook
  static async setWebhook(webhookUrl: string): Promise<WebhookResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookUrl })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error setting webhook:', error)
      return {
        success: false,
        message: 'Failed to set webhook'
      }
    }
  }

  // Restart bot
  static async restartBot(): Promise<BotUpdateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/restart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error restarting bot:', error)
      return {
        success: false,
        message: 'Failed to restart bot'
      }
    }
  }

  // Stop bot
  static async stopBot(): Promise<BotUpdateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error stopping bot:', error)
      return {
        success: false,
        message: 'Failed to stop bot'
      }
    }
  }
}

// Export individual functions for convenience
export const {
  getBotConfig,
  getBotStatus,
  getBotData,
  updateBotConfig,
  updateBotStatus,
  setWebhook,
  restartBot,
  stopBot
} = BotAPI
