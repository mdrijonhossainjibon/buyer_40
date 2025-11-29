import { WithdrawHistoryState, WithdrawHistoryActionTypes, WITHDRAW_HISTORY_ACTIONS } from './types'

// Initial state
const initialState: WithdrawHistoryState = {
  transactions: [],
  isLoading: false,
  error: null
}

// Reducer
export const withdrawHistoryReducer = (
  state: WithdrawHistoryState = initialState,
  action: WithdrawHistoryActionTypes
): WithdrawHistoryState => {
  switch (action.type) {
    case WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactions: action.payload,
        error: null
      }

    case WITHDRAW_HISTORY_ACTIONS.FETCH_WITHDRAW_HISTORY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case WITHDRAW_HISTORY_ACTIONS.CLEAR_WITHDRAW_HISTORY:
      return {
        ...state,
        transactions: [],
        error: null
      }

    default:
      return state
  }
}

export default withdrawHistoryReducer
