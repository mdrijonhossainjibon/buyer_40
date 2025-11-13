import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string'
import {
  FETCH_CRYPTO_COINS_REQUEST,
  FetchCryptoCoinsRequestAction,
} from './types'
import {
  fetchCryptoCoinsSuccess,
  fetchCryptoCoinsFailure,
} from './actions'

// Worker saga: fetch crypto coins
function* fetchCryptoCoinsSaga(action: FetchCryptoCoinsRequestAction) {
  try {
    const { response } = yield call(API_CALL, {
      baseURL,
      url: '/crypto-coins',
      method: 'GET'
    })
    
    if (response && response.success && response.data) {
      yield put(fetchCryptoCoinsSuccess(response.data))
    } else {
      yield put(fetchCryptoCoinsFailure(response?.message || 'Failed to fetch crypto coins'))
    }
  } catch (error: any) {
    yield put(fetchCryptoCoinsFailure(error.message || 'Network error while fetching crypto coins'))
  }
}

// Watcher saga
export function* watchCryptoCoins() {
  yield takeLatest(FETCH_CRYPTO_COINS_REQUEST, fetchCryptoCoinsSaga)
}
