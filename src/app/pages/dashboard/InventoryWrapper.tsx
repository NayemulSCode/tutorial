import { useIntl } from "react-intl"
import React, { FC,useContext,useState } from "react"
import { Link, useLocation, Switch, Route, useHistory } from 'react-router-dom'
import { PageTitle } from "../../../_metronic/layout/core"
import { AppointmentChart } from "../../../_metronic/partials/widgets/charts/AppointmentChart"
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap-v5";
import Products from "./components/inventory/Products"
import { StockTakes } from "./components/inventory/StockTakes"
import Suppliers from "./components/inventory/Suppliers"
// import ProductAdd from "./components/inventory/ProductAdd"
import Orders from "./components/inventory/ProductCategory"
// import BrandAdd from "./components/inventory/BrandAdd"
import { Category } from "./components/inventory/Category"
// import CategoryAdd from "./components/inventory/CategoryAdd"
import ProductEdit from "./components/inventory/ProductEdit"
import BrandAddModal from "./components/inventory/BrandAddModal"
import CategoryAddModal from "./components/inventory/CategoryAddModal"
import { AppContext } from "../../../context/Context"
import { xllExportUrl } from "../../modules/util"

const InventoryWrapper: FC = () => {
    document.title = "Inventory";
    const intl = useIntl()
    const history = useHistory()
    const location = useLocation()

    const [showBrand, setShowBrand] = useState<boolean>(false);
    const handleCloseBrand = () => setShowBrand(false);
    const handleShowBrand = () => {
        setShowBrand(true);
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
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=product&start_date=&end_date=`)
    }
    const {addVideoItem} = useContext(AppContext)
    const handleRedirectVideoSection = () => {
      addVideoItem(6)
      history.push('/setup/how-to')
    }
    return (
      <>
        <div className='inventory-wrap'>
          <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.Inventory'})}</PageTitle>

          <div className='toolbar'>
            <div className='d-flex overflow-auto'>
              <ul className='nav nav-stretch nav-line-tabs toolbar-tab nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/inventory/products' && 'active')
                    }
                    to='/inventory/products'
                  >
                    Products
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/inventory/product-brand' && 'active')
                    }
                    to='/inventory/product-brand'
                  >
                    Brands
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/inventory/product-category' && 'active')
                    }
                    to='/inventory/product-category'
                  >
                    Categories
                  </Link>
                </li>
                <li className='nav-item remove'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/inventory/suppliers' && 'active')
                    }
                    to='/inventory/suppliers'
                  >
                    Suppliers
                  </Link>
                </li>
              </ul>
            </div>
            <div className='d-flex justify-content-between'>
              <div className='d-flex tService'>
                <DropdownButton className='option-btn' id='dropdown-basic-button' title='Export'>
                  {/* <Dropdown.Item href="#/action-1">Download PDF</Dropdown.Item> */}
                  <Link to='' onClick={hnaldeDownloadxxl}>
                    <Dropdown.Item>Download Excel</Dropdown.Item>
                  </Link>
                </DropdownButton>
                <DropdownButton
                  className='add-btn btn2 add-service-btn'
                  id='dropdown-basic-button'
                  title='Create'
                >
                  <Link to='/product-add' className='dropdown-link'>
                    New product
                  </Link>
                  <Link to='/treatement-types/add'>
                    <Dropdown.Item onClick={handleShowBrand}>New Brand</Dropdown.Item>
                  </Link>
                  <Link to='/category/add'>
                    <Dropdown.Item onClick={handleShowCat}>New category</Dropdown.Item>
                  </Link>
                </DropdownButton>
                <button
                  type='button'
                  style={{background: '#ebc11a'}}
                  onClick={handleRedirectVideoSection}
                  className='btn btn-sm text-light ms-5'
                >
                  How To
                </button>
              </div>
              <BrandAddModal handleClose={handleCloseBrand} show={showBrand} />
              <CategoryAddModal handleClose={handleCloseCat} show={showCat} />
            </div>
          </div>
        </div>

        <Switch>
          <Route path='/inventory/products'>
            <Products />
          </Route>
          <Route path='/inventory/product-brand'>
            <StockTakes className='' />
          </Route>
          {/* <Route path='/inventory/brand-add'>
                    <BrandAdd />
                </Route> */}
          <Route path='/inventory/product-category'>
            <Category className='' />
          </Route>
          {/* <Route path="/inventory/category-add">
                    <CategoryAdd />
                </Route> */}
          <Route path='/inventory/suppliers'>
            <Suppliers />
          </Route>
          {/* <Route path="/inventory/product-add">
                    <ProductAdd />
                </Route> */}
          <Route path='/inventory/product-edit/:id'>
            <ProductEdit />
          </Route>
        </Switch>
      </>
    )
}

export { InventoryWrapper }