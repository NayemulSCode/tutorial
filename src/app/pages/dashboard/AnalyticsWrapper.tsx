import { useIntl } from "react-intl"
import React, { FC, useContext, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { PageTitle } from "../../../_metronic/layout/core"
import { useHistory, useLocation } from 'react-router-dom'
import { Link, Switch, Route } from "react-router-dom";
import Dashboard from "./components/analytics/Dashboard";
import Reports from "./components/analytics/Reports";
import { ANALYTICS } from '../../../gql/Query'
import { Card4 } from "../../../_metronic/partials/content/cards/Card4";
import { AppContext } from "../../../context/Context"

const AnalyticsWrapper: FC = () => {
    document.title = "Analytics";
    const [totalAppt, setTotalAppt] = useState<any>();
    const [totalOnlineAppt, setTotalOnlineAppt] = useState<any>();
    const [totalSale, setTotalSale] = useState<any>();
    const intl = useIntl()
    const history = useHistory()
    const location = useLocation()
    const { data: analyticsData, loading } = useQuery(ANALYTICS);

    useEffect(() => {
        if (analyticsData) {
            // console.log(analyticsData)
            setTotalAppt(analyticsData?.analytics?.total_appt)
            setTotalOnlineAppt(analyticsData?.analytics?.total_online_appt)
            setTotalSale(analyticsData?.analytics?.total_sale)
        }
        if(loading){
            // console.log("Loading")
        }
    }, [analyticsData])
    const {addVideoItem} = useContext(AppContext)
    const handleRedirectVideoSection = () => {
        addVideoItem(7)
        history.push('/setup/how-to')
    }
    return (
      <>
        <div className='CalendarWrap'>
          <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.Analytics'})}</PageTitle>
          <div className='toolbar d-flex justify-content-end'>
            <div className='d-flex justify-content-between'>
              <div className='d-flex align-items-center justify-content-end tService'>
                <button
                  type='button'
                  style={{background: '#ebc11a'}}
                  onClick={handleRedirectVideoSection}
                  className='btn btn-sm text-light ms-auto d-block'
                >
                  How To
                </button>
              </div>
            </div>
          </div>
          <div className='row ptc'>
            <div className='col-xl-4 mb-5'>
              <div className='card h-100'>
                <div className='card-body d-flex justify-content-start flex-column p-8'>
                  <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
                    <div className='symbol symbol-75px mb-6'>
                      <h3>{`Appointments`}</h3>
                    </div>
                    <div className='fs-5 fw-bolder mb-2'>
                      <h1>{totalAppt?.total}</h1>
                    </div>
                  </a>
                  <div>
                    <p>
                      <i className='fas fa-chevron-up'></i> 100% previous day
                    </p>
                  </div>
                  <div className='fs-7 fw-bold text-gray-400 mt-auto'>
                    <p>Completed: {totalAppt?.complete}</p>
                    <p>Not Completed: {totalAppt?.not_complete}</p>
                    <p>Canceled: {totalAppt?.cancel}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-4 mb-5'>
              <div className='card h-100'>
                <div className='card-body d-flex justify-content-start flex-column p-8'>
                  <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
                    <div className='symbol symbol-75px mb-6'>
                      <h3>{`Online Appointments`}</h3>
                    </div>
                    <div className='fs-5 fw-bolder mb-2'>
                      <h1>{totalOnlineAppt?.total}</h1>
                    </div>
                  </a>
                  <div>
                    <p>
                      <i className='fas fa-chevron-up'></i> 100% previous day
                    </p>
                  </div>
                  <div className='fs-7 fw-bold text-gray-400 mt-auto'>
                    <p>Completed: {totalOnlineAppt?.complete}</p>
                    <p>Not Completed: {totalOnlineAppt?.not_complete}</p>
                    <p>Canceled: {totalOnlineAppt?.cancel}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-4 mb-5'>
              <div className='card h-100'>
                <div className='card-body d-flex justify-content-start flex-column p-8'>
                  <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
                    <div className='symbol symbol-75px mb-6'>
                      <h3>{`Sale`}</h3>
                    </div>
                    <div className='fs-5 fw-bolder mb-2'>
                      <h1>{totalSale?.total}</h1>
                    </div>
                  </a>
                  <div>
                    <p>
                      <i className='fas fa-chevron-up'></i> 100% previous day
                    </p>
                  </div>
                  <div className='fs-7 fw-bold text-gray-400 mt-auto'>
                    <p>Completed: {totalSale?.complete}</p>
                    <p>Not Completed: {totalSale?.not_complete}</p>
                    <p>Canceled: {totalSale?.cancel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export { AnalyticsWrapper }