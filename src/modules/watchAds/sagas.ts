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

/**
 * Watch Ad Saga - Socket-based
 */
function* watchAdSaga(action: WatchAdRequestAction): Generator<any, void, any> {
  try {

    const currentUser = getCurrentUser();

    const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

    // Call HTTP API to watch ad
    const { response , status } = yield call(API_CALL, {
      baseURL,
      url: '/ads/watch',
      method: 'POST',
      body: { hash, signature, timestamp }
    })

    if (status === 200 && response?.success) {
      const data = response.data
      yield put(watchAdSuccess(
        data.watchedToday,
        data.nextAdTime,
        data.message
      ))

      //toast.success(response.message)
    } 
    if(status === 409 && response.data){
       yield put(watchAdSuccess(
        response.data.watchedToday,
        response.data.nextAdTime,
        response.data.message
      ))
      //toast.error(response.message)
    }
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to watch ad'
    yield put(watchAdFailure(errorMessage))
    //toast.error(errorMessage)
  }
}

/**
 * Fetch Ad Status Saga
 */
function* fetchAdStatusSaga(action: FetchAdStatusRequestAction): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser();

    const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
    
    // Call HTTP API to fetch ad status
    const { response, status } = yield call(API_CALL, {
      baseURL,
      url: '/ads/status',
      method: 'GET',
      params: { hash, signature, timestamp }
    })

    if (status === 200 && response?.success) {
      const data = response.data
      yield put(fetchAdStatusSuccess(
        data.watchedToday,
        data.maxAdsPerDay,
        data.canWatchAd,
        data.nextAdTime
      ))
    } else {
      throw new Error(response?.message || 'Failed to fetch ad status')
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch ad status'
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
