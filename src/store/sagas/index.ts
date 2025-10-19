import { all, fork } from 'redux-saga/effects'
import { userSaga } from '../modules/user'
import { botStatusSaga } from '../modules/botStatus'
import { adsSettingsSaga } from '../modules/adsSettings'
import { activitiesSaga } from '../modules/activities'
import { withdrawSaga } from '../modules/withdraw'
import { adminUsersSaga } from '../modules/adminUsers'
import { adminWithdrawalsSaga } from '../modules/adminWithdrawals'
import { tasksSaga } from '../modules/tasks'

// Root saga that combines all module sagas
export function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(botStatusSaga),
    fork(adsSettingsSaga),
    fork(activitiesSaga),
    fork(withdrawSaga),
    fork(adminUsersSaga),
    fork(adminWithdrawalsSaga),
    fork(tasksSaga)
  ])
}
