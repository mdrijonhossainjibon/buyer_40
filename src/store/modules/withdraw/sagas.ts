import { call, put, takeEvery, select } from 'redux-saga/effects'
import { withdrawAPI } from '@/lib/api/withdraw'
import { RootState } from '@/store/rootReducer'
 
import {
  WITHDRAW_ACTIONS,
  SubmitWithdrawRequestAction,
  FetchWithdrawConfigRequestAction
} from './types'
import {
  submitWithdrawSuccess,
  submitWithdrawFailure,
  fetchWithdrawConfigSuccess,
  fetchWithdrawConfigFailure,
  setSubmitting,
  clearForm
} from './actions'
import { updateBalance } from '../user/actions'
import  toast   from 'react-hot-toast'

// Submit withdrawal request saga
function* submitWithdrawSaga(action: SubmitWithdrawRequestAction): Generator<any, void, any> {
  try {
    // Set submitting state
    yield put(setSubmitting(true))

    // Show loading toast
    toast.loading('Submitting withdrawal request...' ,{
      duration: 3000
    })

    // Call API
    const response = yield call(withdrawAPI.submitWithdraw, action.payload)

    if (response.success) {
      // Success
      yield put(submitWithdrawSuccess(response.message || 'Withdrawal request submitted successfully'))
      
      // Show success toast
      toast.success(response.message || 'Withdrawal request submitted successfully.', {
        duration: 3000
      })

      // Update user balance - subtract withdrawn amount from current balance
      const currentState: RootState = yield select()
      const currentBalance = currentState.user.balanceTK
      const withdrawnAmount = action.payload.amount
      const remainingBalance = currentBalance - withdrawnAmount
      
      // Dispatch balance update action
      yield put(updateBalance(remainingBalance))
      
      // Clear the withdrawal form after successful submission
      yield put(clearForm())
      
    } else {
      // Failure
      yield put(submitWithdrawFailure(response.error || 'Withdrawal request failed'))
      
      // Show error toast
      toast.error(response.error || 'Withdrawal request failed', {
        duration: 3000
      })
    }
  } catch (error: any) {
    // Handle unexpected errors
    const errorMessage = error.message || 'Network error! Please try again.'
    yield put(submitWithdrawFailure(errorMessage))
    
    // Show error toast
    toast.error(errorMessage, {
      duration: 3000
    })
  } finally {
    // Always reset submitting state
    yield put(setSubmitting(false))
  }
}

// Fetch withdrawal configuration saga
function* fetchWithdrawConfigSaga(action: FetchWithdrawConfigRequestAction): Generator<any, void, any> {
  try {
    // Call API to get withdrawal configuration
    const response = yield call(withdrawAPI.getWithdrawConfig)

    if (response.success && response.data) {
      // Success
      yield put(fetchWithdrawConfigSuccess(
        response.data.minWithdraw,
        response.data.requiredReferrals
      ))
    } else {
      // Use default values on failure
      yield put(fetchWithdrawConfigSuccess(1000, 20))
    }
  } catch (error: any) {
    // Use default values on error
    yield put(fetchWithdrawConfigFailure(error.message || 'Failed to fetch withdrawal configuration'))
    yield put(fetchWithdrawConfigSuccess(1000, 20))
  }
}

// Root saga for withdraw module
export function* withdrawSaga() {
  yield takeEvery(WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST, submitWithdrawSaga)
  yield takeEvery(WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_REQUEST, fetchWithdrawConfigSaga)
}
