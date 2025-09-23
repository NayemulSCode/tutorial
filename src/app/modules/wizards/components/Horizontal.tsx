import React, {FC, useContext, useEffect, useRef, useState} from 'react'
import {Step1} from './steps/Step1'
import {Step6} from './steps/Step6'
import {Step9} from './steps/Step9'
import {KTSVG} from '../../../../_metronic/helpers'
import {StepperComponent} from '../../../../_metronic/assets/ts/components'
import {Formik, Form, FormikValues} from 'formik'
import {createAccountSchemas, ICreateAccount, inits} from './CreateAccountWizardHelper'
import {useHistory} from 'react-router-dom'
import {useApolloClient, useMutation, useQuery} from '@apollo/client'
import {BUSINESS_SETUP} from '../../../../gql/Mutation'
import {useSnackbar} from 'notistack'
import {AppContext} from '../../../../context/Context'
import {PROFILE_INFORMATION} from '../../../../gql/Query'

const Horizontal: FC = () => {
  const client = useApolloClient()
  const {authToken, addUser, user} = useContext(AppContext)
  const {enqueueSnackbar} = useSnackbar()
  const history = useHistory()
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const stepper = useRef<StepperComponent | null>(null)
  const [currentStep, setCurrentStep] = useState(0) // Manual step tracking
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0])
  const [initValues] = useState<ICreateAccount>(inits)
  const [isSubmitButton, setSubmitButton] = useState(false)
  const [bType, setbType] = useState<string[]>([]) // Changed to array for multiple business types
  const [bService, setbService] = useState<any>()
  const [bTeam, setbTeam] = useState<any>()
  const [nChair, setnChair] = useState<any>()
  const [howToKnow, sethowToKnow] = useState<any>()
  const [dayTimes, setDayTimes] = useState<any>()

  // Define the steps you want to use
  const activeSteps = [0, 5, 8] // Step1 (index 0), Step6 (index 5), Step9 (index 8)
  const totalSteps = activeSteps.length

  const {data: accountData} = useQuery(PROFILE_INFORMATION)

  useEffect(() => {
    if (accountData) {
      addUser(accountData.profileInformation)
    }
  }, [accountData])

  useEffect(() => {
    // Update submit button state based on current step
    setSubmitButton(currentStep === totalSteps - 1)
    // Update schema based on current step
    if (createAccountSchemas[activeSteps[currentStep]]) {
      setCurrentSchema(createAccountSchemas[activeSteps[currentStep]])
    }
  }, [currentStep])

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const [businessSetup, {loading: isLoading}] = useMutation(BUSINESS_SETUP)

  const submitStep = (values: any, actions: FormikValues) => {
    const setupPayload = {
      business_type_ids: bType.length > 0 ? bType.map((id) => +id) : [], // Convert to array of numbers
      service_category_ids: bService ? bService : '',
      number_of_chairs: nChair ? +nChair : 1,
      daily_work_hours: dayTimes ?? '',
      subscription: '',
      team_size: bTeam ? bTeam : 'only me',
      about: howToKnow,
    }

    if (isSubmitButton) {
      console.log('🚀 ~ submitStep ~ setupPayload:', setupPayload)
      // Uncomment when ready to submit

      businessSetup({ variables: setupPayload }).then(({data})=>{
        if (data.businessSetup.status === 1){
          addUser(data?.businessSetup?.user)
          enqueueSnackbar("Congratulation! Your Business is setup successfully.", {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            transitionDuration: {
              enter: 300,
              exit: 500
            }
          });
          history.push('/')
        }
        else if (data.businessSetup.status === 0){
          enqueueSnackbar(data.businessSetup.message, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            transitionDuration: {
              enter: 300,
              exit: 500
            }
          });
        }
      })
    } else {
      // Move to next step
      nextStep()
    }
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }
    loadStepper()
  }, [stepperRef])

  const getBusinessType = (types: string[]) => {
    setbType(types)
  }

  const getChuzeday = (type: string) => {
    sethowToKnow(type)
  }

  // Render current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1 getBusinessType={getBusinessType} />
      case 1:
        return <Step6 getChuzeday={getChuzeday} />
      case 2:
        return <Step9 />
      default:
        return <Step1 getBusinessType={getBusinessType} />
    }
  }

  // Check if current step is valid (has required data)
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return bType.length > 0
      case 1:
        return howToKnow !== undefined && howToKnow !== ''
      case 2:
        return true // Step9 might not have validation requirements
      default:
        return false
    }
  }

  return (
    <div className='card'>
      <div className='card-body'>
        <div
          ref={stepperRef}
          className='stepper stepper-links d-flex flex-column pt-15'
          id='kt_create_account_stepper'
        >
          <div className='d-flex flex-stack align-items-center'>
            <div></div>
            <div className='text-gray-400 text-center fw-bold fs-3'>
              Business Registration - Step {currentStep + 1} of {totalSteps}
            </div>
            <button className='menu-item signOutBtn'>
              <a
                href='/auth/login'
                className='menu-link px-2'
                onClick={() => {
                  localStorage.removeItem('token')
                  client.cache.reset()
                  authToken('')
                }}
              >
                Sign Out
              </a>
            </button>
          </div>

          <Formik validationSchema={currentSchema} initialValues={initValues} onSubmit={submitStep}>
            {() => (
              <Form className='mx-auto mw-875px w-100 pt-15 pb-10' id='kt_create_account_form'>
                <div className='current' data-kt-stepper-element='content'>
                  {renderCurrentStep()}
                </div>

                <div className='d-flex flex-stack pt-15'>
                  <div className='mr-2'>
                    <button
                      onClick={prevStep}
                      type='button'
                      className={`btn btn-lg btn-light-primary me-3 ${
                        currentStep === 0 ? 'disabled' : ''
                      }`}
                      disabled={currentStep === 0}
                    >
                      <KTSVG
                        path='/media/icons/duotune/arrows/arr063.svg'
                        className='svg-icon-4 me-1'
                      />
                      Back
                    </button>
                  </div>

                  <div>
                    <button
                      type='submit'
                      className={`btn btn-lg btn-primary me-3 ${
                        !isCurrentStepValid() ? 'disabled' : ''
                      }`}
                      disabled={!isCurrentStepValid()}
                    >
                      <span className='indicator-label'>
                        {!isSubmitButton && 'Continue'}
                        {isSubmitButton && 'Submit'}
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr064.svg'
                          className='svg-icon-3 ms-2 me-0'
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export {Horizontal}
