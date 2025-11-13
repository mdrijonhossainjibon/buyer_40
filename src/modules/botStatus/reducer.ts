import { 
  BotStatusState, 
  BotStatusActionTypes, 
  BOT_STATUS_ACTIONS 
} from './types'

// Initial state
const initialState: BotStatusState = {
  botUsername: '',
  botStatus: 'offline',
  botLastSeen: '',
  botVersion: '',
  isLoading: false,
  referralCount : null,
  error: null
}

// Reducer
export const botStatusReducer = (
  state: BotStatusState = initialState, 
  action: BotStatusActionTypes
): BotStatusState => {
  switch (action.type) {
    case BOT_STATUS_ACTIONS.SET_BOT_STATUS:
      return {
        ...state,
        ...action.payload,
        error: null
      }

    case BOT_STATUS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case BOT_STATUS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case BOT_STATUS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_SUCCESS:
      return {
        ...state,
        botUsername: action.payload.botUsername,
        botStatus: action.payload.botStatus,
        botLastSeen: action.payload.botLastSeen,
        botVersion: action.payload.botVersion,
        referralCount : action.payload.referralCount as any,
        isLoading: false,
        error: null
      }

    case BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
