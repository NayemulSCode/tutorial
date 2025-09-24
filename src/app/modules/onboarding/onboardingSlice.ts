import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// Define unique keys for each UI element that can be unlocked.
export const OnboardingUnlockKeys = {
  PROFILE_MENU: 'PROFILE_MENU',
  MY_PROFILE_LINK: 'MY_PROFILE_LINK',
  PROFILE_PAGE_EDIT_BUTTON: 'PROFILE_PAGE_EDIT_BUTTON',
  UPDATE_THUMBNAIL: 'UPDATE_THUMBNAIL',
  SETTINGS_MENU: 'SETTINGS_MENU',
  WORKING_HOURS_EDIT_BUTTON: 'WORKING_HOURS_EDIT_BUTTON',
  SERVICES_MENU: 'SERVICES_MENU',
}

interface OnboardingStep {
  title: string
  description: string
  videoUrl: string
  unlocks: string | null // Key from OnboardingUnlockKeys
}

interface OnboardingState {
  currentStep: number
  totalSteps: number
  isOnboardingActive: boolean
  steps: OnboardingStep[]
  unlockedItems: string[]
  hasCompletedOnce: boolean
}

const mockSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Chuzeday!',
    description: 'A quick overview of the platform.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: null, // First step unlocks nothing
  },
  {
    title: 'Profile Menu Access',
    description: 'This step enables the profile dropdown menu in the header.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: OnboardingUnlockKeys.PROFILE_MENU,
  },
  {
    title: 'Set Up Your Profile',
    description: 'This step enables the "My Profile" link.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: OnboardingUnlockKeys.MY_PROFILE_LINK,
  },
  {
    title: 'Edit Profile',
    description: 'This step enables the "Edit Profile" button.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: OnboardingUnlockKeys.PROFILE_PAGE_EDIT_BUTTON,
  },
  {
    title: 'Update Thumbnail ',
    description: 'This step enables the Update thumbnail file input field.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: OnboardingUnlockKeys.UPDATE_THUMBNAIL,
  },
  {
    title: 'Setting Working Hours',
    description:
      'This step enables the "Settings" menu item to allow access to working hours.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: OnboardingUnlockKeys.SETTINGS_MENU,
  },
  {
    title: 'Working Hours Configuration',
    description: 'This step enables the "Edit" button on the working hours page.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA',
    unlocks: OnboardingUnlockKeys.WORKING_HOURS_EDIT_BUTTON,
  },
  {
    title: 'Create Your First Service',
    description: 'This step enables the "Services" menu item.',
    videoUrl: 'https://www.youtube.com/embed/w5nDRW9E1lY',
    unlocks: OnboardingUnlockKeys.SERVICES_MENU,
  },
]

const initialState: OnboardingState = {
  currentStep: 1,
  totalSteps: mockSteps.length,
  isOnboardingActive: false,
  steps: mockSteps,
  unlockedItems: [],
  hasCompletedOnce: false,
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setOnboardingActive: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingActive = action.payload
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        const currentStepData = state.steps[state.currentStep - 1]
        if (currentStepData.unlocks && !state.unlockedItems.includes(currentStepData.unlocks)) {
          state.unlockedItems.push(currentStepData.unlocks)
        }
        state.currentStep += 1
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
        // Note: We don't re-lock items when going back. This is a design choice.
      }
    },
    finishOnboardingFlow: (state) => {
      // Unlock the final item before finishing
      const lastStep = state.steps[state.totalSteps - 1]
      if (lastStep.unlocks && !state.unlockedItems.includes(lastStep.unlocks)) {
        state.unlockedItems.push(lastStep.unlocks)
      }
      state.isOnboardingActive = false
      state.hasCompletedOnce = true // Set completion flag
      // On completion, ensure all items are unlocked for the user going forward
      state.unlockedItems = Object.values(OnboardingUnlockKeys)
    },
  },
})

export const {
  setCurrentStep,
  setOnboardingActive,
  nextStep,
  prevStep,
  finishOnboardingFlow,
} = onboardingSlice.actions
export default onboardingSlice.reducer
