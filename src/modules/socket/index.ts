/**
 * Socket Module - Redux Saga Socket.IO Integration
 * 
 * This module provides real-time communication between the client and server
 * using Socket.IO integrated with Redux Saga for state management.
 */

import { takeEvery, fork } from 'redux-saga/effects'
import { SOCKET_ACTIONS } from './types'
import {
  initializeSocketSaga,
  sendSocketMessageSaga,
  joinRoomSaga,
  leaveRoomSaga,
} from './socketSaga'

/**
 * Root socket saga - watches for socket actions
 */
export function* socketSaga() {
  // Watch for socket actions
  yield takeEvery(SOCKET_ACTIONS.SOCKET_CONNECT_REQUEST, initializeSocketSaga)
  yield takeEvery(SOCKET_ACTIONS.SOCKET_SEND_MESSAGE, sendSocketMessageSaga)
  yield takeEvery(SOCKET_ACTIONS.SOCKET_JOIN_ROOM, joinRoomSaga)
  yield takeEvery(SOCKET_ACTIONS.SOCKET_LEAVE_ROOM, leaveRoomSaga)
}

// Export actions
export * from './actions'
export * from './types'
