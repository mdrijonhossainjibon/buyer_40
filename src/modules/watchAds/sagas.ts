import { call, put, takeLatest, select } from 'redux-saga/effects'

import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string'
import {
  WATCH_ADS_ACTIONS,
  WatchAdRequestAction,
  FetchAdStatusRequestAction
} from './types'
import {
  watchAdSuccess,
  watchAdFailure,
  fetchAdStatusSuccess,
  fetchAdStatusFailure
} from './actions'

import { getCurrentUser } from 'lib/getCurrentUser';
import toast from 'react-hot-toast'

/**
 * Watch Ad Saga - Socket-based
 */
function* watchAdSaga(action: WatchAdRequestAction): Generator<any, void, any> {


  const currentUser = getCurrentUser();

  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  // Call HTTP API to watch ad
  const { success, data, error, message } = yield call(API_CALL, {
    baseURL,
    url: '/ads/watch',
    method: 'POST',
    body: { hash, signature, timestamp }
  })

  if (success) {

    yield put(watchAdSuccess(
      data.watchedToday,
      data.nextAdTime,
      data.message
    ))

    toast.success(message)
  }


}



/**
 * Fetch Ad Status Saga
 */
function* fetchAdStatusSaga(action: FetchAdStatusRequestAction): Generator<any, void, any> {

  const currentUser = getCurrentUser();

  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  // Call HTTP API to fetch ad status
  const { success, data, error, message } = yield call(API_CALL, {
    baseURL,
    url: '/ads/status',
    method: 'GET',
    params: { hash, signature, timestamp }
  })

  if (success) {

    yield put(fetchAdStatusSuccess(
      data.watchedToday,
      data.maxAdsPerDay,
      data.canWatchAd,
      data.nextAdTime
    ))
  } else {
    const errorMessage =  error.message || 'Failed to fetch ad status'
    yield put(fetchAdStatusFailure(errorMessage))
  }

}

/**
 * Root Watch Ads Saga
 */
export function* watchAdsSaga() {
  yield takeLatest(WATCH_ADS_ACTIONS.WATCH_AD_REQUEST, watchAdSaga)
  yield takeLatest(WATCH_ADS_ACTIONS.FETCH_AD_STATUS_REQUEST, fetchAdStatusSaga)
}
