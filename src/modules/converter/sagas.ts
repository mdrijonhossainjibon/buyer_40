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
import { notification } from 'antd'
import toast from 'react-hot-toast'

// Fetch conversion rates saga
function* fetchRatesSaga(action: FetchRatesRequestAction): Generator<any, void, any> {
  try {
    const { success, message, data, error } = yield call(API_CALL, {
      baseURL,
      url: '/converter/rates',
      method: 'GET'
    })

    if (success && data) {
      yield put(fetchRatesSuccess(data))
    } else {
      yield put(fetchRatesFailure(error || 'Failed to fetch conversion rates'))

      notification.error({ message: error || 'Failed to fetch conversion rates', description: error || 'Failed to fetch conversion rates' })
    }
  } catch (error: any) {
    yield put(fetchRatesFailure(error.message || 'An error occurred'))
    notification.error({ message: error || 'Failed to fetch conversion rates', description: error || 'Failed to fetch conversion rates' })
  }
}

// Convert currency saga - Socket-based
function* convertSaga(action: ConvertRequestAction): Generator<any, void, any> {

  const { userId, fromCurrency, toCurrency, amount } = action.payload


  if (!userId) {
    yield put(convertFailure('User ID is required'))
    notification.error({ message: 'User ID is required', description: 'User ID is required' })
    return
  }

  if (amount <= 0) {
    yield put(convertFailure('Amount must be greater than 0'))
    notification.error({ message: 'Amount must be greater than 0', description: 'Amount must be greater than 0' })
    return
  }

  toast.loading('Converting...', { id: 'convert' })

  // Fallback to HTTP API
  const { success, message, data, error } = yield call(API_CALL, {
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

  if ( success && data ) {
    const { newBalances } =  data

    yield put(convertSuccess(newBalances))

    // Update user balances in Redux
    if (newBalances.xp !== undefined) {
      yield put(updateXP(newBalances.xp))
    }
    if (newBalances.usdt !== undefined) {
      yield put(updateBalance(newBalances.usdt))
    }

    Toast.show({ content: `✅ ${message || 'Conversion successful'}`, icon: 'success' })
  } else {
    yield put(convertFailure(error || 'Failed to convert currency'))
      toast.error(error || 'Failed to convert currency', { id: 'convert' })
  }
}


// Root saga
export function* converterSaga() {
  yield takeLatest(CONVERTER_ACTIONS.FETCH_RATES_REQUEST, fetchRatesSaga)
  yield takeLatest(CONVERTER_ACTIONS.CONVERT_REQUEST, convertSaga)
}
