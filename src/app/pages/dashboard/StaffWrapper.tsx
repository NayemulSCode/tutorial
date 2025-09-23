import { useIntl } from "react-intl"
import React, { FC, useState } from "react"
import { Link, useLocation, Switch, Route } from 'react-router-dom'
import { PageTitle } from "../../../_metronic/layout/core"
import StaffMember from "./components/staff/StaffMember"
import Closedate from "./components/staff/Closedate"
import { TablesWidget18 } from "../../../_metronic/partials/widgets"
import Schedule from "./components/staff/Schedule"
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap-v5";
import {StaffEdit} from "./components/staff/StaffEdit"
import { xllExportUrl } from "../../modules/util"
// import DatePicker from 'react-datepicker'

const StaffWrapper: FC = () => {
    document.title = "Staff";
    const intl = useIntl()
    const location = useLocation()
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const businessID = parseData.business_id;
    const hnaldeDownloadxxl = () => {
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=staff&start_date=&end_date=`)
    }
    return (
        <>
            <div className="staff-wrap">
                <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.Staff' })}</PageTitle>
                <div className="toolbar">
                    <div className='d-flex overflow-auto'>
                        <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                            <li className='nav-item'>
                                <Link to="/business/settings" className="btn btn-primary btn-sm add-product">Back</Link>
                                {/* <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname === '/staff/employees' && 'active')
                                    }
                                    to='/staff/employees'
                                >
                                    All
                                </Link> */}
                            </li>
                            <li className='nav-item remove'>
                                <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname === '/staff/schedule' && 'active')
                                    }
                                    to='/staff/schedule'
                                >
                                    Staff working hours
                                </Link>
                            </li>
                            <li className='nav-item remove'>
                                <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname === '/staff/closed-dates' && 'active')
                                    }
                                    to='/staff/closed-dates'
                                >
                                    Closed dates
                                </Link>
                            </li>
                            <li className='nav-item remove'>
                                <Link
                                    className={
                                        `nav-link text-active-primary me-6 ` +
                                        (location.pathname === '/staff/permissions' && 'active')
                                    }
                                    to='/staff/permissions'
                                >
                                    User permissions
                                </Link>
                            </li>
                        </ul>
                    </div>
                        {/* <input type="text" placeholder="Search by name or title" className="form-control tsearch" /> */}
                        <div className="d-flex">
                            <DropdownButton className="option-btn" id="dropdown-basic-button" title="Export">
                                <Link to=''
                                    onClick={hnaldeDownloadxxl}
                                >
                                    <Dropdown.Item>Download Excel</Dropdown.Item>
                                </Link>
                            </DropdownButton>
                            <Link to="/staff-add" className="btn secondaryBtn ms-5 add-product">Add new staff</Link>
                        </div>
                </div>
            </div>

            <Switch>
                <Route path="/staff/edit/:id">
                    <StaffEdit />
                </Route>
                <Route path="/staff/schedule">
                    <Schedule />
                </Route>
                <Route path=''>
                    <StaffMember />
                </Route>
                <Route path='/staff/closed-dates'>
                    <Closedate />
                </Route>

            </Switch>
        </>
    )
}

export { StaffWrapper }