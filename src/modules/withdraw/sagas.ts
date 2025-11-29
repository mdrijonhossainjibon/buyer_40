import { call, put, takeLatest, delay } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga';
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string';
import {
  WITHDRAW_ACTIONS,
  SubmitWithdrawRequestAction,
  CryptoPrices,
  TransactionData,
} from './types'
import {
  fetchCryptoPricesSuccess,
  fetchCryptoPricesFailure,
  submitWithdrawFailure,
  toggleProcessing,
} from './actions'
import { getCurrentUser } from 'lib/getCurrentUser';
import toast from 'react-hot-toast';


// Coin to CoinGecko ID mapping
const COINGECKO_ID_MAP: { [key: string]: string } = {
  btc: 'bitcoin',
  eth: 'ethereum',
  usdt: 'tether',
  bnb: 'binancecoin',
  trx: 'tron',
  sol: 'solana',
  xrp: 'ripple',
  ada: 'cardano',
  doge: 'dogecoin',
  matic: 'matic-network',
}

// Fetch crypto prices from CoinGecko API
function* fetchCryptoPricesSaga(): SagaIterator {
  try {
    const coinIds = Object.values(COINGECKO_ID_MAP).join(',')
    const response: Response = yield call(
      fetch,
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
    )
    const data: any = yield call([response, 'json'])

    // Convert CoinGecko response to our format
    const prices: CryptoPrices = {}
    Object.entries(COINGECKO_ID_MAP).forEach(([symbol, geckoId]) => {
      if (data[geckoId]?.usd) {
        prices[symbol] = data[geckoId].usd
      }
    })

    yield put(fetchCryptoPricesSuccess(prices))
  } catch (error: any) {
    yield put(fetchCryptoPricesFailure(error.message || 'Failed to fetch crypto prices'))
  }
}

// Submit withdraw request saga
function* submitWithdrawSaga(action: SubmitWithdrawRequestAction): SagaIterator {
  try {
    // Get current user for authentication
    const currentUser = getCurrentUser()
    const { hash, signature, timestamp } = generateSignature(
      JSON.stringify({ ...currentUser, ...action.payload }),
      process.env.NEXT_PUBLIC_SECRET_KEY || 'app'
    )

   

    // Make API call to submit withdrawal using API_CALL
    const { success, data, error, message } = yield call(API_CALL, {
      baseURL,
      url: '/withdraw/submit',
      method: 'POST',
      body: {
        hash,
        signature,
        timestamp
      }
    })

    if (success && data) {
      yield put(toggleProcessing(true))
    } 

  } catch (error: any) {
    yield put(submitWithdrawFailure(error.message || 'Failed to submit withdrawal'))
  }
}

// Root saga for withdraw module
export function* withdrawSaga(): SagaIterator {
  yield takeLatest(WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_REQUEST, fetchCryptoPricesSaga)
  yield takeLatest(WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST, submitWithdrawSaga)
}
