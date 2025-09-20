import { call, put, takeEvery, all } from 'redux-saga/effects'
import { Toast } from 'antd-mobile'
import {
  ADMIN_USERS_ACTIONS,
  FetchUsersRequestAction,
  UpdateUserStatusRequestAction,
  UpdateUserBalanceRequestAction,
  User
} from './types'
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  updateUserBalanceSuccess,
  updateUserBalanceFailure
} from './actions'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
import { toast } from 'react-toastify'

// Fetch users saga
function* fetchUsersSaga(action: FetchUsersRequestAction): Generator<any, void, any> {
  try {

    const { response } = yield call(API_CALL, {
      baseURL, url: '/admin/users', method: 'POST', body: JSON.stringify({
        action: 'list-users',
        ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || '')
      })
    });

    yield put(fetchUsersSuccess(response.data.users))

    // Show toast if requested
    if (action.payload?.showToast) {
      Toast.show({
        content: 'Users refreshed successfully',
        position: 'top'
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users'
    yield put(fetchUsersFailure(errorMessage))

    Toast.show({
      content: 'Error loading users',
      position: 'top'
    })
  }
}

// Update user status saga
function* updateUserStatusSaga(action: UpdateUserStatusRequestAction): Generator<any, void, any> {
  try {
    const { userId, newStatus } = action.payload;

    const { response, status } = yield call(API_CALL, {  baseURL,  url: '/admin/users',  method: 'POST',
      body: JSON.stringify({
        action: 'update-user-status',
        userId,
        newStatus,
        ...generateSignature('admin',  process.env.NEXT_PUBLIC_SECRET_KEY || '')
      })
    })

   if(status === 200 ){
    yield put(updateUserStatusSuccess(userId, newStatus))
   }
    

  toast.success(`User ${newStatus === 'suspend' ? 'suspended' : 'activated'} successfully`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user status'
    yield put(updateUserStatusFailure(errorMessage))

   toast.error('Failed to update user status')
  }
}

// Update user balance saga
function* updateUserBalanceSaga(action: UpdateUserBalanceRequestAction): Generator<any, void, any> {
  try {
    const { userId, newBalance } = action.payload
   const { } = yield call(API_CALL, { baseURL , url : '/admin/users' , method : 'POST' , body :  JSON.stringify({
    action: 'update-user-balance',
    userId,
    newBalance,
    ...generateSignature('admin',   process.env.NEXT_PUBLIC_SECRET_KEY || '')
  })})  
   
    yield put(updateUserBalanceSuccess(userId, newBalance))

    toast('User balance updated successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user balance'
    yield put(updateUserBalanceFailure(errorMessage))

    toast('Failed to update balance' )
  }
}

// Root saga for admin users
export function* adminUsersSaga() {
  yield all([
    takeEvery(ADMIN_USERS_ACTIONS.FETCH_USERS_REQUEST, fetchUsersSaga),
    takeEvery(ADMIN_USERS_ACTIONS.UPDATE_USER_STATUS_REQUEST, updateUserStatusSaga),
    takeEvery(ADMIN_USERS_ACTIONS.UPDATE_USER_BALANCE_REQUEST, updateUserBalanceSaga)
  ])
}
