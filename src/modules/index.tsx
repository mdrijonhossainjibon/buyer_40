import { all, fork } from 'redux-saga/effects';
import { socketSaga } from './socket';
import { spinWheelSaga } from './spinWheel';
import { adsSettingsSaga } from './adsSettings';
import { watchAdsSaga } from './watchAds';
import { withdrawHistorySaga } from './withdrawHistory';
import { botStatusSaga } from './botStatus';
import { converterSaga } from './converter/sagas';
import { converterSocketSaga } from './converter';
import { withdrawSaga } from './withdraw';
import { watchCryptoCoins } from './cryptoCoins';
import { tasksSaga } from './tasks';



export function* rootSaga() {
    yield all([
        fork(socketSaga),
        fork(spinWheelSaga),
        fork(adsSettingsSaga),
        fork(watchAdsSaga),
        fork(withdrawHistorySaga),
        fork(botStatusSaga),
        fork(converterSaga),
        fork(converterSocketSaga),
        fork(withdrawSaga),
        fork(watchCryptoCoins),
        fork(tasksSaga),
    ])
}


export * from './app';
export * from './socket';
export * from './converter';
export * from './withdraw';
