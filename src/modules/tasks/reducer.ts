import {
  TASKS_ACTIONS,
  TasksState,
  TasksActionTypes
} from './types'

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null
}

export const tasksReducer = (
  state = initialState,
  action: TasksActionTypes
): TasksState => {
  switch (action.type) {
    case TASKS_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload
      }

    case TASKS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case TASKS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case TASKS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case TASKS_ACTIONS.FETCH_TASKS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case TASKS_ACTIONS.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        error: null
      }

    case TASKS_ACTIONS.FETCH_TASKS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case TASKS_ACTIONS.CLAIM_TASK_REQUEST:
      return {
        ...state,
        error: null
      }

    case TASKS_ACTIONS.CLAIM_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, claimed: true }
            : task
        ),
        error: null
      }

    case TASKS_ACTIONS.CLAIM_TASK_FAILURE:
      return {
        ...state,
        error: action.payload
      }

    default:
      return state
  }
}
