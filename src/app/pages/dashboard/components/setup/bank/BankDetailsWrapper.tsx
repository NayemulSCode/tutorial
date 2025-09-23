import React, { FC, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import BankDetails from './BankDetails'
import {useHistory} from 'react-router-dom'
import RevoluteAccountDetails from './RevoluteAccountDetails'
const BankDetailsWrapper:FC = () => {
  const history = useHistory();
  const [revoluteShow, setRevouteShow] = useState<boolean>(false);
  return (
    <div>
      <div className='d-flex align-items-center'>
        <div className='mr-1 mb-2'>
          <button
            onClick={() => {
              history.push('/business/settings')
            }}
            type='button'
            className='btn btn-lg btn-light-primary me-3'
            data-kt-stepper-action='previous'
          >
            <KTSVG path='/media/icons/duotune/arrows/arr063.svg' className='svg-icon-4 me-1' />
          </button>
        </div>
        <h1>Bank Details</h1>
      </div>
      <div>
        <button
          className={`${
            revoluteShow === false
              ? 'btn btn-sm btn-light-primary me-3 bank_dt_active'
              : 'btn btn-sm btn-light-primary me-3'
          }`}
          onClick={() => {
            setRevouteShow(false)
          }}
        >
          Bank Details
        </button>
        <button
          className='btn btn-sm btn-light-primary me-3'
          onClick={() => {
            setRevouteShow(true)
          }}
        >
          Revolut Account Details
        </button>
      </div>
      <div className='d-flex row'>
        <div className='col-md-6'>
          <div className='card p-4 my-3 '>
            {revoluteShow ? <RevoluteAccountDetails /> : <BankDetails />}
          </div>
        </div>
        <div className='col-md-6'>
          <a
            className='card p-4 my-3 bg-transparent pt-0'
            href='https://revolut.ngih.net/c/4099234/1584831/9626'
            target='_blank'
          >
            <img
              className='rounded-2'
              src={toAbsoluteUrl('/media/revolut/revolut-banner.jpg')}
              alt='revolut-banner'
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default BankDetailsWrapper