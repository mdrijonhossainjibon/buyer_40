import { call, put, takeEvery, select } from 'redux-saga/effects'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { 
  USER_ACTIONS, 
  FetchUserDataRequestAction,
  ValidateAccountRequestAction,
  WatchAdRequestAction,
  ClaimYoutubeRequestAction,
  ClaimChannelRequestAction
} from './types'
import { 
  fetchUserDataSuccess, 
  fetchUserDataFailure,
  validateAccountSuccess,
  validateAccountFailure,
  setLoading,
  watchAdSuccess,
  watchAdFailure,
  claimYoutubeSuccess,
  claimYoutubeFailure,
  claimChannelSuccess,
  claimChannelFailure
} from './actions'
import { baseURL } from '@/lib/api-string'
import { toast } from 'react-toastify'

 

// API call function
function* fetchUserDataSaga(action: FetchUserDataRequestAction) {
  try {
    yield put(setLoading(true))
     
    // Make API call using auth-fingerprint
    const { response } = yield call(API_CALL, {
      baseURL,
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
      
      toast.success(response.message || 'Ad watched successfully! Reward credited.')
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

// Claim YouTube saga
function* claimYoutubeSaga(action: ClaimYoutubeRequestAction) {
  try {
    const { response } = yield call(API_CALL, {
      baseURL,
      method: 'POST',
      url: '/youtube-bonus',
      body: {
        ...generateSignature(action.payload.userId.toString(), process.env.NEXT_PUBLIC_SECRET_KEY || '')
      }
    })

    if (response && response.success) {
      yield put(claimYoutubeSuccess(
        response.data.balance,
        response.data.youtubeBonus,
        response.message
      ))
      
      toast.success(response.message || 'YouTube bonus claimed successfully!')
    } else {
      yield put(claimYoutubeFailure(response?.message || 'Failed to claim YouTube bonus'))
      toast.error(response?.message || 'Failed to claim YouTube bonus')
    }
  } catch (error: any) {
    console.error('Claim YouTube failed:', error)
    yield put(claimYoutubeFailure(error.message || 'Network error occurred'))
    toast.error('Failed to claim YouTube bonus. Please try again.')
  }
}

// Claim channel saga
function* claimChannelSaga(action: ClaimChannelRequestAction) {
  try {
    const { response } = yield call(API_CALL, {
      baseURL,
      method: 'POST',
      url: '/telegram-bonus',
      body: {
        ...generateSignature(action.payload.userId.toString(), process.env.NEXT_PUBLIC_SECRET_KEY || '')
      }
    })

    if (response && response.success) {
      yield put(claimChannelSuccess(
        response.data.balance,
        response.data.telegramBonus,
        response.message
      ))
      
      toast.success(response.message || 'Channel bonus claimed successfully!')
    } else {
      yield put(claimChannelFailure(response?.message || 'Failed to claim channel bonus'))
      toast.error(response?.message || 'Failed to claim channel bonus')
    }
  } catch (error: any) {
    console.error('Claim channel failed:', error)
    yield put(claimChannelFailure(error.message || 'Network error occurred'))
    toast.error('Failed to claim channel bonus. Please try again.')
  }
}

// Root user saga
export function* userSaga() {
  yield takeEvery(USER_ACTIONS.FETCH_USER_DATA_REQUEST, fetchUserDataSaga)
  yield takeEvery(USER_ACTIONS.WATCH_AD_REQUEST, watchAdSaga)
  yield takeEvery(USER_ACTIONS.CLAIM_YOUTUBE_REQUEST, claimYoutubeSaga)
  yield takeEvery(USER_ACTIONS.CLAIM_CHANNEL_REQUEST, claimChannelSaga)
}
