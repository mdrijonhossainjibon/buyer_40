import { 
  AdminUsersState, 
  AdminUsersActionTypes, 
  ADMIN_USERS_ACTIONS 
} from './types'

// Initial state
const initialState: AdminUsersState = {
  users: [],
  isLoading: false,
  isUpdating: false,
  searchQuery: '',
  userFilter: 'all',
  selectedUser: null,
  showDetailsPopup: false,
  error: null
}

// Admin users reducer
export const adminUsersReducer = (
  state: AdminUsersState = initialState,
  action: AdminUsersActionTypes
): AdminUsersState => {
  switch (action.type) {
    case ADMIN_USERS_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload,
        error: null
      }

    case ADMIN_USERS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case ADMIN_USERS_ACTIONS.SET_UPDATING:
      return {
        ...state,
        isUpdating: action.payload
      }

    case ADMIN_USERS_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      }

    case ADMIN_USERS_ACTIONS.SET_USER_FILTER:
      return {
        ...state,
        userFilter: action.payload
      }

    case ADMIN_USERS_ACTIONS.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload
      }

    case ADMIN_USERS_ACTIONS.SET_SHOW_DETAILS_POPUP:
      return {
        ...state,
        showDetailsPopup: action.payload
      }

    case ADMIN_USERS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case ADMIN_USERS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    // Saga actions handling
    case ADMIN_USERS_ACTIONS.FETCH_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case ADMIN_USERS_ACTIONS.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        isLoading: false,
        error: null
      }

    case ADMIN_USERS_ACTIONS.FETCH_USERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_REQUEST:
    case ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_REQUEST:
      return {
        ...state,
        isUpdating: true,
        error: null
      }

    case ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        users: state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, status: action.payload.newStatus }
            : user
        ),
        error: null
      }

    case ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        users: state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, totalEarnings: action.payload.newBalance }
            : user
        ),
        error: null
      }

    case ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_FAILURE:
    case ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_FAILURE:
      return {
        ...state,
        isUpdating: false,
        error: action.payload
      }

    default:
      return state
  }
}
