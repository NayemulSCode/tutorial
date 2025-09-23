import React, { FC, useState, useEffect } from "react"
import './Services.css'
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { SERVICE_CATEGORIES, GET_ALL_SERVICES, SINGLE_SERVICE , ALL_STAFF_INFO} from "../../../../../gql/Query";
import {
  SERVICE_DELETE,
  SERVICE_ACTIVE_OR_INACTIVE,
  ONLINE_ACTIVE_OR_INACTIVE,
} from '../../../../../gql/Mutation'
import { Card, Table, Modal,Form } from "react-bootstrap-v5";
import { IService, IservicePricing } from '../../../../../types';
import { Link } from 'react-router-dom';
import ModalWidgets from '../../../../../app/modules/widgets/components/ModalWidgets'
import { currency } from "../../../../modules/util";
import { useTostMessage } from "../../../../modules/widgets/components/useTostMessage";

interface IServiceCategory {
    id: number;
    name: string;
}

const Services: FC = () => {
    const {showToast} = useTostMessage()
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [categories, setCategories] = useState<IServiceCategory[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    console.log("🚀 ~ services:", services)
    const [singleService, setSingleService] = useState<IService>();
    const [staff, setStaff] = useState<any>([]);
    const [serviceId, setServiceId] = useState(0);
    const [price, setPrice] = useState<IservicePricing[]>([]);
    const [singleServicePricing, setSingleServicePricing] = useState<IservicePricing[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const [deleteID, setDeleteID] = useState(0)

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const [runQuery, { data: singleServiceData, error: singleServiceError, loading: singleServiceLoading }] = useLazyQuery(SINGLE_SERVICE, {
        variables: {
            id: serviceId
        }
    })
    const { data: allCategories, error: categoriesError, loading: categoryLoding } = useQuery(SERVICE_CATEGORIES, {
        variables: {
            type: "",
            count: 20,
            page: 1
        }
    })
    const { data: allStaff, error: allStaffError, loading: allStaffLoading } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: 100,
            page: 1
        },
        fetchPolicy: "network-only"
    })

    const { data: serviceData, error: serviceError, loading: serviceLoading, refetch } = useQuery(GET_ALL_SERVICES, {
        variables: {
            type: "",
            count: 100,
            page: 1
        }
        //     ,
        //    fetchPolicy: "network-only"
    })
    console.log("🚀 ~ serviceData:", serviceData)

    const handleViewService = (id: any) => {
        setServiceId(id);
        runQuery();
    }
    const [deleteService] = useMutation(SERVICE_DELETE, {
        refetchQueries: [{ query: GET_ALL_SERVICES, variables: { type: "", count: 100, page: 1 } }],
        awaitRefetchQueries: true,
    });

    const confirmation = (status: any) => {
        if (status === 0) {
            // console.log(status);
        }
        if (status === 1) {
            handleServiceDelete(deleteID)
        }
    }

    const handleServiceDelete = (id: number) => {
        if (id) {
            deleteService({
                variables: {
                    id: id,
                }
            }).then(({ data }) => {
                if (data) {
                    showToast('Service Deleted', 'success');
                }
            })
        }
    }
    useEffect(() => {
        if (singleServiceData) {
            setSingleService(singleServiceData.service);
            setSingleServicePricing(singleServiceData?.service.service_pricings)
            setLoading2(false);
        }
        if (singleServiceLoading) {
            setLoading2(true);
        }
    }, [singleServiceData, singleServiceLoading])

    useEffect(() => {
        if (categoryLoding) {
            setCategories([])
            setLoading(true);
        }
        if (allCategories) {
            console.log('🚀 ~ useEffect ~ allCategories:', allCategories)
            setCategories(allCategories.serviceCategories.data)
            setLoading(false)
        }
    }, [allCategories, categoryLoding])
    useEffect(() => {
        if (allStaff) {
            // console.log(allStaff)
            setStaff(allStaff.staffs.data)
        }
    }, [ allStaff])

    const myStaff = staff.filter((staff: any) => singleService && singleService.staffs.includes(+staff.id))
    // console.log("myStaff", myStaff)
    useEffect(() => {
        if (serviceData) {
            refetch();
            setServices(serviceData.services.data);
            let uniquePricing = [];
            let service_pricing = [];
            for (let price of serviceData?.services?.data) {
                for (let data of price?.service_pricings) {
                    // data['service_id'] = price.id
                    service_pricing.push(data);
                }
            }
            uniquePricing = service_pricing.filter((v, i, a) => a.findIndex(t => (t.service_id === v.service_id)) === i)
            setPrice(uniquePricing);
            // console.log(serviceData)
        }
        if (serviceError) {
            // console.log("service error", serviceError)
        }
    }, [serviceData]);
    const [updateServiceStatus] = useMutation(SERVICE_ACTIVE_OR_INACTIVE,{
        refetchQueries: [{ query: GET_ALL_SERVICES, variables: { type: "", count: 100, page: 1 } }],
        awaitRefetchQueries: true,
    })
    const [updateServiceOnlineStatus] = useMutation(ONLINE_ACTIVE_OR_INACTIVE, {
      refetchQueries: [{query: GET_ALL_SERVICES, variables: {type: '', count: 100, page: 1}}],
      awaitRefetchQueries: true,
    })
    const handleServiceEnable=(id:any, status: any)=>{
        updateServiceStatus({
        variables:{
            id: id,
            status: !status
        }
        }).then(({data})=>{
            if(data){
                showToast(data.updateServiceStatus.message, 'success');
            }
        })
    }
    const handleOnlineEnable=(id:any, status: any) => {
        updateServiceOnlineStatus({
          variables: {
            id: id,
            online_booking: !status,
          },
        }).then(({data}) => {
          if (data) {
           showToast(data.updateServiceOnlineStatus.message, 'success');
          }
        })
    }
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;

    return (
        <>
            {
                loading ?
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
            :
            categories?.length === 0 ? <div className="text-center d-flex justify-content-center align-items-center">
                <h1>Service list not found!</h1>
            </div>
            :
            categories?.map((category, i) => {
                    return (
                      <Card className='mb-30' key={category.id}>
                        <Card.Body>
                          <h3>{category?.name}</h3>
                          <div className='table-responsive'>
                            <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
                              <thead>
                                <tr className='fw-bolder bg-light text-muted'>
                                  <th className='ps-4'>Name</th>
                                  <th>Duration</th>
                                  <th>Price</th>
                                  <th className='text-center'>Online Booking</th>
                                  <th className='text-center'>Active Service</th>
                                  <th className='pe-4 text-end rounded-end'>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {services.map((product) => (
                                  <tr key={product.id}>
                                    {category.name == product?.service_category_info?.name && (
                                      <>
                                        <td className='ps-4 text-dark fw-bolder fs-6'>
                                          {product.name}
                                        </td>
                                        {/* <td>{`${price[0]?.duration} minute`}</td>
                                                                <td>{`BDT ${price[0]?.price}`}</td> */}
                                        {price.map(
                                          (i, index) =>
                                            i.service_id == product.id && (
                                              <>
                                                {
                                                  <>
                                                    <td className='text-dark fw-bolder fs-6'>
                                                      {i.duration + 'min'}
                                                    </td>
                                                    <td className='text-dark fw-bolder fs-6'>
                                                      {currency(countryName)}
                                                      {i.price}
                                                    </td>
                                                  </>
                                                }
                                              </>
                                            )
                                        )}
                                        <td className='pe-4 text-center'>
                                          <Form.Check
                                            className='service_switch'
                                            type='switch'
                                            id='custom-switch'
                                            defaultChecked={
                                              product.enable_online_booking ? true : false
                                            }
                                            onClick={() => {
                                              handleOnlineEnable(
                                                product.id,
                                                product.enable_online_booking
                                              )
                                            }}
                                          />
                                        </td>
                                        <td className='pe-4 text-center'>
                                          <Form.Check
                                            className='service_switch'
                                            type='switch'
                                            id='custom-switch'
                                            defaultChecked={product.status ? true : false}
                                            onClick={() => {
                                              handleServiceEnable(product.id, product.status)
                                            }}
                                          />
                                        </td>
                                        <td className='pe-4 text-end d-flex align-items-center justify-content-end'>
                                          <i
                                            className='far fa-eye btn btn-icon btn-bg-light text-hover-primary btn-sm me-2 text-muted'
                                            onClick={() => handleViewService(product.id)}
                                            id='kt_drawer_example_basic_button'
                                          ></i>
                                          <Link to={`/services/edit/${product.id}`}>
                                            <i className='far fa-edit btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted ms-4'></i>
                                          </Link>
                                          {/* <i className="far fa-trash-alt btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted"
                                                                        onClick={() => openDeleteModal(product.id)}
                                                                    ></i> */}
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card.Body>
                      </Card>
                    )
                }
                )
            }
            <ModalWidgets
                closeDeleteModal={closeDeleteModal}
                deleteModal={deleteModal}
                confirmation={confirmation}
            />
            <div
                id="kt_drawer_example_basic"

                className="bg-white"
                data-kt-drawer="true"
                data-kt-drawer-activate="true"
                data-kt-drawer-toggle="#kt_drawer_example_basic_button"
                data-kt-drawer-close="#kt_drawer_example_basic_close"
            // data-kt-drawer-width="420px"
            >
                {/* <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span className="svg-icon svg-icon-2x"></span>
                </div> */}

                {
                    loading2 &&
                    <div className="service-details-wrap text-center d-flex justify-content-center align-items-center">
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
                {!loading2 && <div className="service-details-wrap">
                    <h2 className="top-title">Services Details</h2>
                    <Card className="primary-bx-shadow s-details-card mt-0">
                        <div className="form-heading">
                            <h2 className="section-title mb-0">Basic info</h2>
                        </div>
                        <div className="p-30">
                            <p className="mt-0 d-flex justify-content-between">Category Name <span>{singleService?.service_category_info?.name ? singleService?.service_category_info?.name : "N/A"}</span></p>
                            <p className="d-flex justify-content-between">Service Name <span>{singleService?.name ? singleService?.name : "N/A"}</span></p>
                            <p className="d-flex justify-content-between">Treatment type <span>{singleService?.treatment_type_info?.name ? singleService?.treatment_type_info?.name : "N/A"}</span></p>
                            <p className="d-flex justify-content-between">Online Booking Status <span>{singleService?.enable_online_booking ? singleService?.enable_online_booking.toString() : "N/A"}</span></p>
                            <p className="d-flex justify-content-between">Service for <span>{singleService?.service_available_for ? singleService?.service_available_for : "N/A"}</span></p>
                            {/* <p className="d-flex justify-content-between">Tax <span>{singleService?.tax}</span></p> */}
                            <p className="d-flex justify-content-between">Staffs <span>{myStaff && myStaff.map((itm: any) => <><span>{itm.name}</span> &nbsp;</>)}</span></p>
                            {/* <p className="mb-0 d-flex justify-content-between">Vouchers <span>{singleService?.voucher_sale}</span></p> */}
                        </div>
                    </Card>
                    {
                        singleServicePricing?.map((pricing, i) =>
                            <>
                                <Card className="primary-bx-shadow s-details-card">
                                    <div className="form-heading">
                                        <h2 className="section-title mb-0">Pricing {+i + 1}:</h2>
                                    </div>
                                    <div className="p-30">
                                        <p className="mt-0 d-flex justify-content-between">Name <span>{pricing?.pricing_name ? pricing?.pricing_name : "N/A"}</span></p>
                                        <p className="d-flex justify-content-between">Duration <span>{pricing?.duration ? pricing?.duration+"min" : "N/A"}</span></p>
                                        <p className="d-flex justify-content-between">Price <span>{pricing?.price ? `${currency(countryName)}${pricing?.price}` : "N/A"}</span></p>
                                        {/* <p className="d-flex justify-content-between">Price Type <span>{pricing?.priceType}</span></p> */}
                                        <p className="mb-0 d-flex justify-content-between">Special Price <span>{Number(pricing?.special_price) > 0 ? `${currency(countryName)}${pricing?.special_price}` : "N/A"}</span></p>
                                    </div>
                                </Card>
                            </>)
                    }
                    <Card className="primary-bx-shadow s-details-card">
                        <div className="form-heading">
                            <h2 className="section-title mb-0">Description</h2>
                        </div>
                        <div className="p-30">
                            <span>{singleService?.description ? singleService?.description : "N/A"}</span>
                        </div>
                    </Card>

                    {/* <h5 className="d-flex justify-content-between">Brand <span>{service?.brand_info?.name}</span></h5>
                                    <h5 className="d-flex justify-content-between">Product category <span>{service?.category_info?.name}</span></h5>
                                    <h5 className="d-flex justify-content-between">Amount <span>{service?.amount}{service?.mesaurement_type}</span></h5>
                                    <hr />
                                    <h5 className="">Short description</h5>
                                    <span>{itm?.short_description}</span>
                                    <h5 className="mt-2">Product description</h5>
                                    <span>{itm?.description}</span> */}
                </div>
                }
            </div>
            {/* <TablesWidget13 className='mt-5' />
            <TablesWidget14 className='mt-5' /> */}
        </>
    )
}

export default Services;
