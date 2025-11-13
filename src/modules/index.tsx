import { all, fork } from 'redux-saga/effects';
import { socketSaga } from './socket';
import { spinWheelSaga } from './spinWheel';
import { adsSettingsSaga } from './adsSettings';
import { watchAdsSaga } from './watchAds';
import { withdrawHistorySaga } from './withdrawHistory';



export function* rootSaga() {
    yield all([
        fork(socketSaga),
        fork(spinWheelSaga),
        fork(adsSettingsSaga),
        fork(watchAdsSaga),
        fork(withdrawHistorySaga),
    ])
}


export * from './app';
export * from './socket';