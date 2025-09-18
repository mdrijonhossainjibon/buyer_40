import { AdsSettingsState, AdsSettingsActionTypes, ADS_SETTINGS_ACTIONS } from './types'

const initialState: AdsSettingsState = {
  _id : '',
  enableGigaPubAds: false,
  gigaPubAppId: '',
  defaultAdsReward: 0,
  adsRewardMultiplier: 1,
  adsWatchLimit : 15,
  monetagEnabled: false,
  monetagZoneId: '',
  minWatchTime : 30,
  isLoading: false,
  createdAt: new Date().toISOString(),
  updatedAt:  new Date().toISOString(),
  error: null
}

export const adsSettingsReducer = (
  state: AdsSettingsState = initialState,
  action: AdsSettingsActionTypes
): AdsSettingsState => {
  switch (action.type) {
    case ADS_SETTINGS_ACTIONS.SET_ADS_SETTINGS:
      return {
        ...state,
        ...action.payload
      }

    case ADS_SETTINGS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case ADS_SETTINGS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case ADS_SETTINGS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      }

    case ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
