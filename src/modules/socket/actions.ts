/**
 * Socket Redux Actions
 */

import { SOCKET_ACTIONS } from './types'

// Connection actions
export const socketConnectRequest = () => ({
  type: SOCKET_ACTIONS.SOCKET_CONNECT_REQUEST,
})

export const socketDisconnectRequest = () => ({
  type: SOCKET_ACTIONS.SOCKET_DISCONNECT_REQUEST,
})

// Message actions
export const socketSendMessage = (event: string, data: any) => ({
  type: SOCKET_ACTIONS.SOCKET_SEND_MESSAGE,
  payload: { event, data },
})

// Room actions
export const socketJoinRoom = (room: string) => ({
  type: SOCKET_ACTIONS.SOCKET_JOIN_ROOM,
  payload: { room },
})

export const socketLeaveRoom = (room: string) => ({
  type: SOCKET_ACTIONS.SOCKET_LEAVE_ROOM,
  payload: { room },
})
