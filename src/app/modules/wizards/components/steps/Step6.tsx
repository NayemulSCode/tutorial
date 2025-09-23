import React, {FC, useState, useEffect} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Field, ErrorMessage} from 'formik'

type Props = {
  getChuzeday: (type: string) => void
}

const Step6: FC<Props> = ({getChuzeday}) => {
  const [aChuzeday, setAChuzeday] = useState('')

  // Use useEffect to call getChuzeday when aChuzeday changes
  useEffect(() => {
    if (aChuzeday) {
      getChuzeday(aChuzeday)
    }
  }, [aChuzeday, getChuzeday])

  const handleOptionSelect = (value: string) => {
    setAChuzeday(value)
  }

  return (
    <div className='w-100'>
      <div className='pb-10'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          How did you find out about Chuzeday?
        </h2>
      </div>

      <div className='mb-0 fv-row'>
        <div className='mb-0'>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                onClick={() => handleOptionSelect('Recommended by a friend')}
                type='radio'
                name='accountPlan'
                value='Recommended by a friend'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Recommended by a friend
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                type='radio'
                onClick={() => handleOptionSelect('Acuity')}
                name='accountPlan'
                value='Acuity'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>Acuity</span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                onClick={() => handleOptionSelect('Search engine (e.g. Google, Yahoo)')}
                type='radio'
                name='accountPlan'
                value='Search engine (e.g. Google, Yahoo)'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Search engine (e.g. Google, Yahoo)
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                onClick={() => handleOptionSelect('Social media')}
                type='radio'
                name='accountPlan'
                value='Social media'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Social media
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                onClick={() => handleOptionSelect('Magazine ad')}
                type='radio'
                name='accountPlan'
                value='Magazine ad'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>Magazine ad</span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                onClick={() => handleOptionSelect('Ratings website (e.g. Capterra, Trustpilot)')}
                type='radio'
                name='accountPlan'
                value='Ratings website (e.g. Capterra, Trustpilot)'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Ratings website (e.g. Capterra, Trustpilot)
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field
                className='form-check-input'
                onClick={() => handleOptionSelect('Other')}
                type='radio'
                name='accountPlan'
                value='Other'
              />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>Other</span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export {Step6}
