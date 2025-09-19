import { ActivityData, ActivityListRequest } from '@/lib/api/activities'

// Activities state interface
export interface ActivitiesState {
  activities: ActivityData[]
  selectedActivity: ActivityData | null
  searchQuery: string
  statusFilter: string
  typeFilter: string
  pagination: {
    offset: number
    limit: number
    hasMore: boolean
  }
  stats: {
    total: number
    pending: number
    completed: number
    failed: number
    cancelled: number
    totalAmount: number
  }
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
}

// Action types
export const ACTIVITIES_ACTIONS = {
  // UI Actions
  SET_SEARCH_QUERY: 'SET_ACTIVITIES_SEARCH_QUERY',
  SET_STATUS_FILTER: 'SET_ACTIVITIES_STATUS_FILTER',
  SET_TYPE_FILTER: 'SET_ACTIVITIES_TYPE_FILTER',
  SET_SELECTED_ACTIVITY: 'SET_SELECTED_ACTIVITY',
  SET_LOADING: 'SET_ACTIVITIES_LOADING',
  SET_LOADING_MORE: 'SET_ACTIVITIES_LOADING_MORE',
  SET_ERROR: 'SET_ACTIVITIES_ERROR',
  CLEAR_ERROR: 'CLEAR_ACTIVITIES_ERROR',
  RESET_PAGINATION: 'RESET_ACTIVITIES_PAGINATION',
  // Saga Actions
  FETCH_ACTIVITIES_REQUEST: 'FETCH_ACTIVITIES_REQUEST',
  FETCH_ACTIVITIES_SUCCESS: 'FETCH_ACTIVITIES_SUCCESS',
  FETCH_ACTIVITIES_FAILURE: 'FETCH_ACTIVITIES_FAILURE',
  LOAD_MORE_ACTIVITIES_REQUEST: 'LOAD_MORE_ACTIVITIES_REQUEST',
  LOAD_MORE_ACTIVITIES_SUCCESS: 'LOAD_MORE_ACTIVITIES_SUCCESS',
  LOAD_MORE_ACTIVITIES_FAILURE: 'LOAD_MORE_ACTIVITIES_FAILURE',
  UPDATE_ACTIVITY_STATUS_REQUEST: 'UPDATE_ACTIVITY_STATUS_REQUEST',
  UPDATE_ACTIVITY_STATUS_SUCCESS: 'UPDATE_ACTIVITY_STATUS_SUCCESS',
  UPDATE_ACTIVITY_STATUS_FAILURE: 'UPDATE_ACTIVITY_STATUS_FAILURE'
} as const

// Action interfaces
export interface SetSearchQueryAction {
  type: typeof ACTIVITIES_ACTIONS.SET_SEARCH_QUERY
  payload: string
  [key: string]: any
}

export interface SetStatusFilterAction {
  type: typeof ACTIVITIES_ACTIONS.SET_STATUS_FILTER
  payload: string
  [key: string]: any
}

export interface SetTypeFilterAction {
  type: typeof ACTIVITIES_ACTIONS.SET_TYPE_FILTER
  payload: string
  [key: string]: any
}

export interface SetSelectedActivityAction {
  type: typeof ACTIVITIES_ACTIONS.SET_SELECTED_ACTIVITY
  payload: ActivityData | null
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof ACTIVITIES_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetLoadingMoreAction {
  type: typeof ACTIVITIES_ACTIONS.SET_LOADING_MORE
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof ACTIVITIES_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof ACTIVITIES_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

export interface ResetPaginationAction {
  type: typeof ACTIVITIES_ACTIONS.RESET_PAGINATION
  [key: string]: any
}

// Saga action interfaces
export interface FetchActivitiesRequestAction {
  type: typeof ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_REQUEST
  payload?: { showToast?: boolean }
  [key: string]: any
}

export interface FetchActivitiesSuccessAction {
  type: typeof ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_SUCCESS
  payload: {
    activities: ActivityData[]
    hasMore: boolean
    stats?: ActivitiesState['stats']
  }
  [key: string]: any
}

export interface FetchActivitiesFailureAction {
  type: typeof ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_FAILURE
  payload: string
  [key: string]: any
}

export interface LoadMoreActivitiesRequestAction {
  type: typeof ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_REQUEST
  [key: string]: any
}

export interface LoadMoreActivitiesSuccessAction {
  type: typeof ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_SUCCESS
  payload: {
    activities: ActivityData[]
    hasMore: boolean
  }
  [key: string]: any
}

export interface LoadMoreActivitiesFailureAction {
  type: typeof ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_FAILURE
  payload: string
  [key: string]: any
}

export interface UpdateActivityStatusRequestAction {
  type: typeof ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_REQUEST
  payload: {
    activityId: string
    status: ActivityData['status']
  }
  [key: string]: any
}

export interface UpdateActivityStatusSuccessAction {
  type: typeof ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_SUCCESS
  payload: ActivityData
  [key: string]: any
}

export interface UpdateActivityStatusFailureAction {
  type: typeof ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_FAILURE
  payload: string
  [key: string]: any
}

export type ActivitiesActionTypes = 
  | SetSearchQueryAction
  | SetStatusFilterAction
  | SetTypeFilterAction
  | SetSelectedActivityAction
  | SetLoadingAction
  | SetLoadingMoreAction
  | SetErrorAction
  | ClearErrorAction
  | ResetPaginationAction
  | FetchActivitiesRequestAction
  | FetchActivitiesSuccessAction
  | FetchActivitiesFailureAction
  | LoadMoreActivitiesRequestAction
  | LoadMoreActivitiesSuccessAction
  | LoadMoreActivitiesFailureAction
  | UpdateActivityStatusRequestAction
  | UpdateActivityStatusSuccessAction
  | UpdateActivityStatusFailureAction
