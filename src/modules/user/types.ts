// Wallet interfaces
export interface WalletBalances {
  xp: number
  usdt: number
  spin: number
}

export interface Wallet {
  balances: WalletBalances
  locked: WalletBalances
  available: WalletBalances
  totalEarned: WalletBalances
  totalSpent: WalletBalances
}

// User state interface
export interface UserState {
  userId: number | null
  referralCount: number
  referralEarnings: number
  status: 'active' | 'suspend';
  referralCode: string
  isLoading: boolean
  error: string | null
  username: string
  totalEarned: number
  wallet: Wallet
}

// Action types
export const USER_ACTIONS = {
  SET_USER_DATA: 'SET_USER_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_BALANCE: 'UPDATE_BALANCE',
  UPDATE_XP: 'UPDATE_XP',
  UPDATE_WATCHED_TODAY: 'UPDATE_WATCHED_TODAY',
  CLEAR_ERROR: 'CLEAR_ERROR',
  // Saga actions
  FETCH_USER_DATA_REQUEST: 'FETCH_USER_DATA_REQUEST',
  FETCH_USER_DATA_SUCCESS: 'FETCH_USER_DATA_SUCCESS',
  FETCH_USER_DATA_FAILURE: 'FETCH_USER_DATA_FAILURE',
  // Account validation actions
  VALIDATE_ACCOUNT_REQUEST: 'VALIDATE_ACCOUNT_REQUEST',
  VALIDATE_ACCOUNT_SUCCESS: 'VALIDATE_ACCOUNT_SUCCESS',
  VALIDATE_ACCOUNT_FAILURE: 'VALIDATE_ACCOUNT_FAILURE',
  CLEAR_STORED_ACCOUNT: 'CLEAR_STORED_ACCOUNT'
} as const

// Action interfaces
export interface SetUserDataAction {
  type: typeof USER_ACTIONS.SET_USER_DATA
  payload: Partial<UserState>
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof USER_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof USER_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface UpdateBalanceAction {
  type: typeof USER_ACTIONS.UPDATE_BALANCE
  payload: number
  [key: string]: any
}

export interface UpdateXPAction {
  type: typeof USER_ACTIONS.UPDATE_XP
  payload: number
  [key: string]: any
}

export interface UpdateWatchedTodayAction {
  type: typeof USER_ACTIONS.UPDATE_WATCHED_TODAY
  payload: number
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof USER_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

// Saga action interfaces
export interface FetchUserDataRequestAction {
  type: typeof USER_ACTIONS.FETCH_USER_DATA_REQUEST
  payload: { userId: number , start_param ?: string , username ?: string }
  [key: string]: any
}

export interface FetchUserDataSuccessAction {
  type: typeof USER_ACTIONS.FETCH_USER_DATA_SUCCESS
  payload: Partial<UserState>
  [key: string]: any
}

export interface FetchUserDataFailureAction {
  type: typeof USER_ACTIONS.FETCH_USER_DATA_FAILURE
  payload: string
  [key: string]: any
}

// Account validation action interfaces
export interface ValidateAccountRequestAction {
  type: typeof USER_ACTIONS.VALIDATE_ACCOUNT_REQUEST
  payload: { userId: number, username: string }
  [key: string]: any
}

export interface ValidateAccountSuccessAction {
  type: typeof USER_ACTIONS.VALIDATE_ACCOUNT_SUCCESS
  payload: { isValid: boolean, message?: string }
  [key: string]: any
}

export interface ValidateAccountFailureAction {
  type: typeof USER_ACTIONS.VALIDATE_ACCOUNT_FAILURE
  payload: string
  [key: string]: any
}

export interface ClearStoredAccountAction {
  type: typeof USER_ACTIONS.CLEAR_STORED_ACCOUNT
  [key: string]: any
}

export type UserActionTypes = 
  | SetUserDataAction
  | SetLoadingAction
  | SetErrorAction
  | UpdateBalanceAction
  | UpdateXPAction
  | UpdateWatchedTodayAction
  | ClearErrorAction
  | FetchUserDataRequestAction
  | FetchUserDataSuccessAction
  | FetchUserDataFailureAction
  | ValidateAccountRequestAction
  | ValidateAccountSuccessAction
  | ValidateAccountFailureAction
  | ClearStoredAccountAction
