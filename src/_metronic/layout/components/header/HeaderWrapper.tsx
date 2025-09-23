/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import { classNames } from 'react-select/dist/declarations/src/utils'
import { SUBSCRIPTION_INFO } from '../../../../gql/Query'
import {MenuComponent} from '../../../assets/ts/components'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {Header} from './Header'
import {DefaultTitle} from './page-title/DefaultTitle'
import {Topbar} from './Topbar'

export function HeaderWrapper() {
  const {pathname} = useLocation()
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config
  const { data: subscriptionInfo } = useQuery(SUBSCRIPTION_INFO);
  const [subscriptionStatus, setSubscriptionStatus] = useState<number>()
  useEffect(()=>{
    if (subscriptionInfo){
        setSubscriptionStatus(subscriptionInfo?.subscribedDetail?.current?.sub_status)
    }
}, [subscriptionInfo]);
  useEffect(() => {
    MenuComponent.reinitialization()
  }, [pathname])

  return (
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      <div
        className={clsx(
          classes.headerContainer.join(' '),
          'd-flex align-items-stretch justify-content-between'
        )}
      >
        {/* begin::Aside mobile toggle */}
        {aside.display && (
          <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
            <div
              className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
              id='kt_aside_mobile_toggle'
            >
              <KTSVG path='/media/icons/duotune/abstract/abs015.svg' className='svg-icon-2x mt-1' />
            </div>
          </div>
        )}
        {/* end::Aside mobile toggle */}
        {/* begin::Logo */}
        {!aside.display && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
            <Link to='/dashboard' className='d-lg-none'>
              <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo.svg')} className='h-30px' />
            </Link>
          </div>
        )}
        {/* end::Logo */}

        {aside.display && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
            <Link to='/' className='d-lg-none'>
              <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo.svg')} className='mobile-logo' />
            </Link>
          </div>
        )}

        {/* begin::Wrapper */}
        <div className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
          {/* begin::Navbar */}
          {header.left === 'menu' && (
            <div className='d-flex align-items-stretch' id='kt_header_nav'>
              <Header />
            </div>
          )}
          {
            subscriptionStatus === 2 &&<>
              <h3 style={{margin:'auto auto', textAlign: 'center', color:'red'}}>Subscription Expired
              <Link to='/setup/subscription' style={{margin:'5px ', textAlign: 'center', color:'#740030', fontSize:'15px' }} className="btn btn-warning btn-sm">Subscribe</Link>
              </h3>
            </>
          }
         
          {header.left === 'page-title' && (
            <div className='d-flex align-items-center' id='kt_header_nav'>
              <DefaultTitle />
            </div>
          )}

          <div className='d-flex align-items-stretch flex-shrink-0'>
            <Topbar />
          </div>
        </div>
        {/* end::Wrapper */}
      </div>
    </div>
  )
}
