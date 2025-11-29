"use client";

import { eventChannel, EventChannel } from 'redux-saga'
import { call, put, take, fork, cancel, cancelled, select, delay } from 'redux-saga/effects'
import { Task } from 'redux-saga'
import { getSocketClient, SocketEvents, SocketClient } from 'lib/socket/socketClient';


import { getCurrentUser } from 'lib/getCurrentUser';
import { Toast } from 'antd-mobile';
import { fetchUserDataSuccess, updateBalance, updateXP } from 'modules/user';
import { withdrawalStatusUpdate } from 'modules/withdraw';
import { fetchAllActions } from 'modules/app/actions';
import toast from 'react-hot-toast';
import { socketSendMessage } from './actions';


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

    // Withdrawal status update event
    socket.on(SocketEvents.WITHDRAWAL_STATUS_UPDATE, (data: any) => {
      emit({ type: 'WITHDRAWAL_STATUS_UPDATE', payload: data })
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


    // Connection events
    socket.on('internal:connect', (data: any) => {
      emit({ type: 'CONNECTED', payload: data })
    })

    socket.on('auth:response', (data: any) => {
      emit({ type: 'AUTH:LOGIN', payload: data })
    });

    socket.on('auth:error', (data: any) => {
      emit({ type: 'AUTH:ERROR', payload: data })
    });

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
      socket.off(SocketEvents.TASK_COMPLETED)
      socket.off(SocketEvents.TASK_REWARD_CLAIMED)
      socket.off(SocketEvents.SPIN_RESULT)
      socket.off(SocketEvents.SPIN_TICKETS_UPDATE)
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
      const currentUser = getCurrentUser();
      console.log('[SocketSaga] Received event:', event.type, event.payload)

      switch (event.type) {
        case 'CONNECTED':
          console.log('[SocketSaga] Socket connected:', event.payload.socketId)
          Toast.show({ content: 'AUTH:LOGIN', icon: 'loading' });
          yield delay(3000);
          yield put(socketSendMessage('auth:user', JSON.stringify({ ...currentUser })))
          break

        case 'DISCONNECTED':
          console.log('[SocketSaga] Socket disconnected:', event.payload.reason)
          Toast.show({ content: 'Disconnected' })
          break

        case 'ERROR':
          console.error('[SocketSaga] Socket error:', event.payload.error)
          break

        case 'XP_UPDATE':
          if (event.payload.telegramId === currentUser?.telegramId) {
            yield put(updateXP(event.payload.xp))
          }

          break
        case 'BALANCE_UPDATE':
          if (event.payload.telegramId === currentUser?.telegramId) {
            yield put(updateBalance(event.payload.usdt))
          }

          break
        case 'USER_STATUS_UPDATE':
          // Dispatch user status update action
          yield put({ type: 'USER_STATUS_UPDATE', payload: event.payload })
          break

        case 'WITHDRAWAL_STATUS_UPDATE':
          // Dispatch withdrawal status update to withdraw reducer
          console.log('[SocketSaga] Withdrawal status update:', event.payload)
          yield put(withdrawalStatusUpdate(event.payload))
          break
        case 'AUTH:LOGIN':
          yield put(fetchUserDataSuccess(event.payload.user));
          Toast.show({ content: 'AUTH:SUCCESS' });
          yield put(fetchAllActions())
          break;
        case 'AUTH:ERROR':
          Toast.show({ content: 'AUTH:ERROR' });
          break;
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

    // Get socket client instance
    const socketClient: SocketClient = yield call(getSocketClient)

    // Connect to socket server
    yield call([socketClient, socketClient.connect])

    // Create event channel
    const socketChannel: EventChannel<any> = yield call(createSocketChannel, socketClient)

    // Fork socket event watcher
    socketTask = yield fork(watchSocketEvents, socketChannel)

    // Wait for disconnect action
    yield take('SOCKET_DISCONNECT_REQUEST')

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
