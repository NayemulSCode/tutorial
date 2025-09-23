import React, { FC } from "react";
import { Card8 } from "../../../../../_metronic/partials/content/cards/Card8"
import { TablesWidget19 } from "../../../../../_metronic/partials/widgets";

const Schedule: FC = () => {
    return (
        <>
            <div className="d-flex justify-content-between my-5">
                <select className="form-control exportBtn">
                    <option>All staff</option>
                    <option>Staff one</option>
                    <option>Staff two</option>
                    <option>Staff three</option>
                </select>
                {/* <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                    /> */}
            </div>
            <TablesWidget19  className=''/>
        </>
    )
}

export default Schedule;

