import {
  WITHDRAW_ACTIONS,
  WithdrawRequest,
  SetWithdrawMethodAction,
  SetAccountNumberAction,
  SetAmountAction,
  ClearFormAction,
  SetSubmittingAction,
  SetLoadingAction,
  SetErrorAction,
  SetSuccessMessageAction,
  ClearErrorAction,
  ClearSuccessMessageAction,
  SubmitWithdrawRequestAction,
  SubmitWithdrawSuccessAction,
  SubmitWithdrawFailureAction,
  FetchWithdrawConfigRequestAction,
  FetchWithdrawConfigSuccessAction,
  FetchWithdrawConfigFailureAction
} from './types'

// Form field update actions
export const setWithdrawMethod = (method: string): SetWithdrawMethodAction => ({
  type: WITHDRAW_ACTIONS.SET_WITHDRAW_METHOD,
  payload: method
})

export const setAccountNumber = (accountNumber: string): SetAccountNumberAction => ({
  type: WITHDRAW_ACTIONS.SET_ACCOUNT_NUMBER,
  payload: accountNumber
})

export const setAmount = (amount: string): SetAmountAction => ({
  type: WITHDRAW_ACTIONS.SET_AMOUNT,
  payload: amount
})

export const clearForm = (): ClearFormAction => ({
  type: WITHDRAW_ACTIONS.CLEAR_FORM
})

// State management actions
export const setSubmitting = (isSubmitting: boolean): SetSubmittingAction => ({
  type: WITHDRAW_ACTIONS.SET_SUBMITTING,
  payload: isSubmitting
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: WITHDRAW_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setError = (error: string | null): SetErrorAction => ({
  type: WITHDRAW_ACTIONS.SET_ERROR,
  payload: error
})

export const setSuccessMessage = (message: string | null): SetSuccessMessageAction => ({
  type: WITHDRAW_ACTIONS.SET_SUCCESS_MESSAGE,
  payload: message
})

export const clearError = (): ClearErrorAction => ({
  type: WITHDRAW_ACTIONS.CLEAR_ERROR
})

export const clearSuccessMessage = (): ClearSuccessMessageAction => ({
  type: WITHDRAW_ACTIONS.CLEAR_SUCCESS_MESSAGE
})

// Saga actions
export const submitWithdrawRequest = (withdrawData: WithdrawRequest): SubmitWithdrawRequestAction => ({
  type: WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST,
  payload: withdrawData
})

export const submitWithdrawSuccess = (message: string): SubmitWithdrawSuccessAction => ({
  type: WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_SUCCESS,
  payload: { message }
})

export const submitWithdrawFailure = (error: string): SubmitWithdrawFailureAction => ({
  type: WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_FAILURE,
  payload: error
})

export const fetchWithdrawConfigRequest = (): FetchWithdrawConfigRequestAction => ({
  type: WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_REQUEST
})

export const fetchWithdrawConfigSuccess = (
  minWithdraw: number, 
  requiredReferrals: number
): FetchWithdrawConfigSuccessAction => ({
  type: WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_SUCCESS,
  payload: { minWithdraw, requiredReferrals }
})

export const fetchWithdrawConfigFailure = (error: string): FetchWithdrawConfigFailureAction => ({
  type: WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_FAILURE,
  payload: error
})
