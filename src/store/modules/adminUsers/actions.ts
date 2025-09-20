import {
  ADMIN_USERS_ACTIONS,
  User,
  UserFilter,
  SetUsersAction,
  SetLoadingAction,
  SetUpdatingAction,
  SetSearchQueryAction,
  SetUserFilterAction,
  SetSelectedUserAction,
  SetShowDetailsPopupAction,
  SetErrorAction,
  ClearErrorAction,
  FetchUsersRequestAction,
  FetchUsersSuccessAction,
  FetchUsersFailureAction,
  UpdateUserStatusRequestAction,
  UpdateUserStatusSuccessAction,
  UpdateUserStatusFailureAction,
  UpdateUserBalanceRequestAction,
  UpdateUserBalanceSuccessAction,
  UpdateUserBalanceFailureAction
} from './types'

// State management actions
export const setUsers = (users: User[]): SetUsersAction => ({
  type: ADMIN_USERS_ACTIONS.SET_USERS,
  payload: users
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: ADMIN_USERS_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setUpdating = (isUpdating: boolean): SetUpdatingAction => ({
  type: ADMIN_USERS_ACTIONS.SET_UPDATING,
  payload: isUpdating
})

export const setSearchQuery = (query: string): SetSearchQueryAction => ({
  type: ADMIN_USERS_ACTIONS.SET_SEARCH_QUERY,
  payload: query
})

export const setUserFilter = (filter: UserFilter): SetUserFilterAction => ({
  type: ADMIN_USERS_ACTIONS.SET_USER_FILTER,
  payload: filter
})

export const setSelectedUser = (user: User | null): SetSelectedUserAction => ({
  type: ADMIN_USERS_ACTIONS.SET_SELECTED_USER,
  payload: user
})

export const setShowDetailsPopup = (show: boolean): SetShowDetailsPopupAction => ({
  type: ADMIN_USERS_ACTIONS.SET_SHOW_DETAILS_POPUP,
  payload: show
})

export const setError = (error: string | null): SetErrorAction => ({
  type: ADMIN_USERS_ACTIONS.SET_ERROR,
  payload: error
})

export const clearError = (): ClearErrorAction => ({
  type: ADMIN_USERS_ACTIONS.CLEAR_ERROR
})

// Saga actions for API calls
export const fetchUsersRequest = (payload?: { showToast?: boolean }): FetchUsersRequestAction => ({
  type: ADMIN_USERS_ACTIONS.FETCH_USERS_REQUEST,
  payload
})

export const fetchUsersSuccess = (users: User[]): FetchUsersSuccessAction => ({
  type: ADMIN_USERS_ACTIONS.FETCH_USERS_SUCCESS,
  payload: users
})

export const fetchUsersFailure = (error: string): FetchUsersFailureAction => ({
  type: ADMIN_USERS_ACTIONS.FETCH_USERS_FAILURE,
  payload: error
})

export const updateUserStatusRequest = (userId: string, newStatus: 'active' | 'suspend'): UpdateUserStatusRequestAction => ({
  type: ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_REQUEST,
  payload: { userId, newStatus }
})

export const updateUserStatusSuccess = (userId: string, newStatus: 'active' | 'suspend'): UpdateUserStatusSuccessAction => ({
  type: ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_SUCCESS,
  payload: { userId, newStatus }
})

export const updateUserStatusFailure = (error: string): UpdateUserStatusFailureAction => ({
  type: ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_FAILURE,
  payload: error
})

export const updateUserBalanceRequest = (userId: string, newBalance: number): UpdateUserBalanceRequestAction => ({
  type: ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_REQUEST,
  payload: { userId, newBalance }
})

export const updateUserBalanceSuccess = (userId: string, newBalance: number): UpdateUserBalanceSuccessAction => ({
  type: ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_SUCCESS,
  payload: { userId, newBalance }
})

export const updateUserBalanceFailure = (error: string): UpdateUserBalanceFailureAction => ({
  type: ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_FAILURE,
  payload: error
})
