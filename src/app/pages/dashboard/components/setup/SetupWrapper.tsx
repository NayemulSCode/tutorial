import { useIntl } from "react-intl"
import React, { FC, useContext } from "react"
import { Link, useHistory } from "react-router-dom"
import { PageTitle } from "../../../../../_metronic/layout/core"
import { AppointmentChart } from "../../../../../_metronic/partials/widgets/charts/AppointmentChart"
import { Card6 } from "../../../../../_metronic/partials/content/cards/Card6"
import { AppContext } from "../../../../../context/Context"


const SetupWrapper: FC = () => {
    document.title = "Business setup";
    const intl = useIntl();
    const history = useHistory();
    const {addVideoItem} = useContext(AppContext);
    const handleRedirectVideoSection = () => {
      addVideoItem(8)
      history.push('/setup/how-to');
    }
    return (
      <>
        <div className='SetupWrap'>
          <div className='setup-toolbar d-flex justify-content-between'>
            <div>
              <h2 className='page-title mb-1 text-start'>Business settings</h2>
              <p className='mb-0 fs-5'>Operate all your Chuzeday settings from here.</p>
            </div>
            <button
              type='button'
              style={{background: '#ebc11a'}}
              onClick={handleRedirectVideoSection}
              className='btn btn-sm text-light h-25 ms-auto'
            >
              How To
            </button>
          </div>
          <div className='row'>
            <div className='col-xl-6'>
              <div className='col-xl-12 mb-7'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Account Setup</h2>
                  </div>
                  <Link to='/setup/business-details' className='select-single-item'>
                    <div>
                      <p>Business Details</p>
                      <span className='text-muted fs-6'>
                        Manage settings such as your business name, slider and links
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/bank-details' className='select-single-item'>
                    <div>
                      <p>Bank Details</p>
                      <span className='text-muted fs-6'>Manage your bank details</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/location' className='select-single-item'>
                    <div>
                      <p>Location</p>
                      <span className='text-muted fs-6'>Manage your business location</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/online-booking' className='select-single-item'>
                    <div>
                      <p>Online Booking</p>
                      <span className='text-muted fs-6'>Manage settings for online booking</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/closed-dates' className='select-single-item'>
                    <div>
                      <p>Closed Date</p>
                      <span className='text-muted fs-6'>
                        Set the dates when your business is closed
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/calendar' className='select-single-item'>
                    <div>
                      <p>Calender Permission</p>
                      <span className='text-muted fs-6'>
                        Set your calender permission
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
              <div className='col-xl-12 mb-7'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Guests</h2>
                  </div>
                  <Link to='/setup/guest-notifications' className='select-single-item'>
                    <div>
                      <p>Guests Notifications</p>
                      <span className='text-muted fs-6'>
                        Review messages sent to guests about their appointment
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
              <div className='col-xl-12 mb-5'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Subscription</h2>
                  </div>
                  <Link to='/setup/subscription' className='select-single-item'>
                    <div>
                      <p>Subscription Details</p>
                      <span className='text-muted fs-6'>Manage your business subscription</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-xl-6'>
              <div className='col-xl-12 mb-7'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Sales</h2>
                  </div>
                  <Link to='/setup/invoice-sequencing' className='select-single-item'>
                    <div>
                      <p>Invoice Sequencing</p>
                      <span className='text-muted fs-6'>
                        The content displayed on invoices issued to your clients
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/invoice-setup' className='select-single-item'>
                    <div>
                      <p>Custom Invoice</p>
                      <span className='text-muted fs-6'>
                        The content displayed on invoices issued to your clients
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/setup/tax' className='select-single-item'>
                    <div>
                      <p>Taxes</p>
                      <span className='text-muted fs-6'>
                        Manage tax rates that apply to items sold at checkout
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
              <div className='col-xl-12  mb-7'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Opening Hours</h2>
                  </div>
                  <Link to='/setup/working-hours' className='select-single-item'>
                    <div>
                      <p>Working Hours</p>
                      <span className='text-muted fs-6'>Manage working hours</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
              <div className='col-xl-12  mb-7'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Team</h2>
                  </div>
                  <Link to='/chairs' className='select-single-item'>
                    <div>
                      <p>Chair</p>
                      <span className='text-muted fs-6'>Add and delete your business chairs</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                  <Link to='/staff/employees' className='select-single-item'>
                    <div>
                      <p>Staff</p>
                      <span className='text-muted fs-6'>
                        Add, edit and delete your business staffs
                      </span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
              <div className='col-xl-12 mb-5'>
                <div className='card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>How To</h2>
                  </div>
                  <Link
                    to={{
                      pathname: '/setup/how-to',
                      state: {title: 'setting'},
                    }}
                    className='select-single-item'
                  >
                    <div>
                      <p>How to setup your business</p>
                      <span className='text-muted fs-6'>Business setup guideline videos</span>
                    </div>
                    <i className='next-icon fas fa-angle-right'></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export { SetupWrapper }