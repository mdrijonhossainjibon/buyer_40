import { ActivitiesState, ActivitiesActionTypes, ACTIVITIES_ACTIONS } from './types'

const initialState: ActivitiesState = {
  activities: [],
  selectedActivity: null,
  searchQuery: '',
  statusFilter: 'all',
  typeFilter: 'all',
  pagination: {
    offset: 0,
    limit: 20,
    hasMore: false
  },
  stats: {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    totalAmount: 0
  },
  isLoading: false,
  isLoadingMore: false,
  error: null
}

export const activitiesReducer = (
  state: ActivitiesState = initialState,
  action: ActivitiesActionTypes
): ActivitiesState => {
  switch (action.type) {
    case ACTIVITIES_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        pagination: { ...initialState.pagination } // Reset pagination when search changes
      }

    case ACTIVITIES_ACTIONS.SET_STATUS_FILTER:
      return {
        ...state,
        statusFilter: action.payload,
        pagination: { ...initialState.pagination } // Reset pagination when filter changes
      }

    case ACTIVITIES_ACTIONS.SET_TYPE_FILTER:
      return {
        ...state,
        typeFilter: action.payload,
        pagination: { ...initialState.pagination } // Reset pagination when filter changes
      }

    case ACTIVITIES_ACTIONS.SET_SELECTED_ACTIVITY:
      return {
        ...state,
        selectedActivity: action.payload
      }

    case ACTIVITIES_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case ACTIVITIES_ACTIONS.SET_LOADING_MORE:
      return {
        ...state,
        isLoadingMore: action.payload
      }

    case ACTIVITIES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isLoadingMore: false
      }

    case ACTIVITIES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case ACTIVITIES_ACTIONS.RESET_PAGINATION:
      return {
        ...state,
        pagination: { ...initialState.pagination }
      }

    case ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        activities: action.payload.activities,
        pagination: {
          offset: action.payload.activities.length,
          limit: state.pagination.limit,
          hasMore: action.payload.hasMore
        },
        stats: action.payload.stats || state.stats,
        isLoading: false,
        error: null
      }

    case ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_REQUEST:
      return {
        ...state,
        isLoadingMore: true,
        error: null
      }

    case ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_SUCCESS:
      return {
        ...state,
        activities: [...state.activities, ...action.payload.activities],
        pagination: {
          ...state.pagination,
          offset: state.pagination.offset + action.payload.activities.length,
          hasMore: action.payload.hasMore
        },
        isLoadingMore: false,
        error: null
      }

    case ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_FAILURE:
      return {
        ...state,
        isLoadingMore: false,
        error: action.payload
      }

    case ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_REQUEST:
      return {
        ...state,
        error: null
      }

    case ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_SUCCESS:
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity._id === action.payload._id ? action.payload : activity
        ),
        selectedActivity: state.selectedActivity?._id === action.payload._id 
          ? action.payload 
          : state.selectedActivity,
        error: null
      }

    case ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload
      }

    default:
      return state
  }
}
