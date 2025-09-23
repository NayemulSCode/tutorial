import React, { FC } from "react"
import { Card4 } from "../../../../../_metronic/partials/content/cards/Card4";
const Dashboard: FC = () => {
    return (
        <>
            <div className="row mt-5"> 
                <div className='col-xl-4 mb-5'>
                    <Card4
                        title="Total Appointments"
                        amount={1}
                    />
                </div>
                <div className='col-xl-4 mb-5'>
                    <Card4
                        title="Online Appointments"
                        amount={2}
                    />
                </div>
                {/* <div className='col-xl-4 mb-5'>
                    <Card4
                        title="Occupancy"
                        amount="0%"
                    />
                </div> */}
                <div className='col-xl-4 mb-5'>
                    <Card4
                        title="Total Sales"
                        amount={3}
                    />
                </div>
                {/* <div className='col-xl-4 mb-5'>
                    <Card4
                        title="Average Sale"
                        amount="€0"
                    />
                </div> */}
                {/* <div className='col-xl-4 mb-5'>
                    <Card4
                        title="Client Retention (Sales)"
                        amount="0%"
                    />
                </div> */}
            </div>
        </>
    )
}

export default Dashboard;