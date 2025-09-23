import { useIntl } from "react-intl"
import React, { FC, useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { Modal, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap-v5'
import { CToolbar } from '../../../_metronic/layout/components/toolbar/CalendarToolbar'
import { PageTitle } from "../../../_metronic/layout/core"
import BlockTimeModal from "./components/calendar/BlockTimeModal"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import events from './components/events'
import {useQuery, useMutation} from '@apollo/client'
import { ALL_STAFF_INFO, STAFF_WISE_APPOINTMENT, ALL_APPOINTMENTS} from '../../../gql/Query'
import {IStaff, IAppointments} from '../../../types'
import { number } from "yup"
import { string } from "yup/lib/locale"
type IStaffAppoin= {
    id: number;
    title: string;
    start: any;
    end: any;
    // client_source: string;
}
const CalendarWrapper: FC = () => {
    const intl = useIntl()
    const localizer = momentLocalizer(moment)
    // const dayFormat = (date:any, culture:any, localizer:any) => localizer.format(date, 'D MMMM YYYY', culture);
    const [staffId, setStaffId] = useState("0")
    const [staffs, setStaffs] = useState<IStaff[]>([]);
    const [allAppointments, setAllAppointments] = useState<IAppointments[]>([]);
    const [appointmentsData, setAppointmentsData] = useState<Array<any>>([{
        id: "",
        title: "",
        start: new Date(),
        end: new Date()
    }])
    const [convertedArry, setConvertedArry] = useState<Array<any>>([])
    const [showBlockTime, setshowBlockTime] = useState<boolean>(false);
    const handleCloseBlock = () => setshowBlockTime(false);
    const handleShowBlock = () => {
        setshowBlockTime(true);
    }
    // console.log("initial appointmentdata>>", appointmentsData);
    const { data: staffsData, error: staffsError, loading: staffsLoading, refetch: refetchStaff } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: 10,
            page: 1,
        },
        fetchPolicy: "network-only"
    })

    const { data: appointmentData, error: appointmentError, loading: appointmentLoading, refetch } = useQuery(STAFF_WISE_APPOINTMENT, {
        variables: {
            staff_id: +staffId
        }
    })
    const { data: allAppointment, error: allAppointmentError, loading: allAppointmentLoading, refetch: allAppoinRefetch } = useQuery(ALL_APPOINTMENTS, {
        variables: {
            type: "",
            count: 10,
            page: 1,
        }
    });
    useEffect(() => {
        if (allAppointment) {
            allAppoinRefetch()
            setAllAppointments(allAppointment.appointments.data)
            // console.log("all appointment>>>>>>", allAppointment.appointments.data)
        }
    }, [])
    useEffect(() => {
        if (appointmentData) {
            refetch();
            if (appointmentData.staffWiseAppointment.length > 0) {
                refetch();
                setAppointmentsData(appointmentData.staffWiseAppointment)
            }
            // console.log("staff wise appointment>>>", appointmentData.staffWiseAppointment.length)
        }
    }, [appointmentData]);

    useEffect(() => {
        if (staffsData) {
            refetchStaff()
            setStaffs(staffsData.staffs.data);
        }
    }, [staffsData, staffs]);
    const handleStaffAppoinment = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStaffId(e.target.name = e.target.value)
    };

    // staff wish appointment
    useEffect(() => {
        const convertArr: any[] = [];
        appointmentsData.forEach((item: any) => {
            // Object.assign(item, { "uuid": uuidv4() })
            const sDate = moment.unix(item.start).format('YYYY MM DD H:m');
            const eDate = moment.unix(item.end).format('YYYY MM DD H:m');
            const newObj = {
                title: item.title,
                start: new Date(sDate),
                end: new Date(eDate),
                id: item.id
            }

            convertArr.push(newObj);
            setConvertedArry(convertArr)
            // console.log("sDate", moment.unix(item.start).format('YYYY MM DD H:m'))
            // console.log("eDate", moment.unix(item.end).format('YYYY MM DD H:m:s'))

        })
    }, [appointmentsData])
    // console.log("converted array", convertedArry);
    return (
        <>

            <div className="calendar ptc">
                <div className="toolbar">
                    <div className="calendar-staff ms-auto d-flex align-items-center justify-content-between">
                        <Form.Select aria-label="Default select example" name="staff_id" onChange={handleStaffAppoinment}>
                            <option value="0" selected>All</option>
                            {staffs.map((staff) => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                        </Form.Select>
                        <DropdownButton className="add-btn btn2 add-service-btn" id="dropdown-basic-button" title="Create">
                            <Link to="/appointment/add" className="dropdown-link">New appointment</Link>
                            <Link to="#"><Dropdown.Item onClick={handleShowBlock} >New blocked time</Dropdown.Item></Link>
                            <Link to="/sales-checkout" className="dropdown-link">New sale</Link>
                        </DropdownButton>
                    </div>
                    <BlockTimeModal handleClose={handleCloseBlock} show={showBlockTime} />
                </div>
                <div className="CalendarWrapM">
                    <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'Calendar' })}</PageTitle>
                    {/* begin::Row */}

                    <div className='row g-5 g-xl-8'>
                        <div className='col-xl-12'>
                            <Calendar
                                culture='en-GB'
                                localizer={localizer}
                                events={convertedArry}
                                startAccessor="start"
                                endAccessor="end"
                                step={30}
                                // formats="YYYY MM DD H:m"
                                // defaultDate={moment().toDate()}
                                defaultDate={new Date()}
                                views={{ month: true, week: true, day: true, agenda: true }}
                                style={{ height: 500 }}
                            />
                        </div>
                    </div>
                    {/* end::Row */}
                </div>
            </div>
        </>
    )
}

export { CalendarWrapper }