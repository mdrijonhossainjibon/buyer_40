import {
  ADMIN_WITHDRAWALS_ACTIONS,
  WithdrawalRequest,
  WithdrawalStatusFilter,
  WithdrawalMethodFilter,
  WithdrawalSortBy,
  WithdrawalSortOrder,
  SetWithdrawalsAction,
  SetLoadingAction,
  SetProcessingAction,
  SetSearchQueryAction,
  SetStatusFilterAction,
  SetMethodFilterAction,
  SetSortByAction,
  SetSortOrderAction,
  SetSelectedWithdrawalAction,
  SetShowDetailsPopupAction,
  SetErrorAction,
  ClearErrorAction,
  SetStatisticsAction,
  FetchWithdrawalsRequestAction,
  ProcessWithdrawalRequestAction,
  BulkProcessWithdrawalsRequestAction
} from './types'

// State management actions
export const setWithdrawals = (withdrawals: WithdrawalRequest[]): SetWithdrawalsAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_WITHDRAWALS,
  payload: withdrawals
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setProcessing = (isProcessing: boolean): SetProcessingAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING,
  payload: isProcessing
})

export const setSearchQuery = (query: string): SetSearchQueryAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_SEARCH_QUERY,
  payload: query
})

export const setStatusFilter = (filter: WithdrawalStatusFilter): SetStatusFilterAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_STATUS_FILTER,
  payload: filter
})

export const setMethodFilter = (filter: WithdrawalMethodFilter): SetMethodFilterAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_METHOD_FILTER,
  payload: filter
})

export const setSortBy = (sortBy: WithdrawalSortBy): SetSortByAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_SORT_BY,
  payload: sortBy
})

export const setSortOrder = (sortOrder: WithdrawalSortOrder): SetSortOrderAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_SORT_ORDER,
  payload: sortOrder
})

export const setSelectedWithdrawal = (withdrawal: WithdrawalRequest | null): SetSelectedWithdrawalAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_SELECTED_WITHDRAWAL,
  payload: withdrawal
})

export const setShowDetailsPopup = (show: boolean): SetShowDetailsPopupAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_SHOW_DETAILS_POPUP,
  payload: show
})

export const setError = (error: string | null): SetErrorAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_ERROR,
  payload: error
})

export const clearError = (): ClearErrorAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.CLEAR_ERROR
})

export const setStatistics = (stats: {
  totalCount: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalAmount: number
  pendingAmount: number
}): SetStatisticsAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.SET_STATISTICS,
  payload: stats
})

// Saga actions for API calls
export const fetchWithdrawalsRequest = (options?: { showToast?: boolean }): FetchWithdrawalsRequestAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_REQUEST,
  payload: options
})

export const processWithdrawalRequest = (
  withdrawalId: string,
  action: 'approve' | 'reject',
  adminNote?: string,
  transactionId?: string
): ProcessWithdrawalRequestAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_REQUEST,
  payload: { withdrawalId, action, adminNote, transactionId }
})

export const bulkProcessWithdrawalsRequest = (
  withdrawalIds: string[],
  action: 'approve' | 'reject',
  adminNote?: string
): BulkProcessWithdrawalsRequestAction => ({
  type: ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_REQUEST,
  payload: { withdrawalIds, action, adminNote }
})

// Export all actions
export const adminWithdrawalsActions = {
  setWithdrawals,
  setLoading,
  setProcessing,
  setSearchQuery,
  setStatusFilter,
  setMethodFilter,
  setSortBy,
  setSortOrder,
  setSelectedWithdrawal,
  setShowDetailsPopup,
  setError,
  clearError,
  setStatistics,
  fetchWithdrawalsRequest,
  processWithdrawalRequest,
  bulkProcessWithdrawalsRequest
}
