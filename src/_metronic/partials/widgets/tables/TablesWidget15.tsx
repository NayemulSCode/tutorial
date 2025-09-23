/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { KTSVG } from '../../../helpers'

type Props = {
    className: string
    dailyCash: Array<any>

}

const TablesWidget15: React.FC<Props> = ({ className, dailyCash }) => {
    // console.log(dailyCash)
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
                    <span className='card-label fw-bolder fs-3 mb-1'>Transaction Summary</span>
                </h3>
            </div>
            <div className='card-body py-3'>
                <div className='table-responsive'>
                    <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                        <thead>
                            <tr className='fw-bolder text-muted'>
                                <th className='min-w-140px'>Item type</th>
                                <th className='min-w-140px'>Sales qty</th>
                                <th className='min-w-120px'>Gross total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dailyCash .length > 0 && dailyCash.map(itm => (
                                    <tr>
                                        <td>
                                            <a className='text-dark text-hover-primary fs-6'>
                                                {itm?.product_type.charAt(0).toUpperCase()+ itm?.product_type.slice(1)}
                                            </a>
                                        </td>
                                        <td>
                                            <a className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                                {itm?.total_qty}
                                            </a>

                                        </td>
                                        <td>
                                            <a className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                                {`${currency(countryName)}${itm?.total_price}`}
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

export { TablesWidget15 }
