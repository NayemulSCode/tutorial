import React, { FC, useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap-v5";
import { ALL_CLIENTS, SALE_VOUCHER } from '../../../../../gql/Query';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { xllExportUrl } from "../../../../modules/util";

type Props = {
    className: string
}

const VoucherList: React.FC<Props> = ({ className }) => {
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(10);
    const [loading, setLoading] = useState(false)
    const [allClient, setAllClient] = useState([]);
    const [allSaleVoucher, setAllSaleVoucher] = useState([]);
    const [keyword, setKeyword] = useState("")

    const [dateRange, setDateRange] = useState([new Date(), null]);
    const [startDate, endDate] = dateRange;

    const LoadMoreList = () => {
        setCount(count + 10)
    }

    const { data: saleClientData } = useQuery(ALL_CLIENTS, {
        variables: {
            search: "",
            count: 100,
            page: 1
        }
    })

    const { data: saleVoucherData, loading: saleVoucherDataLoading } = useQuery(SALE_VOUCHER, {
        variables: {
            keyword: keyword,
            date_range: JSON.stringify(dateRange),
            count: count,
            page: 1
        }
    })

    useEffect(() => {
        if (saleClientData) {
            // console.log(saleClientData?.clients?.data)
            setAllClient(saleClientData?.clients?.data)
        }
        if (saleVoucherData) {
            // console.log(saleVoucherData?.saleVoucher?.data)
            setAllSaleVoucher(saleVoucherData?.saleVoucher?.data)
            setPaginate(saleVoucherData.saleVoucher?.paginatorInfo)
            setLoading(false)
        }
        if (saleVoucherDataLoading) {
            setLoading(true)
        }
    }, [saleVoucherData, saleClientData, saleVoucherDataLoading])

    const handleSearch = (e: any) => {
        setKeyword([e.target.name] = e.target.value)
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
        window.open(`${xllExportUrl}/api/export?business_id=${businessID}&type=voucher&start_date=${moment(startDate).format('DD-MM-yyyy')}&end_date=${ endDate? moment(endDate).format('DD-MM-yyyy'): ""}`)
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
                            <input onChange={handleSearch} type="text" autoComplete="off" name="search" className="sale-search" placeholder="Search by Voucher Code or Guest" />
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
                                        <th className='min-w-150px ps-4'>Owner</th>
                                        <th className='ps-4 min-w-200px rounded-start'>Validity</th>
                                        <th className='min-w-150px'>Status</th>
                                        <th className='min-w-125px text-end pe-4'>Voucher Amount</th>
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
                                        allSaleVoucher.length > 0 && allSaleVoucher.map((v: any) => (
                                            <tr>
                                                <td className="ps-4">
                                                    <p className='text-dark fw-bolder d-block fs-6'>
                                                        {v?.owner}
                                                    </p>
                                                </td>
                                                <td className="ps-4">
                                                    <a className='text-dark fw-bolder text-primary fs-6'>
                                                        Iss: {moment.unix(v?.purchase_date).utcOffset('+0000').format('llll')} <br />
                                                        Exp: {v?.expiry_date != null ? moment.unix(v?.expiry_date).utcOffset('+0000').format('llll') : "Forever"}
                                                    </a>
                                                </td>

                                                {/* <td>
                                                    <a href='#' className='text-dark fw-bolder d-block fs-6'>
                                                        {v.buyer_id ? allClient.map((c: any) => c.id == v.buyer_id ? c.first_name + " " + c.last_name : "") : "Walk-In"}
                                                    </a>
                                                </td> */}
                                                <td>
                                                    <span className='badge badge-light-primary fs-7 fw-bold'>
                                                        {
                                                            v?.expiry_date != null ?
                                                                v?.expiry_date >= moment().unix() ? "ACTIVE" : "EXPIRED" : "ACTIVE-FOREVER"
                                                        }

                                                    </span>
                                                </td>
                                                {/* <td className="">
                                                    <a className='text-dark fw-bolder d-block fs-6'>
                                                        {v?.voucher_code}
                                                    </a>
                                                </td> */}
                                                <td className="text-end pe-4">
                                                    <p className='text-dark fw-bolder d-block fs-6'>
                                                        Value: {`${currency(countryName)}${v?.value}`} <br />
                                                        Redeemed: {`${currency(countryName)}${v?.redeemed}`} <br />
                                                        Remaining:  {`${currency(countryName)}${v?.remaining}`}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    <div className="text-center">
                                        {
                                            count < paginate.total && (
                                                <button className="btn btn-primary text-center" onClick={LoadMoreList}>Load More</button>
                                            )
                                        }
                                    </div>
                                    {!loading && !allSaleVoucher.length && (
                                        <p className="text-center">No Available Voucher Sale Information</p>
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default VoucherList;