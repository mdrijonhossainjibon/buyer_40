import { call, put, takeLatest } from 'redux-saga/effects'
 
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string'
import { getSocketClient } from 'lib/socket/socketClient'
import {
  CONVERTER_ACTIONS,
  FetchRatesRequestAction,
  ConvertRequestAction
} from './types'
import {
  fetchRatesSuccess,
  fetchRatesFailure,
  convertSuccess,
  convertFailure
} from './actions'
import { updateXP, updateBalance } from '../user/actions'
import { Toast } from 'antd-mobile'

// Fetch conversion rates saga
function* fetchRatesSaga(action: FetchRatesRequestAction): Generator<any, void, any> {
  try {
    const { response } = yield call(API_CALL, {
      baseURL,
      url: '/converter/rates',
      method: 'GET'
    })

    if (response && response.success && response.data) {
      yield put(fetchRatesSuccess(response.data))
    } else {
      yield put(fetchRatesFailure(response?.error || 'Failed to fetch conversion rates'))
      //toast.error(response?.error || 'Failed to fetch conversion rates')
    }
  } catch (error: any) {
    yield put(fetchRatesFailure(error.message || 'An error occurred'))
    //toast.error(error.message || 'An error occurred while fetching rates')
  }
}

// Convert currency saga - Socket-based
function* convertSaga(action: ConvertRequestAction): Generator<any, void, any> {
  try {
    const { userId, fromCurrency, toCurrency, amount } = action.payload
    const socketClient = getSocketClient()

    if (!userId) {
      yield put(convertFailure('User ID is required'))
      //toast.error('User ID is required')
      return
    }

    if (amount <= 0) {
      yield put(convertFailure('Amount must be greater than 0'))
      //toast.error('Amount must be greater than 0')
      return
    }

    //toast.loading('Converting...', { id: 'convert' })

    // Try socket first, fallback to HTTP
    if (socketClient.isConnected()) {
      // Emit conversion request via socket
      socketClient.send('converter:convert', {
        userId,
        fromCurrency,
        toCurrency,
        amount,
        timestamp: Date.now()
      })

      // Socket saga will handle the response via 'CONVERTER_SUCCESS' event
      // For now, we just show loading state
    } else {
      // Fallback to HTTP API
      const { response } = yield call(API_CALL, {
        baseURL,
        url: '/converter/convert',
        method: 'POST',
        body: JSON.stringify({
          userId,
          fromCurrency,
          toCurrency,
          amount
        })
      })

      if (response && response.success && response.data) {
        const { newBalances } = response.data

        yield put(convertSuccess(newBalances))

        // Update user balances in Redux
        if (newBalances.xp !== undefined) {
          yield put(updateXP(newBalances.xp))
        }
        if (newBalances.usdt !== undefined) {
          yield put(updateBalance(newBalances.usdt))
        }
 
        Toast.show({ content : `✅ ${response.message || 'Conversion successful'}` , icon : 'success'})
      } else {
        yield put(convertFailure(response?.error || 'Failed to convert currency'))
        //toast.error(response?.error || 'Failed to convert currency', { id: 'convert' })
      }
    }
  } catch (error: any) {
    yield put(convertFailure(error.message || 'An error occurred'))
    //toast.error(error.message || 'An error occurred while converting', { id: 'convert' })
  }
}

// Root saga
export function* converterSaga() {
  yield takeLatest(CONVERTER_ACTIONS.FETCH_RATES_REQUEST, fetchRatesSaga)
  yield takeLatest(CONVERTER_ACTIONS.CONVERT_REQUEST, convertSaga)
}
