import { 
  USER_ACTIONS, 
  SetUserDataAction, 
  SetLoadingAction, 
  SetErrorAction, 
  UpdateBalanceAction,
  UpdateXPAction,
  UpdateWatchedTodayAction, 
  ClearErrorAction,
  FetchUserDataSuccessAction,
  FetchUserDataFailureAction,
  ValidateAccountRequestAction,
  ValidateAccountSuccessAction,
  ValidateAccountFailureAction,
  ClearStoredAccountAction,
  UserState 
} from './types'

// Action creators
export const setUserData = (userData: Partial<UserState>): SetUserDataAction => ({
  type: USER_ACTIONS.SET_USER_DATA,
  payload: userData
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: USER_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setError = (error: string | null): SetErrorAction => ({
  type: USER_ACTIONS.SET_ERROR,
  payload: error
})

export const updateBalance = (balance: number): UpdateBalanceAction => ({
  type: USER_ACTIONS.UPDATE_BALANCE,
  payload: balance
})

export const updateXP = (xp: number): UpdateXPAction => ({
  type: USER_ACTIONS.UPDATE_XP,
  payload: xp
})

export const updateWatchedToday = (count: number): UpdateWatchedTodayAction => ({
  type: USER_ACTIONS.UPDATE_WATCHED_TODAY,
  payload: count
})

export const clearError = (): ClearErrorAction => ({
  type: USER_ACTIONS.CLEAR_ERROR
})

// Saga action creators
export const fetchUserDataRequest = (  )  => ({
  type: USER_ACTIONS.FETCH_USER_DATA_REQUEST,
  
})

export const fetchUserDataSuccess = (userData: Partial<UserState>): FetchUserDataSuccessAction => ({
  type: USER_ACTIONS.FETCH_USER_DATA_SUCCESS,
  payload: userData
})

export const fetchUserDataFailure = (error: string): FetchUserDataFailureAction => ({
  type: USER_ACTIONS.FETCH_USER_DATA_FAILURE,
  payload: error
})

// Account validation action creators
export const validateAccountRequest = (userId: number, username: string): ValidateAccountRequestAction => ({
  type: USER_ACTIONS.VALIDATE_ACCOUNT_REQUEST,
  payload: { userId, username }
})

export const validateAccountSuccess = (isValid: boolean, message?: string): ValidateAccountSuccessAction => ({
  type: USER_ACTIONS.VALIDATE_ACCOUNT_SUCCESS,
  payload: { isValid, message }
})

export const validateAccountFailure = (error: string): ValidateAccountFailureAction => ({
  type: USER_ACTIONS.VALIDATE_ACCOUNT_FAILURE,
  payload: error
})

export const clearStoredAccount = (): ClearStoredAccountAction => ({
  type: USER_ACTIONS.CLEAR_STORED_ACCOUNT
})
