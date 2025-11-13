// Withdraw transaction interface
export interface WithdrawTransaction {
  id: string
  amount: string
  currency: string
  network: string
  address: string
  status: 'completed' | 'pending' | 'failed' | 'processing'
  date: string
  transactionId: string
  fee?: string
  txHash?: string
}

// Withdraw history state interface
export interface WithdrawHistoryState {
  transactions: WithdrawTransaction[]
  isLoading: boolean
  error: string | null
}

// Action types
export const WITHDRAW_HISTORY_ACTIONS = {
  FETCH_WITHDRAW_HISTORY_REQUEST: 'FETCH_WITHDRAW_HISTORY_REQUEST',
  FETCH_WITHDRAW_HISTORY_SUCCESS: 'FETCH_WITHDRAW_HISTORY_SUCCESS',
  FETCH_WITHDRAW_HISTORY_FAILURE: 'FETCH_WITHDRAW_HISTORY_FAILURE',
  CLEAR_WITHDRAW_HISTORY: 'CLEAR_WITHDRAW_HISTORY'
} as const

// Action interfaces
export interface FetchWithdrawHistoryRequestAction {
  type: typeof WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_REQUEST
  payload: number // userId
  [key: string]: any
}

export interface FetchWithdrawHistorySuccessAction {
  type: typeof WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_SUCCESS
  payload: WithdrawTransaction[]
  [key: string]: any
}

export interface FetchWithdrawHistoryFailureAction {
  type: typeof WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_FAILURE
  payload: string
  [key: string]: any
}

export interface ClearWithdrawHistoryAction {
  type: typeof WITHDRAW_HISTORY_ACTIONS.CLEAR_WITHDRAW_HISTORY
  [key: string]: any
}

export type WithdrawHistoryActionTypes =
  | FetchWithdrawHistoryRequestAction
  | FetchWithdrawHistorySuccessAction
  | FetchWithdrawHistoryFailureAction
  | ClearWithdrawHistoryAction
