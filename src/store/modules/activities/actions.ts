import {
  ACTIVITIES_ACTIONS,
  SetSearchQueryAction,
  SetStatusFilterAction,
  SetTypeFilterAction,
  SetSelectedActivityAction,
  SetLoadingAction,
  SetLoadingMoreAction,
  SetErrorAction,
  ClearErrorAction,
  ResetPaginationAction,
  FetchActivitiesRequestAction,
  FetchActivitiesSuccessAction,
  FetchActivitiesFailureAction,
  LoadMoreActivitiesRequestAction,
  LoadMoreActivitiesSuccessAction,
  LoadMoreActivitiesFailureAction,
  UpdateActivityStatusRequestAction,
  UpdateActivityStatusSuccessAction,
  UpdateActivityStatusFailureAction,
  ActivitiesState
} from './types'
import { ActivityData } from '@/lib/api/activities'

// UI Action creators
export const setSearchQuery = (payload: string): SetSearchQueryAction => ({
  type: ACTIVITIES_ACTIONS.SET_SEARCH_QUERY,
  payload
})

export const setStatusFilter = (payload: string): SetStatusFilterAction => ({
  type: ACTIVITIES_ACTIONS.SET_STATUS_FILTER,
  payload
})

export const setTypeFilter = (payload: string): SetTypeFilterAction => ({
  type: ACTIVITIES_ACTIONS.SET_TYPE_FILTER,
  payload
})

export const setSelectedActivity = (payload: ActivityData | null): SetSelectedActivityAction => ({
  type: ACTIVITIES_ACTIONS.SET_SELECTED_ACTIVITY,
  payload
})

export const setLoading = (payload: boolean): SetLoadingAction => ({
  type: ACTIVITIES_ACTIONS.SET_LOADING,
  payload
})

export const setLoadingMore = (payload: boolean): SetLoadingMoreAction => ({
  type: ACTIVITIES_ACTIONS.SET_LOADING_MORE,
  payload
})

export const setError = (payload: string | null): SetErrorAction => ({
  type: ACTIVITIES_ACTIONS.SET_ERROR,
  payload
})

export const clearError = (): ClearErrorAction => ({
  type: ACTIVITIES_ACTIONS.CLEAR_ERROR
})

export const resetPagination = (): ResetPaginationAction => ({
  type: ACTIVITIES_ACTIONS.RESET_PAGINATION
})

// Saga action creators
export const fetchActivitiesRequest = (showToast?: boolean): FetchActivitiesRequestAction => ({
  type: ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_REQUEST,
  payload: { showToast }
})

export const fetchActivitiesSuccess = (payload: {
  activities: ActivityData[]
  hasMore: boolean
  stats?: ActivitiesState['stats']
}): FetchActivitiesSuccessAction => ({
  type: ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_SUCCESS,
  payload
})

export const fetchActivitiesFailure = (payload: string): FetchActivitiesFailureAction => ({
  type: ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_FAILURE,
  payload
})

export const loadMoreActivitiesRequest = (): LoadMoreActivitiesRequestAction => ({
  type: ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_REQUEST
})

export const loadMoreActivitiesSuccess = (payload: {
  activities: ActivityData[]
  hasMore: boolean
}): LoadMoreActivitiesSuccessAction => ({
  type: ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_SUCCESS,
  payload
})

export const loadMoreActivitiesFailure = (payload: string): LoadMoreActivitiesFailureAction => ({
  type: ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_FAILURE,
  payload
})

export const updateActivityStatusRequest = (
  activityId: string,
  status: ActivityData['status']
): UpdateActivityStatusRequestAction => ({
  type: ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_REQUEST,
  payload: { activityId, status }
})

export const updateActivityStatusSuccess = (payload: ActivityData): UpdateActivityStatusSuccessAction => ({
  type: ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_SUCCESS,
  payload
})

export const updateActivityStatusFailure = (payload: string): UpdateActivityStatusFailureAction => ({
  type: ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_FAILURE,
  payload
})
