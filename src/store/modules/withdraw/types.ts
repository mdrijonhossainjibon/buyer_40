// Withdraw state interface
export interface WithdrawState {
  withdrawMethod: string
  accountNumber: string
  amount: string
  isSubmitting: boolean
  isLoading: boolean
  error: string | null
  successMessage: string | null
  minWithdraw: number
  requiredReferrals: number
}

// Withdrawal request interface
export interface WithdrawRequest {
  userId: number
  withdrawMethod: string
  accountNumber: string
  amount: number
}

// Withdrawal response interface
export interface WithdrawResponse {
  success: boolean
  message: string
  data?: any
}

// Action types
export const WITHDRAW_ACTIONS = {
  // Form field updates
  SET_WITHDRAW_METHOD: 'SET_WITHDRAW_METHOD',
  SET_ACCOUNT_NUMBER: 'SET_ACCOUNT_NUMBER',
  SET_AMOUNT: 'SET_AMOUNT',
  CLEAR_FORM: 'CLEAR_FORM',
  
  // State management
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_SUCCESS_MESSAGE: 'CLEAR_SUCCESS_MESSAGE',
  
  // Saga actions
  SUBMIT_WITHDRAW_REQUEST: 'SUBMIT_WITHDRAW_REQUEST',
  SUBMIT_WITHDRAW_SUCCESS: 'SUBMIT_WITHDRAW_SUCCESS',
  SUBMIT_WITHDRAW_FAILURE: 'SUBMIT_WITHDRAW_FAILURE',
  
  // Configuration actions
  FETCH_WITHDRAW_CONFIG_REQUEST: 'FETCH_WITHDRAW_CONFIG_REQUEST',
  FETCH_WITHDRAW_CONFIG_SUCCESS: 'FETCH_WITHDRAW_CONFIG_SUCCESS',
  FETCH_WITHDRAW_CONFIG_FAILURE: 'FETCH_WITHDRAW_CONFIG_FAILURE'
} as const

// Action interfaces
export interface SetWithdrawMethodAction {
  type: typeof WITHDRAW_ACTIONS.SET_WITHDRAW_METHOD
  payload: string
  [key: string]: any
}

export interface SetAccountNumberAction {
  type: typeof WITHDRAW_ACTIONS.SET_ACCOUNT_NUMBER
  payload: string
  [key: string]: any
}

export interface SetAmountAction {
  type: typeof WITHDRAW_ACTIONS.SET_AMOUNT
  payload: string
  [key: string]: any
}

export interface ClearFormAction {
  type: typeof WITHDRAW_ACTIONS.CLEAR_FORM
  [key: string]: any
}

export interface SetSubmittingAction {
  type: typeof WITHDRAW_ACTIONS.SET_SUBMITTING
  payload: boolean
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof WITHDRAW_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof WITHDRAW_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface SetSuccessMessageAction {
  type: typeof WITHDRAW_ACTIONS.SET_SUCCESS_MESSAGE
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof WITHDRAW_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

export interface ClearSuccessMessageAction {
  type: typeof WITHDRAW_ACTIONS.CLEAR_SUCCESS_MESSAGE
  [key: string]: any
}

// Saga action interfaces
export interface SubmitWithdrawRequestAction {
  type: typeof WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST
  payload: WithdrawRequest
  [key: string]: any
}

export interface SubmitWithdrawSuccessAction {
  type: typeof WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_SUCCESS
  payload: { message: string }
  [key: string]: any
}

export interface SubmitWithdrawFailureAction {
  type: typeof WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_FAILURE
  payload: string
  [key: string]: any
}

export interface FetchWithdrawConfigRequestAction {
  type: typeof WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_REQUEST
  [key: string]: any
}

export interface FetchWithdrawConfigSuccessAction {
  type: typeof WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_SUCCESS
  payload: { minWithdraw: number, requiredReferrals: number }
  [key: string]: any
}

export interface FetchWithdrawConfigFailureAction {
  type: typeof WITHDRAW_ACTIONS.FETCH_WITHDRAW_CONFIG_FAILURE
  payload: string
  [key: string]: any
}

export type WithdrawActionTypes = 
  | SetWithdrawMethodAction
  | SetAccountNumberAction
  | SetAmountAction
  | ClearFormAction
  | SetSubmittingAction
  | SetLoadingAction
  | SetErrorAction
  | SetSuccessMessageAction
  | ClearErrorAction
  | ClearSuccessMessageAction
  | SubmitWithdrawRequestAction
  | SubmitWithdrawSuccessAction
  | SubmitWithdrawFailureAction
  | FetchWithdrawConfigRequestAction
  | FetchWithdrawConfigSuccessAction
  | FetchWithdrawConfigFailureAction
