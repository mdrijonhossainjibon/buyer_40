import {
  ADS_SETTINGS_ACTIONS,
  SetAdsSettingsAction,
  SetLoadingAction,
  SetErrorAction,
  ClearErrorAction,
  FetchAdsSettingsRequestAction,
  FetchAdsSettingsSuccessAction,
  FetchAdsSettingsFailureAction,
  AdsSettingsState
} from './types'

// Action creators
export const setAdsSettings = (payload: Partial<AdsSettingsState>): SetAdsSettingsAction => ({
  type: ADS_SETTINGS_ACTIONS.SET_ADS_SETTINGS,
  payload
})

export const setLoading = (payload: boolean): SetLoadingAction => ({
  type: ADS_SETTINGS_ACTIONS.SET_LOADING,
  payload
})

export const setError = (payload: string | null): SetErrorAction => ({
  type: ADS_SETTINGS_ACTIONS.SET_ERROR,
  payload
})

export const clearError = (): ClearErrorAction => ({
  type: ADS_SETTINGS_ACTIONS.CLEAR_ERROR
})

// Saga action creators
export const fetchAdsSettingsRequest = (): FetchAdsSettingsRequestAction => ({
  type: ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST
})

export const fetchAdsSettingsSuccess = (payload: {
  dailyAdLimit: number
  adEarningAmount: number
  adWatchEnabled: boolean
  minWatchTime: number
  rewardMultiplier: number
  lastUpdated: string
}): FetchAdsSettingsSuccessAction => ({
  type: ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_SUCCESS,
  payload
})

export const fetchAdsSettingsFailure = (payload: string): FetchAdsSettingsFailureAction => ({
  type: ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_FAILURE,
  payload
})
