import React, {FC} from 'react'
import {KTSVG,toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'

const Step9: FC = () => {
  return (
    <div className='w-100 text-center'>
      <div className='pb-8 pb-lg-10'>
        <h2 className='fw-bolder text-dark'>Your Are Done! <br /> Just Click Submit</h2>
        {/* <div className='text-gray-400 fw-bold fs-6'>
          Congratulation! Your Business is setup successfully.If you need more info, please
          <Link to='/auth/login' className='link-primary fw-bolder'>
            {' '}
            Sign In
          </Link>
          .
        </div> */}
      </div>

      <div className='mb-0 fv-row'>
        <div className='mb-0 stepper-complete-icon'>
          <img src={toAbsoluteUrl('/media/logos/checked.png')} alt='image' />
        </div>
      </div>
    </div>
  )
}

export {Step9}
