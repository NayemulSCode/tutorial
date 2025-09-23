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
    videoUrl: 'https://www.youtube.com/embed/h_j6PLSHrW4', // Placeholder
  },
  {
    title: 'Set Up Your Profile',
    description: 'Complete your business profile to get started.',
    videoUrl: 'https://www.youtube.com/embed/h_j6PLSHrW4', // Placeholder
  },
  {
    title: 'Create Your First Service',
    description: 'Learn how to add services to your marketplace listing.',
    videoUrl: 'https://www.youtube.com/embed/h_j6PLSHrW4', // Placeholder
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
