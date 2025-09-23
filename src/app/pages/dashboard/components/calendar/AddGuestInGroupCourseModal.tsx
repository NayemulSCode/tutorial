import React, { FC, useState, useEffect, useContext, Fragment } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Card, Button, Form, Row, Col, Modal, Dropdown } from "react-bootstrap-v5";
import moment from 'moment'
import CreateClientModal from "./CreateClientModal";
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { AppContext } from '../../../../../../src/context/Context';
import { IProduct, IVoucher, IService, IUsers, IStaff, IGuest, IServiceTobeCheckout, IBuyerGuest } from "../../../../../types";
import { ALL_CLIENTS, SINGLE_CLIENT, ALL_STAFF_INFO, GET_ALL_SERVICES, ALL_CHAIRS, SERVICE_PRICING, SINGLE_APPOINTMENT, PARTNER_TIME_SLOT, STAFF_WISE_APPOINTMENT } from '../../../../../gql/Query';
import { ADD_OR_UPDATE_GROUP_COUSE, APPOINTMENT_STATUS_UPDATE, APPOINTMENT_UPDATE, CONFLICT_CHECKING, GUEST_PROFILE_UPDATE } from '../../../../../gql/Mutation';
import AppointmentCancelationNoteModal from './AppointmentCancelationNoteModal';
import NoShowModal from './NoShowModal';
import Select from 'react-select'
import GuestList from './GuestList';
import { useTostMessage } from '../../../../modules/widgets/components/useTostMessage';
import { frequency, occurrence, timeDurationArray } from '../../../../modules/util';
import { EventDateTime, ShouldRepeated } from '../../../../modules/generates.type';
import { useAppointmentDetails } from '../../../../modules/api/fetchQueryData';
import GuestShouldRepeated from './GuestShouldRepeated';
import ButtonR from '../../../../modules/widgets/components/ButtonR';
import { toast } from 'react-toastify';

type Props = {
  isUpdateAppointment: boolean;
  handleClose: () => void
  handleCloseGroupCourse: () => void
  appointmentId: any;
  eventDateTime: EventDateTime;
}


const AddGuestInGroupCourseModal: FC<Props> = ({ appointmentId, eventDateTime, isUpdateAppointment, handleClose, handleCloseGroupCourse }) => {
  const history = useHistory()
  const { showToast } = useTostMessage()
  const { apptInfo, addApptInfo, guest, addGuest, guests, addGuests, groupInfo, addGroupInfo, apptServices, addApptServices, appointmentCancel } =
    useContext(AppContext);
  const { appointmentDetails, appointmentDetailsError, appointmentDetailsLoading } = useAppointmentDetails(appointmentId, false); //here is appointmentId
  const [formValues, setFormValues] = useState<any[]>([{
    appt_id: 0,
    ser_pricing_id: "",
    time: "",
    duration: "",
    staff_id: "",
    chair: "", //chairId && chairId
    quantity: 0,
    service_name: "",
    price: 0,
    special_price: 0,
    staffs: "",
    online: 0,
    single_group: false,
    repeated_group: false,
    is_group: false,
    is_course: false,
    frequency: "",
    occurrences: "",
  }])
  console.log('formvalues:', formValues)
  let [myIndex, setMyIndex] = useState(0)
  const [isOverwrite, setIsOverwrite] = React.useState(false)
  const [clients, setClients] = useState<IUsers[]>([])
  const [search, setSearch] = useState('')
  const [chairs, setChairs] = useState<Array<any>>([])
  const [staffs, setStaffs] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [appointmentDate, setAppointmentDate] = useState<any>()
  const [appointmentDateForComapare, setAppointmentDateForComapare] = useState<any>()
  const [appointNote, setAppointNote] = useState<any>()
  const [timeSlots, setTimeSlots] = useState<Array<any>>([])
  const [overwrite, setOverwrite] = useState<number>(0)
  const [appointCancelationNote, setAppointCancelationNote] = useState('')
  const [cancelAppt, setCancelAppt] = useState(false)
  const [noShow, setNoShow] = useState(false)
  const [shouldRepeatedGuest, setShouldRepeatedGuest] = useState<boolean>(true);
  const [shouldRepeatedInfo, setShouldRepeatedInfo] = useState<ShouldRepeated>({ occurrences: '',frequency: '',});
  const [addedGuestId, setAddedGuestId] = useState<string>('');
  const [servicePricingId, setServicePricingId] = useState<string>('');
  const [courseTimeSlots, setCourseTimeSlots] = useState<Array<any>>([]);

  // const handleCloseNote = (setCancelAppt(!cancelAppt));
  const handleCloseNote = () => {
    setCancelAppt(false)
  }
  const handleCloseNoShow = () => {
    setNoShow(false)
  }
  const [detailClient, setDetailClient] = useState<any>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
  })

  const [overwriteObject, setOverwriteObject] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    additional_mobile: '',
    client_source: '',
    display_booking: '',
    gender: '',
    dob: '',
    client_info: '',
    address: '',
    marketing_notification: '',
    email_notification: '',
    language: '',
  })

  const [guestProfileUpdate] = useMutation(GUEST_PROFILE_UPDATE);
  const [checkScheduleConflictForClient,{loading: conflictLoading}] = useMutation(CONFLICT_CHECKING);
  const [addOrUpdateGroupAppointment, {loading: updateLoading}] = useMutation(
    ADD_OR_UPDATE_GROUP_COUSE,
    {
      onError(err) {
        const graphQLErrors = err.graphQLErrors

        if (graphQLErrors && graphQLErrors.length > 0) {
          const error = graphQLErrors[0]
          const extensions = error.extensions
          // Check if it's a validation error
          if (extensions && extensions.validation) {
            const validationErrors = extensions.validation
            // Loop through the validation errors and show each message in a toast
            Object.keys(validationErrors).forEach((key) => {
              validationErrors[key].forEach((message: any) => {
                showToast(message, 'error')
              })
            })
          } else {
            // If it's a different type of error, show the general reason
             showToast(extensions.reason, 'error')
          }
        } else {
          // Handle the case where there's no detailed GraphQL error
          showToast('An unknown error occurred', 'error')
        }
      },
    }
  )
  const [updateAppointment] = useMutation(APPOINTMENT_UPDATE, {
    refetchQueries: [
      {
        query: STAFF_WISE_APPOINTMENT,
        variables: {
          staff_id: 0,
          chair_id: 0,
        },
      },
    ],
    awaitRefetchQueries: true,
  })
  const { data: timeSlotData } = useQuery(PARTNER_TIME_SLOT)
  useEffect(() => {
    if (timeSlotData) {
      setTimeSlots(timeSlotData.partnerTimeSlots)
    }
  }, [timeSlotData])

  const handleDateFormater = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newCdate = moment(value).format('LL')
    setAppointmentDate(newCdate)
  }
  const convertedDate = moment(appointmentDate).format('DD-MM-YYYY')
  console.log("🚀 ~ file: AddGuestInGroupCourseModal.tsx:140 ~ convertedDate:", convertedDate)

  const {data: clientsData,error: clientsError,loading: ClientsLoading,refetch: refetchClient,} = useQuery(ALL_CLIENTS, {
    variables: {
      search: search,
      count: 1000,
      page: 1,
    },
  })
  const { data: allChairs,error: chairError,loading: chairLoading,} = useQuery(ALL_CHAIRS, {
    variables: {
      count: 100,
      page: 1,
    },
  })
  const {data: allStaffs,error: staffError,loading: staffLoading,} = useQuery(ALL_STAFF_INFO, {
    variables: {
      count: 100,
      page: 1,
    },
    fetchPolicy: 'network-only',
  })
  const [ getClient,{ data: singleClientData, error: singleClientError, loading: singleClientLoading },] = useLazyQuery(SINGLE_CLIENT, {
    fetchPolicy: 'network-only',
  })

  const [myAppointment, setMyAppointment] = useState<any>()


  useEffect(() => {
    return () => {
      setLoading(false)
      setLoading2(false)
    }
  }, [])
  useEffect(() => {
    if (clientsData) {
      refetchClient()
      setClients(clientsData.clients?.data)
    }
  }, [clientsData])

  useEffect(() => {
    if (allChairs) {
      setChairs(allChairs.chairs.data)
      // console.log("chairs>>", allChairs.chairs.data)
    }
    if (allStaffs) {
      setStaffs(allStaffs.staffs.data)
      // console.log("allStaffs", allStaffs)
    }
  }, [allChairs, allStaffs])

  const [showClients, setShowClients] = React.useState(false)
  const [showCdetails, setShowCdetails] = React.useState(false)

  const handleClickCBack = () => {
    setShowClients((Cprev) => !Cprev)
  }
  const handleClickCBackMutiple =()=>{
    setShowCdetails(false);
  }

  // add group occurence and frequency
  useEffect(()=>{
    let updatedGuest = guests.find((guest) => guest.id === addedGuestId);
    if (updatedGuest) {
      updatedGuest = {
        ...updatedGuest,
        occurrences: shouldRepeatedInfo.occurrences 
        ? shouldRepeatedInfo?.occurrences : groupInfo.occurrences 
        ? groupInfo?.occurrences  : "",
        frequency: groupInfo.frequency,
        repeated: shouldRepeatedGuest
      };
      // Call the addGuest function with the updated guest
      addGuests(updatedGuest, 'update');
    }
  }, [shouldRepeatedGuest, shouldRepeatedInfo.frequency, shouldRepeatedInfo.occurrences])
  // group service client work
  const handleClientsDetailView = (c: any) => {
    // group guest booking
    if (!guests?.some((guest) => guest?.id == c.id)
      && groupInfo.is_group
      && guests.length !== groupInfo.client_per_class
    ) {
      addGuests({
        ...c,
        ...shouldRepeatedInfo,
        repeated: shouldRepeatedGuest,
      }, 'update')
      setAddedGuestId(c.id)
      setShowCdetails(true)
    }
    else if (guests.length === groupInfo?.client_per_class && groupInfo.is_group) {
      showToast('Already filled your guests limit', 'warning');
    }
    else {
      showToast('Guest already have been added in the list', 'warning')
    }
  };

  const handleSearch = (e: any) => {
    setSearch(([e.target.name] = e.target.value))
  }
  // Show Client Details
  // useEffect for edit client info
  useEffect(() => {
    if (singleClientData?.client === null) {
      setShowClients(false)
      setShowCdetails(false)
    }
    if (singleClientData?.client != null) {
      console.log('Client', singleClientData.client)
      setShowCdetails(true)
      setShowClients(true)
      // setDetailClient(singleClientData?.client)
      addGuests(singleClientData?.client, 'add')
    }

    return () => {
      setShowClients(false)
      setShowCdetails(false)
      // setDetailClient({
      //   id: '',
      //   first_name: '',
      //   last_name: '',
      //   email: '',
      //   mobile: '',
      // })
    }
  }, [singleClientData])
  const handleClickCdetailsBack = (guest: any, length: number) => {
    console.log("🚀 ~ file: AddGuestInGroupCourseModal.tsx:322 ~ handleClickCdetailsBack ~ guest:", guest)
    addGuests(guest, 'remove')
    // setShouldRepeatedGuest(false)
    if (length - 1 == 0) {
      setShowCdetails((Cdprev) => !Cdprev);
    }
  };
  // Create client modal
  const [showCreateClient, setShowCreateClient] = useState<boolean>(false)
  const handleCloseCreateClient = () => setShowCreateClient(false)
  const handleShowCreateClient = () => {
    setShowCreateClient(true)
  }
  const guestId = (c: any) => {
    // console.log(c)
    // setDetailClient(c)
    addGuests(c, 'add')
    setShowCdetails(true)
  }


  const handleTextareaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAppointNote(value)
  }
  // when we add to cart from value.
  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (appointmentId) {
      setLoading2(true)
      const updateGroupCoursePayload = {
        id: myAppointment.id,
        date: eventDateTime.date,
        services: formValues.map((item) => ({
          time: item.time,
          duration: item.duration,
          staff_id: item.staff_id,
          chair: item.chiar,
          service_pricing_id: item.service_pricing_id,
        })),
        clients:
          guests.length > 0
            ? guests.map((guest) => ({
                id: guest?.client_id ? +guest?.client_id : +guest.id,
                // frequency: guest.frequency,
                occurrences: guest.occurrences ? +guest.occurrences : 0,
              }))
            : [],
        note: appointNote,
      }
      updateAppointment({
        variables: updateGroupCoursePayload,
      }).then(({data}) => {
        console.log('apppoint update', data)
        if (data.updateAppointment.status === 1) {
          setLoading2(false)
          showToast(data.updateAppointment.message, 'success')
          handleClose()
        } else if (data.updateAppointment.status === 0) {
          setLoading2(false)
          showToast(data.updateAppointment.message, 'error')
        }
      })
    }
  }
  // append time slot in timeSlot array which is messing for 45,15 minutes interval
  const handleTimeSlotLogic = (selectedTime: string, index: number) => {
    if (
      !timeSlots.some((time: any) => moment.unix(time.s_time).format('HH:mm') === selectedTime)
    ) {
      const lowerTimeIndex = timeSlots.findIndex(
        (time: any) => moment.unix(time.s_time).format('HH:mm') < selectedTime
      )

      if (lowerTimeIndex !== -1) {
        const newTimeSlot = {
          __typename: 'BusinessTimeSlot',
          s_time: moment(selectedTime, 'HH:mm').unix(),
        }

        const newTimeSlots = [...timeSlots]

        newTimeSlots.splice(lowerTimeIndex + 1, 0, newTimeSlot)

        // Sort the timeSlots array by s_time property
        newTimeSlots.sort((a, b) => a.s_time - b.s_time)

        setTimeSlots(newTimeSlots)

        setFormValues((prevFormValues: any) => {
          const newFormValues = [...prevFormValues]
          newFormValues[index].time = newTimeSlot.s_time
          return newFormValues
        })
      }
    }
  }

  const handleChange = (e: any, index: number) => {
    let { name, value } = e.target
    let values: any = formValues
    for (let itIndex in values) {
      if (+itIndex === index) {
        // console.log(name, value, index)
        values[index][name] = value
        // console.log(values[index][name]);
      }
    }
    setFormValues([...values])
  }

  const [singleService, { data: singleServiceData, loading: singleServiceLoading, refetch: singleServiceRefetch }] = useLazyQuery(SERVICE_PRICING);
  const fetchData = async (id: any, date: string, time: string) => {
    await singleService({
      variables: {
        id: id,
        date: date,
        time: time
      },
      fetchPolicy: "network-only"
    });
  };

  // useEffect to run the query when id, date, or time change
  useEffect(() => {
    if (appointmentId || eventDateTime) {
      fetchData(appointmentId, eventDateTime.date, eventDateTime.time);
    }
  }, [appointmentId, eventDateTime]);

  useEffect(() => {
    if (singleServiceData?.servicePricing) {

      const {
        pricing_name,
        id,
        service_id,
        service_name,
        duration,
        booked_guests,
        total_booked,
        price,
        special_price,
        staffs,
        occurrences,
        appt_note,
      } = singleServiceData.servicePricing || {}
      const booked_guests_arr = Array.isArray(booked_guests) ? booked_guests : []

      const {is_group, is_course, service_group} = singleServiceData.servicePricing.service || {}
      if (singleServiceData.servicePricing?.service?.is_group) {
        setAppointNote(appt_note)
        let groupData = {
          is_group: is_group,
          client_per_class: service_group?.client_per_class,
          is_course: is_course,
          session_per_course: service_group?.session_per_course,
          booked_guests: booked_guests || [],
          total_booked: total_booked,
          group_type: service_group?.group_type,
          frequency: service_group?.frequency,
          occurrences: occurrences,
          disabled: false,
        }
        addGroupInfo(groupData)
        if (booked_guests_arr.length > 0) {
          booked_guests_arr?.forEach((value: IBuyerGuest) => {
            addGuests(value, 'update')
          })
          setShowClients(true)
          setShowCdetails(true)
        }

        let values: any = formValues
        for (let itIndex in values) {
          if (+itIndex === myIndex) {
            // repeated gorup hole qty hobe occurences, course er jonno always 1 hobe
            values[itIndex].quantity =
              service_group?.group_type === 'repeated' ? +shouldRepeatedInfo.occurrences : 1
            values[myIndex].duration = duration
            values[myIndex].time = eventDateTime?.time
            values[myIndex].service_name = pricing_name
              ? `${service_name}(${pricing_name}) ${duration} min €${
                  parseInt(special_price) ? special_price : price
                }`
              : `${service_name} ${duration} min €${
                  parseInt(special_price) ? special_price : price
                }`
            values[myIndex].price = parseInt(price)
            values[myIndex].ser_pricing_id = parseInt(id)
            values[myIndex].service_id = parseInt(service_id)
            values[myIndex].special_price = parseInt(special_price)
            values[myIndex].staffs = staffs
            values[myIndex].staff_id = staffs[0]
            values[myIndex].repeated_group = service_group?.group_type === 'repeated' ? true : false
            // new added
            values[myIndex].is_group = is_group
            values[myIndex].client_per_class = service_group?.client_per_class
            values[myIndex].is_course = is_course
            values[myIndex].session_per_course = service_group?.session_per_course
            // group or course service chair auto filled with first chair
            values[myIndex].chair = chairs[0]?.id
          }
        }
        setFormValues([...values])
      }
    }
  }, [singleServiceLoading, singleServiceData, shouldRepeatedInfo.occurrences])

  const apptInformation = {
    client_id: guests.length > 0 ? JSON.stringify(guests.map((guest) => guest.id)) : "0",
    note: appointNote,
    date: eventDateTime.date,
  }
  //handle payment when payemnt from modal
  const handlePayment = (e: any) => {
    e?.preventDefault();
    const conflictCheckingPayload = formValues.map((item) => ({
      id: '',
      appt_id: '',
      date: convertedDate,
      time: item.time,
      duration: parseInt(item.duration),
      staff_id: parseInt(item.staff_id),
      chair: parseInt(item.chair),
      service_pricing_id: parseInt(item.ser_pricing_id),
    }))
    if (formValues[0].chair != '' && formValues[0].ser_pricing_id != '') {
    checkScheduleConflictForClient({
      variables: {
        client_id: guests.length > 0 ? +guests[0]?.id : 0,
        services: conflictCheckingPayload,
      },
    })
      .then(({data}) => {
        const {message, status} = data.checkScheduleConflictForClient || {}
        if (status === 1) {
          // addGuests(guests)
          addApptInfo(apptInformation)
          addApptServices(formValues)
          history.push('/sales-checkout')
        }
        if (status === 0) {
          showToast(message, 'error')
        }
      })
      .catch((err) => {
        showToast(err.message, 'error')
      })
      .finally(() => {
        setLoading(false)
      })
    } else {
      showToast('Please Fill Up Service & Chair Info', 'error');
    }
  }
  //Group and course schedul update only remove guest and update
  const handleAdOrUpdateGroupCourse=(e:any)=>{
    e?.preventDefault();
    const serviceObjet = formValues.map((item) => ({
      id: '',
      appt_id: '',
      date: eventDateTime.date,
      time: item.time,
      duration: item.duration,
      staff_id: item.staff_id,
      chair: +item.chair,
      service_pricing_id: item.ser_pricing_id,
    }))
    const groupCourseUpdatePayload = {
      date: eventDateTime.date,
      note: appointNote ?? '',
      clients:
        guests.length > 0
          ? guests.map((guest) => ({
              id: guest?.client_id ? +guest?.client_id : +guest.id,
              // frequency: guest.frequency,
              occurrences: guest.occurrences ? +guest.occurrences : 0,
            }))
          : [],
      service: serviceObjet.length ? serviceObjet[0] : {},
    }
    addOrUpdateGroupAppointment({
      variables: groupCourseUpdatePayload,
    }).then(({data}) => {
      const {message, status} = data?.addOrUpdateGroupAppointment || {}
      if (status === 1) {
        showToast(message, 'success')
        handleClose()
        singleServiceRefetch()
      }
      if (status === 0) {
        showToast(message, 'error')
      }
    })
  }

  const guestUpdate = (guestId: any, overwriteObject: any) => {
    // console.log('overwriteObject/////',overwriteObject)
    guestProfileUpdate({
      variables: {
        id: guestId,
        first_name: overwriteObject.first_name,
        last_name: overwriteObject.last_name,
        email: overwriteObject.email,
        mobile: overwriteObject.mobile,
        dob: overwriteObject.dob,
        gender: overwriteObject.gender,
        address: overwriteObject.address,
        additional_mobile: overwriteObject.additional_mobile,
        client_source: overwriteObject.client_source,
        display_booking: overwriteObject.display_booking,
        client_info: overwriteObject.client_info,
        email_notification: overwriteObject.email_notification,
        marketing_notification: overwriteObject.marketing_notification,
        language: '',
        photo: '',
        suite: '',
        country: '',
        eir_code: '',
      },
    })
      .then(({ data }) => {
        setLoading(false)
        if (data.guestProfileUpdate.status === 1) {
          console.log(data?.guestProfileUpdate?.data)
          // guestId(data.guestProfileUpdate?.data)
          setShowCdetails(true)
          // setDetailClient(data?.guestProfileUpdate?.data)
          addGuests(data?.guestProfileUpdate?.data, 'add')
          showToast(data.guestProfileUpdate.message, 'success');
          setIsOverwrite(!isOverwrite)
        }
        if (data.guestProfileUpdate.status === 0) {
          showToast(data.guestProfileUpdate.message, 'error');
        }
      })
      .catch((e) => {
        showToast('Something went wrong!!!', 'error');
        setLoading(false)
      })
  }
  useEffect(() => {
    if (overwrite === 1) {
      guestUpdate(detailClient?.id, overwriteObject)
    }
    if (overwrite === 2) {
      setIsOverwrite(!isOverwrite)
      // history.push('/guests')
    }
  }, [overwrite])
 
  return (
    <>
      <Modal
        dialogClassName='appoinment_update_modal'
        show={isUpdateAppointment}
        onHide={handleCloseGroupCourse}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header className='sale-modal-heade' closeButton>
            {/* <div className=''>
              <span>
                Appointment:{' '}
                <strong className='badge badge-success mb-1 mx-1'>
                  {myAppointment && myAppointment.status}
                </strong>
              </span>
              <span>
                Payment:{' '}
                {myAppointment && myAppointment.payment_status === 'Upfront' ? (
                  <strong className='badge badge-primary'>Partially Paid</strong>
                ) : myAppointment && myAppointment.room_id !== null ? (
                  <strong className='badge badge-primary'>Consultation Video Call</strong>
                ) : (
                  <strong className='badge badge-primary'>
                    {myAppointment && myAppointment.payment_status}
                  </strong>
                )}
              </span>
            </div> */}
            <div className='d-flex align-items-center justify-content-between'>
              <div></div>
              <h2
                className={`${
                  myAppointment?.status === 'Cancelled'
                    ? 'adv-price-modal-title'
                    : 'adv-price-modal-title ml-280'
                }`}
              >
                Update Class Course Appointment
              </h2>
              {/* <ButtonR 
                  loading= {conflictLoading}
                  OnClick={handlePayment}
                  name='Payment'
                  variant='success'
                  class_name='btn btn-sm'
                /> */}
              <ButtonR
                loading={updateLoading}
                OnClick={handleAdOrUpdateGroupCourse}
                name='Update'
                class_name='btn btn-sm'
              />
              {/* <ButtonR 
                  loading= {false}
                  OnClick={handleAdOrUpdateGroupCourse}
                  name='Update'
                  class_name='btn btn-sm'
                  variant= 'primary'
                /> */}
              {myAppointment && myAppointment.status !== 'Cancelled' ? (
                <div className='d-flex gap-2'>
                  {/* {myAppointment && myAppointment.payment_status !== 'Paid' && (
                    <Button
                      className='btn btn-sm'
                      variant='success'
                      type='button'
                      onClick={handlePayment}
                      disabled={myAppointment.status !== 'No Show' ? false : true}
                    >
                      Payment
                    </Button>
                  )} */}
                  {/* <Button
                    className='btn btn-sm'
                    variant='primary'
                    type='submit'
                    disabled={loading2}
                  >
                    {!loading2 && <span className='indicator-label'>Update</span>}
                    {loading2 && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button> */}
                  {appointmentDateForComapare < moment().unix() &&
                    myAppointment?.status != 'Completed' && (
                      <Button
                        className='btn btn-sm'
                        onClick={(e) => {
                          setNoShow(!noShow)
                          handleCloseGroupCourse()
                        }}
                        variant='danger'
                        disabled={myAppointment?.status !== 'No Show' ? false : true}
                      >
                        No Show
                      </Button>
                    )}
                  {myAppointment && myAppointment.status !== 'No Show' && (
                    <Button
                      className='btn btn-sm'
                      onClick={(e) => {
                        setCancelAppt(!cancelAppt)
                        handleCloseGroupCourse()
                      }}
                      variant='danger'
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ) : (
                <div className='d-flex gap-2'></div>
              )}
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className='row'>
              {singleServiceLoading && (
                <div className='text-center'>
                  <div className='spinner-grow text-primary' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                  <div className='spinner-grow text-secondary' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                  <div className='spinner-grow text-success' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                </div>
              )}
              {!singleServiceLoading && (
                <>
                  <div className='col-sm-8'>
                    <Card className='primary-bx-shadow p-30'>
                      <div style={{marginBottom: '15px'}}>
                        <Form.Group
                          className='d-flex justify-content-end align-items-center apnmnt-date-wrapper'
                          controlId='date'
                        >
                          <span className='me-2'>{eventDateTime?.date_show}</span>
                          {/* <div className='apnmnt-date'>
                            <Form.Control
                              className='apnmnt-date-input'
                              type='date'
                              name='date'
                              value={appointmentDate}
                              onChange={handleDateFormater}
                            />
                            <i className='far fa-calendar text-dark calendar-icon'></i>
                          </div> */}
                        </Form.Group>
                      </div>
                      <div className='scheduleWrap'>
                        <div className='scheduleInner'>
                          <div className='add-pricing'>
                            {formValues &&
                              formValues.map((element: any, index) => {
                                return (
                                  <div className='Pricing-option1'>
                                    <Row style={{marginBottom: '30px'}} className='schedulerow'>
                                      <div className='add-price-tool appn_counter d-flex align-items-center justify-content-between'>
                                        <h3 className='appn-service-count'>{index + 1}</h3>
                                      </div>
                                      <Form.Group
                                        as={Col}
                                        sm={4}
                                        className='starttime mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Start time</Form.Label>
                                        <Form.Control
                                          name='time'
                                          id='datePicker'
                                          disabled
                                          value={element.time}
                                          onChange={(e: any) => {
                                            handleChange(e, index)
                                          }}
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        sm={8}
                                        className='duration mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Service</Form.Label>
                                        <Form.Control
                                          name='service_name'
                                          disabled
                                          title={element.service_name}
                                          value={element.service_name}
                                        />
                                        {formValues[index].ser_pricing_id &&
                                        formValues[index].staff_id &&
                                        formValues[index].staffs &&
                                        !formValues[index].staffs.includes(
                                          formValues[index].staff_id
                                        ) ? (
                                          <span className='text-danger'>
                                            this staff doesn't provide this service, but you still
                                            book appointments for them.
                                          </span>
                                        ) : (
                                          ''
                                        )}
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        sm={3}
                                        className='duration mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Duration</Form.Label>
                                        <Form.Select
                                          name='duration'
                                          disabled
                                          defaultValue={element.duration}
                                          onChange={(e) => {
                                            handleChange(e, index)
                                          }}
                                        >
                                          <option value='' disabled selected>
                                            Choose
                                          </option>
                                          {timeDurationArray.map((itm, i) => (
                                            <option
                                              selected={itm.id == +formValues[index].duration}
                                              key={itm.id}
                                              value={itm.id}
                                            >
                                              {itm.text}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        sm={4}
                                        className='duration mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Chair</Form.Label>
                                        <Form.Select
                                          name='chair'
                                          aria-label='Default select example'
                                          defaultValue={element.chair}
                                          onChange={(e) => {
                                            handleChange(e, index)
                                          }}
                                        >
                                          <option value='' disabled selected>
                                            Choose
                                          </option>
                                          {chairs.length > 0 &&
                                            chairs.map((chair, index) => (
                                              <option
                                                selected={+chair.id == element.chair}
                                                value={chair.id}
                                              >
                                                {chair.title}
                                              </option>
                                            ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        sm={5}
                                        className='duration mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Staff</Form.Label>
                                        <Form.Select
                                          name='staff_id'
                                          aria-label='Default select example'
                                          defaultValue={element?.staff_id}
                                          onChange={(e) => {
                                            handleChange(e, index)
                                          }}
                                        >
                                          <option value='' disabled selected>
                                            Choose
                                          </option>
                                          {staffs.map((staff) => (
                                            // serviceStaffs!= null && serviceStaffs.includes(staff.id) ?
                                            <option
                                              selected={staff.id == formValues[index].staff_id}
                                              value={staff.id}
                                            >
                                              {staff.name}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='notes'>
                          <Form.Group className='date' controlId='exampleForm.ControlInput1'>
                            <Form.Label>Appointment notes</Form.Label>
                            <Form.Control
                              as='textarea'
                              placeholder='add an appointment note(visible to staff only)'
                              name='note'
                              defaultValue={appointNote}
                              onChange={handleTextareaUpdate}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className='col-sm-4'>
                    <Card className='primary-bx-shadow checkout-right-wrap'>
                      <div className='appointmentRight'>
                        <div className='appn-right-heading border-b'>
                          <div className='sale-s-wrap'>
                            <i className='fas fa-search'></i>
                            <input
                              onClick={() => {
                                setShowClients(true)
                              }}
                              onChange={(e) => handleSearch(e)}
                              type='text'
                              name='search'
                              autoComplete='off'
                              className='sale-search'
                              placeholder='Search guest here'
                            />
                          </div>
                        </div>
                        {groupInfo.is_group && (
                          <div
                            className={`d-flex align-items-center justify-content-center m-2 ${
                              groupInfo.total_booked == groupInfo.client_per_class && 'text-danger'
                            }`}
                          >
                            {/* Spaces Remaining {groupInfo.total_booked + guests?.length} of {groupInfo.client_per_class} */}
                            Spaces Remaining {groupInfo.client_per_class - guests.length} of{' '}
                            {groupInfo.client_per_class}
                          </div>
                        )}
                        {showCdetails && (
                          <div className='Client-details-body'>
                            <div onClick={handleClickCBackMutiple} className='back-icon'>
                              <img src={toAbsoluteUrl('/media/logos/colourLeft.png')} alt='image' />
                            </div>
                          </div>
                        )}
                        {showClients ? (
                          <div>
                            {showCdetails ? (
                              <div>
                                <div>
                                  {guests.map((guest: IBuyerGuest, index: number) => {
                                    return (
                                      <Fragment key={index}>
                                        <div className='select-single-item text-dark border-0 py-2'>
                                          <div className='d-flex align-items-center'>
                                            <div className='staff-profile-symbol me-4'>
                                              <span>
                                                {guest?.first_name?.slice(0, 1)}
                                                {guest?.last_name?.slice(0, 1)}
                                              </span>
                                            </div>
                                            <div>
                                              <div className='d-flex align-items-center'>
                                                <h5 className='staff-name mb-1 me-3'>{`${guest?.first_name} ${guest?.last_name}`}</h5>
                                                <div>
                                                  <div className='complete-sale-btn text-center'>
                                                    <i
                                                      className='fas fa-minus-circle'
                                                      onClick={() => {
                                                        handleClickCdetailsBack(
                                                          guest,
                                                          guests.length
                                                        )
                                                      }}
                                                    ></i>
                                                  </div>
                                                </div>
                                              </div>
                                              <span className='text-muted d-block'>
                                                {guest?.email}
                                              </span>
                                              <span className='text-muted d-block'>
                                                {guest?.mobile}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className='client-details-status'>
                                          <span
                                            className={`badge badge-secondary fw-bolder me-auto px-2 py-1`}
                                          >
                                            {guest?.client_source}
                                          </span>
                                        </div>
                                        {groupInfo.group_type == 'repeated' ? (
                                          <GuestShouldRepeated
                                            client={guest}
                                            shouldRepeatedGuest={shouldRepeatedGuest}
                                            setShouldRepeatedGuest={setShouldRepeatedGuest}
                                            shouldRepeatedInfo={shouldRepeatedInfo}
                                            setShouldRepeatedInfo={setShouldRepeatedInfo}
                                          />
                                        ) : null}
                                      </Fragment>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className='client-list-wrapper'>
                                  {/* Client list starts */}
                                  <div className='sale-category-title d-flex align-items-center justify-content-between'>
                                    <div onClick={handleClickCBack} className='back-icon'>
                                      <img
                                        src={toAbsoluteUrl('/media/logos/colourLeft.png')}
                                        alt='image'
                                      />
                                    </div>
                                    {/* <div>
                                      <div
                                        onClick={handleShowCreateClient}
                                        className='btn btn-sm btn-light'
                                      >
                                        Create Guest
                                      </div>
                                    </div> */}
                                    <CreateClientModal
                                      handleCloseCreateClient={handleCloseCreateClient}
                                      guestId={guestId}
                                      show={showCreateClient}
                                      setIsOverwrite={setIsOverwrite}
                                      setOverwriteObject={setOverwriteObject}
                                    />
                                    <div></div>
                                  </div>
                                  <GuestList
                                    clients={clients}
                                    groupInfo={groupInfo}
                                    handleClientsDetailView={handleClientsDetailView}
                                    setShowCdetails={setShowCdetails}
                                  />
                                  {/* <ul className='ul-single-item appn-clients-list'>
                                    {clients.map((client) => (
                                      <li key={client.id}>
                                        <Link
                                          to='#'
                                          onClick={() => {
                                            setShowCdetails(true)
                                            clientDetailView(client)
                                          }}
                                          className='select-single-item text-dark'
                                        >
                                          <div className='d-flex align-items-center'>
                                            <div className='staff-profile-symbol me-4'>
                                              <span>
                                                {client?.first_name?.slice(0, 1)}
                                                {client?.last_name?.slice(0, 1)}
                                              </span>
                                            </div>
                                            <div>
                                              <h5 className='staff-name'>{`${client?.first_name} ${client?.last_name}`}</h5>
                                              <span className='text-muted'>{client?.email}</span>
                                            </div>
                                          </div>
                                          <div></div>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul> */}
                                  {/* Client list starts ends */}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className='appn-right-body'>
                              <div className='appn-right-status'>
                                <svg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
                                  <g fill='none' fill-rule='evenodd'>
                                    <circle fill='#37a1d2' cx='22.5' cy='17.5' r='9.5'></circle>
                                    <g
                                      transform='translate(2 2)'
                                      stroke='#740030'
                                      stroke-linecap='round'
                                      stroke-linejoin='round'
                                      stroke-width='1.5'
                                    >
                                      <path d='M34.642 34.642L44.5 44.5'></path>
                                      <circle cx='20.5' cy='20.5' r='20'></circle>
                                      <path d='M29.5 30.5h-18v-2.242a3.999 3.999 0 012.866-3.838c1.594-.472 3.738-.92 6.134-.92 2.356 0 4.514.456 6.125.932a4.003 4.003 0 012.875 3.841V30.5z'></path>
                                      <circle cx='20.5' cy='15.5' r='4.5'></circle>
                                    </g>
                                  </g>
                                </svg>
                                <span>
                                  Search here to add new guest, or keep it blank for walk-in guests.
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" disabled={loading2}>
                    {!loading2 && <span onClick={(e) => { handleSubmit(e) }} className='indicator-label'>Update</span>}
                    {loading2 && (
                        <span className='indicator-progress' style={{ display: 'block' }} >
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </Button>
            </Modal.Footer> */}
        </Form>
      </Modal>

      {/* guest overwrite modal */}
      <Modal
        dialogClassName='modal-90w'
        show={isOverwrite}
        onHide={!isOverwrite}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header className='' closeButton></Modal.Header>
        <Modal.Body>
          <p>This guest already exists. You want to overwrite it or keep it.</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              setOverwrite(1)
            }}
            className='primaryBtn btn btn-success d-flex'
          >
            Overwrite
          </button>
          <button
            onClick={() => {
              setOverwrite(2)
            }}
            className='primaryBtn btn btn-info d-flex'
          >
            Keep it
          </button>
          {/* <Button className="category-save-btn "></Button> */}
          {/* <Button className="category-save-btn "></Button> */}
        </Modal.Footer>
      </Modal>

      {/* appointment cancel */}
      {cancelAppt && (
        <AppointmentCancelationNoteModal
          isCancelAppointment={cancelAppt}
          handleClose={handleCloseNote}
          appointmentId={appointmentId}
        />
      )}
      {noShow && (
        <NoShowModal
          isNoShow={noShow}
          handleClose={handleCloseNoShow}
          appointmentId={appointmentId}
        />
      )}
    </>
  )
}
export default AddGuestInGroupCourseModal