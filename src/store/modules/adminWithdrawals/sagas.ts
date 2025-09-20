import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { Toast } from 'antd-mobile'
import { AdminWithdrawalsAPI } from '@/lib/api/adminWithdrawals'
import {
  ADMIN_WITHDRAWALS_ACTIONS,
  FetchWithdrawalsRequestAction,
  ProcessWithdrawalRequestAction,
  BulkProcessWithdrawalsRequestAction
} from './types'

// Fetch withdrawals saga
function* fetchWithdrawalsSaga(action: FetchWithdrawalsRequestAction): Generator<any, void, any> {
  try {
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.SET_LOADING, payload: true })
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.CLEAR_ERROR })

    const response = yield call(AdminWithdrawalsAPI.getWithdrawals)
    
    if (response.success) {
      yield put({
        type: ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_SUCCESS,
        payload: response.data.withdrawals
      })

      yield put({
        type: ADMIN_WITHDRAWALS_ACTIONS.SET_STATISTICS,
        payload: {
          totalCount: response.data.totalCount,
          pendingCount: response.data.pendingCount,
          approvedCount: response.data.approvedCount,
          rejectedCount: response.data.rejectedCount,
          totalAmount: response.data.totalAmount,
          pendingAmount: response.data.pendingAmount
        }
      })

      // Show success toast if requested
      if (action.payload?.showToast) {
        Toast.show('Withdrawals refreshed successfully')
      }
    } else {
      throw new Error('Failed to fetch withdrawals')
    }
  } catch (error: any) {
    console.error('Fetch withdrawals saga error:', error)
    const errorMessage = error.message || 'Failed to fetch withdrawals'
    
    yield put({
      type: ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_FAILURE,
      payload: errorMessage
    })

    Toast.show(errorMessage)
  } finally {
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.SET_LOADING, payload: false })
  }
}

// Process withdrawal saga
function* processWithdrawalSaga(action: ProcessWithdrawalRequestAction): Generator<any, void, any> {
  try {
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING, payload: true })
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.CLEAR_ERROR })

    const { withdrawalId, action: withdrawalAction, adminNote, transactionId } = action.payload

    const response = yield call(
      AdminWithdrawalsAPI.processWithdrawal,
      withdrawalId,
      withdrawalAction,
      adminNote,
      transactionId
    )
    
    if (response.success) {
      yield put({
        type: ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_SUCCESS,
        payload: {
          withdrawalId,
          action: withdrawalAction,
          adminNote,
          transactionId
        }
      })

      const actionText = withdrawalAction === 'approve' ? 'approved' : 'rejected'
      Toast.show(`Withdrawal ${actionText} successfully`)

      // Refresh withdrawals list to get updated data
      yield put({
        type: ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_REQUEST,
        payload: { showToast: false }
      })
    } else {
      throw new Error(`Failed to ${withdrawalAction} withdrawal`)
    }
  } catch (error: any) {
    console.error('Process withdrawal saga error:', error)
    const errorMessage = error.message || `Failed to ${action.payload.action} withdrawal`
    
    yield put({
      type: ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_FAILURE,
      payload: errorMessage
    })

    Toast.show(errorMessage)
  } finally {
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING, payload: false })
  }
}

// Bulk process withdrawals saga
function* bulkProcessWithdrawalsSaga(action: BulkProcessWithdrawalsRequestAction): Generator<any, void, any> {
  try {
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING, payload: true })
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.CLEAR_ERROR })

    const { withdrawalIds, action: withdrawalAction, adminNote } = action.payload

    const response = yield call(
      AdminWithdrawalsAPI.bulkProcessWithdrawals,
      withdrawalIds,
      withdrawalAction,
      adminNote
    )
    
    if (response.success) {
      yield put({
        type: ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_SUCCESS,
        payload: {
          withdrawalIds,
          action: withdrawalAction
        }
      })

      const actionText = withdrawalAction === 'approve' ? 'approved' : 'rejected'
      const { processedCount, failedCount } = response.data
      
      if (failedCount > 0) {
        Toast.show(
          `${processedCount} withdrawals ${actionText}, ${failedCount} failed`
        )
      } else {
        Toast.show(
          `${processedCount} withdrawals ${actionText} successfully`
        )
      }

      // Refresh withdrawals list to get updated data
      yield put({
        type: ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_REQUEST,
        payload: { showToast: false }
      })
    } else {
      throw new Error(`Failed to bulk ${withdrawalAction} withdrawals`)
    }
  } catch (error: any) {
    console.error('Bulk process withdrawals saga error:', error)
    const errorMessage = error.message || `Failed to bulk ${action.payload.action} withdrawals`
    
    yield put({
      type: ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_FAILURE,
      payload: errorMessage
    })

    Toast.show(errorMessage)
  } finally {
    yield put({ type: ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING, payload: false })
  }
}

// Root saga for admin withdrawals
export function* adminWithdrawalsSaga() {
  yield takeLatest(ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_REQUEST, fetchWithdrawalsSaga)
  yield takeEvery(ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_REQUEST, processWithdrawalSaga)
  yield takeEvery(ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_REQUEST, bulkProcessWithdrawalsSaga)
}
