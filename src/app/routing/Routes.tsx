/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {FC, useContext, useEffect} from 'react'
import {Redirect, Switch, Route, Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {PrivateRoutes} from './PrivateRoutes'
import {Logout, AuthPage} from '../modules/auth'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {RootState} from '../../setup'
import { AppContext } from '../../context/Context'
import {setOnboardingActive} from '../modules/onboarding/onboardingSlice'
import CookieConsent from "react-cookie-consent";

const Routes: FC = () => {
  const {token} = useContext(AppContext)
  const isAuthorized = localStorage.getItem('token') || token;
  const user = useSelector((state: RootState) => state.auth.user)
  console.log("🚀 ~ Routes ~ user:", user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthorized ) {
      dispatch(setOnboardingActive(true))
    } 
  }, [isAuthorized, user, dispatch])

  const handleCookieAccept = () => {
    console.log('accept cookie')
  }
  const handleCookieDecline = () => {
    console.log('decline cookie')
  }
  return (
    <Switch>
      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route>
          <AuthPage />
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from='/auth' to='/home' />
      )}

      <Route path='/error' component={ErrorsPage} />
      <Route path='/logout' component={Logout} />

      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Redirect to='/auth/login' />
      ) : (
        <MasterLayout>
          <PrivateRoutes />
            {/* <CookieConsent
              location="bottom"
              buttonText="Accept!"
              declineButtonText="Decline"
              enableDeclineButton
              cookieName="cookiecontent"
              style={{ background: "#2B373B" }}
              buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
              declineButtonStyle={{ background: '#dd0b0b', color: "#fff", fontSize: "13px" }}
              expires={150}
              onAccept={handleCookieAccept}
              onDecline={handleCookieDecline}
            >
              This helps us to provide you with a good experience when you browse our Sites and also allows us to improve our Sites.{" "}
              
              <Link to='/cookie-policy'><span style={{ color: "red"}}>Cookie Policy</span></Link>
            </CookieConsent> */}
        </MasterLayout>
        
      )}
    </Switch>
  )
}

export {Routes}
