import React from 'react'
import { Link } from 'react-router-dom'
import BackHome from '../../../../../../_metronic/assets/images/services/colourLeft.png'

export default function OfferStep2() {
    return (
        <>
        <section id="offer-step2">
            <div className="offer-top-toolbar d-flex align-items-center justify-content-between">
                <Link className="offer-back-home" to="/services/services"><img src={BackHome} alt="image"/></Link>
                <Link className="close-btn" to="/services/services"><i className="fas fa-times"></i></Link>
            </div>
            <div className="container">
                <div className="heading">
                    <h2 className="section-title">Choose a service type</h2>
                </div>
                <Link to="/add-single-service">
                    <div className="offer-widget offer-widget1 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                                <div className="svg-icon">
                                    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-354.000000, -224.000000) translate(330.000000, 200.000000) translate(0.000000, -0.000000) translate(24.000000, 24.000000)" fill="none" fill-rule="evenodd"><circle fill="#EBF7FE" cx="28" cy="28" r="28"></circle><g transform="translate(14.000000, 17.000000)"><path fill="#FFDB4E" d="M0 0h14v22H0z"></path><path d="M12 3c0 1.1046.8954 2 2 2s2-.8954 2-2h7c1.1046 0 2 .8954 2 2v12c0 1.1046-.8954 2-2 2H5c-1.1046 0-2-.8954-2-2V5c0-1.1046.8954-2 2-2h7z" stroke="#101928" stroke-width="2"></path><rect fill="#101928" x="7" y="9" width="13" height="2" rx="1"></rect><rect fill="#101928" x="7" y="12" width="9" height="2" rx="1"></rect></g></g></svg>
                                </div>
                                <div className="text">
                                    <h5>Single Service</h5>
                                    <p>Services which can be booked individually</p>
                                </div>
                        </div>
                        <Link to="/add-single-service"><i className="next-icon fas fa-angle-right"></i></Link>
                    </div>
                </Link>
                    <Link to="/">
                        <div className="offer-widget offer-widget1 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="svg-icon">
                                    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-354.000000, -352.000000) translate(330.000000, 200.000000) translate(0.000000, 128.000000) translate(24.000000, 24.000000)" fill="none" fill-rule="evenodd"><circle fill="#EBF7FE" cx="28" cy="28" r="28"></circle><g transform="translate(14.000000, 17.000000)"><path fill="#FFDB4E" d="M0 4h14v20H0z"></path><path d="M11 7c0 1.1046.8954 2 2 2s2-.8954 2-2h6c1.1046 0 2 .8954 2 2v10c0 1.1046-.8954 2-2 2H5c-1.1046 0-2-.8954-2-2V9c0-1.1046.8954-2 2-2h6z" stroke="#101928" stroke-width="2"></path><rect fill="#101928" x="7" y="12" width="12" height="2" rx="1"></rect><rect fill="#101928" x="7" y="15" width="7" height="2" rx="1"></rect><path d="M7.9989 4l.0311-.1607c.0874-.4953.2441-1.2367.4188-2.2273C8.6023.7417 9.4321.1607 10.3023.314l16.757 3.7784c.8702.1534 1.4513.9833 1.2978 1.8535l-1.806 10.242c-.1534.8703-.5908 1.779-1.461 1.6255" stroke="#101928" stroke-width="2"></path></g></g></svg>
                                </div>
                                <div className="text">
                                    <h5>Package</h5>
                                    <p>Multiple services booked together in one appointment</p>
                                </div>
                            </div>
                            <Link to="/offer-step2"><i className="next-icon fas fa-angle-right"></i></Link>
                        </div>
                    </Link>
            </div>
        </section>
        </>
    )
}
