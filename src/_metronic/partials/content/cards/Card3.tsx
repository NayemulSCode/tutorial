/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { toAbsoluteUrl, KTSVG } from '../../../helpers'

type Props = {
  title: String,
  description: String,
}

const Card3: FC<Props> = ({
  title,
  description
}) => {
  return (
    <div className='card'>
      <div className='card-body d-flex flex-start flex-column p-9'>
        <div className='mb-5'>
          <div className='symbol symbol-75px symbol-circle'>
            <h1>{title}</h1>
            <p>{description}</p>
            <ul style={{ listStyle: 'none' }}>
              <li>
                <a href='#' className='text-primary'>Finances summary</a><hr />
              </li>
              <li>
                <a href='#' className='text-primary'>Payments summary</a><hr />
              </li>
              <li>
                <a href='#' className='text-primary'>Payments log</a><hr />
              </li>
              <li>
                <a href='#' className='text-primary'>Taxes summary</a><hr />

              </li>
              <li>
                <a href='#' className='text-primary'>Tips collected</a><hr />
              </li>
            </ul>


          </div>
        </div>
      </div>
    </div>
  )
}

export { Card3 }
