import { all, fork } from 'redux-saga/effects'
import { userSaga } from '../modules/user'
import { botStatusSaga } from '../modules/botStatus'
import { adsSettingsSaga } from '../modules/adsSettings'

// Root saga that combines all module sagas
export function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(botStatusSaga),
    fork(adsSettingsSaga)
  ])
}
