import {all} from 'redux-saga/effects'
import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import * as auth from '../../app/modules/auth'
import onboardingReducer from '../../app/modules/onboarding/onboardingSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['onboarding'],
}

const appReducer = combineReducers({
  auth: auth.reducer,
  onboarding: onboardingReducer,
})

export const rootReducer = persistReducer(persistConfig, appReducer)

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga()])
}
