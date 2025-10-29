"use client";

import { eventChannel, EventChannel } from 'redux-saga'
import { call, put, take, fork, cancel, cancelled, select } from 'redux-saga/effects'
import { Task } from 'redux-saga'
import { getSocketClient, SocketEvents, SocketClient } from '@/lib/socket/socketClient'
import { updateBalance, updateXP } from '../user/actions'
import { RootState } from '@/store'
import toast from 'react-hot-toast';
import { getCurrentUser } from '@/lib/getCurrentUser';
 
/**
 * Create event channel for Socket.IO events
 */
function createSocketChannel(socket: SocketClient): EventChannel<any> {
  return eventChannel((emit) => {
    // User events
    socket.on(SocketEvents.USER_BALANCE_UPDATE, (data: any) => {
      emit({ type: 'BALANCE_UPDATE', payload: data })
    })

    socket.on(SocketEvents.USER_XP_UPDATE, (data: any) => {
      emit({ type: 'XP_UPDATE', payload: data })
    })

    socket.on(SocketEvents.USER_STATUS_UPDATE, (data: any) => {
      emit({ type: 'USER_STATUS_UPDATE', payload: data })
    })

    // Withdrawal events
    socket.on(SocketEvents.WITHDRAWAL_STATUS_UPDATE, (data: any) => {
      emit({ type: 'WITHDRAWAL_STATUS_UPDATE', payload: data })
    })

    socket.on(SocketEvents.WITHDRAWAL_APPROVED, (data: any) => {
      emit({ type: 'WITHDRAWAL_APPROVED', payload: data })
    })

    socket.on(SocketEvents.WITHDRAWAL_REJECTED, (data: any) => {
      emit({ type: 'WITHDRAWAL_REJECTED', payload: data })
    })

    // Task events
    socket.on(SocketEvents.TASK_COMPLETED, (data: any) => {
      emit({ type: 'TASK_COMPLETED', payload: data })
    })

    socket.on(SocketEvents.TASK_REWARD_CLAIMED, (data: any) => {
      emit({ type: 'TASK_REWARD_CLAIMED', payload: data })
    })

    // Spin wheel events
    socket.on(SocketEvents.SPIN_RESULT, (data: any) => {
      emit({ type: 'SPIN_RESULT', payload: data })
    })

    socket.on(SocketEvents.SPIN_TICKETS_UPDATE, (data: any) => {
      emit({ type: 'SPIN_TICKETS_UPDATE', payload: data })
    })

    // Notification events
    socket.on(SocketEvents.NEW_NOTIFICATION, (data: any) => {
      emit({ type: 'NEW_NOTIFICATION', payload: data })
    })

    // Admin events
    socket.on(SocketEvents.ADMIN_WITHDRAWAL_REQUEST, (data: any) => {
      emit({ type: 'ADMIN_WITHDRAWAL_REQUEST', payload: data })
    })

    socket.on(SocketEvents.ADMIN_USER_UPDATE, (data: any) => {
      emit({ type: 'ADMIN_USER_UPDATE', payload: data })
    })

    // Connection events
    socket.on('internal:connect', (data: any) => {
      emit({ type: 'CONNECTED', payload: data })
    })

    socket.on('internal:disconnect', (data: any) => {
      emit({ type: 'DISCONNECTED', payload: data })
    })

    socket.on('internal:error', (data: any) => {
      emit({ type: 'ERROR', payload: data })
    })

    // Cleanup function
    return () => {
      console.log('[SocketSaga] Cleaning up socket channel')
      socket.off(SocketEvents.USER_BALANCE_UPDATE)
      socket.off(SocketEvents.USER_XP_UPDATE)
      socket.off(SocketEvents.USER_STATUS_UPDATE)
      socket.off(SocketEvents.WITHDRAWAL_STATUS_UPDATE)
      socket.off(SocketEvents.WITHDRAWAL_APPROVED)
      socket.off(SocketEvents.WITHDRAWAL_REJECTED)
      socket.off(SocketEvents.TASK_COMPLETED)
      socket.off(SocketEvents.TASK_REWARD_CLAIMED)
      socket.off(SocketEvents.SPIN_RESULT)
      socket.off(SocketEvents.SPIN_TICKETS_UPDATE)
      socket.off(SocketEvents.NEW_NOTIFICATION)
      socket.off(SocketEvents.ADMIN_WITHDRAWAL_REQUEST)
      socket.off(SocketEvents.ADMIN_USER_UPDATE)
      socket.off('internal:connect')
      socket.off('internal:disconnect')
      socket.off('internal:error')
    }
  })
}

/**
 * Watch for socket events and dispatch Redux actions
 */
function* watchSocketEvents(socketChannel: EventChannel<any>): Generator<any, void, any> {
  try {
    while (true) {
      const event = yield take(socketChannel)
      
      console.log('[SocketSaga] Received event:', event.type, event.payload)

      switch (event.type) {
        case 'CONNECTED':
          console.log('[SocketSaga] Socket connected:', event.payload.socketId)
          toast.success('Connected to real-time updates')
          break

        case 'DISCONNECTED':
          console.log('[SocketSaga] Socket disconnected:', event.payload.reason)
          toast.error('Disconnected from real-time updates')
          break

        case 'ERROR':
          console.error('[SocketSaga] Socket error:', event.payload.error)
          break

        case 'BALANCE_UPDATE':
          yield put(updateBalance(event.payload.balance))
          break

        case 'XP_UPDATE':
          yield put(updateXP(event.payload.xp))
          if (event.payload.change > 0) {
            toast.success(`+${event.payload.change} XP earned!`)
          }
          break

        case 'USER_STATUS_UPDATE':
          // Dispatch user status update action
          yield put({ type: 'USER_STATUS_UPDATE', payload: event.payload })
          break

        case 'WITHDRAWAL_STATUS_UPDATE':
          // Dispatch withdrawal status update
          yield put({ 
            type: 'WITHDRAWAL_STATUS_UPDATE', 
            payload: event.payload 
          })
          toast(`Withdrawal ${event.payload.status}`, { icon: 'ℹ️' })
          break

        case 'WITHDRAWAL_APPROVED':
          yield put({ 
            type: 'WITHDRAWAL_APPROVED', 
            payload: event.payload 
          })
          toast.success('Withdrawal approved!')
          break

        case 'WITHDRAWAL_REJECTED':
          yield put({ 
            type: 'WITHDRAWAL_REJECTED', 
            payload: event.payload 
          })
          toast.error('Withdrawal rejected')
          break

        case 'TASK_COMPLETED':
          yield put({ 
            type: 'TASK_COMPLETED_UPDATE', 
            payload: event.payload 
          })
          toast.success('Task completed!')
          break

        case 'TASK_REWARD_CLAIMED':
          yield put({ 
            type: 'TASK_REWARD_CLAIMED_UPDATE', 
            payload: event.payload 
          })
          toast.success(`Reward claimed: ${event.payload.reward} USDT`)
          break

        case 'SPIN_RESULT':
          yield put({ 
            type: 'SPIN_RESULT_UPDATE', 
            payload: event.payload 
          })
          break

        case 'SPIN_TICKETS_UPDATE':
          yield put({ 
            type: 'SPIN_TICKETS_UPDATE', 
            payload: event.payload 
          })
          break

        case 'NEW_NOTIFICATION':
          yield put({ 
            type: 'ADD_NOTIFICATION', 
            payload: event.payload 
          })
          toast(event.payload.message, { 
            icon: event.payload.type === 'success' ? '✅' : 
                  event.payload.type === 'error' ? '❌' : 
                  event.payload.type === 'warning' ? '⚠️' : 'ℹ️'
          })
          break

        case 'ADMIN_WITHDRAWAL_REQUEST':
          yield put({ 
            type: 'ADMIN_NEW_WITHDRAWAL_REQUEST', 
            payload: event.payload 
          })
          break

        case 'ADMIN_USER_UPDATE':
          yield put({ 
            type: 'ADMIN_USER_UPDATE', 
            payload: event.payload 
          })
          break

        default:
          console.log('[SocketSaga] Unhandled event:', event.type)
      }
    }
  } finally {
    if (yield cancelled()) {
      console.log('[SocketSaga] Socket watcher cancelled')
      socketChannel.close()
    }
  }
}

/**
 * Initialize socket connection saga
 */
export function* initializeSocketSaga(): Generator<any, void, any> {
  let socketTask: Task | null = null

  try {
    
       const currentUser = getCurrentUser();
       const userId = currentUser?.telegramId;

    if (!userId) {
      console.warn('[SocketSaga] No user ID found, skipping socket initialization')
      return
    }

    console.log('[SocketSaga] Initializing socket connection for user:', userId)

    // Get socket client instance
    const socketClient: SocketClient = yield call(getSocketClient)

    // Connect to socket server
    yield call([socketClient, socketClient.connect], userId as any)

    // Create event channel
    const socketChannel: EventChannel<any> = yield call(createSocketChannel, socketClient)

    // Fork socket event watcher
    socketTask = yield fork(watchSocketEvents, socketChannel)

    // Wait for disconnect action
    yield take('DISCONNECT_REQUEST')

    console.log('[SocketSaga] Disconnect requested')
  } catch (error) {
    console.error('[SocketSaga] Error in socket saga:', error)
  } finally {
    // Cleanup
    if (socketTask) {
      yield cancel(socketTask)
    }

    const socketClient = getSocketClient()
    socketClient.disconnect()
    
    console.log('[SocketSaga] Socket connection closed')
  }
}

/**
 * Send message through socket saga
 */
export function* sendSocketMessageSaga(action: { type: string; payload: { event: string; data: any } }): Generator<any, void, any> {
  try {
    const socketClient = getSocketClient()
    
    if (!socketClient.isConnected()) {
      console.warn('[SocketSaga] Socket not connected, cannot send message')
      return
    }

    yield call([socketClient, socketClient.send], action.payload.event, action.payload.data)
    console.log('[SocketSaga] Message sent:', action.payload.event)
  } catch (error) {
    console.error('[SocketSaga] Error sending socket message:', error)
  }
}

/**
 * Join room saga
 */
export function* joinRoomSaga(action: { type: string; payload: { room: string } }): Generator<any, void, any> {
  try {
    const socketClient = getSocketClient()
    yield call([socketClient, socketClient.joinRoom], action.payload.room)
    console.log('[SocketSaga] Joined room:', action.payload.room)
  } catch (error) {
    console.error('[SocketSaga] Error joining room:', error)
  }
}

/**
 * Leave room saga
 */
export function* leaveRoomSaga(action: { type: string; payload: { room: string } }): Generator<any, void, any> {
  try {
    const socketClient = getSocketClient()
    yield call([socketClient, socketClient.leaveRoom], action.payload.room)
    console.log('[SocketSaga] Left room:', action.payload.room)
  } catch (error) {
    console.error('[SocketSaga] Error leaving room:', error)
  }
}
