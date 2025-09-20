import { combineReducers } from 'redux'
import { userReducer } from './modules/user'
import { botStatusReducer } from './modules/botStatus'
import { adsSettingsReducer } from './modules/adsSettings'
import { activitiesReducer } from './modules/activities'
import { withdrawReducer } from './modules/withdraw'

// Root reducer combining all module reducers
export const rootReducer = combineReducers({
  user: userReducer,
  botStatus: botStatusReducer,
  adsSettings: adsSettingsReducer,
  activities: activitiesReducer,
  withdraw: withdrawReducer
})

// Root state type
export type RootState = ReturnType<typeof rootReducer>
