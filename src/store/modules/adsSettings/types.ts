// Ads settings state interface
export interface AdsSettingsState {
  _id: string
  enableGigaPubAds: boolean
  gigaPubAppId: string
  defaultAdsReward: number
  adsWatchLimit: number
  adsRewardMultiplier: number
  minWatchTime: number
  monetagEnabled: boolean
  monetagZoneId: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  isLoading: boolean
  error: string | null
}

// Action types
export const ADS_SETTINGS_ACTIONS = {
  SET_ADS_SETTINGS: 'SET_ADS_SETTINGS',
  SET_LOADING: 'SET_ADS_LOADING',
  SET_ERROR: 'SET_ADS_ERROR',
  CLEAR_ERROR: 'CLEAR_ADS_ERROR',
  // Saga actions
  FETCH_ADS_SETTINGS_REQUEST: 'FETCH_ADS_SETTINGS_REQUEST',
  FETCH_ADS_SETTINGS_SUCCESS: 'FETCH_ADS_SETTINGS_SUCCESS',
  FETCH_ADS_SETTINGS_FAILURE: 'FETCH_ADS_SETTINGS_FAILURE'
} as const

// Action interfaces
export interface SetAdsSettingsAction {
  type: typeof ADS_SETTINGS_ACTIONS.SET_ADS_SETTINGS
  payload: Partial<AdsSettingsState>
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof ADS_SETTINGS_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof ADS_SETTINGS_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof ADS_SETTINGS_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

// Saga action interfaces
export interface FetchAdsSettingsRequestAction {
  type: typeof ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST
  [key: string]: any
}

export interface FetchAdsSettingsSuccessAction {
  type: typeof ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_SUCCESS
  payload: {
    dailyAdLimit: number
    adEarningAmount: number
    adWatchEnabled: boolean
    minWatchTime: number
    rewardMultiplier: number
    lastUpdated: string
  }
  [key: string]: any
}

export interface FetchAdsSettingsFailureAction {
  type: typeof ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_FAILURE
  payload: string
  [key: string]: any
}

export type AdsSettingsActionTypes = 
  | SetAdsSettingsAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | FetchAdsSettingsRequestAction
  | FetchAdsSettingsSuccessAction
  | FetchAdsSettingsFailureAction
