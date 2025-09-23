/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../helpers'

type Props = {
  title: string
  amount: number
}
 
const Card4: FC<Props> = ({ title, amount}) => {
  return (
    <div className='card h-100'>
      <div className='card-body d-flex justify-content-start flex-column p-8'>
        <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
          <div className='symbol symbol-75px mb-6'>
          <h3>{title}</h3>
          </div>
          <div className='fs-5 fw-bolder mb-2'><h1>{amount}</h1></div>
        </a>
        <div>
          <p><i className="fas fa-chevron-up"></i> 100% previous day</p>
        </div>
        <div className='fs-7 fw-bold text-gray-400 mt-auto'>
          <p>Completed0(0%)</p>
          <p>Not Completed3(100%)</p>
          <p>Canceled0(0%)</p>
          {/* <p>No Show0(0%)</p> */}
        </div>
      </div>
    </div>
  )
}

export {Card4}
