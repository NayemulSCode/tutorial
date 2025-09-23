/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext, useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import Login from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import RegistrationB from './components/RegistrationB'
import ResetPassword from './components/ResetPassword'
import PrivacyPolicy from '../../pages/privacy-terms/PrivacyPolicy'
import WebsiteTerms from '../../pages/privacy-terms/WebsiteTerms'
import BookingTerms from '../../pages/privacy-terms/BookingTerms'
export function AuthPage() {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='https://chuzeday.com/' target='_blank' className='mb-12'>
          <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo.svg')} className='authLogo' />
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div>
          <Switch>
            <Route path='/auth/login/:message?' exact component={Login} />
            {/* <Route path='/auth/registration' component={Registration} /> */}
            <Route path='/auth/registration' component={RegistrationB} />
            <Route path='/auth/forgot-password' component={ForgotPassword} />
            <Route path='/auth/reset-password/:token' component={ResetPassword} />
            <Route path='/privacy-policy' exact component={PrivacyPolicy} />
            <Route path='/website-terms' exact component={WebsiteTerms} />
            <Route path='/booking-terms' exact component={BookingTerms} />
            <Redirect from='/auth' exact={true} to='/auth/login' />
            <Redirect to='/auth/login' />
          </Switch>
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      <div className='d-flex flex-center flex-column-auto p-10 remove d-none'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div>
      {/* end::Footer */}
    </div>
  )
}
