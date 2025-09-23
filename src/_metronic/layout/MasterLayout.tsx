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
import {useSelector} from 'react-redux'
import clsx from 'clsx'
import OnboardingWrapper from '../../app/modules/onboarding/OnboardingWrapper'
import {RootState} from '../../setup'

const MasterLayout: React.FC = ({ children }) => {
  const location = useLocation()
  const {isOnboardingActive, currentStep} = useSelector((state: RootState) => state.onboarding)
  // console.log("location", location.pathname)
  return (
    <PageDataProvider>
      <OnboardingWrapper>
        <div className='page d-flex flex-row flex-column-fluid'>
          {
            location?.pathname === "/account/setup" ? "" : <AsideDefault className={clsx({'grey-out': isOnboardingActive})} />
          }
          {/* <AsideDefault /> */}
          {/* <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'> */}
          <div className={clsx(
              'wrapper d-flex flex-column flex-row-fluid',
              {'grey-out': isOnboardingActive},
              {'d-flex flex-column flex-row-fluid': location.pathname === "/account/setup"}
            )} id='kt_wrapper'>
            {
              location?.pathname === "/account/setup" ? "" : <HeaderWrapper isUnlocked={currentStep >= 2} />
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