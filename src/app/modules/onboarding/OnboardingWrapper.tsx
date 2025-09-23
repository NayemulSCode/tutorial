import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import TutorialTile from './TutorialTile'

const OnboardingWrapper: React.FC = ({children}) => {
  const {isOnboardingActive} = useSelector((state: RootState) => state.onboarding)

  return (
    <>
      {children}
      {isOnboardingActive && <TutorialTile />}
    </>
  )
}

export default OnboardingWrapper
