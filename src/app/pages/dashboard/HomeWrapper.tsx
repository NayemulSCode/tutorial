import { useIntl } from "react-intl"
import React, { FC, useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { PageTitle } from "../../../_metronic/layout/core"
import { HomeWidget1 } from "../../../_metronic/partials/widgets/charts/HomeWidget1"
import { HomeWidget2 } from "../../../_metronic/partials/widgets/charts/HomeWidget2"
import { QrCodeCard } from "../../../_metronic/partials/content/cards/QrCodeCard"


const HomeWrapper: FC = () => {
    document.title = "Home";
    const intl = useIntl()

    return (
        <>
            <div className="HomeItem">
                <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.Home' })}</PageTitle>
                <div>
                    <QrCodeCard/>
                </div>
                {/* begin::Row */}
                <div className='row pt-30'>
                    {/* <div className='col-xl-6'>
                        <HomeWidget1 className='card-xl-stretch mb-md-0 mb-5' />
                    </div> */}
                    <div className='col-xl-12'>
                        <HomeWidget2 className='card-xl-stretch' />
                    </div>
                </div>
                {/* end::Row */}
            </div>
        </>
    )
}

export { HomeWrapper }