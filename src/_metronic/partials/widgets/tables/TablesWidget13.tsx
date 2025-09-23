/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTSVG } from '../../../helpers'
import {Link} from 'react-router-dom'
import { Collapse, Button } from 'react-bootstrap-v5'
import { useQuery } from '@apollo/client'
import { SERVICE_CATEGORIES } from '../../../../gql/Query'

// interface IServiceCategory {
//   id: string;
//   name: string;
//   description: string;
// }

type Props = {
  className: string
}

const TablesWidget13: React.FC<Props> = ({ className }) => {
  // service item collapse
  const [openserviceitem, setOpenserviceitem] = useState<boolean>(false);
  // const [categories, setCategories] = useState<IServiceCategory[]>([])
  // const { data: allCategories, error: categoriesError, loading: categoryLoding, refetch } = useQuery(SERVICE_CATEGORIES, {
  //   variables: {
  //     type:"select",
  //     count: 10,
  //     page: 1
  //   }
  // })
  // useEffect(()=>{
  //   if(allCategories){
  //     console.log("service categories", allCategories)
  //   }
  // }, [allCategories])
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="service-item-wrap">
        <div
          onClick={() => setOpenserviceitem(!openserviceitem)}
          aria-controls="service-item-collapse"
          aria-expanded={openserviceitem}
        >
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Hair</span>
            </h3>
          </div>
        </div>
        <div className='card-toolbar service-card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-flex btn-light btn-active-dark fw-bolder'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            Actions
          </button>
          {/* begin::Menu 2 */}
          <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px'
            data-kt-menu='true'
          >
            {/* begin::Menu separator */}
            <div className='separator mb-3 opacity-75'></div>
            {/* end::Menu separator */}
            {/* begin::Menu item */}
            <div className='menu-item px-3 action-service-dropdown-item'>
              <Link to='/offer-step2' className='menu-link px-3'>
                <i className="fa fa-plus-circle me-1"></i>
                Add new service
              </Link>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className='menu-item px-3 action-service-dropdown-item'>
              <a href='#' className='menu-link px-3'>
                <i className="fa fa-edit me-1"></i>
                Edit Category
              </a>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className='menu-item px-3 action-service-dropdown-item'>
              <a href='#' className='menu-link px-3 delete-category-icon'>
                <i className="fa fa-trash me-1"></i>
                Delete Category
              </a>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu separator */}
            <div className='separator mb-3 opacity-75 border-0'></div>
            {/* end::Menu separator */}
          </div>
          {/* end::Menu 2 */}
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <Collapse in={openserviceitem}>
        <div id="service-item-collapse">
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder bg-light text-muted'>
                    <th className='ps-4 min-w-145px rounded-start'>Service</th>
                    <th className='min-w-140px'>Duration</th>
                    <th className='min-w-120px'>Amount</th>
                    <th className='pe-4 min-w-100px text-end rounded-end'>Actions</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  <tr>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
                        Womens haircut
                      </a>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        45 min
                      </a>

                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        €350
                      </a>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <Link
                          to='/'
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTSVG path='/media/icons/duotune/art/art012.svg' className='svg-icon-3' />
                        </Link>
                        <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                          <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
                        Womens haircut
                      </a>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        45 min
                      </a>

                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        €350
                      </a>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <Link
                          to='/'
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTSVG path='/media/icons/duotune/art/art012.svg' className='svg-icon-3' />
                        </Link>
                        <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                          <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
                        Womens haircut
                      </a>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        45 min
                      </a>

                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        €350
                      </a>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <Link
                          to='/'
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTSVG path='/media/icons/duotune/art/art012.svg' className='svg-icon-3' />
                        </Link>
                        <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                          <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
                        Womens haircut
                      </a>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        45 min
                      </a>

                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        €350
                      </a>
                    </td>
                    <td>
                      <div className='d-flex justify-content-end flex-shrink-0'>
                        <Link
                          to='/'
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTSVG path='/media/icons/duotune/art/art012.svg' className='svg-icon-3' />
                        </Link>
                        <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                          <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                        </a>
                      </div>
                    </td>
                  </tr>

                </tbody>
                {/* end::Table body */}
              </table>
              {/* end::Table */}
            </div>
            {/* end::Table container */}
          </div>
        </div>
      </Collapse>
      {/* begin::Body */}
    </div>
  )
}

export { TablesWidget13 }
