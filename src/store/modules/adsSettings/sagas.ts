import { call, put, takeEvery } from 'redux-saga/effects'
import { ADS_SETTINGS_ACTIONS, FetchAdsSettingsRequestAction } from './types'
import { fetchAdsSettingsSuccess, fetchAdsSettingsFailure } from './actions'
import { API_CALL } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'

 
// Saga worker function
function* fetchAdsSettingsSaga(action: FetchAdsSettingsRequestAction) {
  try {
    const adsSettings: { response: any , status: number} =  yield call(API_CALL, {  baseURL, url : '/ads-settings' , method : 'GET'})
    if (adsSettings.status === 200) {
     
    yield put(fetchAdsSettingsSuccess(adsSettings.response.data))
    }
  } catch (error: any) {
    yield put(fetchAdsSettingsFailure(error.message || 'Failed to fetch ads settings'))
  }
}

// Watcher saga
export function* adsSettingsSaga() {
  yield takeEvery(ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST, fetchAdsSettingsSaga)
}
