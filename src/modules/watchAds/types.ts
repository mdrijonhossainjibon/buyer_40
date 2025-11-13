// Watch Ads State interface
export interface WatchAdsState {
  watchedToday: number
  maxAdsPerDay: number
  canWatchAd: boolean
  nextAdTime: number | null
  isWatching: boolean
  isLoading: boolean
  error: string | null
}

// Action types
export const WATCH_ADS_ACTIONS = {
  SET_WATCHED_TODAY: 'SET_WATCHED_TODAY',
  SET_MAX_ADS_PER_DAY: 'SET_MAX_ADS_PER_DAY',
  SET_CAN_WATCH_AD: 'SET_CAN_WATCH_AD',
  SET_NEXT_AD_TIME: 'SET_NEXT_AD_TIME',
  SET_WATCHING: 'SET_WATCHING',
  SET_LOADING: 'SET_WATCH_ADS_LOADING',
  SET_LAST_AD_PROVIDER: 'SET_LAST_AD_PROVIDER',
  SET_AD_PROVIDERS: 'SET_AD_PROVIDERS',
  SET_ERROR: 'SET_WATCH_ADS_ERROR',
  CLEAR_ERROR: 'CLEAR_WATCH_ADS_ERROR',
  // Saga actions
  WATCH_AD_REQUEST: 'WATCH_AD_REQUEST',
  WATCH_AD_SUCCESS: 'WATCH_AD_SUCCESS',
  WATCH_AD_FAILURE: 'WATCH_AD_FAILURE',
  FETCH_AD_STATUS_REQUEST: 'FETCH_AD_STATUS_REQUEST',
  FETCH_AD_STATUS_SUCCESS: 'FETCH_AD_STATUS_SUCCESS',
  FETCH_AD_STATUS_FAILURE: 'FETCH_AD_STATUS_FAILURE'
} as const

// Action interfaces
export interface SetWatchedTodayAction {
  type: typeof WATCH_ADS_ACTIONS.SET_WATCHED_TODAY
  payload: number
  [key: string]: any
}

export interface SetMaxAdsPerDayAction {
  type: typeof WATCH_ADS_ACTIONS.SET_MAX_ADS_PER_DAY
  payload: number
  [key: string]: any
}

export interface SetCanWatchAdAction {
  type: typeof WATCH_ADS_ACTIONS.SET_CAN_WATCH_AD
  payload: boolean
  [key: string]: any
}

export interface SetNextAdTimeAction {
  type: typeof WATCH_ADS_ACTIONS.SET_NEXT_AD_TIME
  payload: number | null
  [key: string]: any
}

export interface SetWatchingAction {
  type: typeof WATCH_ADS_ACTIONS.SET_WATCHING
  payload: boolean
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof WATCH_ADS_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetLastAdProviderAction {
  type: typeof WATCH_ADS_ACTIONS.SET_LAST_AD_PROVIDER
  payload: string | null
  [key: string]: any
}

export interface SetAdProvidersAction {
  type: typeof WATCH_ADS_ACTIONS.SET_AD_PROVIDERS
  payload: string[]
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof WATCH_ADS_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof WATCH_ADS_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

// Saga action interfaces
export interface WatchAdRequestAction {
  type: typeof WATCH_ADS_ACTIONS.WATCH_AD_REQUEST
  payload: {   adProvider?: string }
  [key: string]: any
}

export interface WatchAdSuccessAction {
  type: typeof WATCH_ADS_ACTIONS.WATCH_AD_SUCCESS
  payload: {
    
    watchedToday: number
    nextAdTime: number | null
    message: string
  }
  [key: string]: any
}

export interface WatchAdFailureAction {
  type: typeof WATCH_ADS_ACTIONS.WATCH_AD_FAILURE
  payload: string
  [key: string]: any
}

export interface FetchAdStatusRequestAction {
  type: typeof WATCH_ADS_ACTIONS.FETCH_AD_STATUS_REQUEST

  [key: string]: any
}

export interface FetchAdStatusSuccessAction {
  type: typeof WATCH_ADS_ACTIONS.FETCH_AD_STATUS_SUCCESS
  payload: {
    watchedToday: number
    maxAdsPerDay: number
    canWatchAd: boolean
    nextAdTime: number | null
  }
  [key: string]: any
}

export interface FetchAdStatusFailureAction {
  type: typeof WATCH_ADS_ACTIONS.FETCH_AD_STATUS_FAILURE
  payload: string
  [key: string]: any
}

export type WatchAdsActionTypes =
  | SetWatchedTodayAction
  | SetMaxAdsPerDayAction
  | SetCanWatchAdAction
  | SetNextAdTimeAction
  | SetWatchingAction
  | SetLoadingAction
  | SetLastAdProviderAction
  | SetAdProvidersAction
  | SetErrorAction
  | ClearErrorAction
  | WatchAdRequestAction
  | WatchAdSuccessAction
  | WatchAdFailureAction
  | FetchAdStatusRequestAction
  | FetchAdStatusSuccessAction
  | FetchAdStatusFailureAction
