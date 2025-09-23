import React, { FC, useState } from "react"
import { TablesWidget18 } from "../../../../../_metronic/partials/widgets";


const CloseDatate: FC = () => {
    return (
        <>
        <div className='d-flex justify-content-end'>
            <button className="btn secondaryBtn mb-5">New Close Date</button>
        </div>
            <TablesWidget18 className="" />
        </>
    )
}

export default CloseDatate;