import { call, put, takeEvery } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string';

import {
  WITHDRAW_HISTORY_ACTIONS,
  FetchWithdrawHistoryRequestAction
} from './types'
import {  fetchWithdrawHistorySuccess,  fetchWithdrawHistoryFailure } from './actions'
 
import { getCurrentUser } from 'lib/getCurrentUser';

// Fetch withdraw history saga
function* fetchWithdrawHistorySaga(action: FetchWithdrawHistoryRequestAction): Generator<any, void, any> {
  const currentUser  = getCurrentUser();
  const { hash , signature , timestamp  } =  generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
  const {  success , data , error , message } = yield call(API_CALL, {
    baseURL,
    url: `/withdraw/history`,
    method: 'GET', 
    params : { hash , signature , timestamp }
  })

  if (  success && data) {
    // Success
    yield put(fetchWithdrawHistorySuccess(data))
  } else {
    // Failure
    const errorMessage =  error || 'Failed to fetch withdrawal history'
    yield put(fetchWithdrawHistoryFailure(errorMessage))
     
  }
}

// Root saga for withdrawHistory module
export function* withdrawHistorySaga() {
  yield takeEvery(WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_REQUEST, fetchWithdrawHistorySaga)
}
