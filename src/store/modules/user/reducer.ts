import { UserState, UserActionTypes, USER_ACTIONS } from './types'

// Initial state
const initialState: UserState = {
  userId: 123456789,
  balanceTK: 0,
  referralCount: 0,
  dailyAdLimit: 10,
  watchedToday: 0,
  telegramBonus: 0,
  youtubeBonus: 0,
  isBotVerified: 0,
  isLoading: true,
  error: null
}

// User reducer
export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER_DATA:
      return {
        ...state,
        ...action.payload,
        error: null
      }
    
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case USER_ACTIONS.UPDATE_BALANCE:
      return {
        ...state,
        balanceTK: action.payload
      }
    
    case USER_ACTIONS.UPDATE_WATCHED_TODAY:
      return {
        ...state,
        watchedToday: action.payload
      }
    
    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    // Saga actions
    case USER_ACTIONS.FETCH_USER_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case USER_ACTIONS.FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      }
    
    case USER_ACTIONS.FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    
    default:
      return state
  }
}
