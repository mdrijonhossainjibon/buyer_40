import { combineReducers } from 'redux'
import { userReducer } from './modules/user'
import { botStatusReducer } from './modules/botStatus'
import { adsSettingsReducer } from './modules/adsSettings'
import { activitiesReducer } from './modules/activities'
import { withdrawReducer } from './modules/withdraw'
import { adminUsersReducer } from './modules/adminUsers'
import { adminWithdrawalsReducer } from './modules/adminWithdrawals'
import { tasksReducer } from './modules/tasks'
import { spinWheelReducer } from './modules/spinWheel'
import { converterReducer } from './modules/converter/reducer'

// Root reducer combining all module reducers
export const rootReducer = combineReducers({
  user: userReducer,
  botStatus: botStatusReducer,
  adsSettings: adsSettingsReducer,
  activities: activitiesReducer,
  withdraw: withdrawReducer,
  adminUsers: adminUsersReducer,
  adminWithdrawals: adminWithdrawalsReducer,
  tasks: tasksReducer,
  spinWheel: spinWheelReducer,
  converter: converterReducer
})

// Root state type
export type RootState = ReturnType<typeof rootReducer>
