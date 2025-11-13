import { combineReducers } from "redux";
import { userReducer } from "./user";
import { uiReducer } from "./ui";
import { adsSettingsReducer } from "./adsSettings";
import { watchAdsReducer } from "./watchAds";
import { spinWheelReducer } from "./spinWheel";
import { withdrawHistoryReducer } from "./withdrawHistory";
import { botStatusReducer } from "./botStatus";
import { converterReducer } from "./converter/reducer";
import { withdrawReducer } from "./withdraw";
import cryptoCoinsReducer from "./cryptoCoins";
import { tasksReducer } from "./tasks";

// Root reducer combining all module reducers
export const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    adsSettings: adsSettingsReducer,
    watchAds: watchAdsReducer,
    spinWheel: spinWheelReducer,
    withdrawHistory: withdrawHistoryReducer,
    botStatus: botStatusReducer,
    converter: converterReducer,
    withdraw: withdrawReducer,
    cryptoCoins: cryptoCoinsReducer,
     tasks: tasksReducer,
})

// Root state type
export type RootState = ReturnType<typeof rootReducer>