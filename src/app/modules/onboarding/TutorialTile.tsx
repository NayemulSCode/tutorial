import React, {useRef} from 'react'
import Draggable from 'react-draggable'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from '../../../setup'
import {nextStep, prevStep, finishOnboardingFlow} from './onboardingSlice'

const TutorialTile: React.FC = () => {
  const dispatch = useDispatch()
  const nodeRef = useRef(null)
  const {currentStep, totalSteps, steps} = useSelector((state: RootState) => state.onboarding)
  const currentStepData = steps[currentStep - 1]

  if (!currentStepData) {
    return null // Or some error state
  }

  const handleNext = () => {
    if (currentStep === totalSteps) {
      dispatch(finishOnboardingFlow())
    } else {
      dispatch(nextStep())
    }
  }

  const handlePrev = () => {
    dispatch(prevStep())
  }

  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef} className='card shadow-sm' style={{position: 'fixed', bottom: '20px', right: '20px', width: '700px', zIndex: 1000}}>
        <div className='card-header'>
          <h3 className='card-title'>Chuzeday Start</h3>
          <div className='card-toolbar'>
            Step {currentStep}/{totalSteps}
          </div>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='mb-4' style={{height: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '5px'}}>
                <p><strong>AI Assistant:</strong> Welcome to Chuzeday! I'm here to help you get started. This first video will give you a quick overview of the platform.</p>
              </div>
              <textarea className='form-control' rows={2} placeholder='Type your message...'></textarea>
            </div>
            <div className='col-md-6'>
              <h4>{currentStepData.title}</h4>
              <p>{currentStepData.description}</p>
              <div className='embed-responsive embed-responsive-16by9 mb-4'>
                <iframe
                  className='embed-responsive-item'
                  src={currentStepData.videoUrl}
                  title='YouTube video player'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-between mt-4'>
            <button className='btn btn-light' onClick={handlePrev} disabled={currentStep === 1}>
              Previous
            </button>
            <button className='btn btn-primary' onClick={handleNext}>
              {currentStep === totalSteps ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default TutorialTile
