import { WithdrawState, WithdrawActionTypes, WITHDRAW_ACTIONS } from './types'

// Initial state
const initialState: WithdrawState = {
  withdrawMethod: '',
  accountNumber: '',
  amount: '',
  isSubmitting: false,
  isLoading: false,
  error: null,
  successMessage: null,
  minWithdraw: 2,
  requiredReferrals: 10
}

// Reducer
export const withdrawReducer = (
  state: WithdrawState = initialState,
  action: WithdrawActionTypes
): WithdrawState => {
  switch (action.type) {
    // Form field updates
    case WITHDRAW_ACTIONS.SET_WITHDRAW_METHOD:
      return {
        ...state,
        withdrawMethod: action.payload,
        error: null
      }

    case WITHDRAW_ACTIONS.SET_ACCOUNT_NUMBER:
      return {
        ...state,
        accountNumber: action.payload,
        error: null
      }

    case WITHDRAW_ACTIONS.SET_AMOUNT:
      return {
        ...state,
        amount: action.payload,
        error: null
      }

    case WITHDRAW_ACTIONS.CLEAR_FORM:
      return {
        ...state,
        accountNumber: '',
        amount: '',
        error: null,
        successMessage: null
      }

    // State management
    case WITHDRAW_ACTIONS.SET_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      }

    case WITHDRAW_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case WITHDRAW_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        successMessage: null,
        isSubmitting: false
      }

    case WITHDRAW_ACTIONS.SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload,
        error: null,
        isSubmitting: false
      }

    case WITHDRAW_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case WITHDRAW_ACTIONS.CLEAR_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: null
      }

    // Saga actions
    case WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null,
        successMessage: null
      }

    case WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        successMessage: action.payload.message,
        error: null,
        // Clear form on success
        accountNumber: '',
        amount: ''
      }

    case WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
        successMessage: null
      }

    // Configuration actions
    case WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        minWithdraw: action.payload.minWithdraw,
        requiredReferrals: action.payload.requiredReferrals,
        error: null
      }

    case WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}

export default withdrawReducer
