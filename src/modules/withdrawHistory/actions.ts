import {
  WITHDRAW_HISTORY_ACTIONS,
  WithdrawTransaction,
  FetchWithdrawHistoryRequestAction,
  FetchWithdrawHistorySuccessAction,
  FetchWithdrawHistoryFailureAction,
  ClearWithdrawHistoryAction
} from './types'

// Fetch withdraw history request
export const fetchWithdrawHistoryRequest = (userId: number): FetchWithdrawHistoryRequestAction => ({
  type: WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_REQUEST,
  payload: userId
})

// Fetch withdraw history success
export const fetchWithdrawHistorySuccess = (transactions: WithdrawTransaction[]): FetchWithdrawHistorySuccessAction => ({
  type: WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_SUCCESS,
  payload: transactions
})

// Fetch withdraw history failure
export const fetchWithdrawHistoryFailure = (error: string): FetchWithdrawHistoryFailureAction => ({
  type: WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_FAILURE,
  payload: error
})

// Clear withdraw history
export const clearWithdrawHistory = (): ClearWithdrawHistoryAction => ({
  type: WITHDRAW_HISTORY_ACTIONS.CLEAR_WITHDRAW_HISTORY
})
