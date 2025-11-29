import {
  TASKS_ACTIONS,
  Task,
  SetTasksAction,
  SetLoadingAction,
  SetErrorAction,
  ClearErrorAction,
  FetchTasksRequestAction,
  FetchTasksSuccessAction,
  FetchTasksFailureAction,
  ClaimTaskRequestAction,
  ClaimTaskSuccessAction,
  ClaimTaskFailureAction
} from './types'

// State management actions
export const setTasks = (tasks: Task[]): SetTasksAction => ({
  type: TASKS_ACTIONS.SET_TASKS,
  payload: tasks
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: TASKS_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setError = (error: string | null): SetErrorAction => ({
  type: TASKS_ACTIONS.SET_ERROR,
  payload: error
})

export const clearError = (): ClearErrorAction => ({
  type: TASKS_ACTIONS.CLEAR_ERROR
})

// Saga actions
export const fetchTasksRequest = (userId: number, showToast?: boolean): FetchTasksRequestAction => ({
  type: TASKS_ACTIONS.FETCH_TASKS_REQUEST,
  payload: { userId, showToast }
})

export const fetchTasksSuccess = (tasks: Task[]): FetchTasksSuccessAction => ({
  type: TASKS_ACTIONS.FETCH_TASKS_SUCCESS,
  payload: tasks
})

export const fetchTasksFailure = (error: string): FetchTasksFailureAction => ({
  type: TASKS_ACTIONS.FETCH_TASKS_FAILURE,
  payload: error
})

export const claimTaskRequest = ( taskId: string): ClaimTaskRequestAction => ({
  type: TASKS_ACTIONS.CLAIM_TASK_REQUEST,
  payload: {   taskId }
})

export const claimTaskSuccess = (taskId: string, reward: number): ClaimTaskSuccessAction => ({
  type: TASKS_ACTIONS.CLAIM_TASK_SUCCESS,
  payload: { taskId, reward }
})

export const claimTaskFailure = (error: string): ClaimTaskFailureAction => ({
  type: TASKS_ACTIONS.CLAIM_TASK_FAILURE,
  payload: error
})
