// User state interface
export interface UserState {
  userId: number | null
  balanceTK: number
  referralCount: number
  watchedToday: number
  telegramBonus: number
  youtubeBonus: number
  status: 'active' | 'suspend';
  referralCode : string;
  isLoading: boolean
  error: string | null
  username: string
  dailyAdLimit: number
}

// Action types
export const USER_ACTIONS = {
  SET_USER_DATA: 'SET_USER_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_BALANCE: 'UPDATE_BALANCE',
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
  CLEAR_STORED_ACCOUNT: 'CLEAR_STORED_ACCOUNT',
  // Ad watching and task completion actions
  WATCH_AD_REQUEST: 'WATCH_AD_REQUEST',
  WATCH_AD_SUCCESS: 'WATCH_AD_SUCCESS',
  WATCH_AD_FAILURE: 'WATCH_AD_FAILURE',
  CLAIM_YOUTUBE_REQUEST: 'CLAIM_YOUTUBE_REQUEST',
  CLAIM_YOUTUBE_SUCCESS: 'CLAIM_YOUTUBE_SUCCESS',
  CLAIM_YOUTUBE_FAILURE: 'CLAIM_YOUTUBE_FAILURE',
  CLAIM_CHANNEL_REQUEST: 'CLAIM_CHANNEL_REQUEST',
  CLAIM_CHANNEL_SUCCESS: 'CLAIM_CHANNEL_SUCCESS',
  CLAIM_CHANNEL_FAILURE: 'CLAIM_CHANNEL_FAILURE'
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

// Ad watching and task completion action interfaces
export interface WatchAdRequestAction {
  type: typeof USER_ACTIONS.WATCH_AD_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface WatchAdSuccessAction {
  type: typeof USER_ACTIONS.WATCH_AD_SUCCESS
  payload: { balance: number, watchedToday: number, message: string }
  [key: string]: any
}

export interface WatchAdFailureAction {
  type: typeof USER_ACTIONS.WATCH_AD_FAILURE
  payload: string
  [key: string]: any
}

export interface ClaimYoutubeRequestAction {
  type: typeof USER_ACTIONS.CLAIM_YOUTUBE_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface ClaimYoutubeSuccessAction {
  type: typeof USER_ACTIONS.CLAIM_YOUTUBE_SUCCESS
  payload: { balance: number, youtubeBonus: number, message: string }
  [key: string]: any
}

export interface ClaimYoutubeFailureAction {
  type: typeof USER_ACTIONS.CLAIM_YOUTUBE_FAILURE
  payload: string
  [key: string]: any
}

export interface ClaimChannelRequestAction {
  type: typeof USER_ACTIONS.CLAIM_CHANNEL_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface ClaimChannelSuccessAction {
  type: typeof USER_ACTIONS.CLAIM_CHANNEL_SUCCESS
  payload: { balance: number, telegramBonus: number, message: string }
  [key: string]: any
}

export interface ClaimChannelFailureAction {
  type: typeof USER_ACTIONS.CLAIM_CHANNEL_FAILURE
  payload: string
  [key: string]: any
}

export type UserActionTypes = 
  | SetUserDataAction
  | SetLoadingAction
  | SetErrorAction
  | UpdateBalanceAction
  | UpdateWatchedTodayAction
  | ClearErrorAction
  | FetchUserDataRequestAction
  | FetchUserDataSuccessAction
  | FetchUserDataFailureAction
  | ValidateAccountRequestAction
  | ValidateAccountSuccessAction
  | ValidateAccountFailureAction
  | ClearStoredAccountAction
  | WatchAdRequestAction
  | WatchAdSuccessAction
  | WatchAdFailureAction
  | ClaimYoutubeRequestAction
  | ClaimYoutubeSuccessAction
  | ClaimYoutubeFailureAction
  | ClaimChannelRequestAction
  | ClaimChannelSuccessAction
  | ClaimChannelFailureAction
