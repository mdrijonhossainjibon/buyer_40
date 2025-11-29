// Bot status state interface
export interface BotStatusState {
  botUsername: string
  botStatus: 'online' | 'offline' | 'maintenance'
  botLastSeen: string;
  referralCount : null;
  botVersion: string
  isLoading: boolean
  error: string | null
}

// Action types
export const BOT_STATUS_ACTIONS = {
  SET_BOT_STATUS: 'SET_BOT_STATUS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  // Saga actions
  FETCH_BOT_STATUS_REQUEST: 'FETCH_BOT_STATUS_REQUEST',
  FETCH_BOT_STATUS_SUCCESS: 'FETCH_BOT_STATUS_SUCCESS',
  FETCH_BOT_STATUS_FAILURE: 'FETCH_BOT_STATUS_FAILURE'
} as const

// Action interfaces
export interface SetBotStatusAction {
  type: typeof BOT_STATUS_ACTIONS.SET_BOT_STATUS
  payload: Partial<BotStatusState>
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof BOT_STATUS_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof BOT_STATUS_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof BOT_STATUS_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

// Saga action interfaces
export interface FetchBotStatusRequestAction {
  type: typeof BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_REQUEST
  [key: string]: any
}

export interface FetchBotStatusSuccessAction {
  type: typeof BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_SUCCESS
  payload: {
    botUsername: string
    botStatus: 'online' | 'offline' | 'maintenance'
    botLastSeen: string
    botVersion: string;
    referralCount : number;
  }
  [key: string]: any
}

export interface FetchBotStatusFailureAction {
  type: typeof BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_FAILURE
  payload: string
  [key: string]: any
}

export type BotStatusActionTypes = 
  | SetBotStatusAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | FetchBotStatusRequestAction
  | FetchBotStatusSuccessAction
  | FetchBotStatusFailureAction
