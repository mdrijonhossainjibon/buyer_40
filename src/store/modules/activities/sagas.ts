import { call, put, takeEvery, select } from 'redux-saga/effects'
import { 
  ACTIVITIES_ACTIONS,
  FetchActivitiesRequestAction,
  LoadMoreActivitiesRequestAction,
  UpdateActivityStatusRequestAction,
  ActivitiesState
} from './types'
import { 
  fetchActivitiesSuccess,
  fetchActivitiesFailure,
  loadMoreActivitiesSuccess,
  loadMoreActivitiesFailure,
  updateActivityStatusSuccess,
  updateActivityStatusFailure
} from './actions'
import ActivityAPI from '@/lib/api/activities'
import { Toast } from 'antd-mobile'
import { RootState } from '@/store/rootReducer'

// Fetch activities saga
function* fetchActivitiesSaga(action: FetchActivitiesRequestAction): Generator<any, void, any> {
  try {
    const state: ActivitiesState = yield select((state: RootState) => state.activities)
    
    const response: any = yield call(ActivityAPI.listActivities, {
      search: state.searchQuery,
      status: state.statusFilter,
      activityType: state.typeFilter,
      limit: state.pagination.limit,
      offset: 0, // Always start from 0 for fresh fetch
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    if (response.success && response.data) {
      yield put(fetchActivitiesSuccess({
        activities: response.data.activities,
        hasMore: response.data.hasMore,
        stats: response.data.stats
      }))
      
      if (action.payload?.showToast) {
        Toast.show({
          content: 'Activities refreshed successfully',
          duration: 2000
        })
      }
    } else {
      yield put(fetchActivitiesFailure(response.error || 'Failed to fetch activities'))
      
      Toast.show({
        content: response.error || 'Failed to load activities',
        duration: 3000
      })
    }
  } catch (error: any) {
    yield put(fetchActivitiesFailure(error.message || 'Failed to fetch activities'))
    
    Toast.show({
      content: 'Failed to load activities',
      duration: 3000
    })
  }
}

// Load more activities saga
function* loadMoreActivitiesSaga(action: LoadMoreActivitiesRequestAction): Generator<any, void, any> {
  try {
    const state: ActivitiesState = yield select((state: RootState) => state.activities)
    
    const response: any = yield call(ActivityAPI.listActivities, {
      search: state.searchQuery,
      status: state.statusFilter,
      activityType: state.typeFilter,
      limit: state.pagination.limit,
      offset: state.pagination.offset,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    if (response.success && response.data) {
      yield put(loadMoreActivitiesSuccess({
        activities: response.data.activities,
        hasMore: response.data.hasMore
      }))
    } else {
      yield put(loadMoreActivitiesFailure(response.error || 'Failed to load more activities'))
      
      Toast.show({
        content: response.error || 'Failed to load more activities',
        duration: 3000
      })
    }
  } catch (error: any) {
    yield put(loadMoreActivitiesFailure(error.message || 'Failed to load more activities'))
    
    Toast.show({
      content: 'Failed to load more activities',
      duration: 3000
    })
  }
}

// Update activity status saga
function* updateActivityStatusSaga(action: UpdateActivityStatusRequestAction): Generator<any, void, any> {
  try {
    const { activityId, status } = action.payload
    
    const response: any = yield call(ActivityAPI.updateActivityStatus, activityId, status)
    
    if (response.success && response.data) {
      yield put(updateActivityStatusSuccess(response.data))
      
      Toast.show({
        content: `Activity status updated to ${status}`,
        duration: 2000
      })
    } else {
      yield put(updateActivityStatusFailure(response.error || 'Failed to update activity status'))
      
      Toast.show({
        content: response.error || 'Failed to update activity status',
        duration: 3000
      })
    }
  } catch (error: any) {
    yield put(updateActivityStatusFailure(error.message || 'Failed to update activity status'))
    
    Toast.show({
      content: 'Failed to update activity status',
      duration: 3000
    })
  }
}

// Watcher saga
export function* activitiesSaga() {
  yield takeEvery(ACTIVITIES_ACTIONS.FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga)
  yield takeEvery(ACTIVITIES_ACTIONS.LOAD_MORE_ACTIVITIES_REQUEST, loadMoreActivitiesSaga)
  yield takeEvery(ACTIVITIES_ACTIONS.UPDATE_ACTIVITY_STATUS_REQUEST, updateActivityStatusSaga)
}
