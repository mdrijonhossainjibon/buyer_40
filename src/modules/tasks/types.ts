// Task data interface
export interface Task {
  id: string
  platform: string
  title: string
  description: string
  reward: string
  link: string
  claimed: boolean
  icon?: string // SVG path data or image URL
  iconColor?: string // Tailwind color class
  buttonColor?: string // Hex color or CSS color
  buttonLabel?: string // Button text label
}

// Tasks state interface
export interface TasksState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}

// Action types
export const TASKS_ACTIONS = {
  SET_TASKS: 'SET_TASKS',
  SET_LOADING: 'SET_TASKS_LOADING',
  SET_ERROR: 'SET_TASKS_ERROR',
  CLEAR_ERROR: 'CLEAR_TASKS_ERROR',
  // Saga actions
  FETCH_TASKS_REQUEST: 'FETCH_TASKS_REQUEST',
  FETCH_TASKS_SUCCESS: 'FETCH_TASKS_SUCCESS',
  FETCH_TASKS_FAILURE: 'FETCH_TASKS_FAILURE',
  CLAIM_TASK_REQUEST: 'CLAIM_TASK_REQUEST',
  CLAIM_TASK_SUCCESS: 'CLAIM_TASK_SUCCESS',
  CLAIM_TASK_FAILURE: 'CLAIM_TASK_FAILURE'
} as const

// Action interfaces
export interface SetTasksAction {
  type: typeof TASKS_ACTIONS.SET_TASKS
  payload: Task[]
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof TASKS_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof TASKS_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof TASKS_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

// Saga action interfaces
export interface FetchTasksRequestAction {
  type: typeof TASKS_ACTIONS.FETCH_TASKS_REQUEST
  payload?: { userId: number; showToast?: boolean }
  [key: string]: any
}

export interface FetchTasksSuccessAction {
  type: typeof TASKS_ACTIONS.FETCH_TASKS_SUCCESS
  payload: Task[]
  [key: string]: any
}

export interface FetchTasksFailureAction {
  type: typeof TASKS_ACTIONS.FETCH_TASKS_FAILURE
  payload: string
  [key: string]: any
}

export interface ClaimTaskRequestAction {
  type: typeof TASKS_ACTIONS.CLAIM_TASK_REQUEST
  payload: {  taskId: string }
  [key: string]: any
}

export interface ClaimTaskSuccessAction {
  type: typeof TASKS_ACTIONS.CLAIM_TASK_SUCCESS
  payload: { taskId: string; reward: number }
  [key: string]: any
}

export interface ClaimTaskFailureAction {
  type: typeof TASKS_ACTIONS.CLAIM_TASK_FAILURE
  payload: string
  [key: string]: any
}

export type TasksActionTypes = 
  | SetTasksAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | FetchTasksRequestAction
  | FetchTasksSuccessAction
  | FetchTasksFailureAction
  | ClaimTaskRequestAction
  | ClaimTaskSuccessAction
  | ClaimTaskFailureAction
