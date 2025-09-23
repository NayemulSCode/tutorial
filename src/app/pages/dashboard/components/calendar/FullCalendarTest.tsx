import React, { FC, useState, useEffect } from "react"
import { Modal, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap-v5'
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { IStaff } from "../../../../../types"
import { useQuery } from "@apollo/client"
import moment from 'moment'
import { ALL_STAFF_INFO, STAFF_WISE_APPOINTMENT, ALL_CHAIRS } from "../../../../../gql/Query"
interface DemoAppState {
    weekendsVisible: boolean
    currentEvents: EventApi[]
}

const FullCalendarTest: FC = () => {
    const [weekendsVisible, setweekendsVisible] = useState<boolean>(true)
    const [fullCalenadar, setFullcalendar] = useState<Array<any>>([{
        start: new Date(),
        end: new Date(),
        title: ""
    }])
    const [convertedArry, setConvertedArry] = useState<Array<any>>([])
    const [appointmentsData, setAppointmentsData] = useState<Array<any>>([{
        id: "",
        title: "",
        start: new Date(),
        end: new Date()
    }])
    const handleSelect = ({ start, end }: any) => {
        const title = window.prompt('New appointment name')
        if (title) {
            // here is call appointment create from calender onclick
            var newEvent = {
                start: moment(start).toDate(),
                end: moment(end).toDate(),
                title: title
            }
            setFullcalendar([...fullCalenadar, newEvent]);
            // let updateEventsList = eventsList;
            // updateEventsList.push(newEvent);
            // setEventsList([...eventsList, newEvent]);
            // console.log("new appointment", newEvent)
        }
    };
    const [staffId, setStaffId] = useState("0")
    const [staffs, setStaffs] = useState<IStaff[]>([]);
    const [chairs, setChairs] = useState<Array<any>>([])

    const { data: allChairData } = useQuery(ALL_CHAIRS, {
        variables: {
            count: 100,
            page: 1,
        }
    })

    useEffect(() => {
        if (allChairData) {
            setChairs(allChairData.chairs?.data);
        }
    }, [allChairData])

    const { data: staffsData, error: staffsError, loading: staffsLoading, refetch: refetchStaff } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: 10,
            page: 1,
        }
    })
    const { data: appointmentData, error: appointmentError, loading: appointmentLoading, refetch } = useQuery(STAFF_WISE_APPOINTMENT, {
        variables: {
            staff_id: +staffId
        }
    })
    useEffect(() => {
        if (appointmentData) {
            refetch();
            if (appointmentData.staffWiseAppointment.length > 0) {
                refetch();
                setAppointmentsData(appointmentData.staffWiseAppointment)
            }
            // console.log("staff wise appointment>>>", appointmentData.staffWiseAppointment)
        }
    }, [appointmentData]);
    useEffect(() => {
        if (staffsData) {
            refetchStaff()
            setStaffs(staffsData.staffs.data);
        }
    }, [staffsData]);
    const handleStaffAppoinment = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStaffId(e.target.name = e.target.value)
    };
    useEffect(() => {
        const convertArr: any[] = [];
        appointmentsData.forEach((item: any) => {
            // Object.assign(item, { "uuid": uuidv4() })
            const sDate = moment.unix(item.start).format('YYYY MM DD H:m');
            // const sTimeZone = moment(sDate).utcOffset('+0000').format('YYYY MM DD HH:mm')
            const eDate = moment.unix(item.end).format('YYYY MM DD H:m');
            // const eTimeZone = moment(sDate).utcOffset('+0000').format('YYYY MM DD HH:mm')
            const newObj = {
                title: item.title,
                start: new Date(sDate),
                end: new Date(eDate),
                id: item.id
            }

            convertArr.push(newObj);
            setConvertedArry(convertArr)
            // console.log("sDate unix", moment.unix(item.start).format('YYYY MM DD H:m'))
            // console.log("eDate utc", moment(sDate).utcOffset('+0000').format('YYYY MM DD HH:mm'))

        })
    }, [appointmentsData])

    return (
        <>
            <div>
                
                <div className="ms-auto d-flex justify-content-between">
                    <Form.Select aria-label="Default select example" name="staff_id" onChange={handleStaffAppoinment}>
                        <option value="0" selected>All</option>
                        {staffs.map((staff) => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                    </Form.Select>
                </div>
            </div>
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    initialView='dayGridMonth'
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={weekendsVisible}
                    initialEvents={appointmentsData} // alternatively, use the `events` setting to fetch from a feed
                    dateClick={handleSelect}
                    // select={handleDateSelect}
                    events={convertedArry} // custom render function
                // eventClick={handleEventClick}
                // eventsSet={thandleEvents} // called after events are initialized/added/changed/removed
                /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
                />
            </div>
        </>
    )
}
export { FullCalendarTest };