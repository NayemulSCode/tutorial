/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client'
import { KTSVG } from '../../../helpers';
import { toAbsoluteUrl } from '../../../helpers';
import QRCode from "react-qr-code";
import { PARTNER_BALANCE } from '../../../../gql/Query'
import moment from "moment";

type Props = {

}

const PaymentCard: FC<Props> = ({

}) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any>()
    const { data, loading: dataLoading, error } = useQuery(PARTNER_BALANCE,{
        onError(err: any){
            if (err?.message == 'Unauthenticated.'){
                // localStorage.setItem("loginError", err?.message);
             }
        }
    });
    useEffect(() => {
        if (data) {
            // console.log(data)
            setState(data.partnerBalance)
            setLoading(false)
        }
        if (dataLoading) {
            setLoading(true)
        }
    }, [data, dataLoading])
    
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
        <div className='card'>
            <div className='align-items-center'>
                {
                    loading && (
                        <div className='m-0 m-auto'>
                            <div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div><div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div><div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )
                }
                {
                    !loading && (<>
                        <div>
                            <div className='d-flex flex-center flex-wrap'>
                                <div className='d-flex align-items-center bg-light-warning rounded min-w-125px  px-4 me-4'>
                                    <span className='svg-icon svg-icon-warning me-5'>
                                        <KTSVG path='/media/icons/duotune/abstract/abs027.svg' className='svg-icon-1' />
                                    </span>
                                    <div>
                                        <div className='fs-6 fw-bolder fw-bolder text-gray-800'>{"Previous Payout"}</div>
                                        <div className='fw-bold text-gray-400'>Amount: <span className='fw-bolder text-warning'> {currency(countryName)}{state?.pre_payout_amout}</span></div>
                                        <div className='fw-bold text-gray-400'>Date: {state?.pre_payout_date ? moment.unix(state?.pre_payout_date).utcOffset('+0000').format("MMMM Do YYYY") : "N/A"}</div>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center bg-light-success rounded min-w-125px py-3 me-4 px-4'>
                                    <span className='svg-icon svg-icon-success me-5'>
                                        <KTSVG path='/media/icons/duotune/abstract/abs027.svg' className='svg-icon-1' />
                                    </span>
                                    <div>
                                        <div className='fs-6 fw-bolder fw-bolder text-gray-800'>{"Balance"}</div>
                                        <div className='fw-bold text-gray-400'><span className='text-success'> {currency(countryName)}{state?.current_balance}</span></div>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center bg-light-info rounded min-w-125px py-3 px-4'>
                                    <span className='svg-icon svg-icon-info me-5'>
                                        <KTSVG path='/media/icons/duotune/abstract/abs027.svg' className='svg-icon-1' />
                                    </span>
                                    <div>
                                        <div className='fs-6 fw-bolder text-gray-800'>{"Next Payout"}</div>
                                        <div className='fw-bold text-gray-400'>Date: {state?.next_payout_date ? moment.unix(state?.next_payout_date).utcOffset('+0000').format("MMMM Do YYYY") : "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>)
                }
            </div>
        </div>
    )
}

export { PaymentCard }
