// Withdrawal request interface
export interface WithdrawalRequest {
  id: string
  userId: string
  username: string
  amount: number
  method: string
  accountNumber: string
  status: 'pending' | 'approved' | 'rejected'
  requestTime: string
  processedTime?: string
  adminNote?: string
  userEmail?: string
  userPhone?: string
  transactionId?: string
}

// Withdrawal filter types
export type WithdrawalStatusFilter = 'all' | 'pending' | 'approved' | 'rejected'
export type WithdrawalMethodFilter = 'all' | 'bkash' | 'nagad' | 'rocket' | 'bank'
export type WithdrawalSortBy = 'requestTime' | 'amount' | 'username' | 'status'
export type WithdrawalSortOrder = 'asc' | 'desc'

// Admin withdrawals state interface
export interface AdminWithdrawalsState {
  withdrawals: WithdrawalRequest[]
  isLoading: boolean
  isProcessing: boolean
  searchQuery: string
  statusFilter: WithdrawalStatusFilter
  methodFilter: WithdrawalMethodFilter
  sortBy: WithdrawalSortBy
  sortOrder: WithdrawalSortOrder
  selectedWithdrawal: WithdrawalRequest | null
  showDetailsPopup: boolean
  error: string | null
  totalCount: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalAmount: number
  pendingAmount: number
}

// Action types
export const ADMIN_WITHDRAWALS_ACTIONS = {
  // State management actions
  SET_WITHDRAWALS: 'SET_ADMIN_WITHDRAWALS',
  SET_LOADING: 'SET_ADMIN_WITHDRAWALS_LOADING',
  SET_PROCESSING: 'SET_ADMIN_WITHDRAWALS_PROCESSING',
  SET_SEARCH_QUERY: 'SET_ADMIN_WITHDRAWALS_SEARCH_QUERY',
  SET_STATUS_FILTER: 'SET_ADMIN_WITHDRAWALS_STATUS_FILTER',
  SET_METHOD_FILTER: 'SET_ADMIN_WITHDRAWALS_METHOD_FILTER',
  SET_SORT_BY: 'SET_ADMIN_WITHDRAWALS_SORT_BY',
  SET_SORT_ORDER: 'SET_ADMIN_WITHDRAWALS_SORT_ORDER',
  SET_SELECTED_WITHDRAWAL: 'SET_ADMIN_SELECTED_WITHDRAWAL',
  SET_SHOW_DETAILS_POPUP: 'SET_ADMIN_SHOW_DETAILS_POPUP',
  SET_ERROR: 'SET_ADMIN_WITHDRAWALS_ERROR',
  CLEAR_ERROR: 'CLEAR_ADMIN_WITHDRAWALS_ERROR',
  SET_STATISTICS: 'SET_ADMIN_WITHDRAWALS_STATISTICS',
  
  // Saga actions for API calls
  FETCH_WITHDRAWALS_REQUEST: 'FETCH_ADMIN_WITHDRAWALS_REQUEST',
  FETCH_WITHDRAWALS_SUCCESS: 'FETCH_ADMIN_WITHDRAWALS_SUCCESS',
  FETCH_WITHDRAWALS_FAILURE: 'FETCH_ADMIN_WITHDRAWALS_FAILURE',
  
  PROCESS_WITHDRAWAL_REQUEST: 'PROCESS_ADMIN_WITHDRAWAL_REQUEST',
  PROCESS_WITHDRAWAL_SUCCESS: 'PROCESS_ADMIN_WITHDRAWAL_SUCCESS',
  PROCESS_WITHDRAWAL_FAILURE: 'PROCESS_ADMIN_WITHDRAWAL_FAILURE',
  
  BULK_PROCESS_WITHDRAWALS_REQUEST: 'BULK_PROCESS_ADMIN_WITHDRAWALS_REQUEST',
  BULK_PROCESS_WITHDRAWALS_SUCCESS: 'BULK_PROCESS_ADMIN_WITHDRAWALS_SUCCESS',
  BULK_PROCESS_WITHDRAWALS_FAILURE: 'BULK_PROCESS_ADMIN_WITHDRAWALS_FAILURE'
} as const

// Action interfaces
export interface SetWithdrawalsAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_WITHDRAWALS
  payload: WithdrawalRequest[]
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetProcessingAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING
  payload: boolean
  [key: string]: any
}

export interface SetSearchQueryAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_SEARCH_QUERY
  payload: string
  [key: string]: any
}

export interface SetStatusFilterAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_STATUS_FILTER
  payload: WithdrawalStatusFilter
  [key: string]: any
}

export interface SetMethodFilterAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_METHOD_FILTER
  payload: WithdrawalMethodFilter
  [key: string]: any
}

export interface SetSortByAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_SORT_BY
  payload: WithdrawalSortBy
  [key: string]: any
}

export interface SetSortOrderAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_SORT_ORDER
  payload: WithdrawalSortOrder
  [key: string]: any
}

export interface SetSelectedWithdrawalAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_SELECTED_WITHDRAWAL
  payload: WithdrawalRequest | null
  [key: string]: any
}

export interface SetShowDetailsPopupAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_SHOW_DETAILS_POPUP
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

export interface SetStatisticsAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.SET_STATISTICS
  payload: {
    totalCount: number
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    totalAmount: number
    pendingAmount: number
  }
  [key: string]: any
}

// Saga action interfaces
export interface FetchWithdrawalsRequestAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_REQUEST
  payload?: { showToast?: boolean }
  [key: string]: any
}

export interface FetchWithdrawalsSuccessAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_SUCCESS
  payload: WithdrawalRequest[]
  [key: string]: any
}

export interface FetchWithdrawalsFailureAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_FAILURE
  payload: string
  [key: string]: any
}

export interface ProcessWithdrawalRequestAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_REQUEST
  payload: { 
    withdrawalId: string
    action: 'approve' | 'reject'
    adminNote?: string
    transactionId?: string
  }
  [key: string]: any
}

export interface ProcessWithdrawalSuccessAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_SUCCESS
  payload: { 
    withdrawalId: string
    action: 'approve' | 'reject'
    adminNote?: string
    transactionId?: string
  }
  [key: string]: any
}

export interface ProcessWithdrawalFailureAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_FAILURE
  payload: string
  [key: string]: any
}

export interface BulkProcessWithdrawalsRequestAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_REQUEST
  payload: { 
    withdrawalIds: string[]
    action: 'approve' | 'reject'
    adminNote?: string
  }
  [key: string]: any
}

export interface BulkProcessWithdrawalsSuccessAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_SUCCESS
  payload: { 
    withdrawalIds: string[]
    action: 'approve' | 'reject'
  }
  [key: string]: any
}

export interface BulkProcessWithdrawalsFailureAction {
  type: typeof ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_FAILURE
  payload: string
  [key: string]: any
}

// Union type for all actions
export type AdminWithdrawalsActionTypes = 
  | SetWithdrawalsAction
  | SetLoadingAction
  | SetProcessingAction
  | SetSearchQueryAction
  | SetStatusFilterAction
  | SetMethodFilterAction
  | SetSortByAction
  | SetSortOrderAction
  | SetSelectedWithdrawalAction
  | SetShowDetailsPopupAction
  | SetErrorAction
  | ClearErrorAction
  | SetStatisticsAction
  | FetchWithdrawalsRequestAction
  | FetchWithdrawalsSuccessAction
  | FetchWithdrawalsFailureAction
  | ProcessWithdrawalRequestAction
  | ProcessWithdrawalSuccessAction
  | ProcessWithdrawalFailureAction
  | BulkProcessWithdrawalsRequestAction
  | BulkProcessWithdrawalsSuccessAction
  | BulkProcessWithdrawalsFailureAction
