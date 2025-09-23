/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC} from 'react'
import { toAbsoluteUrl } from '../../../helpers'
import {Link} from 'react-router-dom'

type Props = {
    voucherValue?: number
    voucherPrice?: number
    name: string
    job: string
    avgEarnings: string
    totalEarnings: string
}

const Card7: FC<Props> = ({
    voucherValue = 0,
    voucherPrice = 0,
    name,
    job,
    avgEarnings,
    totalEarnings,
}) => {
   
    return (
        <div className='card voucher p-9'>
            <Link to="/">
                <div className='card-body voucher-body'>
                    <div className="voucher-info">
                        <div className="value">
                            <p className='v-title'>
                                Voucher value
                            </p>
                            <p className='v-value mb-6'>€{voucherValue}</p>
                        </div>
                        <div className="earning">
                            <p className='avg-earning'>{name}</p>
                            <p className='redeem-service'>Redeem on all services</p>
                        </div>
                    </div>
                    <div className='voucher-price-wrap'>
                        <div className='price-inner'>
                            <p className='voucher-price'>€{voucherPrice}</p>
                            <span className='fw-bold'>Save 85%</span>
                            <p className='fw-bold'>Sold 0</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export { Card7 }
