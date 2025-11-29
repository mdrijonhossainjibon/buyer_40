// Ads settings data interface
export interface AdsSettings {
  enableGigaPubAds: boolean
  gigaPubAppId: string
  defaultAdsReward: number
  adsWatchLimit: number
  adsRewardMultiplier: number
  minWatchTime: number
  monetagEnabled: boolean
  monetagZoneId: string
}

// Ads settings state interface
export interface AdsSettingsState extends AdsSettings {
  _id: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  isLoading: boolean
  isSaving: boolean
  isEditing: boolean
  error: string | null
}

// Action types
export const ADS_SETTINGS_ACTIONS = {
  SET_ADS_SETTINGS: 'SET_ADS_SETTINGS',
  SET_LOADING: 'SET_ADS_LOADING',
  SET_ERROR: 'SET_ADS_ERROR',
  CLEAR_ERROR: 'CLEAR_ADS_ERROR',
  SET_EDITING: 'SET_ADS_EDITING',
  SET_SAVING: 'SET_ADS_SAVING',
  // Saga actions
  FETCH_ADS_SETTINGS_REQUEST: 'FETCH_ADS_SETTINGS_REQUEST',
  FETCH_ADS_SETTINGS_SUCCESS: 'FETCH_ADS_SETTINGS_SUCCESS',
  FETCH_ADS_SETTINGS_FAILURE: 'FETCH_ADS_SETTINGS_FAILURE',
  UPDATE_ADS_SETTINGS_REQUEST: 'UPDATE_ADS_SETTINGS_REQUEST',
  UPDATE_ADS_SETTINGS_SUCCESS: 'UPDATE_ADS_SETTINGS_SUCCESS',
  UPDATE_ADS_SETTINGS_FAILURE: 'UPDATE_ADS_SETTINGS_FAILURE',
  UPDATE_ADS_SETTINGS_FIELD: 'UPDATE_ADS_SETTINGS_FIELD'
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

export interface SetEditingAction {
  type: typeof ADS_SETTINGS_ACTIONS.SET_EDITING
  payload: boolean
  [key: string]: any
}

export interface SetSavingAction {
  type: typeof ADS_SETTINGS_ACTIONS.SET_SAVING
  payload: boolean
  [key: string]: any
}

export interface UpdateAdsSettingsFieldAction {
  type: typeof ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_FIELD
  payload: { field: keyof AdsSettings; value: any }
  [key: string]: any
}

// Saga action interfaces
export interface FetchAdsSettingsRequestAction {
  type: typeof ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST
  payload?: { showToast?: boolean }
  [key: string]: any
}

export interface FetchAdsSettingsSuccessAction {
  type: typeof ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_SUCCESS
  payload: AdsSettings
  [key: string]: any
}

export interface FetchAdsSettingsFailureAction {
  type: typeof ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_FAILURE
  payload: string
  [key: string]: any
}

export interface UpdateAdsSettingsRequestAction {
  type: typeof ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_REQUEST
  payload: AdsSettings
  [key: string]: any
}

export interface UpdateAdsSettingsSuccessAction {
  type: typeof ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_SUCCESS
  payload: AdsSettings
  [key: string]: any
}

export interface UpdateAdsSettingsFailureAction {
  type: typeof ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_FAILURE
  payload: string
  [key: string]: any
}

export type AdsSettingsActionTypes = 
  | SetAdsSettingsAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | SetEditingAction
  | SetSavingAction
  | UpdateAdsSettingsFieldAction
  | FetchAdsSettingsRequestAction
  | FetchAdsSettingsSuccessAction
  | FetchAdsSettingsFailureAction
  | UpdateAdsSettingsRequestAction
  | UpdateAdsSettingsSuccessAction
  | UpdateAdsSettingsFailureAction
