import { useIntl } from "react-intl"
import React, { FC, useContext } from "react"
import { Link, useHistory } from 'react-router-dom'
import { PageTitle } from "../../../_metronic/layout/core"
import { Dropdown, DropdownButton } from "react-bootstrap-v5";
import { AppointmentChart } from "../../../_metronic/partials/widgets/charts/AppointmentChart"
import { Search } from "../../../_metronic/partials/layout/search/Search"
import { ClientList } from "./components/clients/ClientList";
import { AppContext } from "../../../context/Context";
import { xllExportUrl } from "../../modules/util";


const ClientsWrapper: FC = () => {
    document.title = "Guest";
    const intl = useIntl()
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const businessID = parseData.business_id;
    const hnaldeDownloadxxl=()=>{
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=guest&start_date=&end_date=`)
    }
    const history = useHistory();
    const {addVideoItem} = useContext(AppContext);
    const handleRedirectVideoSection = () => {
      addVideoItem(4)
      history.push('/setup/how-to')
    }
    return (
      <>
        <div className='ClientsWrap ptc'>
          <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.Clients'})}</PageTitle>
          <div className='toolbar client-toolbar'>
            {/* <p className="mb-0">Client List &nbsp;<span className="count"></span></p> */}
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
              <li className='nav-item'>All</li>
            </ul>
            <div className='d-flex'>
              <DropdownButton className='option-btn' id='dropdown-basic-button' title='Export'>
                {/* <Dropdown.Item >Options</Dropdown.Item> */}
                <Link to='' onClick={hnaldeDownloadxxl}>
                  <Dropdown.Item>Download Excel</Dropdown.Item>
                </Link>
              </DropdownButton>
              {/* <Link to='/add-guest' className='btn secondaryBtn ms-5 add-product'>
                Create Guest
              </Link> */}
              <button
                type='button'
                style={{background: '#ebc11a'}}
                onClick={handleRedirectVideoSection}
                className='btn btn-sm text-light ms-5'
              >
                How To
              </button>
            </div>
          </div>
          <ClientList className='' />
        </div>
      </>
    )
}

export { ClientsWrapper }