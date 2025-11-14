import { call, put, takeLatest } from 'redux-saga/effects'
 
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string'
import {
  TASKS_ACTIONS,
  ClaimTaskRequestAction
} from './types'
import {
  fetchTasksSuccess,
  fetchTasksFailure,
  claimTaskSuccess,
  claimTaskFailure
} from './actions'
import { getCurrentUser } from 'lib/getCurrentUser';
import toast from 'react-hot-toast'

// Fetch tasks saga
function* fetchTasksSaga(): Generator<any, void, any> {
  const currentUser  = getCurrentUser();
  const { hash , signature , timestamp  } =  generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
  const {  success , data , error , message } = yield call(API_CALL, {
    baseURL,
    url: `/tasks/`,
    method: 'GET',
    params : { hash , signature , timestamp }
  })

  if (success && data) {
    yield put(fetchTasksSuccess(data))

  } else {
    yield put(fetchTasksFailure(error || 'Failed to fetch tasks'))
     toast.error(error || 'Failed to fetch tasks')
  }
}

// Claim task saga
function* claimTaskSaga(action: ClaimTaskRequestAction): Generator<any, void, any> {
  const {   taskId } = action.payload
 const currentUser  = getCurrentUser();
 const { hash , signature , timestamp  } =  generateSignature(JSON.stringify({ ...currentUser , taskId }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
  const { success , data , error , message } = yield call(API_CALL, {
    baseURL,
    url: '/tasks/claim',
    method: 'POST',
    body: JSON.stringify({  hash , signature , timestamp })
  })

  if (success && data) {
    const reward = data.reward
    
    yield put(claimTaskSuccess(taskId, reward))
    
    toast.success(message)
  } else {
    yield put(claimTaskFailure(error || 'Failed to claim task'))
    toast.error(error || data?.error || 'Failed to claim task')
  }
}

// Root saga
export function* tasksSaga() {
  yield takeLatest(TASKS_ACTIONS.FETCH_TASKS_REQUEST, fetchTasksSaga)
  yield takeLatest(TASKS_ACTIONS.CLAIM_TASK_REQUEST, claimTaskSaga)
}
