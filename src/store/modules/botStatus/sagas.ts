import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { 
  BOT_STATUS_ACTIONS,
  FetchBotStatusRequestAction 
} from './types'
import { 
  fetchBotStatusSuccess, 
  fetchBotStatusFailure, 
  setLoading 
} from './actions'
import { baseURL } from '@/lib/api-string'

 

// Saga worker function
function* fetchBotStatusSaga(action: FetchBotStatusRequestAction) {
  try {
    yield put(setLoading(true))
    
    const { response } = yield call(API_CALL, {
      baseURL,
      method: 'POST',
      url: '/bot_status',
      body: {
        ...generateSignature('123456789', process.env.NEXT_PUBLIC_SECRET_KEY || '')
      }
    })

    if (response && response.success) {
      yield put(fetchBotStatusSuccess(response.data))
    } else {
      yield put(fetchBotStatusFailure(response?.message || 'Failed to get bot status'))
    }
    
   
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bot status'
    yield put(fetchBotStatusFailure(errorMessage))
  } finally {
    yield put(setLoading(false))
  }
}

// Watcher saga
export function* botStatusSaga() {
  yield takeLatest(BOT_STATUS_ACTIONS.FETCH_BOT_STATUS_REQUEST, fetchBotStatusSaga)
}
