/**
 * Socket.IO Client for real-time communication
 * Integrated with Redux Saga for state management
 */

import { io, Socket } from 'socket.io-client';
import { generateSignature } from 'auth-fingerprint';
import { baseURL } from 'lib/api-string';

// Socket.IO event types
export enum SocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  
  // User events
  USER_BALANCE_UPDATE = 'user:balance:update',
  USER_XP_UPDATE = 'user:xp:update',
  USER_STATUS_UPDATE = 'user:status:update',
  
  // Withdrawal events
  WITHDRAWAL_STATUS_UPDATE = 'withdrawal:status:update',
  WITHDRAWAL_APPROVED = 'withdrawal:approved',
  WITHDRAWAL_REJECTED = 'withdrawal:rejected',
  
  // Task events
  TASK_COMPLETED = 'task:completed',
  TASK_REWARD_CLAIMED = 'task:reward:claimed',
  
  // Spin wheel events
  SPIN_RESULT = 'spin:result',
  SPIN_TICKETS_UPDATE = 'spin:tickets:update',
  
  // Converter events
  CONVERTER_SUCCESS = 'converter:success',
  CONVERTER_FAILURE = 'converter:failure',
  CONVERTER_PROCESSING = 'converter:processing',
  
}

// Socket.IO message interfaces
export interface SocketMessage<T = any> {
  event: string
  data: T
  timestamp?: number
}

export interface BalanceUpdateMessage {
  userId: number
  balance: number
  currency: string
}

export interface XPUpdateMessage {
  userId: number
  xp: number
  change: number
}

export interface WithdrawalStatusMessage {
  withdrawalId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  transactionHash?: string
  error?: string
}

export interface NotificationMessage {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
}

// Socket.IO client configuration
export interface SocketConfig {
  url?: string
  autoConnect?: boolean
  reconnection?: boolean
  reconnectionDelay?: number
  reconnectionAttempts?: number
  auth?: {
    userId?: number
    token?: string
  }
}

export class SocketClient {
  private socket: Socket | null = null
  private config: SocketConfig
  private eventHandlers: Map<string, Set<Function>> = new Map()

  constructor(config: SocketConfig = {}) {
    this.config = {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionAttempts: 5,
      ...config,
    }
  }

  /**
   * Initialize and connect to Socket.IO server
   */
  connect(userId?: number, token?: string): Socket {
    if (this.socket?.connected) {
      console.log('[SocketClient] Already connected')
      return this.socket
    }

 
    const socketUrl = this.config.url ||  baseURL?.split('/api/v1')[0];

    this.socket = io(socketUrl, {
      autoConnect: this.config.autoConnect,
      reconnection: this.config.reconnection,
      reconnectionDelay: this.config.reconnectionDelay,
      reconnectionAttempts: this.config.reconnectionAttempts,
      auth: {
         userId, token  
      },
        path: '/ws',
      transports: ['websocket', 'polling']
    })

    this.setupDefaultListeners()
    this.socket.connect()

    return this.socket
  }

  /**
   * Setup default event listeners
   */
  private setupDefaultListeners(): void {
    if (!this.socket) return

    this.socket.on(SocketEvents.CONNECT, () => {
      console.log('[SocketClient] Connected to server', this.socket?.id)
      this.emit('internal:connect', { socketId: this.socket?.id })
    })

    this.socket.on(SocketEvents.DISCONNECT, (reason: string) => {
      console.log('[SocketClient] Disconnected from server:', reason)
      this.emit('internal:disconnect', { reason })
    })

    this.socket.on(SocketEvents.CONNECT_ERROR, (error: Error) => {
      console.error('[SocketClient] Connection error:', error)
      this.emit('internal:error', { error })
    })
  }

  /**
   * Subscribe to a specific event
   */
  on<T = any>(event: string, handler: (data: T) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
      
      // Register with Socket.IO
      if (this.socket) {
        this.socket.on(event, (data: T) => {
          this.emit(event, data)
        })
      }
    }

    this.eventHandlers.get(event)?.add(handler)
  }

  /**
   * Unsubscribe from a specific event
   */
  off(event: string, handler?: Function): void {
    if (!handler) {
      // Remove all handlers for this event
      this.eventHandlers.delete(event)
      if (this.socket) {
        this.socket.off(event)
      }
    } else {
      // Remove specific handler
      this.eventHandlers.get(event)?.delete(handler)
    }
  }

  /**
   * Emit event to all local handlers
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`[SocketClient] Error in handler for ${event}:`, error)
        }
      })
    }
  }

  /**
   * Send message to server
   */
  send<T = any>(event: string, data: T): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('[SocketClient] Cannot send message: Socket not connected')
    }
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    this.send('room:join', { room })
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.send('room:leave', { room })
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.eventHandlers.clear()
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id
  }
}

// Singleton instance
let socketClientInstance: SocketClient | null = null

/**
 * Get or create Socket.IO client instance
 */
export function getSocketClient(config?: SocketConfig): SocketClient {
  if (!socketClientInstance) {
    socketClientInstance = new SocketClient(config)
  }
  return socketClientInstance
}

/**
 * Initialize Socket.IO client
 */
export function initializeSocket(userId?: number, token?: string): Socket {
  const client = getSocketClient()
  return client.connect(userId, token)
}

/**
 * Disconnect Socket.IO client
 */
export function disconnectSocket(): void {
  if (socketClientInstance) {
    socketClientInstance.disconnect()
    socketClientInstance = null
  }
}

export default SocketClient
