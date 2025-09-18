import { call, put, takeEvery } from 'redux-saga/effects'
import { ADS_SETTINGS_ACTIONS, FetchAdsSettingsRequestAction } from './types'
import { fetchAdsSettingsSuccess, fetchAdsSettingsFailure } from './actions'

// API call function
async function fetchAdsSettingsAPI() {
  const response = await fetch('/api/ads/settings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch ads settings')
  }

  const data = await response.json()
  return data.data
}

// Saga worker function
function* fetchAdsSettingsSaga(action: FetchAdsSettingsRequestAction) {
  try {
    const adsSettings: {
      dailyAdLimit: number
      adEarningAmount: number
      adWatchEnabled: boolean
      minWatchTime: number
      rewardMultiplier: number
      lastUpdated: string
    } = yield call(fetchAdsSettingsAPI)

    yield put(fetchAdsSettingsSuccess(adsSettings))
  } catch (error: any) {
    yield put(fetchAdsSettingsFailure(error.message || 'Failed to fetch ads settings'))
  }
}

// Watcher saga
export function* adsSettingsSaga() {
  yield takeEvery(ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST, fetchAdsSettingsSaga)
}
