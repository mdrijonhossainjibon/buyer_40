import { call, put, takeEvery, select, delay } from 'redux-saga/effects'
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
 
 
import { getCurrentUser } from 'lib/getCurrentUser'
import { baseURL } from 'lib/api-string'
//import { fetchAdStatusRequest } from '../watchAds'
 


 

// API call function
function* fetchUserDataSaga( ) {
  yield put(setLoading(true))
  const currentUser  = getCurrentUser();
  //toast.info(`Loading user data... ${currentUser?.telegramId || 'Unknown'}`);
  const { hash , timestamp , signature } = generateSignature(JSON.stringify({ ...currentUser }) ,process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
 
  // Make API call using auth-fingerprint
  const { response } = yield call(API_CALL, {
    baseURL,
    url: '/users',
    method: 'POST',
    body: { ...currentUser , hash , timestamp , signature }
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
    yield put(fetchUserDataSuccess(mappedData));
    //yield put(fetchAdStatusRequest());

    yield delay(5000)

  } else {
    //toast.error(response?.message || 'Failed to load user data')
  }
}

// Root user saga
export function* userSaga() {
  yield takeEvery(USER_ACTIONS.FETCH_USER_DATA_REQUEST, fetchUserDataSaga)
}
