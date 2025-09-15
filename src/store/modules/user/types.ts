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
  FETCH_USER_DATA_FAILURE: 'FETCH_USER_DATA_FAILURE'
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
