import { call, put, takeLatest } from 'redux-saga/effects'
import { toast } from 'react-hot-toast'
import { ConverterAPI } from '@/lib/api/converter'
import {
  CONVERTER_ACTIONS,
  FetchRatesRequestAction,
  FetchHistoryRequestAction,
  ConvertRequestAction
} from './types'
import {
  fetchRatesSuccess,
  fetchRatesFailure,
  fetchHistorySuccess,
  fetchHistoryFailure,
  convertSuccess,
  convertFailure
} from './actions'
import { updateXP, updateBalance } from '../user/actions'
import { setSpinTickets } from '../spinWheel/actions'

// Fetch conversion rates saga
function* fetchRatesSaga(action: FetchRatesRequestAction): Generator<any, void, any> {
  try {
    const response = yield call(ConverterAPI.getRates)

    if (response.success && response.data) {
      yield put(fetchRatesSuccess(response.data))
    } else {
      yield put(fetchRatesFailure(response.error || 'Failed to fetch conversion rates'))
      toast.error(response.error || 'Failed to fetch conversion rates')
    }
  } catch (error: any) {
    yield put(fetchRatesFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while fetching rates')
  }
}

// Fetch conversion history saga
function* fetchHistorySaga(action: FetchHistoryRequestAction): Generator<any, void, any> {
  try {
    const { userId } = action.payload

    if (!userId) {
      yield put(fetchHistoryFailure('User ID is required'))
      return
    }

    const response = yield call(ConverterAPI.getHistory, userId)

    if (response.success && response.data) {
      yield put(fetchHistorySuccess(response.data))
    } else {
      yield put(fetchHistoryFailure(response.error || 'Failed to fetch conversion history'))
    }
  } catch (error: any) {
    yield put(fetchHistoryFailure(error.message || 'An error occurred'))
  }
}

// Convert currency saga
function* convertSaga(action: ConvertRequestAction): Generator<any, void, any> {
  try {
    const { userId, fromCurrency, toCurrency, amount } = action.payload

    if (!userId) {
      yield put(convertFailure('User ID is required'))
      toast.error('User ID is required')
      return
    }

    if (amount <= 0) {
      yield put(convertFailure('Amount must be greater than 0'))
      toast.error('Amount must be greater than 0')
      return
    }

    toast.loading('Converting...', { id: 'convert' })

    const response = yield call(ConverterAPI.convert, userId, fromCurrency, toCurrency, amount)

    if (response.success && response.data) {
      const { conversion, newBalances } = response.data

      yield put(convertSuccess(conversion, newBalances))

      // Update user balances in Redux
      if (newBalances.xp !== undefined) {
        yield put(updateXP(newBalances.xp))
      }
      if (newBalances.tickets !== undefined) {
        yield put(setSpinTickets(newBalances.tickets))
      }
      if (newBalances.balance !== undefined) {
        yield put(updateBalance(newBalances.balance))
      }

      toast.success(
        `✅ ${response.message || `Successfully converted ${conversion.fromAmount} ${fromCurrency.toUpperCase()} to ${conversion.toAmount} ${toCurrency.toUpperCase()}`}`,
        { id: 'convert', duration: 5000 }
      )
    } else {
      yield put(convertFailure(response.error || 'Failed to convert currency'))
      toast.error(response.error || 'Failed to convert currency', { id: 'convert' })
    }
  } catch (error: any) {
    yield put(convertFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while converting', { id: 'convert' })
  }
}

// Root saga
export function* converterSaga() {
  yield takeLatest(CONVERTER_ACTIONS.FETCH_RATES_REQUEST, fetchRatesSaga)
  yield takeLatest(CONVERTER_ACTIONS.FETCH_HISTORY_REQUEST, fetchHistorySaga)
  yield takeLatest(CONVERTER_ACTIONS.CONVERT_REQUEST, convertSaga)
}
