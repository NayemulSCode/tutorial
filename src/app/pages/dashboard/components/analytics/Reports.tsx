import React, { FC } from "react"
import { Card3 } from "../../../../../_metronic/partials/content/cards/Card3";

const Reports: FC = () => {
    return (
        <>
            <div className="row">
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Finances"
                        description="Monitor your overall finances including sales, refunds, taxes, payments and more"
                    />
                </div>
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Sales"
                        description="Analyse the performance of your business by comparing sales across products, staff, channels and more"
                    />
                </div>
                <div className='col-xl-6 mb-2'>
                    <Card3
                        title="Inventory"
                        description="Monitor product stock levels and adjustments made, analyse product sales performance, consumption costs and more"
                    />
                </div>
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Appointments"
                        description="View projected revenues of upcoming appointments, track cancellation rates and reasons"
                    />
                </div>
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Vouchers"
                        description="Track your total outstanding liability as well as voucher sales and redemption activity"
                    />
                </div>
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Appointments"
                        description="View projected revenues of upcoming appointments, track cancellation rates and reasons"
                    />
                </div>
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Clients"
                        description="Gain insights into how clients interact with your business and who your top spenders are"
                    />
                </div>
                <div className='col-xl-6 mb-5'>
                    <Card3
                        title="Staff"
                        description="View your team's performance, hours worked as well as commission and tip earnings"
                    />
                </div>
            </div>
        </>
    )
}

export default Reports;