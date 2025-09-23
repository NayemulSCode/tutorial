import React, { FC, useState, useEffect, useContext, Fragment } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap-v5";
import moment from 'moment'
import CreateClientModal from "./CreateClientModal";
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { AppContext } from '../../../../../context/Context';
import { IProduct, IVoucher, IService, IUsers, IStaff, IGuest, IServiceTobeCheckout, IBuyerGuest } from "../../../../../types";
import { ALL_CLIENTS, SINGLE_CLIENT, ALL_STAFF_INFO, GET_ALL_SERVICES, ALL_CHAIRS, SERVICE_PRICING, SINGLE_APPOINTMENT, PARTNER_TIME_SLOT, STAFF_WISE_APPOINTMENT } from '../../../../../gql/Query';
import { APPOINTMENT_STATUS_UPDATE, APPOINTMENT_UPDATE, CONFLICT_CHECKING, GUEST_PROFILE_UPDATE, SYSTEM_LOG } from '../../../../../gql/Mutation';
import AppointmentCancelationNoteModal from './AppointmentCancelationNoteModal';
import NoShowModal from './NoShowModal';
import Select from 'react-select'
import GuestList from './GuestList';
import { useTostMessage } from '../../../../modules/widgets/components/useTostMessage';
import { frequency, occurrence, systemLogPayload, timeDurationArray } from '../../../../modules/util';
import { EventDateTime } from '../../../../modules/generates.type';
import { print } from 'graphql';

type Props = {
  isUpdateAppointment: boolean;
  handleClose: () => void
  appointmentId: any;
  eventDateTime: EventDateTime;
}


const UpdateAppointmentModal: FC<Props> = ({ appointmentId, isUpdateAppointment, eventDateTime, handleClose}) => {
  const history = useHistory()
  const { showToast } = useTostMessage()
  const { apptInfo, addApptInfo, guest, addGuest, guests, addGuests, groupInfo, addGroupInfo, apptServices, addApptServices, appointmentCancel, addAppointmentSource} =
  useContext(AppContext)
  console.log("🚀 ~ file: CreateAppointmentModal.tsx:30 ~ groupInfo:", groupInfo)
  console.log("🚀 ~ file: CreateAppointmentModal.tsx:30 ~ guests:", guests)
  const [formValues, setFormValues] = useState<any[]>([{
    appt_id: 0,
    ser_pricing_id: "",
    date: "",
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
  const [services, setServices] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [appointmentDate, setAppointmentDate] = useState<any>()
  console.log("🚀 ~ file: CreateAppointmentModal.tsx:64 ~ appointmentDate:", appointmentDate)
  const [appointmentDateForComapare, setAppointmentDateForComapare] = useState<any>()
  const [appointNote, setAppointNote] = useState<any>()
  const [timeSlots, setTimeSlots] = useState<Array<any>>([])
  const [overwrite, setOverwrite] = useState<number>(0)
  const [appointCancelationNote, setAppointCancelationNote] = useState('')
  const [cancelAppt, setCancelAppt] = useState(false)
  const [noShow, setNoShow] = useState(false)
  const [servicePricingId, setServicePricingId] = useState<string>('');
  const [servicePricingIds, setServicePricingIds] = useState<Array<any>>([]);
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

  const [guestProfileUpdate] = useMutation(GUEST_PROFILE_UPDATE)
  const [checkScheduleConflictForClient] = useMutation(CONFLICT_CHECKING, {
    // onError(err) {
    //   const graphQLErrors = err.graphQLErrors

    //   if (graphQLErrors && graphQLErrors.length > 0) {
    //     const error = graphQLErrors[0]
    //     const extensions = error.extensions
    //     // Check if it's a validation error
    //     if (extensions && extensions.validation) {
    //       const validationErrors = extensions.validation
    //       // Loop through the validation errors and show each message in a toast
    //       Object.keys(validationErrors).forEach((key) => {
    //         validationErrors[key].forEach((message:any) => {
    //           showToast(message, 'error')
    //           setLoading(false)
    //           setLoading2(false)
    //         })
    //       })
    //     } else {
    //       // If it's a different type of error, show the general reason
    //       showToast(extensions.reason, 'error')
          
    //       setLoading(false)
    //       setLoading2(false)
    //     }
    //   } else {
    //     // Handle the case where there's no detailed GraphQL error
    //     showToast('An unknown error occurred', 'error')
        
    //       setLoading(false)
    //       setLoading2(false)
    //   }
    // },
  })
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
  });
  const APPOINTMENT_UPDATE_STRING = print(APPOINTMENT_UPDATE);
  const [system_log] = useMutation(SYSTEM_LOG)
  const {data: timeSlotData} = useQuery(PARTNER_TIME_SLOT)
  useEffect(() => {
    if (timeSlotData) {
      setTimeSlots(timeSlotData.partnerTimeSlots)
    }
  }, [timeSlotData])

  const handleDateFormater = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    const newCdate = moment(value).format('LL')
    setAppointmentDate(newCdate)
  }
  const convertedDate = moment(appointmentDate).format('YYYY-MM-DD')
  const {
    data: appointmentDetails,
    error: appointmentDetailsError,
    loading: appointmentDetailsLoading /* , refetch: singleapppointFetch */,
  } = useQuery(SINGLE_APPOINTMENT, {
    variables: {
      id: +appointmentId,
    },
    fetchPolicy: 'network-only',
  })
  const {
    data: clientsData,
    error: clientsError,
    loading: ClientsLoading,
    refetch: refetchClient,
  } = useQuery(ALL_CLIENTS, {
    variables: {
      search: search,
      count: 1000,
      page: 1,
    },
  })
  const {
    data: allChairs,
    error: chairError,
    loading: chairLoading,
  } = useQuery(ALL_CHAIRS, {
    variables: {
      count: 100,
      page: 1,
    },
  })
  const {
    data: allStaffs,
    error: staffError,
    loading: staffLoading,
  } = useQuery(ALL_STAFF_INFO, {
    variables: {
      count: 100,
      page: 1,
    },
    fetchPolicy: 'network-only',
  })
  const [
    getClient,
    {data: singleClientData, error: singleClientError, loading: singleClientLoading},
  ] = useLazyQuery(SINGLE_CLIENT, {
    fetchPolicy: 'network-only',
  })
  const {
    data: allServices,
    error: servicesError,
    loading: servicesLoading,
  } = useQuery(GET_ALL_SERVICES, {
    variables: {
      search: '',
      type: '',
      count: 1000,
      page: 1,
    },
  })

  const [myAppointment, setMyAppointment] = useState<any>()

  useEffect(() => {
    // singleapppointFetch()
    if (appointmentDetails) {
      console.log("🚀 ~ file: CreateAppointmentModal.tsx:198 ~ useEffect ~ appointmentDetails:", appointmentDetails)
      // console.log("appt detail: ", appointmentDetails.appointment?.appointment_detail)
      setMyAppointment(appointmentDetails.appointment)
      setFormValues(appointmentDetails?.appointment?.appointment_detail.map((appt:any)=>({...appt, date:  moment.unix(appt.time).format('YYYY-MM-DD')})))
      addAppointmentSource({
        online: appointmentDetails?.appointment?.appointment_detail[0]?.online,
        appt_id: appointmentDetails?.appointment?.appointment_detail[0]?.appt_id,
        sale_id: 0,
      })
      setServicePricingIds(appointmentDetails?.appointment?.appointment_detail.map((item:any)=> item.ser_pricing_id))
      setAppointmentDate(moment.unix(appointmentDetails?.appointment?.date).format('LL'))
      setAppointmentDateForComapare(appointmentDetails?.appointment?.date)
      setAppointNote(appointmentDetails.appointment?.note);
      if (appointmentDetails.appointment?.client_info){
        addGuests(appointmentDetails.appointment?.client_info, 'add');
      }
      getClient({
        variables: {
          id: appointmentDetails.appointment?.user_id,
        },
      });
      // missing slot
      appointmentDetails?.appointment?.appointment_detail.forEach((value: any, index: number) => {
        const selectedTime = value.time // Assuming 'time' is the field you want to use
        handleTimeSlotLogic(moment.unix(+selectedTime).format('HH:mm'), index)
      })

      setLoading(false)
    }
    if (appointmentDetailsLoading) {
      setAppointNote('')
      setFormValues([])
      setAppointmentDate('')
      setDetailClient({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
      })
      setLoading(true)
    }
    return () => {
      setAppointNote('')
      setFormValues([])
      setAppointmentDate('')
      setDetailClient({})
    }
  }, [appointmentDetails])

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
    // if (allServices) {
    //     setServices(allServices.services.data);
    // }
    if (allServices) {
      let formattedData: any = []
      allServices.services.data.map((service: any) =>
        service?.service_pricings.map((item: any) => {
          let data = {
            service_id: service?.id,
            service_pricing_id: item?.id,
            service_cat: service?.service_category_info?.name,
            service_pricing_name: item?.service_name,
            service_price: parseFloat(item?.special_price) ? item?.special_price : item?.price,
            service_duration: item?.duration,
            value: item?.id,
            label: `${service?.service_category_info?.name} ${item?.service_name} ${
              item?.duration
            } min €${parseFloat(item?.special_price) ? item?.special_price : item?.price}`,
            is_group: service.is_group,
            is_course: service.is_course,
          }
          formattedData.push(data)
        })
      )
      setServices(formattedData)
    }
    return () => {
      setServices([])
    }
  }, [allChairs, allStaffs, allServices])

  const [showClients, setShowClients] = React.useState(false)
  const [showCdetails, setShowCdetails] = React.useState(false)

  const handleClickCBack = () => {
    setShowClients((Cprev) => !Cprev)
  }

  // group service client work
  const handleClientsDetailView = (c: any) => {
    // signle guest booking
      addGuests(c, "add");
      setShowCdetails(true)
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
      setDetailClient(singleClientData?.client)
    }

    return () => {
      setShowClients(false)
      setShowCdetails(false)
      setDetailClient({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
      })
    }
  }, [singleClientData])
  const handleClickCdetailsBack = (guest: any, length: number) => {
    addGuests(guest, 'remove')
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
    const {name, value} = e.target
    setAppointNote(value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const updateApptPayload = formValues.map((item) => ({
      id: item.id,
      appt_id: item.appt_id,
      date: item.date ? item.date : moment.unix(item.time).format('YYYY-MM-DD'),
      time: typeof item.time === 'number' ? item.formatted_time : item.time,
      duration: parseInt(item.duration),
      staff_id: item.staff_id ? parseInt(item.staff_id) : 0,
      chair: item.chair ? parseInt(item.chair) : 0,
      service_pricing_id: parseInt(item.ser_pricing_id),
    }))
    console.log("🚀 ~ updateApptPayload ~ updateApptPayload:", updateApptPayload)
    console.log('🚀 ~ updateApptPayload ~ formValues:', formValues)
    if (appointmentId) {
      setLoading2(true)
      checkScheduleConflictForClient({
        variables: {
          client_id: guests.length > 0 ? +guests[0]?.id : 0,
          services: updateApptPayload,
        },
      })
        .then(({data}) => {
          const {message, status} = data.checkScheduleConflictForClient || {}
           if (status == 1){
            updateAppointment({
              variables: {
                id: myAppointment.id,
                date: convertedDate,
                services: updateApptPayload,
                client_id: guests.length > 0 ? +guests[0]?.id : 0,
                note: appointNote,
              },
            }).then(({data}) => {
              console.log('apppoint update', data)
              if (data.updateAppointment.status === 1) {
                setLoading2(false)
                showToast(data.updateAppointment.message, 'success')
                handleClose()
              } else if (data.updateAppointment.status === 0) {
                setLoading2(false);
                showToast(data.updateAppointment.message, 'error');
                system_log({
                  variables: {
                    ...systemLogPayload,
                    api: APPOINTMENT_UPDATE_STRING,
                    type: 'appointment-update-error',
                    body: JSON.stringify({
                      id: myAppointment.id,
                      date: convertedDate,
                      services: updateApptPayload,
                      client_id: guests.length > 0 ? +guests[0]?.id : 0,
                      note: appointNote,
                    }),
                    response: JSON.stringify(data.updateAppointment.message),
                  },
                });
              }
            })
           }
          if (status == 0){
            showToast(message, 'error');
            setLoading(false);
            setLoading2(false);
          }
        })
        .catch((err: any) => {
          // Handle errors from checkScheduleConflictForClient
          showToast(err.message, 'error')
          setLoading(false)
          setLoading2(false)
        })
        .finally(() => {
          setLoading(false)
          setLoading2(false)
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
    let {name, value} = e.target
    // console.log("🚀 ~ handleChange ~ name, value:", name, value)
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

  // useEffect(() => {
  //   if (formValues) {
  //     console.log('run effect for function call')
  //     formValues.forEach((value: any, index: number) => {
  //       const selectedTime = value.time // Assuming 'time' is the field you want to use
  //       handleTimeSlotLogic(moment.unix(+selectedTime).format('HH:mm'), index)
  //     })
  //   }
  // }, [formValues]) 

  const handleServiceChange = (e: any, index: number) => {
    let values: any = formValues
    for (let itIndex in values) {
      if (+itIndex === index) {
        values[index]['id'] = ""
        values[index]['ser_pricing_id'] = parseInt(e?.service_pricing_id)
        values[index]['service_name'] = e?.service_pricing_name
        values[index]['duration'] = e?.service_duration
        values[index]['quantity'] = 1
        values[index]['price'] = parseFloat(e?.service_price)
      }
    }
    setFormValues([...values])
    // console.log("update value",values, e)
  }
  let addFormFields = () => {
    if (!formValues[myIndex]) {
      let lastIndex = formValues.length - 1
      myIndex = lastIndex
      setMyIndex(lastIndex)
    }
    const val = myFunc(formValues[myIndex].time, formValues[myIndex].duration)
    const myDate = moment().format('MM/DD/YYYY')
    let nextTobeSlot = moment(myDate + ' ' + val).unix()
    // console.log('val: ', val)
    // console.log("nextTobeSlot", nextTobeSlot)
    const data = getNearestTime(timeSlots, nextTobeSlot)
    const timeValue = moment.unix(+data).format('HH:mm')
    const nObj = {
      appt_id: formValues[0].appt_id,
      ser_pricing_id: '',
      time: timeValue,
      date: moment(appointmentDate).format('YYYY-MM-DD'),
      duration: '',
      staff_id: formValues[myIndex].staff_id,
      chair: formValues[myIndex].chair,
      quantity: 0,
      service_name: '',
      price: 0,
      special_price: 0,
      staffs: '',
      online: 0,
      single_group: false,
      repeated_group: false,
      is_group: false,
      is_course: false,
      frequency: "",
      occurrences: "",
    }
    const nArr = formValues.concat(nObj)
    setFormValues(nArr)
  }

  let removeFormFields = (i: number) => {
    let newFormValues = [...formValues]
    newFormValues.splice(i, 1)
    setFormValues(newFormValues)
  }

  const [singleService, { data: singleServiceData }] = useLazyQuery(SERVICE_PRICING);
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

  // // useEffect to run the query when id, date, or time change
  // useEffect(() => {
  //   if (servicePricingId || convertedDate || formValues[0]?.time) {
  //     fetchData(servicePricingId, convertedDate, formValues[0]?.time);
  //   }
  // }, [servicePricingId, convertedDate, formValues[0]?.time]);
  // useEffect to run the query when id, date, or time change
  useEffect(() => {
    if (servicePricingId || eventDateTime) {
      fetchData(servicePricingId, eventDateTime.date, eventDateTime.time);
    }
  }, [servicePricingId, eventDateTime]);
  useEffect(() => {
    if (singleServiceData) {
      console.log("🚀 ~ file: AppointmnetCreate.tsx:353 ~ useEffect ~ singleServiceData:", singleServiceData)
      if (singleServiceData?.servicePricing?.service?.is_group) {
        let groupData = {
          is_group: singleServiceData?.servicePricing?.service?.is_group,
          client_per_class: singleServiceData?.servicePricing?.service?.client_per_class,
          is_course: singleServiceData?.servicePricing?.service?.is_course,
          session_per_course: singleServiceData?.servicePricing?.service?.session_per_course,
          booked_guests: singleServiceData?.servicePricing?.booked_guests || [],
          total_booked: singleServiceData?.servicePricing?.total_booked,
          disabled: false
        }
        addGroupInfo(groupData);
        // let values: any = formValues;
        // for (let itIndex in values) {
        //   if (+itIndex === myIndex) {
        //     values[itIndex].quantity = 1;
        //     values[myIndex].duration = singleServiceData.servicePricing?.duration
        //     values[myIndex].service_name = singleServiceData.servicePricing?.service_name
        //     values[myIndex].price = singleServiceData.servicePricing?.price
        //     values[myIndex].special_price = singleServiceData.servicePricing?.special_price
        //     values[myIndex].staffs = singleServiceData.servicePricing?.staffs
        //     // new added
        //     values[myIndex].is_group = singleServiceData?.servicePricing?.service?.is_group
        //     values[myIndex].client_per_class = singleServiceData?.servicePricing?.service?.client_per_class
        //     values[myIndex].is_course = singleServiceData?.servicePricing?.service?.is_course
        //     values[myIndex].session_per_course = singleServiceData?.servicePricing?.service?.session_per_course
        //     // group or course service chair auto filled with first chair
        //     values[myIndex].chair = chairs[0]?.id
        //   }
        // }
        // setFormValues([...values])
        // set data if course avaiable
        // if (singleServiceData?.servicePricing?.service?.is_course) {
        //   const timeSlots = singleServiceData?.servicePricing?.time_slots || "[]";
        //   const parsedTimeSlots = JSON.parse(timeSlots);
        //   if (parsedTimeSlots.length > 0) {
        //     setCourseTimeSlots(parsedTimeSlots);
        //   } else {
        //     setCourseTimeSlots([]);
        //   }
        // }
      } else {
        let groupData = {
          is_group: false,
          client_per_class: 0,
          is_course: false,
          session_per_course: 0,
          booked_guests: [],
          total_booked: 0,
          disabled: true,
        }
        addGroupInfo(groupData);
      //   let values: any = formValues;
      //   for (let itIndex in values) {
      //     if (+itIndex === myIndex) {
      //       values[itIndex].quantity = 1;
      //       values[myIndex].duration = singleServiceData.servicePricing?.duration
      //       values[myIndex].service_name = singleServiceData.servicePricing?.service_name
      //       values[myIndex].price = singleServiceData.servicePricing?.price
      //       values[myIndex].special_price = singleServiceData.servicePricing?.special_price
      //       values[myIndex].staffs = singleServiceData.servicePricing?.staffs
      //       // new added
      //       values[myIndex].is_group = singleServiceData?.servicePricing?.service?.is_group
      //       values[myIndex].client_per_class = singleServiceData?.servicePricing?.service?.client_per_class
      //       values[myIndex].is_course = singleServiceData?.servicePricing?.service?.is_course
      //       values[myIndex].session_per_course = singleServiceData?.servicePricing?.service?.session_per_course
      //     }
      //   }
      //   setFormValues([...values])
      }

    }
  }, [singleServiceData])

  const getNearestTime = (timeList: any, currentTime: any) => {
    var nearestTime = timeList.reduce((prev: any, curr: any) => {
      // console.log("revfarfe ",prev, curr, currentTime)
      return Math.abs(curr.s_time - currentTime) < Math.abs(prev.s_time - currentTime) ? curr : prev
    })
    // console.log('nearestTime', nearestTime)
    return nearestTime.s_time
  }

  const myFunc = (
    time: any = formValues[myIndex].time,
    duration: any = formValues[myIndex].duration
  ) => {
    // console.log("time",time, "time with format",moment.unix(time).utcOffset('+0000').format("HH:mm"), "duration",duration);
    console.log('type of time', typeof time)
    let str = null
    if (typeof time == 'string') {
      str = moment(time, 'HH:mm')
      str.add(duration, 'minutes')
      return str.utcOffset('+0000').format('HH:mm')
    } else {
      // let str = moment(time, "HH:mm").utcOffset('+0000');
      str = moment.unix(time).format('HH:mm')
      console.log('converting string', str)
      str = moment(str, 'HH:mm').add(duration, 'minutes').format('HH:mm')
      return str
    }
  }

  const apptInformation = {
    client_id: +detailClient.id,
    note: appointNote,
    date: convertedDate,
  }

  const handlePayment = (e: any) => {
    e.preventDefault()
    if (formValues[0].chair != '' && formValues[0].ser_pricing_id != '') {
      // addGuest(detailClient)
      addApptInfo(apptInformation)
      addApptServices(
        formValues.map((item) => ({
          ...item,
          price: parseInt(item.price),
          special_price: parseInt(item.special_price),
        }))
      )
      history.push('/sales-checkout')
    } else {
      showToast('Please Fill Up Service & Chair Info', 'error');
    }
  }
  //appointment cancellation

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
      .then(({data}) => {
        setLoading(false)
        if (data.guestProfileUpdate.status === 1) {
          console.log(data?.guestProfileUpdate?.data)
          // guestId(data.guestProfileUpdate?.data)
          setShowCdetails(true)
          setDetailClient(data?.guestProfileUpdate?.data)
          addGuest(data?.guestProfileUpdate?.data)
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
  // if(appointmentDateForComapare < moment().unix()){
  //     console.log('if state true', moment().unix())
  //     console.log("appttime",appointmentDateForComapare)

  // }else{
  //     console.log('else state ture', moment().unix())
  //     console.log("appttime",appointmentDateForComapare)
  // }
  // {
  // console.log("rgrgsdfs", myAppointment?.status !== "No Show" || myAppointment?.payment_status !== 'Unpaid')
  // }
  return (
    <>
      <Modal
        dialogClassName='appoinment_update_modal'
        show={isUpdateAppointment}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header className='sale-modal-heade' closeButton>
            <div className=''>
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
            </div>
            <div className='d-flex align-items-center justify-content-between'>
              <div></div>
              <h2
                className={`${
                  myAppointment?.status === 'Cancelled'
                    ? 'adv-price-modal-title'
                    : 'adv-price-modal-title ml-280'
                }`}
              >
                Update Appointment
              </h2>
              {myAppointment && myAppointment.status !== 'Cancelled' ? (
                <div className='d-flex gap-2'>
                  {myAppointment && myAppointment.payment_status !== 'Paid' && (
                    <Button
                      className='btn btn-sm'
                      variant='success'
                      type='button'
                      onClick={handlePayment}
                      disabled={myAppointment.status !== 'No Show' ? false : true}
                    >
                      Payment
                    </Button>
                  )}
                  <Button
                    className='btn btn-sm'
                    variant='primary'
                    type='submit'
                    disabled={loading2}
                  >
                    {!loading2 && <span className='indicator-label'>Update</span>}
                    {loading2 && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  {appointmentDateForComapare < moment().unix() &&
                    myAppointment?.status != 'Completed' && (
                      <Button
                        className='btn btn-sm'
                        onClick={(e) => {
                          setNoShow(!noShow)
                          handleClose()
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
                        handleClose()
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
              {loading && (
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
              {!loading && (
                <>
                  <div className='col-sm-8'>
                    <Card className='primary-bx-shadow p-30'>
                      {/* <div style={{marginBottom: '15px'}}>
                        <Form.Group
                          className='d-flex justify-content-end align-items-center apnmnt-date-wrapper'
                          controlId='date'
                        >
                          <span className='me-2'>{appointmentDate}</span>
                          <div className='apnmnt-date'>
                            <Form.Control
                              className='apnmnt-date-input'
                              type='date'
                              name='date'
                              value={appointmentDate}
                              onChange={handleDateFormater}
                            />
                            <i className='far fa-calendar text-dark calendar-icon'></i>
                          </div>
                        </Form.Group>
                      </div> */}
                      <div className='scheduleWrap'>
                        <div className='scheduleInner'>
                          <div className='add-pricing'>
                            {formValues &&
                              formValues.map((element: any, index) => {
                                {
                                  const aCtime = moment(element.time).format('HH.mm')
                                }
                                // console.log("handleChange time for edit appointment",element)
                                return (
                                  <div className='Pricing-option1'>
                                    <Row style={{marginBottom: '30px'}} className='schedulerow'>
                                      <div className='add-price-tool appn_counter d-flex align-items-center justify-content-between'>
                                        <h3 className='appn-service-count'>{index + 1}</h3>
                                        {index ? (
                                          <i
                                            className='close-adv-price fa fa-times'
                                            style={{cursor: 'pointer'}}
                                            onClick={() => removeFormFields(index)}
                                          ></i>
                                        ) : null}
                                      </div>
                                       <div style={{marginBottom: '15px'}}>
                                      <Form.Group
                                        className='d-flex justify-content-end align-items-center apnmnt-date-wrapper'
                                        controlId='date'
                                      >
                                        <span className='me-2'>{
                                        formValues[index]?.date ? 
                                        moment(formValues[index].date).format('LL'):
                                        <span className='me-2'>{appointmentDate}</span>
                                      }</span>
                                        <div className='apnmnt-date'>
                                          <Form.Control
                                            className='apnmnt-date-input'
                                            type='date'
                                            name='date'
                                            value={moment.unix(formValues[index].date).format('LL')}
                                            onChange={(e)=>handleChange(e,index)}
                                            min={moment().format('YYYY-MM-DD')}
                                          />
                                          <i className='far fa-calendar text-dark calendar-icon'></i>
                                        </div>
                                      </Form.Group>
                                    </div>
                                      <Form.Group
                                        as={Col}
                                        sm={4}
                                        className='starttime mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Start time</Form.Label>
                                        <Form.Select
                                          name='time'
                                          aria-label='Default select example'
                                          id='datePicker'
                                          onChange={(e:any) => {
                                            handleChange(e, index)
                                          }}
                                        >
                                          <option value='' disabled selected>
                                            Choose
                                          </option>
                                          {timeSlots.map((time: any) => {
                                            console.log('time', formValues[index].time)
                                            // handleTimeSlotLogic(
                                            //   moment.unix(+formValues[index].time).format('HH:mm'),
                                            //   index
                                            // )
                                            return (
                                              <option
                                                selected={
                                                  formValues[index].formatted_time
                                                  ? formValues[index].formatted_time == time.time
                                                  : false
                                                }
                                                value={time.time}
                                              >
                                                {time.time}
                                              </option>
                                            )
                                          })}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        sm={8}
                                        className='duration mb-5'
                                        controlId='exampleForm.ControlInput1'
                                      >
                                        <Form.Label>Service</Form.Label>
                                        <Select
                                          options={services}
                                          getOptionLabel={(option: any) => option.label}
                                          getOptionValue={(option: any) => option.value}
                                          defaultValue={{
                                            label: formValues[index]?.service_pricing?.service_name,
                                            value: formValues[index].ser_pricing_id,
                                          }}
                                          onChange={(e:any) => {
                                            setMyIndex(index)
                                            setServicePricingId(e.service_pricing_id)
                                            handleServiceChange(e, index)
                                          }}
                                          // formatOptionLabel={element?.service_pricing?.service_name}
                                        />
                                        {/* <Form.Select name="ser_pricing_id" aria-label="Default select example" defaultValue={element.ser_pricing_id}
                                            onChange={(e) => { setMyIndex(index); servicePricingId(e, index); handleChange(e, index) }}
                                          >
                                              <option value="" disabled selected>Choose</option>
                                              {
                                                  services.map((service: any) => service.service_pricings.map((itm: any) => {
                                                      return (
                                                          <option selected={itm.id == formValues[index].ser_pricing_id} value={itm.id}>
                                                              {`${itm.service_name} (${itm.duration} min, €${itm.price})`}
                                                          </option>)
                                                  }))
                                              }
                                          </Form.Select> */}
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
                                          aria-label='Default select example'
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
                            <div className='add-pricing-btn-wrap ps-0'>
                              <button
                                onClick={() => addFormFields()}
                                type='button'
                                className='add-price-btn btn btn-light d-flex align-items-center'
                              >
                                <i className='fa fa-plus-circle'></i>
                                <span>Add another service</span>
                              </button>
                            </div>
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
                                                      onClick={() => { handleClickCdetailsBack(guest, guests.length) }}
                                                    ></i>
                                                    {/* <Dropdown>
                                                  <Dropdown.Toggle className="btn btn-sm btn-icon s-checkout-cdbtn client-d-dropdown-btn" id="dropdown-basic">
                                                      <i className='bi bi-three-dots fs-5'></i>
                                                  </Dropdown.Toggle>
                                                  <Dropdown.Menu>
                                                      <Dropdown.Item><i className="far fa-eye me-1"></i> View profile</Dropdown.Item>
                                                      <Dropdown.Item onClick={handleClickCdetailsBack}><i className="far fa-trash-alt me-1"></i>Remove from appointment</Dropdown.Item>
                                                  </Dropdown.Menu>
                                              </Dropdown> */}
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
                                      </Fragment>)
                                  })
                                  }
                                  <div className='Client-details-body'></div>
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
          servicePricingIds ={servicePricingIds}
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

export default UpdateAppointmentModal
