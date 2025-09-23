import React from 'react'
import { Link } from 'react-router-dom'

export default function OfferStep1() {
    return (
        <>
        <section id="offer-step1">
            <div className="offer-top-toolbar"><Link className="close-btn" to="/services/services"><i className="fas fa-times"></i></Link></div>
            <div className="container">
                <div className="heading">
                    <div className="pagination">
                        <span>Step 1 of 2</span>
                    </div>
                    <h2 className="section-title">Add an offering to your service menu</h2>
                </div>
                <Link to="/offer-step2">
                    <div className="offer-widget offer-widget1 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                                <i className="icon icon1 fa fa-calendar"></i>
                                <div className="text">
                                    <h5>Service</h5>
                                    <p>Services booked by one client in a single visit</p>
                                </div>
                        </div>
                        <Link to="/offer-step2"><i className="next-icon fas fa-angle-right"></i></Link>
                    </div>
                </Link>
                    <div className="offer-widget offer-widget2 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <i className="icon icon2 fa fa-users"></i>
                            <div className="text">
                                <h5>Class</h5>
                                <p>Services booked by multiple clients in scheduled sessions</p>
                            </div>
                        </div>
                        <span>Coming soon</span>
                    </div>
            </div>
        </section>
        </>
    )
}
