import { 
  USER_ACTIONS, 
  SetUserDataAction, 
  SetLoadingAction, 
  SetErrorAction, 
  UpdateBalanceAction, 
  UpdateWatchedTodayAction, 
  ClearErrorAction,
  FetchUserDataRequestAction,
  FetchUserDataSuccessAction,
  FetchUserDataFailureAction,
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

export const updateWatchedToday = (count: number): UpdateWatchedTodayAction => ({
  type: USER_ACTIONS.UPDATE_WATCHED_TODAY,
  payload: count
})

export const clearError = (): ClearErrorAction => ({
  type: USER_ACTIONS.CLEAR_ERROR
})

// Saga action creators
export const fetchUserDataRequest = ( payload : { userId : number , start_param ?: string , username ?: string }): FetchUserDataRequestAction => ({
  type: USER_ACTIONS.FETCH_USER_DATA_REQUEST,
  payload 
})

export const fetchUserDataSuccess = (userData: Partial<UserState>): FetchUserDataSuccessAction => ({
  type: USER_ACTIONS.FETCH_USER_DATA_SUCCESS,
  payload: userData
})

export const fetchUserDataFailure = (error: string): FetchUserDataFailureAction => ({
  type: USER_ACTIONS.FETCH_USER_DATA_FAILURE,
  payload: error
})
