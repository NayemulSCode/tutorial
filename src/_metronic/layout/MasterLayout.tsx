import React from 'react'
import { AsideDefault } from './components/aside/AsideDefault'
import { Footer } from './components/Footer'
import { HeaderWrapper } from './components/header/HeaderWrapper'
import { Toolbar } from './components/toolbar/Toolbar'
import { ScrollTop } from './components/ScrollTop'
import { Content } from './components/Content'
import { MasterInit } from './MasterInit'
import { PageDataProvider } from './core'
import {
  DrawerMessenger,
  ExploreMain,
  ActivityDrawer,
  Main,
  InviteUsers,
  UpgradePlan,
} from '../partials'
import { useLocation } from 'react-router-dom'
import OnboardingWrapper from '../../app/modules/onboarding/OnboardingWrapper'

const MasterLayout: React.FC = ({ children }) => {
  const location = useLocation()
  // console.log("location", location.pathname)
  return (
    <PageDataProvider>
      <OnboardingWrapper>
        <div className='page d-flex flex-row flex-column-fluid'>
          {
            location?.pathname === "/account/setup" ? "" : <AsideDefault />
          }
          {/* <AsideDefault /> */}
          {/* <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'> */}
          <div className={`${location.pathname === "/account/setup" ? 'd-flex flex-column flex-row-fluid' : 'wrapper d-flex flex-column flex-row-fluid'}`} id='kt_wrapper'>
            {
              location?.pathname === "/account/setup" ? "" : <HeaderWrapper />
            }
            {/* <HeaderWrapper /> */}

            <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
              <Toolbar />
              <div className='post d-flex flex-column-fluid' id='kt_post'>
                <Content>{children}</Content>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </OnboardingWrapper>

      {/* begin:: Drawers */}
      <ActivityDrawer />
      <ExploreMain />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <Main />
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}

      <MasterInit />
      <ScrollTop />
    </PageDataProvider>
  )
}

export { MasterLayout }