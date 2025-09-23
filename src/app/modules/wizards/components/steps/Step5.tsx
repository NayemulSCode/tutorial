import React, {FC} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Field, ErrorMessage} from 'formik'

const Step5: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          Which software are you currently using?</h2>
        <div className='text-gray-400 fw-bold fs-6'>
          If you're looking to switch, we can help speed up your business setup and import your data into your new Chuzeday account.
        </div>
      </div>

      <div className='mb-0 fv-row'>
        <label className='d-flex align-items-center form-label mb-5'>
          Select software
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Monthly billing will be based on your account plan'
          ></i>
        </label>

        <div className='mb-0'>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  I'm not using any software
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Acuity
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Booksy
                </span>
              </span>
            </span>
          </label>

          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Janeapp
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Kitomba
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Mindbody
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Ovatu
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Phorest
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Company Account
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Salon Iris
                </span>
              </span>
            </span>
          </label>
          <label className='d-flex mb-5 cursor-pointer'>
            <span className='form-check form-check-custom form-check-solid me-2'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
            <span className='d-flex align-items-center'>
              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Other
                </span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export {Step5}
