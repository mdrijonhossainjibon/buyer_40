import { combineReducers } from 'redux'
import { userReducer } from './modules/user'
import { botStatusReducer } from './modules/botStatus'

// Root reducer combining all module reducers
export const rootReducer = combineReducers({
  user: userReducer,
  botStatus: botStatusReducer
})

// Root state type
export type RootState = ReturnType<typeof rootReducer>
