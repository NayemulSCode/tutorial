import React, { FC, useState, useEffect, useContext } from "react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/client"
import { Link, useHistory } from "react-router-dom";
import { Card, Dropdown, DropdownButton } from "react-bootstrap-v5";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from '../../../../../../src/context/Context';
import { CSVLink } from "react-csv";
import { WAITING_LISTS } from '../../../../../gql/Query';
import { APPOINTMENT_STATUS_UPDATE } from '../../../../../gql/Mutation';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import ClientModal from "./ClientModal";

type Props = {
    className: string
}

const WaitingList: React.FC<Props> = ({ className }) => {
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(10);
    const [allWaitingList, setAllWaitingList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [dateRange, setDateRange] = useState([new Date(), null]);
    const [startDate, endDate] = dateRange;
    const [keyword, setKeyword] = useState("")
    
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const handleModalClose = () => { setModalOpen(false) };

    const LoadMoreList = () => {
        setCount(count + 10)
    }

    const { data: allwaitingData, loading: allWaitingDataLoading, refetch } = useQuery(WAITING_LISTS, {
        variables: {
            keyword: keyword,
            date_range: JSON.stringify(dateRange),
            count: count,
            page: 1,
        }
    })

    useEffect(() => {
        refetch()
        if (allwaitingData) {
            // console.log(allwaitingData?.cancellationList)
            setAllWaitingList(allwaitingData?.cancellationList?.data)
            setPaginate(allwaitingData.cancellationList?.paginatorInfo)
            setLoading(false)
        }
        if (allWaitingDataLoading) {
            setLoading(true)
        }
    }, [allwaitingData])

    const addWaitingGuest = (e: any) => {
        e.preventDefault()
        setModalOpen(!modalOpen)
    }
    const handleSearch = (e: any) => {
        setKeyword([e.target.name] = e.target.value)
    }
    return (
        <>
            <section id="Daily-appointments">
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
                            <input onChange={handleSearch} type="text" autoComplete="off" name="search" className="sale-search" placeholder="Search by Guest" />
                        </div>
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary" onClick={addWaitingGuest}>Add Guest</button>
                    </div>
                </div>
                <div className={`card ${className}`} style={{ marginTop: '15px' }}>
                    <div className='card-body py-3 pt-7'>
                        <div className='table-responsive'>
                            <table className='table align-middle gs-0 gy-4'>
                                <thead>
                                    <tr className='fw-bolder text-muted bg-light'>
                                        <th className='rounded-start ps-4'>Date</th>
                                        <th>Name</th>
                                        <th>Mobile</th>
                                        <th>Email</th>
                                        <th>Gender</th>
                                        <th>Address</th>
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
                                        allWaitingList.length > 0 && allWaitingList.map((appt: any) => (
                                            <tr key={appt.id}>
                                                <td>
                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                        {moment.unix(appt?.date).format('MM/DD/YY')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                        {`${appt?.client_info?.first_name} ${appt.client_info?.last_name}`}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                        {appt?.client_info?.mobile ? appt?.client_info?.mobile : "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                        {appt?.client_info?.email ? appt?.client_info?.email : "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                        {appt?.client_info?.gender ? appt?.client_info?.gender : "N/A"}
                                                    </span>
                                                </td>
                                                <td >
                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                        {appt?.client_info?.address ? appt?.client_info?.address :"N/A"}
                                                    </span>
                                                </td>
                                                {/* <td>
                                                    <i className="far fa-eye btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted me-2" id="kt_drawer_example_basic_button"></i>
                                                </td> */}
                                            </tr>
                                        ))
                                    }


                                    {!loading && !allWaitingList.length && (
                                        <p className="text-center">No Available Cancellation Request</p>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
            <div className="text-center">
                {
                    count < paginate.total && (
                        <button className="btn btn-primary text-center" onClick={LoadMoreList}>Load More</button>
                    )
                }
            </div>
            <ClientModal allWaitingList={allWaitingList} modalOpen={modalOpen} handleModalClose={handleModalClose} />
        </>
    )
}

export default WaitingList;