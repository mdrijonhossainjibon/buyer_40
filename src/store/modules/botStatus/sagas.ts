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

// API call function
function* callBotStatusAPI() {
  try {
    const { response } = yield call(API_CALL, {
      method: 'POST',
      url: '/bot_status',
      body: {
        ...generateSignature('123456789', process.env.NEXT_PUBLIC_SECRET_KEY || '')
      }
    })

    if (response && response.success) {
      return response.data
    } else {
      throw new Error(response?.message || 'Failed to get bot status')
    }
  } catch (error) {
    throw error
  }
}

// Saga worker function
function* fetchBotStatusSaga(action: FetchBotStatusRequestAction) {
  try {
    yield put(setLoading(true))
    
    const botStatusData = yield call(callBotStatusAPI)
    
    yield put(fetchBotStatusSuccess(botStatusData))
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
