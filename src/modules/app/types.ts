// App action types
export const APP_ACTIONS = {
  FETCH_ALL_REQUEST: 'APP/FETCH_ALL_REQUEST',
  FETCH_ALL_SUCCESS: 'APP/FETCH_ALL_SUCCESS',
  FETCH_ALL_FAILURE: 'APP/FETCH_ALL_FAILURE',
} as const

// Action interfaces
export interface FetchAllRequestAction {
  type: typeof APP_ACTIONS.FETCH_ALL_REQUEST
}

export interface FetchAllSuccessAction {
  type: typeof APP_ACTIONS.FETCH_ALL_SUCCESS
}

export interface FetchAllFailureAction {
  type: typeof APP_ACTIONS.FETCH_ALL_FAILURE
  payload: string
}

// Union type for all app actions
export type AppAction =
  | FetchAllRequestAction
  | FetchAllSuccessAction
  | FetchAllFailureAction
