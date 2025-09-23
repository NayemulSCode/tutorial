import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface OnboardingStep {
  title: string
  description: string
  videoUrl: string
}

interface OnboardingState {
  currentStep: number
  totalSteps: number
  isOnboardingActive: boolean
  steps: OnboardingStep[]
}

// Mock data for the onboarding steps
const mockSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Chuzeday!',
    description: 'A quick overview of the platform.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA', // Placeholder
  },
  {
    title: 'Set Up Your Profile',
    description: 'Complete your business profile to get started.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA', // Placeholder
  },
  {
    title: 'Access Profile Menu',
    description: '2nd Step to Update Thumbnail & See Business Listing on Marketplace.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA', // Placeholder
  },
  {
    title: 'Edit Profile',
    description: 'Open My Profile Icon and access to edit.',
    videoUrl: 'https://www.youtube.com/embed/ZxVG_k3q6jA', // Placeholder
  },
  {    
    title: 'Setting Working Hours',
    description:
      'Critical Data set needs to be entered for other items to work. Guide to Settings Page and Opening Hours.',
    videoUrl: 'https://www.youtube.com/embed/w5nDRW9E1lY', // Placeholder
  },
  {
    title: 'Create Your First Service',
    description: 'Learn how to add services to your marketplace listing.',
    videoUrl: 'https://www.youtube.com/embed/1urZ9dihpLg', // Placeholder
  },
]

const initialState: OnboardingState = {
  currentStep: 1,
  totalSteps: mockSteps.length,
  isOnboardingActive: false, // Default to false, will be activated based on user status
  steps: mockSteps,
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
        state.currentStep += 1
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    completeOnboarding: (state) => {
      state.isOnboardingActive = false
      state.currentStep = 1
    },
  },
})

export const {setCurrentStep, setOnboardingActive, nextStep, prevStep, completeOnboarding} = onboardingSlice.actions
export default onboardingSlice.reducer
