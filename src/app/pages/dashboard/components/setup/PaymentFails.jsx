import React from 'react'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { Link } from 'react-router-dom'
const PaymentFails = () => {
  return (
    <div className="container pt-150">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-7 col-12 mx-auto payment-status">
                        <div className="card venuItem">
                            <div className="card-body text-center">
                                <div className="logo mb-5">
                                    <img className="mt-5 pt-5" src={toAbsoluteUrl(`/media/payment/logo.svg`)} alt="brand-logo" />
                                </div>
                                <h3>Payment Failed</h3>
                                <div className="stage my-5">
                                    <div className="box bounce-5" />
                                    <img className="box bounce-5" src={ toAbsoluteUrl(`/media/payment/payment-fail.png`)} alt="payment" />
                                </div>
                                <Link to="/setup/subscription" className="venuBtn p-3"> Check Subscription</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default PaymentFails