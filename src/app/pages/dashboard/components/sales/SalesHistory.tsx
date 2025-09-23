import React, { FC, useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { Link, useHistory } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap-v5";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SALES } from '../../../../../gql/Query';
import moment from 'moment';
import { xllExportUrl } from "../../../../modules/util";

type Props = {
    className: string
}

const SalesHistory: React.FC<Props> = ({ className }) => {
    const history = useHistory()
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(10);
    const [keyword, setKeyword] = useState("")
    const [allSalesData, setAllSalesData] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([new Date(), null]);
    const [startDate, endDate] = dateRange;

    const LoadMoreList = () => {
        setCount(count + 10)
    }

    const { data: salesData, loading: salesDataLoading } = useQuery(SALES, {
        variables: {
            keyword: keyword,
            date_range: JSON.stringify(dateRange),
            count: count,
            page: 1
        }
    })

    useEffect(() => {
        if (salesData) {
            // console.log("sale data",salesData.sales?.data)
            setAllSalesData(salesData?.sales?.data)
            setPaginate(salesData.sales?.paginatorInfo)
            setLoading(false)
        }
        if (salesDataLoading) {
            setAllSalesData([])
            setLoading(true);
        }
    }, [salesData, salesDataLoading])


    const handleSearch = (e: any) => {
        setKeyword([e.target.name] = e.target.value)
    }

    const handleClick = (e: any, id: any) => {
        e.preventDefault()
        history.push(`/invoice/${id}`)
    }
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;
    const businessID = parseData.business_id;
    const currency = (countryName: any) => {
        if (countryName === 'ireland') {
            return "€";
        }
        if (countryName === 'uk') {
            return "£";
        }
        if (countryName === 'bangladesh') {
            return "৳";
        }
    }
    const hnaldeDownloadxxl = () => {
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=sale&start_date=${moment(startDate).format('DD-MM-yyyy')}&end_date=${ endDate ? moment(endDate).format('DD-MM-yyyy') : ""}`)
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
                            <input onChange={handleSearch} type="text" autoComplete="off" name="search" className="sale-search" placeholder="Search by Invoice or Guest" />
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
                                        <th>Guest</th>
                                        <th>Invoice date</th>
                                        <th>Payment method</th>
                                        <th>Status</th>
                                        <th>Total</th>
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
                                        allSalesData?.length > 0 && allSalesData.map((s: any) => {
                                            return(
                                            <tr key={s?.id}>
                                                <td>
                                                    <a href='' onClick={(e) => handleClick(e, s.id)} className='fw-bolder text-primary fs-6'>
                                                        {s?.inv_pre}{s?.inv_no}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a className='text-dark fw-bolder d-block fs-6'>
                                                        {s?.buyer_name}
                                                    </a>
                                                </td>

                                                <td>
                                                    <a className='text-dark fw-bolder d-block fs-6'>
                                                        {moment.unix(s?.created_at).utcOffset('+0000').format('llll')}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a className='text-dark fw-bolder d-block fs-6'>
                                                        {JSON.parse(s?.payment_type)?.map((typ: any) => <span className="badge badge-secondary">{typ}</span>)}
                                                    </a>
                                                </td>
                                                <td className="text-start">
                                                    <span className='badge badge-light-primary fs-7 fw-bold'>
                                                        <span className="badge badge-success">{s?.payment_status == "Upfront" ? "Partially paid" : s?.payment_status}</span>
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <a className='text-dark fw-bolder d-block fs-6'>
                                                        {`${currency(countryName)}${s?.total_amount}`}
                                                    </a>
                                                </td>
                                            </tr>
                                        )})
                                    }

                                    {!loading && !allSalesData.length && (
                                        <p className="text-center">No Available Sale Information</p>
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
        </>
    )
}

export default SalesHistory;