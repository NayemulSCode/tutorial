/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { toAbsoluteUrl } from '../../../helpers'

type Props = {
  title: string
  description: string
}

const Card6: FC<Props> = ({ title, description }) => {
  return (
    <div className='card h-100'>
      <div className='card-body d-flex justify-content-start flex-column p-8'>
        <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
          <div className='symbol symbol-75px mb-6'>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul style={{ listStyle: 'none' }}>
              <li>
                <h5>Account Settings</h5><br />
                <span>Manage settings such as your business name and time zone</span>
                <hr />
              </li>
              <li>
                <h5>Locations</h5><br />
                <span>Manage settings such as your business name and time zone</span> <hr />
              </li>
              <li>
                <h5>Resources</h5><br />
                <span>Manage settings such as your business name and time zone</span> <hr />
              </li>
              <li>
                <h5>Online Booking</h5><br />
                <a>Manage settings such as your business name and time zone</a> <hr />
              </li>
              <li>
                <h5>Marketing</h5><br />
                <span>Manage settings such as your business name and time zone</span> <hr />
              </li>
            </ul>
          </div>
        </a>
      </div>
    </div>
  )
}

export { Card6 }
