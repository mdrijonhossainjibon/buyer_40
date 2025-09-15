import { call, put, takeEvery, select } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { 
  USER_ACTIONS, 
  FetchUserDataRequestAction,
 
} from './types'
import { 
  fetchUserDataSuccess, 
  fetchUserDataFailure,
  setLoading 
} from './actions'

// API call function
function* fetchUserDataSaga(action: FetchUserDataRequestAction) {
  try {
    yield put(setLoading(true))
    
 
    // Make API call using auth-fingerprint
    const { response } = yield call(API_CALL, {
      url: '/users',
      method: 'POST',
      body: {
        ...generateSignature(
          JSON.stringify({ ...action.payload  }), 
          process.env.NEXT_PUBLIC_SECRET_KEY || ''
        )
      }
    })
    
    if (response && response.success) {
      // Dispatch success action with user data
      yield put(fetchUserDataSuccess({
       
        ...response.data
      }))
    } else {
      yield put(fetchUserDataFailure('Failed to load user data'))
    }
  } catch (error: any) {
    console.error('User data fetch failed:', error)
    yield put(fetchUserDataFailure(error.message || 'Network error occurred'))
  }
}

// Root user saga
export function* userSaga() {
  yield takeEvery(USER_ACTIONS.FETCH_USER_DATA_REQUEST, fetchUserDataSaga)
}
