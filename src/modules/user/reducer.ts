import { UserState, UserActionTypes, USER_ACTIONS } from './types'

// Initial state
const initialState: UserState = {
  userId: null,
  referralCount: 0,
  referralEarnings: 0,
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
        wallet: {
          ...state.wallet,
          ...action.payload.wallet,
          balances: {
            ...state.wallet.balances,
            ...action.payload.wallet?.balances
          },
          available: {
            ...state.wallet.available,
            ...action.payload.wallet?.available
          },
          locked: {
            ...state.wallet.locked,
            ...action.payload.wallet?.locked
          },
          totalEarned: {
            ...state.wallet.totalEarned,
            ...action.payload.wallet?.totalEarned
          },
          totalSpent: {
            ...state.wallet.totalSpent,
            ...action.payload.wallet?.totalSpent
          }
        },
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
        wallet: {
          ...state.wallet,
          ...action.payload.wallet,
          balances: {
            ...state.wallet.balances,
            ...action.payload.wallet?.balances
          },
          available: {
            ...state.wallet.available,
            ...action.payload.wallet?.available
          },
          locked: {
            ...state.wallet.locked,
            ...action.payload.wallet?.locked
          },
          totalEarned: {
            ...state.wallet.totalEarned,
            ...action.payload.wallet?.totalEarned
          },
          totalSpent: {
            ...state.wallet.totalSpent,
            ...action.payload.wallet?.totalSpent
          }
        },
        isLoading: false,
        error: null
      }
    
      
    default:
      return state
  }
}
