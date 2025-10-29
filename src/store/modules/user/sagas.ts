import { call, put, takeEvery, select } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { 
  USER_ACTIONS, 
  FetchUserDataRequestAction,
  ValidateAccountRequestAction,
  WatchAdRequestAction
} from './types'
import { 
  fetchUserDataSuccess, 
  fetchUserDataFailure,
  validateAccountSuccess,
  validateAccountFailure,
  setLoading,
  watchAdSuccess,
  watchAdFailure
} from './actions'
import { baseURL } from '@/lib/api-string'
import { toast } from 'react-toastify'
import { getCurrentUser } from '@/lib/getCurrentUser'

 

// API call function
function* fetchUserDataSaga( ) {
  try {
    yield put(setLoading(true))
    const currentUser  = getCurrentUser();
 
    // Make API call using auth-fingerprint
    const { response } = yield call(API_CALL, {
      baseURL,
      url: '/users',
      method: 'POST',
      body: {
        ...generateSignature(
          JSON.stringify({ ...currentUser }), 
          process.env.NEXT_PUBLIC_SECRET_KEY || 'app'
        )
      }
    })
    
    if (response && response.success) {
      const data = response.data
      
      // Map new wallet structure to Redux state
      const mappedData = {
        userId: data.userId,
        username: data.username,
        referralCount: data.referralCount,
        watchedToday: data.watchedToday,
        status: data.status,
        referralCode: data.referralCode,
        totalEarned: data.totalEarned || 0,
        
        // Legacy XP field for backward compatibility
        xp: data.wallet?.available?.xp || 0,
        
        // New wallet structure
        wallet: data.wallet || {
          balances: { xp: 0, usdt: 0, spin: 0 },
          locked: { xp: 0, usdt: 0, spin: 0 },
          available: { xp: 0, usdt: 0, spin: 0 },
          totalEarned: { xp: 0, usdt: 0, spin: 0 },
          totalSpent: { xp: 0, usdt: 0, spin: 0 }
        }
      }
      
      // Dispatch success action with mapped user data
      yield put(fetchUserDataSuccess(mappedData))
    } else {
      toast.error(response?.message || 'Failed to load user data')
    }
  } catch (error: any) {
    console.error('User data fetch failed:', error)
    yield put(fetchUserDataFailure(error.message || 'Network error occurred'))
  }
}

// Watch ad saga
function* watchAdSaga(action: WatchAdRequestAction) {
  try {
    const { response } = yield call(API_CALL, {
      baseURL,
      method: 'POST',
      url: '/watch-ad',
      body: {
        ...generateSignature(action.payload.userId.toString(), process.env.NEXT_PUBLIC_SECRET_KEY || '')
      }
    })

    if (response && response.success) {
      yield put(watchAdSuccess(
        response.data.newBalance,
        response.data.watchedToday,
        response.message
      ))
      
      toast.success('Ad watched successfully! Reward credited.')
    } else {
      yield put(watchAdFailure(response?.message || 'Failed to watch ad'))
      toast.error(response?.message || 'Failed to watch ad')
    }
  } catch (error: any) {
    console.error('Watch ad failed:', error)
    yield put(watchAdFailure(error.message || 'Network error occurred'))
    toast.error('Ad watched but failed to credit reward. Please contact support.')
  }
}

// Root user saga
export function* userSaga() {
  yield takeEvery(USER_ACTIONS.FETCH_USER_DATA_REQUEST, fetchUserDataSaga)
  yield takeEvery(USER_ACTIONS.WATCH_AD_REQUEST, watchAdSaga)
}
