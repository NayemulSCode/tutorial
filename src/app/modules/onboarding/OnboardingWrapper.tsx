import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import TutorialTile from './TutorialTile'

const OnboardingWrapper: React.FC = ({children}) => {
  const {isOnboardingActive, currentStep} = useSelector((state: RootState) => state.onboarding)

  useEffect(() => {
    const mainWrapper = document.getElementById('kt_wrapper')
    const aside = document.getElementsByClassName('aside')?.item(0)

    if (isOnboardingActive) {
      mainWrapper?.classList.add('grey-out')
      aside?.classList.add('grey-out')
    } else {
      mainWrapper?.classList.remove('grey-out')
      aside?.classList.remove('grey-out')
    }

    // Handle progressive unlocking
    const userMenuToggle = document.getElementById('kt_header_user_menu_toggle')
    if (isOnboardingActive && userMenuToggle) {
      if (currentStep >= 2) {
        userMenuToggle.classList.add('grey-out-override')
      } else {
        userMenuToggle.classList.remove('grey-out-override')
      }
    }

    return () => {
      mainWrapper?.classList.remove('grey-out')
      aside?.classList.remove('grey-out')
      userMenuToggle?.classList.remove('grey-out-override')
    }
  }, [isOnboardingActive, currentStep])

  return (
    <>
      {children}
      {isOnboardingActive && <TutorialTile />}
    </>
  )
}

export default OnboardingWrapper
