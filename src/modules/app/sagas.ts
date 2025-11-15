import { call, put, takeLatest, all } from 'redux-saga/effects'
import { APP_ACTIONS } from './types'
import { fetchAllSuccess, fetchAllFailure } from './actions'
import { fetchTasksRequest } from '../tasks/actions'
import { fetchSpinConfigRequest, fetchUserTicketsRequest } from '../spinWheel/actions'
import { fetchAdsSettingsRequest } from '../adsSettings/actions'
import { fetchAdStatusRequest } from '../watchAds/actions'
import { fetchBotStatusRequest } from '../botStatus/actions'
import { fetchWithdrawHistoryRequest } from '../withdrawHistory/actions'
import { getCurrentUser } from 'lib/getCurrentUser'
import toast from 'react-hot-toast'

/**
 * Fetch all data saga
 * This saga dispatches all the necessary fetch actions to load initial data
 */
function* fetchAllDataSaga(): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser()
    const userId = currentUser.telegramId

    // Dispatch all fetch actions in parallel
    yield all([
      put(fetchTasksRequest(userId)),
      put(fetchSpinConfigRequest(userId)),
      put(fetchUserTicketsRequest(userId)),
      put(fetchAdsSettingsRequest()),
      put(fetchAdStatusRequest()),
      put(fetchBotStatusRequest()),
      put(fetchWithdrawHistoryRequest(userId)),

    ])

    yield put(fetchAllSuccess())
    console.log('[AppSaga] All data fetched successfully')
  } catch (error: any) {
    console.error('[AppSaga] Error fetching all data:', error)
    yield put(fetchAllFailure(error.message || 'Failed to fetch all data'))
    toast.error('Failed to load app data')
  }
}

/**
 * Root app saga
 */
export function* appSaga() {
  yield takeLatest(APP_ACTIONS.FETCH_ALL_REQUEST, fetchAllDataSaga)
}
