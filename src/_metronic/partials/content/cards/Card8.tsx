/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { toAbsoluteUrl } from '../../../helpers'

type Props = {
    avatar?: string
    name: string
    job: string
    
}

const Card8: FC<Props> = ({
    avatar = '',
    name,
    job
}) => {
    return (
        <div className='card'>
            <div className='card-body d-flex flex-center flex-column p-9'>
                <div className='mb-5'>
                    <div className='symbol symbol-75px symbol-circle'>
                        <img alt='Pic' src={toAbsoluteUrl(avatar)} />
                    </div>
                </div>

                <a href='#' className='fs-4 text-gray-800 text-hover-primary fw-bolder mb-0'>
                    {name}
                </a>

                <div className='fw-bold text-gray-400 mb-6'>{job}</div>
                {/* <div className='d-flex flex-center flex-wrap mb-5'>
          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mx-3 mb-3'>
            <div className='fs-6 fw-bolder text-gray-700'>{name}</div>
            <div className='fw-bold text-gray-400'>Avg. Earnings</div>
          </div>

          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 mx-3 px-4 mb-3'>
            <div className='fs-6 fw-bolder text-gray-700'>{job}</div>
            <div className='fw-bold text-gray-400'>Total Sales</div>
          </div>
        </div> */}

                <button className='btn btn-sm btn-light-primary fw-bolder' id='kt_drawer_chat_toggle'>
                    Send Message
                </button>
            </div>
        </div>
    )
}

export { Card8 }
