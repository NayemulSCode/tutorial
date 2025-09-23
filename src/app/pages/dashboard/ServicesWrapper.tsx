import { useIntl } from "react-intl"
import React, { FC, useContext, useState} from "react"
import { PageTitle } from "../../../_metronic/layout/core"
import { AppointmentChart } from "../../../_metronic/partials/widgets/charts/AppointmentChart"
import { Link,useLocation, Switch, Route, useHistory } from 'react-router-dom';
import Services from "./components/services/Services";
import PaidPlans from "./components/services/PaidPlans";
import { Button, Dropdown, DropdownButton } from "react-bootstrap-v5";
import AddCategoryModal from "../dashboard/components/services/AddCategoryModal";
import AddTreatmentTypeModal from "../dashboard/components/services/AddTreatmentTypeModal";
import {TreatmentType} from "./components/services/Treatment/TreatmentType";
import { ServiceCategory } from "./components/services/Category/ServiceCategory";
import  EditService  from "./components/services/editservice/EditService";
import { AppContext } from "../../../context/Context";
import { xllExportUrl } from "../../modules/util";

const ServicesWrapper: FC = () => {
    document.title = "Services";
    const intl = useIntl()
    const location = useLocation()

    const [showTreat, setShowTreat] = useState<boolean>(false);
    const handleCloseTreat = () => setShowTreat(false);
    const handleShowTreat = () => {
        setShowTreat(true);
    }
    const [showCat, setShowCat] = useState<boolean>(false);
    const handleCloseCat = () => setShowCat(false);
    const handleShowCat = () => {
        setShowCat(true);
    }
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const businessID = parseData.business_id;
    const hnaldeDownloadxxl = () => {
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=service&start_date=&end_date=`)
    }
    const history = useHistory();
    const {addVideoItem} = useContext(AppContext);
    const handleRedirectVideoSection = () => {
      addVideoItem(5);
      history.push('/setup/how-to');
    }
    return (
      <>
        <div className='ServicesWrap ptc'>
          <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.Services'})}</PageTitle>

          <div className='toolbar services-toolbar'>
            <div className='d-flex overflow-auto'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/services/list' && 'active')
                    }
                    to='/services/list'
                  >
                    Services
                  </Link>
                </li>
                {/* <li className='nav-item'>
                            <Link
                                className={
                                    `nav-link text-active-primary me-6 ` +
                                    (location.pathname === '/services/paid-plans' && 'active')
                                }
                                to='/services/paid-plans'
                            >
                                Paid plans
                            </Link>
                        </li> */}
                {/* <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/services/treatment-types' && 'active')
                    }
                    to='/services/treatment-types'
                  >
                    Treatment Types
                  </Link>
                </li> */}
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/services/categories' && 'active')
                    }
                    to='/services/categories'
                  >
                    Service Category
                  </Link>
                </li>
              </ul>
            </div>
            <div className='d-flex justify-content-between'>
              <div className='d-flex tService'>
                <button
                  type='button'
                  style={{background: '#ebc11a'}}
                  onClick={handleRedirectVideoSection}
                  className='btn btn-sm text-light ms-5'
                >
                  How To
                </button>
                <DropdownButton
                  className='add-btn btn2 add-service-btn'
                  id='dropdown-basic-button'
                  title='Create'
                >
                  <Link to='/add-service' className='dropdown-link'>
                    New service
                  </Link>
                  {/* <Link to='/treatement-types/add'>
                    <Dropdown.Item onClick={handleShowTreat}>New treatement type</Dropdown.Item>
                  </Link> */}
                  <Link to='/category/add'>
                    <Dropdown.Item onClick={handleShowCat}>New category</Dropdown.Item>
                  </Link>
                </DropdownButton>
                <DropdownButton className='option-btn' id='dropdown-basic-button' title='Export'>
                  {/* <Dropdown.Item href="#/action-1">Download PDF</Dropdown.Item> */}
                  <Link to='' onClick={hnaldeDownloadxxl}>
                    <Dropdown.Item>Download Excel</Dropdown.Item>
                  </Link>
                </DropdownButton>
              </div>
              {/* <AddTreatmentTypeModal handleClose={handleCloseTreat} show={showTreat} /> */}
              <AddCategoryModal handleCloseCat={handleCloseCat} showCat={showCat} />
            </div>
          </div>
        </div>
        <Switch>
          <Route path='/services/edit/:id'>
            <EditService />
          </Route>
          <Route path='/services/list'>
            <Services />
          </Route>
          <Route path='/services/treatment-types'>
            <TreatmentType className='' />
          </Route>
          <Route path='/services/categories'>
            <ServiceCategory className='' />
          </Route>
        </Switch>
      </>
    )
}

export { ServicesWrapper }