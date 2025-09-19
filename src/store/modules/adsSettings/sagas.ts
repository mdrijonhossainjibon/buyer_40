import { call, put, takeEvery } from 'redux-saga/effects'
import { 
  ADS_SETTINGS_ACTIONS, 
  FetchAdsSettingsRequestAction,
  UpdateAdsSettingsRequestAction 
} from './types'
import { 
  fetchAdsSettingsSuccess, 
  fetchAdsSettingsFailure,
  updateAdsSettingsSuccess,
  updateAdsSettingsFailure 
} from './actions'
import { adsAPI } from '@/lib/api/ads'
import { Toast } from 'antd-mobile'
import { API_CALL } from 'auth-fingerprint';
import { baseURL } from '@/lib/api-string';

// Fetch ads settings saga
function* fetchAdsSettingsSaga(action: FetchAdsSettingsRequestAction): Generator<any, void, any> {
  try {
    const response: any = yield call(adsAPI.getSettings)
    
    if (response.success && response.data) {
      yield put(fetchAdsSettingsSuccess(response.data))
      
      if (action.payload?.showToast) {
        Toast.show({
          content: 'Settings refreshed successfully',
          duration: 2000
        })
      }
    } else {
      yield put(fetchAdsSettingsFailure(response.error || 'Failed to fetch ads settings'))
      
      Toast.show({
        content: response.error || 'Failed to load settings',
        duration: 3000
      })
    }
  } catch (error: any) {
    yield put(fetchAdsSettingsFailure(error.message || 'Failed to fetch ads settings'))
    
    Toast.show({
      content: 'Failed to load settings',
      duration: 3000
    })
  }
}

// Update ads settings saga
function* updateAdsSettingsSaga(action: UpdateAdsSettingsRequestAction): Generator<any, void, any> {
  try {
    const response: any = yield call(adsAPI.updateSettings, action.payload)
    
    if (response.success && response.data) {
      yield put(updateAdsSettingsSuccess(response.data))
      
      Toast.show({
        content: 'Ad settings saved successfully',
        duration: 2000
      })
    } else {
      yield put(updateAdsSettingsFailure(response.error || 'Failed to save settings'))
      
      Toast.show({
        content: response.error || 'Failed to save settings',
        duration: 3000
      })
    }
  } catch (error: any) {
    yield put(updateAdsSettingsFailure(error.message || 'Failed to save settings'))
    
    Toast.show({
      content: 'Failed to save settings',
      duration: 3000
    })
  }
}

// Watcher saga
export function* adsSettingsSaga() {
  yield takeEvery(ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST, fetchAdsSettingsSaga)
  yield takeEvery(ADS_SETTINGS_ACTIONS.UPDATE_ADS_SETTINGS_REQUEST, updateAdsSettingsSaga)
}
