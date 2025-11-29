import { createStore, applyMiddleware, Dispatch, AnyAction } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootReducer, RootState ,  rootSaga} from 'modules'
 
import { composeWithDevTools } from '@redux-devtools/extension'

// Create saga middleware
const sagaMiddleware = createSagaMiddleware()

// Create Redux store with saga middleware + DevTools
export const store = createStore(
  rootReducer as any,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

// Run the root saga
sagaMiddleware.run(rootSaga)

// Export types
export type { RootState }
export type AppDispatch = Dispatch<AnyAction>

// Export store as default
export default store
