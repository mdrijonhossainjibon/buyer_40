import {
  ADS_SETTINGS_ACTIONS,
  SetAdsSettingsAction,
  SetLoadingAction,
  SetErrorAction,
  ClearErrorAction,
  SetEditingAction,
  SetSavingAction,
  UpdateAdsSettingsFieldAction,
  FetchAdsSettingsRequestAction,
  FetchAdsSettingsSuccessAction,
  FetchAdsSettingsFailureAction,
  UpdateAdsSettingsRequestAction,
  UpdateAdsSettingsSuccessAction,
  UpdateAdsSettingsFailureAction,
  AdsSettingsState,
  AdsSettings
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

export const setEditing = (payload: boolean): SetEditingAction => ({
  type: ADS_SETTINGS_ACTIONS.SET_EDITING,
  payload
})

export const setSaving = (payload: boolean): SetSavingAction => ({
  type: ADS_SETTINGS_ACTIONS.SET_SAVING,
  payload
})

export const updateAdsSettingsField = (field: keyof AdsSettings, value: any): UpdateAdsSettingsFieldAction => ({
  type: ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_FIELD,
  payload: { field, value }
})

// Saga action creators
export const fetchAdsSettingsRequest = (showToast?: boolean): FetchAdsSettingsRequestAction => ({
  type: ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST,
  payload: { showToast }
})

export const fetchAdsSettingsSuccess = (payload: AdsSettings): FetchAdsSettingsSuccessAction => ({
  type: ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_SUCCESS,
  payload
})

export const fetchAdsSettingsFailure = (payload: string): FetchAdsSettingsFailureAction => ({
  type: ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_FAILURE,
  payload
})

export const updateAdsSettingsRequest = (payload: AdsSettings): UpdateAdsSettingsRequestAction => ({
  type: ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_REQUEST,
  payload
})

export const updateAdsSettingsSuccess = (payload: AdsSettings): UpdateAdsSettingsSuccessAction => ({
  type: ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_SUCCESS,
  payload
})

export const updateAdsSettingsFailure = (payload: string): UpdateAdsSettingsFailureAction => ({
  type: ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_FAILURE,
  payload
})
