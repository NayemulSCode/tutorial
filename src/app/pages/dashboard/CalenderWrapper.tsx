import { useIntl } from "react-intl"
import React, { FC, useState, useEffect, useContext } from "react"
import { Link, useHistory } from 'react-router-dom'
import { Modal, Button, Dropdown, DropdownButton, Form, Card, Row, Col } from 'react-bootstrap-v5'
import { PageTitle } from "../../../_metronic/layout/core"
import BlockTimeModal from "./components/calendar/BlockTimeModal"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import moment from 'moment-timezone'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { ALL_STAFF_INFO, STAFF_WISE_APPOINTMENT, SINGLE_APPOINTMENT, ALL_CHAIRS, GET_ALL_SERVICES, PROFILE_INFORMATION } from '../../../gql/Query'
import { IStaff, IAppointments } from '../../../types'
import UpdateAppointmentModal from './components/calendar/UpdateAppointmentModal'
import { APPOINTMENT_UPDATE_FROM_CALENDER } from "../../../gql/Mutation"
import { useSnackbar } from 'notistack';
import { AppContext } from "../../../context/Context"
import VideoConsultationModal from "./components/calendar/videoConsultationModal"
import GoogleCalendar from "./components/calendar/GoogleCalendar/GoogleCalendar"
import {useTostMessage} from '../../modules/widgets/components/useTostMessage'
import { useStaffWiseAappointment } from "../../modules/api/fetchQueryData"
import AddGuestInGroupCourseModal from "./components/calendar/AddGuestInGroupCourseModal"
import { EventDateTime } from "../../modules/generates.type"

const DragAndDropCalendar = withDragAndDrop(Calendar as any);

const CalendeEvents: FC = () => {
    document.title = "Calendar";
  const { addCaEvent, cancelApptId, clearContext } = useContext(AppContext);
    const intl = useIntl()
    const history = useHistory();
    const {showToast} = useTostMessage();
    // moment().tz("Asia/Dhaka").format()
    // console.log("cancel appointment id", cancelApptId)
    const localizer = momentLocalizer(moment)
    const { enqueueSnackbar } = useSnackbar();
    const [formValues, setFormValues] = useState<Array<object>>([]);
    const [staffId, setStaffId] = useState("0");
    const [charisId, setCharisId] = useState("0");
    const [staffs, setStaffs] = useState<IStaff[]>([]);
    const [chairs, setChairs] = useState<Array<any>>([]);
    const [services, setServices] = useState<Array<any>>([]);
    const [scheduleDate, setScheduleDate] = useState<any>("")
    const [appointmentsData, setAppointmentsData] = useState<Array<any>>([{
        id: "",
        appt_id: 0,
        title: "",
        start: new Date(),
        end: new Date()
    }])
    // update appointment
    const momentTime: any = moment.unix(scheduleDate).utcOffset('+0000').format('YYYY MM DD H:m')
    // console.log("moment time for test", momentTime)
    const [appointmentTime, setAppointmentTime] = useState<any>(momentTime)
    const convertedDate = moment(appointmentTime).format("DD-MM-YYYY")
    const [appointmentId, setAppointmentId] = useState<string>("")
    const [roomId, setRoomId] = useState(null);
    const [isUpdateAppointment, setIsUpdateAppointment] = useState<boolean>(false)
    const handleClose = () => {setIsUpdateAppointment(false)};
    const handleCloseGroupCourse = () => {
      setIsUpdateAppointment(false);
      clearContext();
    };
    const [convertedArry, setConvertedArry] = useState<Array<any>>([])
    const [showBlockTime, setshowBlockTime] = useState<boolean>(false);
    const [slotDuration, setSlotDuration] = useState<any>();
    const [status, setStatus] = useState<string>("");
    const [eventDateTime, setEventDateTime] = useState<EventDateTime>({
      date:"",
      date_show:"",
      time: ""
    });

    const handleCloseBlock = () => setshowBlockTime(false);
    const handleShowBlock = () => {
        setshowBlockTime(true);
    }
    // create new event 
    const handleSelect = ({ start, end }: any) => {
        // console.log(start, end);
        // add context 
        if (start && end) {
            var newEvent = {
                start: start,
                end: end,
            }
            addCaEvent(newEvent)
        }

        history.push('/appointment/add')
    };
    const { data, error, loading } = useStaffWiseAappointment(staffId, charisId);
    const {data: profileInformation, refetch: profileInfo} = useQuery(PROFILE_INFORMATION)
    const { data: appointmentDetails, error: appointmentDetailsError, loading: appointmentDetailsLoading, refetch: singleapppointFetch } = useQuery(SINGLE_APPOINTMENT, {
        variables: {
            id: +appointmentId
        },
        fetchPolicy: "network-only"
    })
    const { data: staffsData, error: staffsError, loading: staffsLoading, refetch: refetchStaff } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: 10,
            page: 1,
        },
        fetchPolicy: "network-only"
    })
    const handleViewAppointmnet2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStaffId(e.target.name = e.target.value);
        setCharisId("0");
    }
    const handleViewAppointmnet1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCharisId(e.target.name = e.target.value);
        setStaffId("0")
    }
    useEffect(()=>{
        if(profileInformation){
            // profileInfo()
            setSlotDuration(profileInformation.profileInformation.slot_duration)
            // console.log('profile information', profileInformation.profileInformation.slot_duration)
        }
    },[profileInformation])
    useEffect(() => {
        if (appointmentDetails) {
            console.log("all appointment>>", appointmentDetails?.appointment)
            setFormValues(appointmentDetails?.appointment?.appointment_detail)
            setScheduleDate(appointmentDetails?.appointment?.date)
        }
        if (appointmentDetailsError) {
        }
        if(appointmentDetailsLoading){
            setFormValues([])
        }
    }, [appointmentDetails]);
    const { data: allChairs, error: chairError, loading: chairLoading } = useQuery(ALL_CHAIRS, {
        variables: {
            count: 10,
            page: 1
        }
    });
    const { data: allServices, error: servicesError, loading: servicesLoading } = useQuery(GET_ALL_SERVICES, {
        variables: {
            type: "sale",
            count: 10,
            page: 1
        }
    });
    // 
    useEffect(() => {
      // Get the current URL
      const currentURL = window.location.href
      const url = new URL(currentURL)
      const message = url.searchParams.get('message')
      if (message) {
        showToast(message, 'success') // You can use a toast library or custom notification component here
      }
    }, []) 

  useEffect(() => {
    try {
      if (data?.staffWiseAppointment && !loading) {
        setAppointmentsData(data.staffWiseAppointment);
      }

      if (error) {
        // Handle error if needed
      }
    } catch (error) {
      // Handle error if needed
    }
  }, [data, loading, error, setAppointmentsData, cancelApptId]);

    useEffect(() => {
        if (staffsData) {
            // refetchStaff()
            setStaffs(staffsData.staffs.data);
        }
        if (allChairs) {
            setChairs(allChairs.chairs.data)
        }
        if (allServices) {
            setServices(allServices.services.data)
            // console.log(allServices)
        }
    }, [staffsData, allChairs, allServices]);

    // staff wish appointment
    useEffect(() => {
        const convertArr: any[] = [];
        appointmentsData.forEach((item: any) => {
            // console.log("item",item)
            // Object.assign(item, { "uuid": uuidv4() })
            // const sDate = moment.unix(item.start).utcOffset('+0000');
            // const sDate = moment.unix(item.start).utcOffset('+0000').format('YYYY MM DD H:m');

            // const eDate = moment.unix(item.end).utcOffset('+0000');
            // const eDate = moment.unix(item.end).utcOffset('+0000').format('YYYY MM DD H:m');
            let sDate = moment(item.start)
            let eDate = moment(item.end)
            const newObj = {
              title: item.is_group ? `${item.title}` : `${item.title}-${item.name}`,
              start: sDate.toDate(), // Use .toDate() instead of new Date(sDate)
              end: eDate.toDate(), // Use .toDate() instead of new Date(eDate)
              id: item.id,
              appt_id: item.appt_id,
              room_id: item?.room_id,
              status: item?.status,
              is_group: item?.is_group,
              is_course: item?.is_course,
            }
            convertArr.push(newObj);
            setConvertedArry(convertArr);

        })
    }, [appointmentsData, cancelApptId])

    // update appointment
    const handleUpdateAppointment = (event: any) => {
        console.log("🚀 ~ file: TestCalender.tsx:206 ~ handleUpdateAppointment ~ event:", event)
        setAppointmentId(event.appt_id);
        setRoomId(event.room_id);
        setIsUpdateAppointment(!isUpdateAppointment);
        setStatus(event.status);
        // state need for course and group update
      setEventDateTime({
        date: moment(event.start).format('YYYY-MM-DD'),
        date_show: moment(event.start).format('ddd MMM DD YYYY'),
        time: moment(event.start).format('HH:mm')
      })
        // history.push(`/appointment/update/${event.appt_id}`)
    }
    // console.log('room Id: ', roomId)
    // drag and drop start
    const [appointmentUpdateFromCalendar] = useMutation(APPOINTMENT_UPDATE_FROM_CALENDER)
    const moveEvent = ({ event, start, end }: any) => {
        const thisEvent = event;
        // console.log("this event",thisEvent)
        const nextEvents = convertedArry.map((existingEvent) => {
            const convtDate = moment(start).format("DD-MM-YYYY")
            const s_time = moment(start).format("HH:mm")
            const e_time = moment(end).format("HH:mm")
            const newSchedule = {
                id: event.id,
                appt_id: event.appt_id,
                date: convtDate,
                s_time: s_time,
                e_time: e_time
            }
            if (existingEvent.appt_id == event.appt_id) {
                appointmentUpdateFromCalendar({
                    variables: {
                        id: event.id,
                        // appt_id: event.appt_id,
                        date: convtDate,
                        s_time: s_time,
                        e_time: e_time
                    }
                }).then(({ data }) => {
                    console.log("draga and drop update", data)
                    enqueueSnackbar(data.appointmentUpdateFromCalendar.message, {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        transitionDuration: {
                            enter: 300,
                            exit: 500
                        }
                    });
                    window.location.reload();
                })
            }
            console.log("newSchedule", newSchedule)
            return (
                existingEvent.appt_id == event.appt_id
                    ? {

                        ...existingEvent, start, end
                    }
                    : existingEvent
            )
        });
        setConvertedArry(nextEvents)
        console.log("drag event", nextEvents);
    };
    // drag and drop start
    // resize appointment start
    const resizeEvent = ({ event, start, end }: any) => {
        const thisEvent = event;
        const nextEvents = convertedArry.map(existingEvent => {
            const convtDate = moment(start).format("DD-MM-YYYY");
            const s_time = moment(start).format("HH:mm");
            const e_time = moment(end).format("HH:mm");
            if (existingEvent.appt_id == event.appt_id) {
                appointmentUpdateFromCalendar({
                    variables: {
                        id: event.id,
                        // appt_id: event.appt_id,
                        date: convtDate,
                        s_time: s_time,
                        e_time: e_time
                    }
                }).then(({ data }) => {
                    console.log("draga and drop update", data)
                    enqueueSnackbar(data.appointmentUpdateFromCalendar.message, {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        transitionDuration: {
                            enter: 300,
                            exit: 500
                        }
                    });
                })
            }
            return existingEvent.appt_id == event.appt_id
                ? { ...existingEvent, start, end }
                : existingEvent
        })

        setConvertedArry(nextEvents)
    }
    // resize appointment end 
    // day field color changer
    let today = new Date();    
    // how to
    const {addVideoItem} = useContext(AppContext)
    const handleRedirectVideoSection = () => {
      addVideoItem(1)
      history.push('/setup/how-to')
    }
    return (
      <>
        <div className='calendar ptc'>
          <div className='toolbar'>
            <GoogleCalendar />
            <div className='d-flex justify-content-start flex-wrap me-auto'>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'green', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>Completed</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'red', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>No show</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'blue', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>New or Confirm</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'purple', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>Refunded</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'darkblue', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>Google calendar events</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'chocolate', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>Class</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'darkcyan', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>Course</span>
              </div>
              <div className='d-flex align-items-center me-3'>
                <div style={{backgroundColor: 'orange', height: '12px', width: '12px'}}> </div>
                <span className='ms-2'>Consultation call</span>
              </div>
            </div>
            <div className='calendar-staff ms-auto d-flex align-items-center justify-content-between'>
              <Form.Select
                aria-label='Default select example'
                name='chair_id'
                onChange={handleViewAppointmnet1}
              >
                <option value='0' selected>
                  All Chair
                </option>
                {chairs.map((chair, index) => (
                  <option key={chair.id} value={chair.id}>
                    {index + 1}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                aria-label='Default select example'
                name='staff_id'
                onChange={handleViewAppointmnet2}
              >
                <option value='0' selected>
                  All Staff
                </option>
                {staffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </Form.Select>
              <DropdownButton
                className='add-btn btn2 add-service-btn'
                id='dropdown-basic-button'
                title='Create'
              >
                <Link to='/appointment/add' className='dropdown-link'>
                  New appointment
                </Link>
                {/* <Link to="#"><Dropdown.Item onClick={handleShowBlock} >New blocked time</Dropdown.Item></Link> */}
                <Link to='/sales-checkout' className='dropdown-link'>
                  New sale
                </Link>
              </DropdownButton>
              <button
                style={{background: '#ebc11a'}}
                type='button'
                onClick={handleRedirectVideoSection}
                className='btn btn-sm text-light text-nowrap ms-5'
              >
                How To
              </button>
            </div>
            <BlockTimeModal handleClose={handleCloseBlock} show={showBlockTime} />
          </div>
          <div className='CalendarWrapM'>
            <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'Calendar'})}</PageTitle>
            <div className='row g-5 g-xl-8'>
              <div className='col-xl-12 rbc-calendar'>
                <DragAndDropCalendar
                  culture='en-GB'
                  localizer={localizer}
                  longPressThreshold={10}
                  events={convertedArry}
                  startAccessor='start'
                  endAccessor='end'
                  step={slotDuration}
                  defaultDate={new Date()}
                  defaultView='week'
                  // dayPropGetter={calendarStyle} //day filed color changer
                  min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6)}
                  max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23.9)}
                  timeslots={1}
                  selectable
                  // onEventDrop={moveEvent}
                  // onEventResize={resizeEvent}
                  onSelectSlot={handleSelect}
                  onSelectEvent={(event) => handleUpdateAppointment(event)}
                  views={{month: true, week: true, day: true, agenda: true}}
                  style={{height: 500}}
                  // resources={resourceArray}
                  messages={{
                    // today: "Today",
                    previous: 'Prev.',
                    // next: "",
                    // month: "Month",
                    // week: "Week",
                    // day: "Day"
                    agenda: 'Bookings',
                  }}
                  eventPropGetter={(convertedArry: any) => {
                    const backgroundColor = convertedArry.room_id
                      ? 'orange'
                      : convertedArry.status === 'Completed'
                      ? 'green'
                      : convertedArry.status === 'No Show'
                      ? 'red'
                      : convertedArry.status === 'Cancelled'
                      ? 'purple'
                      : convertedArry.status === 'Google'
                      ? 'darkblue'
                      : Boolean(convertedArry.is_course)
                      ? 'darkcyan'
                      : Boolean(convertedArry.is_group) && !Boolean(convertedArry.is_course)
                      ? 'chocolate'
                      : 'blue'
                    return {style: {backgroundColor}}
                  }}
                />
              </div>
            </div>
            {/* course and group appointment */}
            {status === 'Group Service' && (
              <AddGuestInGroupCourseModal
                appointmentId={appointmentId}
                isUpdateAppointment={isUpdateAppointment}
                handleClose={handleClose}
                handleCloseGroupCourse={handleCloseGroupCourse}
                eventDateTime={eventDateTime}
              />
            )}
            {/* start update modal single event with event calender */}
            {!Boolean(roomId) && status !== 'Google' && status !== 'Group Service' && (
              <UpdateAppointmentModal
                appointmentId={appointmentId}
                isUpdateAppointment={isUpdateAppointment}
                handleClose={handleClose}
                eventDateTime={eventDateTime}
              />
            )}
            {Boolean(roomId) && (
              <VideoConsultationModal
                appointmentId={appointmentId}
                isUpdateAppointment={isUpdateAppointment}
                handleClose={handleClose}
              />
            )}
            {/* end create modal with clader event */}
          </div>
        </div>
      </>
    )
}

export {CalendeEvents}