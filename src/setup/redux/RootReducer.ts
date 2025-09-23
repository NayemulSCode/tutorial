import {all} from 'redux-saga/effects'
import {combineReducers} from 'redux'

import * as auth from '../../app/modules/auth'
import onboardingReducer from '../../app/modules/onboarding/onboardingSlice'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  onboarding: onboardingReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga()])
}
