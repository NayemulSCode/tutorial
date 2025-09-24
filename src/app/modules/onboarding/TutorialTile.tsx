import React, {useRef, useState, useEffect} from 'react'
import Draggable from 'react-draggable'
import {useSelector, useDispatch} from 'react-redux'
import YouTube from 'react-youtube'
import {RootState} from '../../../setup'
import {nextStep, prevStep, finishOnboardingFlow} from './onboardingSlice'
import {KTSVG} from '../../../_metronic/helpers'

const TutorialTile: React.FC = () => {
  const dispatch = useDispatch()
  const nodeRef = useRef(null)
  const {currentStep, totalSteps, steps} = useSelector((state: RootState) => state.onboarding)
  const currentStepData = steps[currentStep - 1]

  const [isMinimized, setIsMinimized] = useState(false)
  const [isVideoFinished, setIsVideoFinished] = useState(false)

  // Reset video finished state when step changes
  useEffect(() => {
    setIsVideoFinished(false)
  }, [currentStep])

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

  const handleVideoEnd = () => {
    setIsVideoFinished(true)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const videoId = new URL(currentStepData.videoUrl).pathname.split('/').pop()

  return (
    <Draggable nodeRef={nodeRef} handle='.card-header'>
      <div
        ref={nodeRef}
        className='card shadow-sm'
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          width: isMinimized ? '350px' : '650px',
          zIndex: 1000,
        }}
      >
        <div className='card-header'>
          <h3 className='card-title'>Chuzeday Start</h3>
          <div className='card-toolbar'>
            <span className='me-3'>Step {currentStep}/{totalSteps}</span>
            <button className='btn btn-icon btn-sm' onClick={toggleMinimize}>
              {isMinimized ? (
                <KTSVG path='/media/icons/duotune/arrows/arr012.svg' className='svg-icon-2' />
              ) : (
                <KTSVG path='/media/icons/duotune/arrows/arr011.svg' className='svg-icon-2' />
              )}
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6'>
                <div
                  className='mb-4'
                  style={{
                    height: '100px',
                    overflowY: 'auto',
                    border: '1px solid #eee',
                    padding: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <p>
                    <strong>AI Assistant:</strong> Welcome to Chuzeday! I'm here to help you get
                    started. This first video will give you a quick overview of the platform.
                  </p>
                </div>
                <textarea
                  className='form-control'
                  rows={2}
                  placeholder='Type your message...'
                ></textarea>
              </div>
              <div className='col-md-6'>
                <h4>{currentStepData.title}</h4>
                <p>{currentStepData.description}</p>
                <div className='embed-responsive embed-responsive-16by9 mb-4'>
                  <YouTube
                    videoId={videoId}
                    className='embed-responsive-item'
                    onEnd={handleVideoEnd}
                    opts={{
                      height: '195',
                      width: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='d-flex justify-content-between mt-4'>
              <button className='btn btn-light' onClick={handlePrev} disabled={currentStep === 1}>
                Previous
              </button>
              <button
                className='btn btn-primary'
                onClick={handleNext}
                disabled={!isVideoFinished && currentStep !== totalSteps}
              >
                {currentStep === totalSteps ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  )
}

export default TutorialTile
