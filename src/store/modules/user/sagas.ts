import { call, put, takeEvery, select } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { 
  USER_ACTIONS, 
  FetchUserDataRequestAction,
  ValidateAccountRequestAction
} from './types'
import { 
  fetchUserDataSuccess, 
  fetchUserDataFailure,
  validateAccountSuccess,
  validateAccountFailure,
  setLoading 
} from './actions'
import {
  isCurrentUserValid,
  isAccountSwitchAttempt,
  storeUserData,
  clearStoredUserData,
  getAccountLockDuration
} from '@/lib/localStorage'

// Account validation saga
function* validateAccountSaga(action: ValidateAccountRequestAction) {
  try {
    const { userId, username } = action.payload
    
    // Check if this is an account switch attempt
    if (isAccountSwitchAttempt(userId)) {
      const lockDuration = getAccountLockDuration()
      
      if (lockDuration > 0) {
        yield put(validateAccountFailure(
          `Account switching not allowed. Browser is locked for ${Math.ceil(lockDuration)} more hours. Please use a different browser or wait.`
        ))
        return
      }
    }
    
    // Check if current user is valid
    if (!isCurrentUserValid(userId)) {
      yield put(validateAccountFailure(
        'Account validation failed. Please clear browser data and try again.'
      ))
      return
    }
    
    // Store user data in localStorage
    storeUserData(userId, username)
    
    yield put(validateAccountSuccess(true, 'Account validated successfully'))
  } catch (error: any) {
    console.error('Account validation failed:', error)
    yield put(validateAccountFailure(error.message || 'Account validation error'))
  }
}

// API call function
function* fetchUserDataSaga(action: FetchUserDataRequestAction) {
  try {
    yield put(setLoading(true))
    
    const { userId, username } = action.payload
    
    // First validate the account
    if (userId && username) {
      // Check account validation before making API call
      if (isAccountSwitchAttempt(userId)) {
        const lockDuration = getAccountLockDuration()
        
        if (lockDuration > 0) {
          yield put(fetchUserDataFailure(
            `Account switching not allowed. Browser is locked for ${Math.ceil(lockDuration)} more hours.`
          ))
          return
        }
      }
      
      // Store user data if validation passes
      storeUserData(userId, username)
    }
 
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

// Clear stored account saga
function* clearStoredAccountSaga() {
  try {
    clearStoredUserData()
    yield put(validateAccountSuccess(true, 'Account data cleared successfully'))
  } catch (error: any) {
    console.error('Failed to clear account data:', error)
    yield put(validateAccountFailure(error.message || 'Failed to clear account data'))
  }
}

// Root user saga
export function* userSaga() {
  yield takeEvery(USER_ACTIONS.FETCH_USER_DATA_REQUEST, fetchUserDataSaga)
  yield takeEvery(USER_ACTIONS.VALIDATE_ACCOUNT_REQUEST, validateAccountSaga)
  yield takeEvery(USER_ACTIONS.CLEAR_STORED_ACCOUNT, clearStoredAccountSaga)
}
