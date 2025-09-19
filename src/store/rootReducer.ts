import { combineReducers } from 'redux'
import { userReducer } from './modules/user'
import { botStatusReducer } from './modules/botStatus'
import { adsSettingsReducer } from './modules/adsSettings'
import { activitiesReducer } from './modules/activities'

// Root reducer combining all module reducers
export const rootReducer = combineReducers({
  user: userReducer,
  botStatus: botStatusReducer,
  adsSettings: adsSettingsReducer,
  activities: activitiesReducer
})

// Root state type
export type RootState = ReturnType<typeof rootReducer>
