import React, { FC, useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client"
import { TablesWidget15, TablesWidget17 } from "../../../../../_metronic/partials/widgets"
import { Dropdown, DropdownButton } from "react-bootstrap-v5";
// import DatePicker, { DayValue, DayRange, Day } from 'react-modern-calendar-datepicker'
// import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { DAILY_SALE } from '../../../../../gql/Query';
import { PaymentCard } from "../../../../../_metronic/partials/content/cards/PaymentCard";

type ICASH = {
    payment_collect: number;
    payment_type: string
}

const DailySales: FC = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [dailyCash, setDailyCash] = useState<ICASH[]>([])
    const [dailyTransaction, setDailyTransaction] = useState<Array<any>>([])
    const [loading, setLoading] = useState(false)

    const { data: dailySaleData, loading: dailySaleDataLoading } = useQuery(DAILY_SALE, {
        variables: {
            date: startDate
        }
    })

    useEffect(() => {
        if (dailySaleData) {
            setDailyCash(dailySaleData.dailySales?.tran_summary)
            setDailyTransaction(dailySaleData.dailySales?.cash_summary)
            // console.log(dailySaleData.dailySales.cash_summary)
            // console.log(dailySaleData.dailySales.tran_summary)
            setLoading(false)
        }
        if (dailySaleDataLoading) {
            setDailyCash([])
            setDailyTransaction([])
            setLoading(true)
        }
    }, [dailySaleData, dailySaleDataLoading])

    return (
        <>
            <section id="daily-sales" className="">
                <div className="toolbarBtn d-flex er align-items-center justify-content-between sales-toolbar">
                    <div>
                        <DatePicker
                            className="sales-datepicker"
                            selected={startDate}
                            onChange={(date: any) => setStartDate(date)} />
                    </div>
                    <div className="d-flex">
                        <PaymentCard />
                    </div>
                </div>
                <div className="row pt-30">
                    {
                        loading &&
                        <div className="text-center d-flex justify-content-center align-items-center">
                            <div className="spinner-grow " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }
                    {
                        !loading && dailyTransaction.length <= 0 && dailyCash.length <= 0 &&
                        <p className="text-center">You have no sale information available for today</p>
                    }
                    <div className='col-xl-6 mb-5'>
                        {
                            dailyTransaction.length > 0 && <TablesWidget17 dailyTransaction={dailyTransaction} className='' />
                        }
                    </div>
                    <div className='col-xl-6 mb-5'>
                        {
                            dailyCash.length > 0 && <TablesWidget15 dailyCash={dailyCash} className='' />
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default DailySales;