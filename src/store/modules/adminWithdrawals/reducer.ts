import {
  AdminWithdrawalsState,
  AdminWithdrawalsActionTypes,
  ADMIN_WITHDRAWALS_ACTIONS,
  WithdrawalRequest
} from './types'

// Initial state
const initialState: AdminWithdrawalsState = {
  withdrawals: [],
  isLoading: false,
  isProcessing: false,
  searchQuery: '',
  statusFilter: 'all',
  methodFilter: 'all',
  sortBy: 'requestTime',
  sortOrder: 'desc',
  selectedWithdrawal: null,
  showDetailsPopup: false,
  error: null,
  totalCount: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  totalAmount: 0,
  pendingAmount: 0
}

// Helper function to calculate statistics
const calculateStatistics = (withdrawals: WithdrawalRequest[]) => {
  const totalCount = withdrawals.length
  const pendingCount = withdrawals.filter(w => w.status === 'pending').length
  const approvedCount = withdrawals.filter(w => w.status === 'approved').length
  const rejectedCount = withdrawals.filter(w => w.status === 'rejected').length
  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0)
  const pendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0)

  return {
    totalCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalAmount,
    pendingAmount
  }
}

// Helper function to update withdrawal in array
const updateWithdrawalInArray = (
  withdrawals: WithdrawalRequest[],
  withdrawalId: string,
  updates: Partial<WithdrawalRequest>
): WithdrawalRequest[] => {
  return withdrawals.map(withdrawal =>
    withdrawal.id === withdrawalId
      ? { ...withdrawal, ...updates }
      : withdrawal
  )
}

// Helper function to update multiple withdrawals in array
const updateMultipleWithdrawalsInArray = (
  withdrawals: WithdrawalRequest[],
  withdrawalIds: string[],
  updates: Partial<WithdrawalRequest>
): WithdrawalRequest[] => {
  return withdrawals.map(withdrawal =>
    withdrawalIds.includes(withdrawal.id)
      ? { ...withdrawal, ...updates }
      : withdrawal
  )
}

// Reducer
export const adminWithdrawalsReducer = (
  state = initialState,
  action: AdminWithdrawalsActionTypes
): AdminWithdrawalsState => {
  switch (action.type) {
    case ADMIN_WITHDRAWALS_ACTIONS.SET_WITHDRAWALS: {
      const withdrawals = action.payload
      const statistics = calculateStatistics(withdrawals)
      return {
        ...state,
        withdrawals,
        ...statistics
      }
    }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_PROCESSING:
      return {
        ...state,
        isProcessing: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_STATUS_FILTER:
      return {
        ...state,
        statusFilter: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_METHOD_FILTER:
      return {
        ...state,
        methodFilter: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_SELECTED_WITHDRAWAL:
      return {
        ...state,
        selectedWithdrawal: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_SHOW_DETAILS_POPUP:
      return {
        ...state,
        showDetailsPopup: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case ADMIN_WITHDRAWALS_ACTIONS.SET_STATISTICS:
      return {
        ...state,
        ...action.payload
      }

    // Saga action handlers
    case ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_SUCCESS: {
      const withdrawals = action.payload
      const statistics = calculateStatistics(withdrawals)
      return {
        ...state,
        withdrawals,
        isLoading: false,
        error: null,
        ...statistics
      }
    }

    case ADMIN_WITHDRAWALS_ACTIONS.FETCH_WITHDRAWALS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_REQUEST:
      return {
        ...state,
        isProcessing: true,
        error: null
      }

    case ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_SUCCESS: {
      const { withdrawalId, action: withdrawalAction, adminNote, transactionId } = action.payload
      const updatedWithdrawals = updateWithdrawalInArray(
        state.withdrawals,
        withdrawalId,
        {
          status: withdrawalAction === 'approve' ? 'approved' : 'rejected',
          processedTime: new Date().toISOString(),
          adminNote,
          transactionId
        }
      )
      const statistics = calculateStatistics(updatedWithdrawals)
      
      return {
        ...state,
        withdrawals: updatedWithdrawals,
        isProcessing: false,
        error: null,
        showDetailsPopup: false,
        selectedWithdrawal: null,
        ...statistics
      }
    }

    case ADMIN_WITHDRAWALS_ACTIONS.PROCESS_WITHDRAWAL_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: action.payload
      }

    case ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_REQUEST:
      return {
        ...state,
        isProcessing: true,
        error: null
      }

    case ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_SUCCESS: {
      const { withdrawalIds, action: withdrawalAction } = action.payload
      const updatedWithdrawals = updateMultipleWithdrawalsInArray(
        state.withdrawals,
        withdrawalIds,
        {
          status: withdrawalAction === 'approve' ? 'approved' : 'rejected',
          processedTime: new Date().toISOString()
        }
      )
      const statistics = calculateStatistics(updatedWithdrawals)
      
      return {
        ...state,
        withdrawals: updatedWithdrawals,
        isProcessing: false,
        error: null,
        ...statistics
      }
    }

    case ADMIN_WITHDRAWALS_ACTIONS.BULK_PROCESS_WITHDRAWALS_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: action.payload
      }

    default:
      return state
  }
}
