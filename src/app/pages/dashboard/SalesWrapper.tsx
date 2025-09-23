import { useIntl } from "react-intl"
import React, { FC, useContext } from "react"
import { Link, useLocation, Switch, Route, useHistory } from 'react-router-dom'
import { PageTitle } from "../../../_metronic/layout/core"
import DailySales from "./components/sales/DailySales"
import Appointments from './components/sales/Appointments'
import SalesHistory from "./components/sales/SalesHistory"
import VoucherList from "./components/sales/VoucherList"
import WaitingList from "./components/sales/WaitingList"
import { AppContext } from "../../../context/Context"

const SalesWrapper: FC = () => {
    document.title = "Sales";
    const intl = useIntl()
    const location = useLocation();
    const history = useHistory()
    const {addVideoItem} = useContext(AppContext)
    const handleRedirectVideoSection = () => {
      addVideoItem(2)
      history.push('/setup/how-to')
    }
    return (
      <>
        <div className='SalesWrap'>
          <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.Sales'})}</PageTitle>
          <div className='toolbar'>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/sales/daily-sales' && 'active')
                  }
                  to='/sales/daily-sales'
                >
                  Daily Sales
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/sales/appointment-list' && 'active')
                  }
                  to='/sales/appointment-list'
                >
                  Appointments
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/sales/sales-list' && 'active')
                  }
                  to='/sales/sales-list'
                >
                  Sales history
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/sales/voucher-list' && 'active')
                  }
                  to='/sales/voucher-list'
                >
                  Vouchers
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className={
                    `nav-link text-active-primary me-6 ` +
                    (location.pathname === '/sales/waiting-list' && 'active')
                  }
                  to='/sales/waiting-list'
                >
                  Cancellation List
                </Link>
              </li>
            </ul>
            <button
              type="button"
              style={{background: '#ebc11a'}}
              onClick={handleRedirectVideoSection}
              className='btn btn-sm ms-auto text-light text-nowrap'
            >
              How To
            </button>
          </div>
        </div>

        <Switch>
          <Route path='/sales/daily-sales'>
            <DailySales />
          </Route>
          <Route path='/sales/appointment-list'>
            <Appointments className='' />
          </Route>
          <Route path='/sales/sales-list'>
            <SalesHistory className='' />
          </Route>
          <Route path='/sales/voucher-list'>
            <VoucherList className='' />
          </Route>
          <Route path='/sales/waiting-list'>
            <WaitingList className='' />
          </Route>
        </Switch>
      </>
    )
}

export { SalesWrapper }