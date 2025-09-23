import React, { FC } from "react"
import { Link } from "react-router-dom";

const PaidPlans: FC = () => {

    return(
        <>
            <section id="empty-paid-plans" className="">
                <div className="container empty-paid-plans-container">
                    <div className="empty-content d-flex align-items-center">
                        <div className="empty-content-inner">
                            <i className="icon far fa-calendar-times"></i>
                            <h2>Create a paid plan</h2>
                            <span className="text-muted">You have no active paid plans.</span>
                            <Link className="submit-btn" to="/">
                                Create paid plan
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PaidPlans;