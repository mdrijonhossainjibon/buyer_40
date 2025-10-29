/**
 * WebSocket client for real-time withdrawal status updates
 */

export type WithdrawalStatus = 
  | 'WITHDRAWAL_INITIATED'
  | 'WITHDRAWAL_PROCESSING'
  | 'WITHDRAWAL_SUCCESS'
  | 'WITHDRAWAL_FAILED'
  | 'WITHDRAWAL_PENDING'

export interface WithdrawalMessage {
  type: WithdrawalStatus
  transactionId?: string
  withdrawalId?: string
  status?: string
  error?: string
  confirmations?: number
  data?: any
}

export interface WithdrawalSocketConfig {
  url?: string
  onMessage: (message: WithdrawalMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  reconnectInterval?: number
}

export class WithdrawalSocket {
  private ws: WebSocket | null = null
  private config: WithdrawalSocketConfig
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isManualClose = false

  constructor(config: WithdrawalSocketConfig) {
    this.config = {
      autoReconnect: true,
      reconnectInterval: 3000,
      ...config,
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    try {
      const wsUrl = this.config.url || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws/withdraw'
      
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('[WithdrawalSocket] Connected to withdrawal service')
        this.isManualClose = false
        if (this.config.onConnect) {
          this.config.onConnect()
        }
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WithdrawalMessage = JSON.parse(event.data)
          console.log('[WithdrawalSocket] Message received:', message)
          this.config.onMessage(message)
        } catch (error) {
          console.error('[WithdrawalSocket] Error parsing message:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('[WithdrawalSocket] WebSocket error:', error)
        if (this.config.onError) {
          this.config.onError(error)
        }
      }

      this.ws.onclose = () => {
        console.log('[WithdrawalSocket] Disconnected')
        this.ws = null
        
        if (this.config.onDisconnect) {
          this.config.onDisconnect()
        }

        // Auto-reconnect if enabled and not manually closed
        if (this.config.autoReconnect && !this.isManualClose) {
          this.reconnectTimeout = setTimeout(() => {
            console.log('[WithdrawalSocket] Attempting to reconnect...')
            this.connect()
          }, this.config.reconnectInterval)
        }
      }
    } catch (error) {
      console.error('[WithdrawalSocket] Error creating connection:', error)
    }
  }

  /**
   * Send message to server
   */
  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn('[WithdrawalSocket] Cannot send message: WebSocket not connected')
    }
  }

  /**
   * Initiate withdrawal request
   */
  initiateWithdrawal(withdrawalData: {
    withdrawalId: string
    coinId: string
    coinSymbol: string
    network: string
    address: string
    amount: string
  }): void {
    this.send({
      type: 'INITIATE_WITHDRAWAL',
      data: withdrawalData,
    })
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManualClose = true
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * Get current connection state
   */
  getReadyState(): number | null {
    return this.ws ? this.ws.readyState : null
  }
}

/**
 * Create a withdrawal socket instance
 */
export function createWithdrawalSocket(config: WithdrawalSocketConfig): WithdrawalSocket {
  return new WithdrawalSocket(config)
}
