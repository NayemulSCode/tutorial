import React, { FC, useState, useEffect, useContext } from "react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/client"
import { Link, useHistory } from "react-router-dom";
import { Card, Dropdown, DropdownButton, Modal } from "react-bootstrap-v5";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from '../../../../../../src/context/Context';
import { CSVLink } from "react-csv";
import { ALL_APPOINTMENTS, APPT_SERVICE_DETAIL, SINGLE_CLIENT, ALL_CHAIRS } from '../../../../../gql/Query';
import { APPOINTMENT_STATUS_UPDATE } from '../../../../../gql/Mutation';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { currency, xllExportUrl } from "../../../../modules/util";
import { useTostMessage } from "../../../../modules/widgets/components/useTostMessage";
import { IBuyerGuest } from "../../../../../types";
// import { Jutsu } from "react-jutsu/dist";

type Props = {
    className: string
}

const Appointments: React.FC<Props> = ({ className }) => {
    const history = useHistory();
    const { addGuests, addApptServices, addAppointmentSource } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(30);
    const [allAppointment, setAllAppointment] = useState([]);
    const [apptServiceDetail, setApptServiceDetail] = useState<any>([]);
    const [chairs, setChairs] = useState<any>([]);
    const [loading, setLoading] = useState(false)
    const [apptID, setApptID] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [guestID, setGuestID] = useState("");
    const [keyword, setKeyword] = useState("");
    const [loading2, setLoading2] = useState(false)
    // video call
    const [vattingCall, setVattingCall] = useState(false)
    const [apptGuest, setApptGuest] = useState<IBuyerGuest | undefined>();

    const [dateRange, setDateRange] = useState([new Date(), null]);
    const [startDate, endDate] = dateRange;

    // console.log(dateRange);
    // console.log(startDate, endDate);

    const LoadMoreList = () => {
        setCount(count + 20)
    }

    // export data
    const headers = [
        { label: "inv_no", key: "allAppointment.inv_no" },
        { label: "date", key: "allAppointment.date" },
        { label: "guest", key: "allAppointment.user_name" },
        { label: "status", key: "allAppointment.status" },
        { label: "payment status", key: "allAppointment.payment_status" },
        { label: "amount", key: "allAppointment.total_amount" }
    ];
    const csvReport = {
        data: allAppointment,
        headers: headers,
        filename: 'appointments.csv'
    };

    const [statusUpdateForAppointment] = useMutation(APPOINTMENT_STATUS_UPDATE)

    const { data: allApptData, loading: allApptDataLoading } = useQuery(ALL_APPOINTMENTS, {
        variables: {
            type: '',
            keyword: keyword,
            date_range: JSON.stringify(dateRange),
            count: count,
            page: 1,
        }
    })
    const { data: chairData, loading: chairDataLoading } = useQuery(ALL_CHAIRS, {
        variables: {
            count: 100,
            page: 1
        }
    })

    const [runQuery, { data: apptServiceData, loading: apptServiceLoading }] = useLazyQuery(APPT_SERVICE_DETAIL, {
        variables: {
            id: apptID
        }
    })

    const [guestFetch, { data: guestData }] = useLazyQuery(SINGLE_CLIENT, {
        variables: {
            id: guestID
        }
    })

    const handleViewService = (id: any, status: any, guest: any) => {
        setGuestID(guest)
        setApptID(id);
        setPaymentStatus(status);
        runQuery();
        guestFetch();
    }

    useEffect(() => {
        if (chairData) {
            // console.log(chairData.chairs.data);
            setChairs(chairData.chairs.data);
        }
    }, [chairData])

    useEffect(() => {
        if (allApptData) {
            // console.log(allApptData?.appointments?.data)
            setAllAppointment(allApptData?.appointments?.data)
            setPaginate(allApptData.appointments?.paginatorInfo)
            setLoading(false)
        }
        if (allApptDataLoading) {
            setLoading(true)
        }
    }, [allApptData, allApptDataLoading])
    useEffect(() => {
        if (guestData?.client) {
            setApptGuest(guestData?.client)
        }
    }, [guestData])

    useEffect(() => {
        if (apptServiceData) {
            // console.log('apptServiceData?.appointmentDetail:', apptServiceData?.appointmentDetail)
            setApptServiceDetail(
              apptServiceData?.appointmentDetail.map((item: any) => ({
                ...item,
                price: parseInt(item.price),
                special_price: parseInt(item.special_price),
              }))
            )
            addAppointmentSource({
                online: apptServiceData?.appointmentDetail[0]?.online,
                appt_id: apptServiceData?.appointmentDetail[0]?.appt_id,
                sale_id:0
            })
            // setApptServiceDetail([...apptServiceDetail, {
            //     id: apptServiceData?.appointmentDetail?.id,
            //     service_id: apptServiceData?.appointmentDetail?.service_pricing?.service_id,
            //     service_qty: 1,
            //     unit_price: apptServiceData?.appointmentDetail?.special_price ? apptServiceData?.appointmentDetail?.special_price : apptServiceData?.appointmentDetail?.price,
            //     discount: apptServiceData?.appointmentDetail?.discount,
            //     staff: 0,
            // }])
            setLoading2(false)
        }
        if (apptServiceLoading) {
            setApptServiceDetail([]);
            addAppointmentSource({
                online: 0,
                sale_id: 0,
                appt_id: 0
            })
            setLoading2(true);
        }
    }, [apptServiceData])


    const handlePayment = () => {
        if (apptGuest){
            addGuests(apptGuest, 'add');
        }
        addApptServices(apptServiceDetail)
        history.push('/sales-checkout')
    }

    const handleSearch = (e: any) => {
        setKeyword([e.target.name] = e.target.value)
    }

    const handleClick = (e: any, id: any) => {
        e.preventDefault()
        history.push(`/invoice/${id}`)
    }

    const options = ["New", "Accepted", "Arrived", "Confirmed", "Completed", "Cancelled", "Reschedule", "Refundable"];

    const apptStatusUpdate = (e: any, apptId: any) => {
        e.preventDefault();
        const { name, value } = e.target;
        statusUpdateForAppointment({
            variables: {
                id: apptId,
                status: value,
                date: "",
                time: ""
            }
        }).then(({ data }) => {
            if (data?.statusUpdateForAppointment?.status == 1) {
                enqueueSnackbar('Appointment status updated', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    transitionDuration: {
                        enter: 300,
                        exit: 500
                    }
                });
            } else {
                enqueueSnackbar('Failed to update status', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    transitionDuration: {
                        enter: 300,
                        exit: 500
                    }
                });
            }

        }).catch(err => {
            // console.log(err);
            enqueueSnackbar('Failed to update status', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                transitionDuration: {
                    enter: 300,
                    exit: 500
                }
            });
        })
        // console.log(e)
    }
    const handleVideo = (id: string) => {
        // console.log("id------>appointm", id)
        // history.push('/setup/video-vatting')
    }
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;
    const businessID = parseData.business_id;

    const hnaldeDownloadxxl = () => {
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=appointment&start_date=${moment(startDate).format('DD-MM-yyyy')}&end_date=${endDate? moment(endDate).format('DD-MM-yyyy'): ""}`)
    }
    return (
        <>
            <section id="Daily-appointments" className="">
                <div className="toolbarBtn d-flex justify-content-between sales-toolbar">
                    <div className="d-flex">
                        <DatePicker
                            className="sales-datepicker"
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update: any) => {
                                setDateRange(update);
                            }}
                            withPortal
                        />
                        <div className="sale-s-wrap ms-5"
                            style={{ width: '340px' }}
                        >
                            <i className="fas fa-search"></i>
                            <input type="text" name="keyword" autoComplete="off" onChange={handleSearch} className="sale-search" placeholder="Search by Invoice or Guest" />
                        </div>
                    </div>
                    <div className="d-flex">
                        <DropdownButton className="option-btn" id="dropdown-basic-button" title="Export">
                            {/* <Dropdown.Item >PDF</Dropdown.Item> */}
                            <Link to=''
                                onClick={hnaldeDownloadxxl}
                            >
                                <Dropdown.Item>Download Excel</Dropdown.Item>
                            </Link>
                        </DropdownButton>
                    </div>
                </div>

                <div className={`card ${className}`} style={{ marginTop: '30px' }}>
                    <div className='card-body py-3 pt-7'>
                        <div className='table-responsive'>
                            <table className='table align-middle gs-0 gy-4'>
                                <thead>
                                    <tr className='fw-bolder text-muted bg-light'>
                                        <th className='rounded-start ps-4'>Invoice</th>
                                        <th>Date</th>
                                        <th>Guest</th>
                                        <th>Group/Course</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>P.Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading && <div className="text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    }
                                    {
                                        allAppointment.length > 0 && allAppointment.map((appt: any) => {
                                            console.log("appt", appt)
                                            return (
                                                <tr key={appt.id}>
                                                    <td>
                                                        {
                                                            appt?.sale_info?.inv_pre || appt?.sale_info?.inv_no ? <a href="" onClick={(e: any) => handleClick(e, appt.sale_info?.id)} className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                {appt.sale_info?.inv_pre}{appt.sale_info?.inv_no}
                                                            </a> : "N/A"
                                                        }

                                                    </td>
                                                    <td>
                                                        <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                            {moment.unix(appt?.date).utcOffset('+0000').format('llll')}
                                                            {/* {
                                                                appt?.appointment_detail && appt?.appointment_detail?.length > 0 ? moment.unix(appt?.time).utcOffset('+0000').format('llll') : moment.unix(appt?.date).utcOffset('+0000').format('llll')
                                                            } */}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                            {appt?.user_name}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                            {Boolean(appt?.is_course) ? <span style={{color: 'darkcyan'}}>Course</span> :
                                                                Boolean(appt?.is_group) ? <span style={{color: 'chocolate'}}>Class</span> : 'N/A'}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                            {appt?.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                            {currency(countryName)}{appt?.total_amount}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        {
                                                            appt?.payment_status === 'Unpaid' ? <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                {currency(countryName)} 0
                                                            </span> : <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                {currency(countryName)}{appt?.payment}
                                                            </span>
                                                        }

                                                    </td>
                                                    <td>
                                                        {
                                                            appt?.room_id === null ? (
                                                                <span className={`${appt?.payment_status === 'Upfront' ? "badge badge-info fs-7 fw-bold" : appt?.payment_status === "Unpaid" ? "badge badge-danger fs-7 fw-bold" : "badge badge-success fs-7 fw-bold"}`}>
                                                                    {appt?.payment_status == "Upfront" ? "Partially paid" : appt?.payment_status}
                                                                </span>
                                                            ) : (appt?.status === 'Completed' || appt?.status === 'Cancelled') ? (
                                                                <span className='badge vatting-call-disabled fs-7 text-mute fw-bold'>
                                                                    Consultation Video Call
                                                                </span>
                                                            ) : (
                                                                <Link to={`/video-vetting/${appt?.room_id}`} onClick={() => { handleVideo(appt?.id) }} style={{ cursor: 'pointer' }} className='badge vatting-call fs-7 fw-bold'>
                                                                    Consultation Video Call
                                                                </Link>
                                                            )
                                                        }
                                                    </td>
                                                    <td>
                                                        {appt?.room_id != null ? "" : (appt?.status === 'Cancelled' || appt?.status === 'Refundable' || appt?.status === 'Refunded') ? <i className="far fa-eye-slash btn btn-icon btn-bg-light btn-sm text-muted me-2"></i> : <i onClick={() => handleViewService(appt.id, appt.payment_status, appt?.user_id)} className="far fa-eye btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted me-2" id="kt_drawer_example_basic_button"></i>}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                    {!loading && !allAppointment.length && (
                                        <p className="text-center">No Available Appointment</p>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* drawer */}
            <div
                id="kt_drawer_example_basic"
                className="pr-details-drawer"
                data-kt-drawer="true"
                data-kt-drawer-activate="true"
                data-kt-drawer-toggle="#kt_drawer_example_basic_button"
                data-kt-drawer-close="#kt_drawer_example_basic_close"
            >
                <div className="product-details-wrap">
                    <div className="form-heading">
                        <h2 className="section-title mb-0">Appointment Service Info</h2>
                    </div>
                    {
                        loading2 &&
                        <div className="d-flex justify-content-center align-items-center">
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
                        apptServiceDetail.length > 0 && apptServiceDetail.map((itm: any, index: number) => (
                            <Card className="mb-25 primary-bx-shadow p-details-card" key={itm.id}>
                                <div className="d-flex">
                                    <h3 className="appn-service-count d-inline-block">{index + 1}</h3>
                                    <div></div>
                                </div>
                                <div className="pr-details-list p-30">
                                    <p className="d-flex justify-content-between">Service <span className="ms-2">{itm?.service_pricing?.service_name}</span></p>
                                    <p className="d-flex justify-content-between">Duration <span>{itm?.duration}min</span></p>
                                    <p className="d-flex justify-content-between mt-0">Chair <span>{itm?.chair_info?.title}</span></p>
                                    <p className="d-flex justify-content-between">Staff <span>{itm?.staff_info?.name ? itm?.staff_info?.name : "N/A"}</span></p>
                                    <p className="d-flex justify-content-between">Time <span>{moment.unix(itm?.time).utcOffset('+0000').format("llll")}</span></p>
                                </div>
                            </Card>
                        ))
                    }
                    {
                        !loading2 && (paymentStatus === "Unpaid" || paymentStatus === "Upfront") && <div className="text-center"> <button className="btn btn-primary" onClick={handlePayment}>Payment</button></div>
                    }

                </div>
            </div>
            <div className="text-center">
                {
                    count < paginate.total && (
                        <button className="btn btn-primary text-center" onClick={LoadMoreList}>Load More</button>
                    )
                }
            </div>
        </>
    )
}

export default Appointments;