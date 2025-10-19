// User interface
export interface User {
  id: string
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspend'
  joinDate: string
  lastActive: string
  totalEarnings: number
  totalWithdrawals: number
  referralCount: number
}

// User filter type
export type UserFilter = 'all' | 'active' | 'inactive' | 'suspend'

// Admin users state interface
export interface AdminUsersState {
  users: User[]
  isLoading: boolean
  isUpdating: boolean
  searchQuery: string
  userFilter: UserFilter
  selectedUser: User | null
  showDetailsPopup: boolean
  error: string | null
}

// Action types
export const ADMIN_USERS_ACTIONS = {
  // State management actions
  SET_USERS: 'SET_ADMIN_USERS',
  SET_LOADING: 'SET_ADMIN_USERS_LOADING',
  SET_UPDATING: 'SET_ADMIN_USERS_UPDATING',
  SET_SEARCH_QUERY: 'SET_ADMIN_USERS_SEARCH_QUERY',
  SET_USER_FILTER: 'SET_ADMIN_USERS_FILTER',
  SET_SELECTED_USER: 'SET_ADMIN_SELECTED_USER',
  SET_SHOW_DETAILS_POPUP: 'SET_ADMIN_SHOW_DETAILS_POPUP',
  SET_ERROR: 'SET_ADMIN_USERS_ERROR',
  CLEAR_ERROR: 'CLEAR_ADMIN_USERS_ERROR',
  
  // Saga actions for API calls
  FETCH_USERS_REQUEST: 'FETCH_ADMIN_USERS_REQUEST',
  FETCH_USERS_SUCCESS: 'FETCH_ADMIN_USERS_SUCCESS',
  FETCH_USERS_FAILURE: 'FETCH_ADMIN_USERS_FAILURE',
  
  UPDATE_USER_STATUS_REQUEST: 'UPDATE_ADMIN_USER_STATUS_REQUEST',
  UPDATE_USER_STATUS_SUCCESS: 'UPDATE_ADMIN_USER_STATUS_SUCCESS',
  UPDATE_USER_STATUS_FAILURE: 'UPDATE_ADMIN_USER_STATUS_FAILURE',
  
  UPDATE_USER_BALANCE_REQUEST: 'UPDATE_ADMIN_USER_BALANCE_REQUEST',
  UPDATE_USER_BALANCE_SUCCESS: 'UPDATE_ADMIN_USER_BALANCE_SUCCESS',
  UPDATE_USER_BALANCE_FAILURE: 'UPDATE_ADMIN_USER_BALANCE_FAILURE'
} as const

// Action interfaces
export interface SetUsersAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_USERS
  payload: User[]
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetUpdatingAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_UPDATING
  payload: boolean
  [key: string]: any
}

export interface SetSearchQueryAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_SEARCH_QUERY
  payload: string
  [key: string]: any
}

export interface SetUserFilterAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_USER_FILTER
  payload: UserFilter
  [key: string]: any
}

export interface SetSelectedUserAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_SELECTED_USER
  payload: User | null
  [key: string]: any
}

export interface SetShowDetailsPopupAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_SHOW_DETAILS_POPUP
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof ADMIN_USERS_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof ADMIN_USERS_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

// Saga action interfaces
export interface FetchUsersRequestAction {
  type: typeof ADMIN_USERS_ACTIONS.FETCH_USERS_REQUEST
  payload?: { showToast?: boolean }
  [key: string]: any
}

export interface FetchUsersSuccessAction {
  type: typeof ADMIN_USERS_ACTIONS.FETCH_USERS_SUCCESS
  payload: User[]
  [key: string]: any
}

export interface FetchUsersFailureAction {
  type: typeof ADMIN_USERS_ACTIONS.FETCH_USERS_FAILURE
  payload: string
  [key: string]: any
}

export interface UpdateUserStatusRequestAction {
  type: typeof ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_REQUEST
  payload: { userId: string; newStatus: 'active' | 'suspend' }
  [key: string]: any
}

export interface UpdateUserStatusSuccessAction {
  type: typeof ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_SUCCESS
  payload: { userId: string; newStatus: 'active' | 'suspend' }
  [key: string]: any
}

export interface UpdateUserStatusFailureAction {
  type: typeof ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_FAILURE
  payload: string
  [key: string]: any
}

export interface UpdateUserBalanceRequestAction {
  type: typeof ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_REQUEST
  payload: { userId: string; newBalance: number }
  [key: string]: any
}

export interface UpdateUserBalanceSuccessAction {
  type: typeof ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_SUCCESS
  payload: { userId: string; newBalance: number }
  [key: string]: any
}

export interface UpdateUserBalanceFailureAction {
  type: typeof ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_FAILURE
  payload: string
  [key: string]: any
}

// Union type for all actions
export type AdminUsersActionTypes = 
  | SetUsersAction
  | SetLoadingAction
  | SetUpdatingAction
  | SetSearchQueryAction
  | SetUserFilterAction
  | SetSelectedUserAction
  | SetShowDetailsPopupAction
  | SetErrorAction
  | ClearErrorAction
  | FetchUsersRequestAction
  | FetchUsersSuccessAction
  | FetchUsersFailureAction
  | UpdateUserStatusRequestAction
  | UpdateUserStatusSuccessAction
  | UpdateUserStatusFailureAction
  | UpdateUserBalanceRequestAction
  | UpdateUserBalanceSuccessAction
  | UpdateUserBalanceFailureAction
