/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC} from 'react'
import {Link} from 'react-router-dom';
import { Modal, Button, Dropdown, DropdownButton,Form} from 'react-bootstrap-v5'
import { useState } from 'react'
import {KTSVG} from '../../../helpers'
import Setting from '../../../assets/images/Calendar/settings.png'
import {useLayout} from '../../core'
import {DefaultTitle} from '../header/page-title/DefaultTitle'
import { CalendarModal1 } from '../../../../_metronic/layout/components/toolbar/CalendarModal1'
import { CalendarModal2} from '../../../../_metronic/layout/components/toolbar/CalendarModal2'


const CToolbar: FC = () => {
  const {classes} = useLayout()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='Calendartoolbar' id=''>
      {/* begin::Container */}
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
        <DefaultTitle />

        {/* begin::Actions */}
        <div className='d-flex align-items-center py-1'>
            {/* begin::Menu */}
            <div className="calendarNav">
              <div className="navItem pe-md-5 pe-0">
                <Form.Select aria-label="Default select example">
                  <option>Chair</option>
                  <option value="1">Chair One</option>
                  <option value="2">Chair Two</option>
                  <option value="3">Chair Three</option>
                </Form.Select>
              </div>
              <div className="navItem pe-md-5 pe-0">
                <Form.Select aria-label="Default select example">
                  <option>Today</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </div>
              <div className="navItem settingBtn">
                <Link to="/">
                  <img src={Setting} alt="img" />
                </Link>
            </div>
              <div className="navItem ps-md-5 pe-0">
                <DropdownButton className="add-btn btn2 add-service-btn" id="dropdown-basic-button" title="Create">
                  <Link to="/appointment/add" className="dropdown-link">New appointment</Link>
                  <Dropdown.Item href="#/action-2"><CalendarModal2 /></Dropdown.Item>
                  <Link to="/treatement-types/add"><Dropdown.Item onClick={handleShow} >New Brand</Dropdown.Item></Link>
                  <Link to="/sale/add" className="dropdown-link">New sale</Link>
                </DropdownButton>
              </div>
            </div>
            {/* end::Menu */}
        </div>
        {/* end::Actions */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export { CToolbar}
