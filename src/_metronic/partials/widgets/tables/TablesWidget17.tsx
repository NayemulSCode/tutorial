/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { KTSVG } from '../../../helpers'

type ICASH = {
    payment_collect: number;
    payment_type: string
}

type Props = {
    className: string
    dailyTransaction: ICASH[]
}

const TablesWidget17: React.FC<Props> = ({ className, dailyTransaction }) => {
    // console.log(dailyTransaction)
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;
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
    return (
        <div className={`card ${className}`}>
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mb-1'>Cash Movement Summary</span>
                </h3>
            </div>
            <div className='card-body py-3'>
                <div className='table-responsive'>
                    <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                <th className='min-w-150px'>Payment type</th>
                                <th className='min-w-140px'>Payments collected</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                            {
                                dailyTransaction.map((itm: any) => (
                                    
                                    <tr>
                                        <td>
                                            <a className='text-dark text-hover-primary fs-6'>
                                                {itm.payment_type.charAt(0).toUpperCase()+ itm?.payment_type.slice(1)}
                                            </a>
                                        </td>
                                        <td>
                                            <a className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                                {`${currency(countryName)}${itm.payment_collect}`}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export { TablesWidget17 }
