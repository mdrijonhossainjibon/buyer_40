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
  ValidateAccountRequestAction,
  ValidateAccountSuccessAction,
  ValidateAccountFailureAction,
  ClearStoredAccountAction,
  WatchAdRequestAction,
  WatchAdSuccessAction,
  WatchAdFailureAction,
  ClaimYoutubeRequestAction,
  ClaimYoutubeSuccessAction,
  ClaimYoutubeFailureAction,
  ClaimChannelRequestAction,
  ClaimChannelSuccessAction,
  ClaimChannelFailureAction,
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

// Ad watching and task completion action creators
export const watchAdRequest = (userId: number): WatchAdRequestAction => ({
  type: USER_ACTIONS.WATCH_AD_REQUEST,
  payload: { userId }
})

export const watchAdSuccess = (balance: number, watchedToday: number, message: string): WatchAdSuccessAction => ({
  type: USER_ACTIONS.WATCH_AD_SUCCESS,
  payload: { balance, watchedToday, message }
})

export const watchAdFailure = (error: string): WatchAdFailureAction => ({
  type: USER_ACTIONS.WATCH_AD_FAILURE,
  payload: error
})

export const claimYoutubeRequest = (userId: number): ClaimYoutubeRequestAction => ({
  type: USER_ACTIONS.CLAIM_YOUTUBE_REQUEST,
  payload: { userId }
})

export const claimYoutubeSuccess = (balance: number, youtubeBonus: number, message: string): ClaimYoutubeSuccessAction => ({
  type: USER_ACTIONS.CLAIM_YOUTUBE_SUCCESS,
  payload: { balance, youtubeBonus, message }
})

export const claimYoutubeFailure = (error: string): ClaimYoutubeFailureAction => ({
  type: USER_ACTIONS.CLAIM_YOUTUBE_FAILURE,
  payload: error
})

export const claimChannelRequest = (userId: number): ClaimChannelRequestAction => ({
  type: USER_ACTIONS.CLAIM_CHANNEL_REQUEST,
  payload: { userId }
})

export const claimChannelSuccess = (balance: number, telegramBonus: number, message: string): ClaimChannelSuccessAction => ({
  type: USER_ACTIONS.CLAIM_CHANNEL_SUCCESS,
  payload: { balance, telegramBonus, message }
})

export const claimChannelFailure = (error: string): ClaimChannelFailureAction => ({
  type: USER_ACTIONS.CLAIM_CHANNEL_FAILURE,
  payload: error
})
