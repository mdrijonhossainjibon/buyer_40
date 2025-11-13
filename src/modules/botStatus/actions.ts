import { 
  BOT_STATUS_ACTIONS, 
  SetBotStatusAction, 
  SetLoadingAction, 
  SetErrorAction, 
  ClearErrorAction,
  FetchBotStatusRequestAction,
  FetchBotStatusSuccessAction,
  FetchBotStatusFailureAction,
  BotStatusState 
} from './types'

// Action creators
export const setBotStatus = (botStatusData: Partial<BotStatusState>): SetBotStatusAction => ({
  type: BOT_STATUS_ACTIONS.SET_BOT_STATUS,
  payload: botStatusData
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: BOT_STATUS_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setError = (error: string | null): SetErrorAction => ({
  type: BOT_STATUS_ACTIONS.SET_ERROR,
  payload: error
})

export const clearError = (): ClearErrorAction => ({
  type: BOT_STATUS_ACTIONS.CLEAR_ERROR
})

// Saga action creators
export const fetchBotStatusRequest = (): FetchBotStatusRequestAction => ({
  type: BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_REQUEST
})

export const fetchBotStatusSuccess = (data: {
  botUsername: string
  botStatus: 'online' | 'offline' | 'maintenance'
  botLastSeen: string
  botVersion: string;
  referralCount : any
}): FetchBotStatusSuccessAction => ({
  type: BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_SUCCESS,
  payload: data
})

export const fetchBotStatusFailure = (error: string): FetchBotStatusFailureAction => ({
  type: BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_FAILURE,
  payload: error
})
