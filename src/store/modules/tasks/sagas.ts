import { call, put, takeLatest } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import { TasksAPI } from '@/lib/api/tasks'
import {
  TASKS_ACTIONS,
  FetchTasksRequestAction,
  ClaimTaskRequestAction
} from './types'
import {
  fetchTasksSuccess,
  fetchTasksFailure,
  claimTaskSuccess,
  claimTaskFailure
} from './actions'
import { updateBalance } from '../user/actions'

// Fetch tasks saga
function* fetchTasksSaga(action: FetchTasksRequestAction): Generator<any, void, any> {
  try {
    const { userId, showToast } = action.payload || {}
    
    if (!userId) {
      yield put(fetchTasksFailure('User ID is required'))
      return
    }

    const response = yield call(TasksAPI.getTasks, userId)

    if (response.success && response.data) {
      yield put(fetchTasksSuccess(response.data))
      
      if (showToast) {
        toast.success('Tasks have been refreshed successfully')
      }
    } else {
      yield put(fetchTasksFailure(response.error || 'Failed to fetch tasks'))
      toast.error(response.error || 'Failed to fetch tasks')
    }
  } catch (error: any) {
    yield put(fetchTasksFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while fetching tasks')
  }
}

// Claim task saga
function* claimTaskSaga(action: ClaimTaskRequestAction): Generator<any, void, any> {
  try {
    const { userId, taskId } = action.payload

    const response = yield call(TasksAPI.claimTask, userId, taskId)

    if (response.success && response.data) {
      const reward = response.data.reward
      
      yield put(claimTaskSuccess(taskId, reward))
      
      // Update user balance
      yield put(updateBalance(reward))
      
      toast.success(`Task Claimed! You earned ${reward} USDT!`)
    } else {
      yield put(claimTaskFailure(response.error || 'Failed to claim task'))
      toast.error(response.error || 'Failed to claim task')
    }
  } catch (error: any) {
    yield put(claimTaskFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while claiming task')
  }
}

// Root saga
export function* tasksSaga() {
  yield takeLatest(TASKS_ACTIONS.FETCH_TASKS_REQUEST, fetchTasksSaga)
  yield takeLatest(TASKS_ACTIONS.CLAIM_TASK_REQUEST, claimTaskSaga)
}
