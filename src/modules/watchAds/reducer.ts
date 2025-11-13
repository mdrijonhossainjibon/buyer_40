import { WATCH_ADS_ACTIONS, WatchAdsState, WatchAdsActionTypes } from './types'

const initialState: WatchAdsState = {
  watchedToday: 0,
  maxAdsPerDay: 50,
  canWatchAd: true,
  nextAdTime: null,
  isWatching: false,
  isLoading: false,
  error: null
}

export const watchAdsReducer = (
  state = initialState,
  action: WatchAdsActionTypes
): WatchAdsState => {
  switch (action.type) {
    case WATCH_ADS_ACTIONS.SET_WATCHED_TODAY:
      return {
        ...state,
        watchedToday: action.payload,
        canWatchAd: action.payload < state.maxAdsPerDay
      }

    case WATCH_ADS_ACTIONS.SET_MAX_ADS_PER_DAY:
      return {
        ...state,
        maxAdsPerDay: action.payload,
        canWatchAd: state.watchedToday < action.payload
      }

    case WATCH_ADS_ACTIONS.SET_CAN_WATCH_AD:
      return {
        ...state,
        canWatchAd: action.payload
      }

    case WATCH_ADS_ACTIONS.SET_NEXT_AD_TIME:
      return {
        ...state,
        nextAdTime: action.payload
      }

    case WATCH_ADS_ACTIONS.SET_WATCHING:
      return {
        ...state,
        isWatching: action.payload
      }

    case WATCH_ADS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
  

    case WATCH_ADS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isWatching: false
      }

    case WATCH_ADS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    // Saga actions
    case WATCH_ADS_ACTIONS.WATCH_AD_REQUEST:
      return {
        ...state,
        isLoading: true,
        isWatching: true,
        error: null
      }

    case WATCH_ADS_ACTIONS.WATCH_AD_SUCCESS:
      return {
        ...state,
        watchedToday: action.payload.watchedToday,
        nextAdTime: action.payload.nextAdTime,
        canWatchAd: action.payload.watchedToday < state.maxAdsPerDay,
        isLoading: false,
        isWatching: false,
        error: null
      }

    case WATCH_ADS_ACTIONS.WATCH_AD_FAILURE:
      return {
        ...state,
        isLoading: false,
        isWatching: false,
        error: action.payload
      }

    case WATCH_ADS_ACTIONS.FETCH_AD_STATUS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case WATCH_ADS_ACTIONS.FETCH_AD_STATUS_SUCCESS:
      return {
        ...state,
        watchedToday: action.payload.watchedToday,
        maxAdsPerDay: action.payload.maxAdsPerDay,
        canWatchAd: action.payload.canWatchAd,
        nextAdTime: action.payload.nextAdTime,
        isLoading: false,
        error: null
      }

    case WATCH_ADS_ACTIONS.FETCH_AD_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
