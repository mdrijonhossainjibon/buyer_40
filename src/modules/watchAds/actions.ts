import {
  WATCH_ADS_ACTIONS,
  SetWatchedTodayAction,
  SetMaxAdsPerDayAction,
  SetCanWatchAdAction,
  SetNextAdTimeAction,
  SetWatchingAction,
  SetLoadingAction,
  SetLastAdProviderAction,
  SetAdProvidersAction,
  SetErrorAction,
  ClearErrorAction,
  WatchAdRequestAction,
  WatchAdSuccessAction,
  WatchAdFailureAction,
  FetchAdStatusRequestAction,
  FetchAdStatusSuccessAction,
  FetchAdStatusFailureAction
} from './types'

// State management actions
export const setWatchedToday = (count: number): SetWatchedTodayAction => ({
  type: WATCH_ADS_ACTIONS.SET_WATCHED_TODAY,
  payload: count
})

export const setMaxAdsPerDay = (max: number): SetMaxAdsPerDayAction => ({
  type: WATCH_ADS_ACTIONS.SET_MAX_ADS_PER_DAY,
  payload: max
})

export const setCanWatchAd = (canWatch: boolean): SetCanWatchAdAction => ({
  type: WATCH_ADS_ACTIONS.SET_CAN_WATCH_AD,
  payload: canWatch
})

export const setNextAdTime = (time: number | null): SetNextAdTimeAction => ({
  type: WATCH_ADS_ACTIONS.SET_NEXT_AD_TIME,
  payload: time
})

export const setWatching = (isWatching: boolean): SetWatchingAction => ({
  type: WATCH_ADS_ACTIONS.SET_WATCHING,
  payload: isWatching
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: WATCH_ADS_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setLastAdProvider = (provider: string | null): SetLastAdProviderAction => ({
  type: WATCH_ADS_ACTIONS.SET_LAST_AD_PROVIDER,
  payload: provider
})

export const setAdProviders = (providers: string[]): SetAdProvidersAction => ({
  type: WATCH_ADS_ACTIONS.SET_AD_PROVIDERS,
  payload: providers
})

export const setError = (error: string | null): SetErrorAction => ({
  type: WATCH_ADS_ACTIONS.SET_ERROR,
  payload: error
})

export const clearError = (): ClearErrorAction => ({
  type: WATCH_ADS_ACTIONS.CLEAR_ERROR
})

// Saga action creators
export const watchAdRequest = ( adProvider?: string): WatchAdRequestAction => ({
  type: WATCH_ADS_ACTIONS.WATCH_AD_REQUEST,
  payload: {  adProvider }
})

export const watchAdSuccess = (
  
  watchedToday: number,
  nextAdTime: number | null,
  message: string
): WatchAdSuccessAction => ({
  type: WATCH_ADS_ACTIONS.WATCH_AD_SUCCESS,
  payload: {   watchedToday, nextAdTime, message }
})

export const watchAdFailure = (error: string): WatchAdFailureAction => ({
  type: WATCH_ADS_ACTIONS.WATCH_AD_FAILURE,
  payload: error
})

export const fetchAdStatusRequest = (): FetchAdStatusRequestAction => ({
  type: WATCH_ADS_ACTIONS.FETCH_AD_STATUS_REQUEST,

})

export const fetchAdStatusSuccess = (
  watchedToday: number,
  maxAdsPerDay: number,
  canWatchAd: boolean,
  nextAdTime: number | null
): FetchAdStatusSuccessAction => ({
  type: WATCH_ADS_ACTIONS.FETCH_AD_STATUS_SUCCESS,
  payload: { watchedToday, maxAdsPerDay, canWatchAd, nextAdTime }
})

export const fetchAdStatusFailure = (error: string): FetchAdStatusFailureAction => ({
  type: WATCH_ADS_ACTIONS.FETCH_AD_STATUS_FAILURE,
  payload: error
})
