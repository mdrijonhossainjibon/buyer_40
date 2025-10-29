import { UserState, UserActionTypes, USER_ACTIONS } from './types'

// Initial state
const initialState: UserState = {
  userId: null,
  xp: 0,
  referralCount: 0,
  watchedToday: 0,
  isLoading: true,
  status: 'active',
  referralCode: '',
  username: '',
  totalEarned: 0,
  error: null,
  wallet: {
    balances: { xp: 0, usdt: 0, spin: 0 },
    locked: { xp: 0, usdt: 0, spin: 0 },
    available: { xp: 0, usdt: 0, spin: 0 },
    totalEarned: { xp: 0, usdt: 0, spin: 0 },
    totalSpent: { xp: 0, usdt: 0, spin: 0 }
  }
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
        wallet: {
          ...state.wallet,
          balances: {
            ...state.wallet.balances,
            usdt: action.payload
          },
          available: {
            ...state.wallet.available,
            usdt: action.payload
          }
        }
      }
    
    case USER_ACTIONS.UPDATE_XP:
      return {
        ...state,
        xp: action.payload,
        wallet: {
          ...state.wallet,
          balances: {
            ...state.wallet.balances,
            xp: action.payload
          },
          available: {
            ...state.wallet.available,
            xp: action.payload
          }
        }
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

    // Account validation actions
    case USER_ACTIONS.VALIDATE_ACCOUNT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case USER_ACTIONS.VALIDATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: action.payload.isValid ? null : (action.payload.message || 'Account validation failed')
      }
    
    case USER_ACTIONS.VALIDATE_ACCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    
    case USER_ACTIONS.CLEAR_STORED_ACCOUNT:
      return {
        ...initialState
      }

    // Ad watching actions
    case USER_ACTIONS.WATCH_AD_REQUEST:
      return {
        ...state,
        isLoading: false,
        error: null
      }
    
    case USER_ACTIONS.WATCH_AD_SUCCESS:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balances: {
            ...state.wallet.balances,
            usdt: action.payload.balance
          },
          available: {
            ...state.wallet.available,
            usdt: action.payload.balance
          }
        },
        watchedToday: action.payload.watchedToday,
        isLoading: false,
        error: null
      }
    
    case USER_ACTIONS.WATCH_AD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
 
    
    
    default:
      return state
  }
}
