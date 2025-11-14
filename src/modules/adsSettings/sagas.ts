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
 
 
import { API_CALL } from 'auth-fingerprint';
import { baseURL } from 'lib/api-string';
import { Toast } from 'antd-mobile';

// Fetch ads settings saga
function* fetchAdsSettingsSaga(action: FetchAdsSettingsRequestAction): Generator<any, void, any> {
  const { success, message, data, error } = yield call(API_CALL, {
    baseURL,
    url: '/ads/settings',
    method: 'GET'
  })
  
 


  if (success && data) {
    yield put(fetchAdsSettingsSuccess(data))
    
    if (action.payload?.showToast) {
      Toast.show({
        content: 'Settings refreshed successfully',
        duration: 2000
      })
    }
  } else {
    yield put(fetchAdsSettingsFailure(error || 'Failed to fetch ads settings'))
    
    Toast.show({
      content: error || 'Failed to load settings',
      duration: 3000
    })
  }
}
 
// Watcher saga
export function* adsSettingsSaga() {
  yield takeEvery(ADS_SETTINGS_ACTIONS.FETCH_ADS_SETTINGS_REQUEST, fetchAdsSettingsSaga)
 
}
