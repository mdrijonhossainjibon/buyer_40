import {
  APP_ACTIONS,
  FetchAllRequestAction,
  FetchAllSuccessAction,
  FetchAllFailureAction
} from './types'

// Fetch all data action creators
export const fetchAllActions = (): FetchAllRequestAction => ({
  type: APP_ACTIONS.FETCH_ALL_REQUEST
})

export const fetchAllSuccess = (): FetchAllSuccessAction => ({
  type: APP_ACTIONS.FETCH_ALL_SUCCESS
})

export const fetchAllFailure = (error: string): FetchAllFailureAction => ({
  type: APP_ACTIONS.FETCH_ALL_FAILURE,
  payload: error
})
