/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap-v5";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { IGuest } from "../../../../../types";
import { PRODUCT_CREATE } from '../../../../../gql/Mutation';
import { ALL_CLIENTS, SINGLE_CLIENT } from '../../../../../gql/Query';
import moment from 'moment';

type Props = {
  className: string
}

type IUsers = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  mobile: string;
  user_type: string;
  client_info: string;
  email_notification: boolean;
  marketing_notification: boolean;
  language: string;
  additional_mobile: string;
  client_source: string;
  display_booking: boolean;
  client_block:{
    block_with_video: boolean;
    block_without_video:  boolean;
  }
}

const ClientList: React.FC<Props> = ({ className }) => {
  const [paginate, setPaginate] = useState<any>([]);
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [singleClient, setSingleClient] = useState<any>({})
  const [clientId, setClientId] = useState("");
  const [users, setUsers] = useState<IUsers[]>([]);
  const [searchWord, setSearchWord] = useState("");
  const [count, setCount] = useState(10);
  const { data: userData, error: userError, loading: userLoading, refetch } = useQuery(ALL_CLIENTS, {
    variables: {
      search: searchWord,
      count: count,
      page: 1,
    }
  });
  const LoadMoreList = () => {
    setCount(count + 10)
  }

  const [runQuery, { data: sClientData, error: sClientError, loading: sClientLoading }] = useLazyQuery(SINGLE_CLIENT, {
    variables: {
      id: clientId
    }
  })
  const handleViewClient = (id: any) => {
    setClientId(id);
    runQuery();
  }

  useEffect(() => {
    if (sClientData) {
      // console.log(sClientData)
      setSingleClient(sClientData.client)
      setLoading2(false)
    }
    if (sClientLoading) {
      setSingleClient({})
      setLoading2(true)
    }
  }, [sClientData, sClientLoading])

  useEffect(() => {
    if (userLoading) {
      setLoading(true)
    }
    if (userData) {
      refetch();
      setUsers(userData.clients?.data)
      // console.log("user data",userData.clients?.data)
      setPaginate(userData.clients?.paginatorInfo)
      setLoading(false)
    }
  }, [userData, userLoading])
// console.log(paginate)
  const handleSearch = (e: any) => {
    setSearchWord([e.target.name] = e.target.value);
  }
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div className="d-flex justify-content-between align-items-center">
          <input type="text" className="form-control tsearch" placeholder="Search by name, emial or mobile number" onChange={handleSearch} />
          {/* <button className="btn btn-pd btn-light">Filters</button> */}
        </div>
        <div className="tselectWrap d-flex align-items-center">
          {/* <span className="me-3 text-muted">Sort by</span>
          <div>
            <select className="form-control tselect">
              <option>First Name</option>
              <option>Last Name</option>
              <option>Gender</option>
            </select>
          </div> */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder bg-light text-muted'>
                {/* <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-13-check'
                    />
                  </div>
                </th> */}
                <th className='min-w-150px ps-4'>Name</th>
                <th className='min-w-120px'>Email</th>
                <th className='min-w-140px'>Mobile</th>
                <th className='min-w-140px'>Status</th>
                <th className='pe-4 min-w-100px text-end rounded-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {
                loading && <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
              {
                users.map(user => (<tr key={user.id}>

                  <td className="ps-4">
                    <span className='text-dark fw-bolder fs-6'>
                      {`${user?.first_name} ${user?.last_name}`} {user?.client_source === 'Online' && <span className="text-muted">({user?.client_source})</span>}
                    </span>
                  </td>
                  <td>
                    <span className='text-dark fw-bolder d-block mb-1 fs-6'>
                      {user?.email ? user?.email : "N/A"}
                    </span>

                  </td>
                  <td>
                    <span className='text-dark fw-bolder d-block mb-1 fs-6'>
                      {user?.mobile ? user?.mobile : "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className='text-dark fw-bolder d-block mb-1 fs-6'>
                      {
                        user && user.client_block !== null 
                             && user.client_block?.block_with_video  
                            || user.client_block?.block_without_video ?  
                             <span style={{color: 'red'}}>BLOCKED</span>
                             : 
                             <span style={{color:'green'}}>ACTIVE</span>
                      }
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <i className="far fa-eye btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted me-2"
                      onClick={() => handleViewClient(user.id)}
                      id="kt_drawer_example_basic_button"></i>
                    <Link to={`/guest/edit/${user.id}`}><i className="far fa-edit btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted"></i></Link>

                  </td>
                </tr>))
              }
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      <div
        id="kt_drawer_example_basic"

        className="bg-white"
        data-kt-drawer="true"
        data-kt-drawer-activate="true"
        data-kt-drawer-toggle="#kt_drawer_example_basic_button"
        data-kt-drawer-close="#kt_drawer_example_basic_close"
        data-kt-drawer-width="420px"
      >
        {
          loading2 &&
          <div className="text-center d-flex justify-content-center align-items-center">
            <div className="spinner-grow " role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow " role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow " role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
        {
          !loading2 && singleClient &&
          <div className="service-details-wrap">
            <h2 className="top-title">Guest Details</h2>
            <Card className="primary-bx-shadow s-details-card mt-0">
              <div className="form-heading">
                <h2 className="section-title mb-0">Basic info</h2>
              </div>
              <div className="p-30">
                <p className="d-flex justify-content-between">Name<span>{`${singleClient?.first_name} ${singleClient?.last_name}`}</span></p>
                <p className="d-flex justify-content-between">Email <span>{singleClient?.email ? singleClient?.email : "N/A"}</span></p>
                <p className="d-flex justify-content-between">Mobile<span>{singleClient?.mobile ? singleClient?.mobile : "N/A"}</span></p>
                <p className="d-flex justify-content-between">Gender<span>{singleClient?.gender ? singleClient?.gender : "N/A"}</span></p>
                <p className="d-flex justify-content-between">Birth Date<span>{singleClient?.dob ? moment.unix(+singleClient?.dob!).format("DD/MM/YYYY") : "N/A"}</span></p>
                <p className="d-flex justify-content-between">Address<span>{singleClient?.address ? singleClient?.address : "N/A"}</span></p>
                <p className="d-flex justify-content-between">Guest source<span>{singleClient?.client_source}</span></p>
                <p className="d-flex justify-content-between">Guest Info<span>{singleClient?.client_info ? singleClient?.client_info : "N/A"}</span></p>
                <p className="d-flex justify-content-between">Display booking<span>{singleClient?.display_booking === true ? "On":"Off"}</span></p>
                  <p className="d-flex justify-content-between">Email Notification<span>{singleClient?.email_notification === true ? "On" : "Off"}</span></p>
                  <p className="d-flex justify-content-between">Marketing Notification<span>{singleClient?.marketing_notification === true ? "On" : "Off"}</span></p>
              </div>
            </Card>
          </div>
        }
      </div>
      {/* begin::Body */}
      <div className="text-center">
        {
          count < paginate.total && (
            <button className="btn btn-primary text-center" onClick={LoadMoreList}>Load More</button>
          )
        }
      </div>
    </div>
  )
}

export { ClientList }
