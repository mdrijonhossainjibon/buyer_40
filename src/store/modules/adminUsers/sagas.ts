import { call, put, takeEvery, all } from 'redux-saga/effects'
import { Toast } from 'antd-mobile'
import { AdminUsersAPI } from '@/lib/api/adminUsers'
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
    

    Toast.show({
      content: `User ${newStatus === 'suspend' ? 'suspended' : 'activated'} successfully`,
      position: 'top'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user status'
    yield put(updateUserStatusFailure(errorMessage))

    Toast.show({
      content: 'Failed to update user status',
      position: 'top'
    })
  }
}

// Update user balance saga
function* updateUserBalanceSaga(action: UpdateUserBalanceRequestAction): Generator<any, void, any> {
  try {
    const { userId, newBalance } = action.payload
    const updatedUser: User = yield call(AdminUsersAPI.updateUserBalance, userId, newBalance)

    yield put(updateUserBalanceSuccess(userId, newBalance))

    Toast.show({
      content: 'User balance updated successfully',
      position: 'top'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user balance'
    yield put(updateUserBalanceFailure(errorMessage))

    Toast.show({
      content: 'Failed to update balance',
      position: 'top'
    })
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
