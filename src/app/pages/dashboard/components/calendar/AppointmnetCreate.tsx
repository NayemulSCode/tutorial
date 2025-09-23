import React, { FC, useState, useEffect, useContext, Fragment } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Card, Button, Form, Container, Row, Col, Modal, InputGroup, Dropdown, DropdownButton, Tab, Nav, FormControl } from "react-bootstrap-v5";
import { useSnackbar } from 'notistack';
import Select from 'react-select'
import moment from 'moment'
import CreateClientModal from "./CreateClientModal";
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { AppContext } from '../../../../../../src/context/Context';
import { IProduct, IVoucher, IService, IUsers, IStaff, IGuest, IServiceTobeCheckout, IServiceCategory, GroupType, IBuyerGuest } from "../../../../../types";
import { ALL_CLIENTS, ALL_STAFF_INFO, GET_ALL_SERVICES, ALL_CHAIRS, SERVICE_PRICING, PARTNER_TIME_SLOT, SERVICE_CATEGORIES } from '../../../../../gql/Query';
import { APPOINTMENT_CREATE, CONFLICT_CHECKING, GUEST_PROFILE_UPDATE, SYSTEM_LOG } from '../../../../../gql/Mutation';
import { useTostMessage } from '../../../../modules/widgets/components/useTostMessage';
import { frequency, occurrence, systemLogPayload, timeDurationArray } from '../../../../modules/util';
import GuestList from './GuestList';
import { print } from 'graphql';

const AppointmnetCreate: FC = () => {
    document.title = "Appointment";
    const {showToast} = useTostMessage()
    const [overwrite, setOverwrite] = useState<number>(0)
    const { apptInfo, addApptInfo, calendarEvent,addCaEvent, guests, addGuests, apptServices, addApptServices, addGroupInfo, groupInfo } = useContext(AppContext);
    const history = useHistory();
    const [chairs, setChairs] = useState<Array<any>>([])
    const [chairId, setChairId] = useState<string>("");
    const [singleStaffId, setSingleStaffId] = useState<string>("");
    const [isOverwrite, setIsOverwrite] = React.useState(false);
    const [formValues, setFormValues] = useState<IServiceTobeCheckout[]>([{
        appt_id: 0,
        ser_pricing_id: "",
        time: "",
        formatted_time: "",
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
        schedule_id: ""
    }]);
    const [overwriteObject, setOverwriteObject] = useState<any>({
        first_name: "",
        last_name: "",
        email: '',
        mobile: "",
        password: '',
        additional_mobile: "",
        client_source: "",
        display_booking: "",
        gender: "",
        dob: '',
        client_info: "",
        address: "",
        marketing_notification: '',
        email_notification: "",
        language: ""
    });
    const [clients, setClients] = useState<IUsers[]>([])
    const [search, setSearch] = useState("");
    const [staffs, setStaffs] = useState<Array<any>>([]);
    const [services, setServices] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const momentDate: any = moment(new Date()).format('LL')
    const momentTime: any = moment(new Date()).format('HH:mm')
    const [appointmentDate, setAppointmentDate] = useState<any>(momentDate)
    const [appointmentTime, setAppointmentTime] = useState<any>("")
    const [showClients, setShowClients] = React.useState(false);
    const [showCdetails, setShowCdetails] = React.useState(false);
    const [showCreateClient, setShowCreateClient] = useState<boolean>(false);
    const [timeSlots, setTimeSlots] = useState<Array<any>>([])
    const [courseTimeSlots, setCourseTimeSlots] = useState<Array<any>>([])
    const [servicePricingId, setServicePricingId] = useState<string>('')
    const [categories, setCategories] = useState<IServiceCategory[]>([]);
    const [note, setNote] = useState("");
    let [myIndex, setMyIndex] = useState(0);
    const [guestProfileUpdate] = useMutation(GUEST_PROFILE_UPDATE)
   const [checkScheduleConflictForClient] = useMutation(CONFLICT_CHECKING);

    const [addAppointment] = useMutation(APPOINTMENT_CREATE);
    const APPOINTMENT_CREATE_STRING = print(APPOINTMENT_CREATE);
    const [system_log] = useMutation(SYSTEM_LOG)

    const [detailClient, setDetailClient] = useState<any>({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: ""
    });

    useEffect(() => {
        if (calendarEvent.start != "") {
            const momentDate: any = moment(calendarEvent?.start).format('LL')
            const momentTime: any = moment(calendarEvent?.start).format('HH:mm')
            setAppointmentDate(() => momentDate);
            setAppointmentTime(() => momentTime);
            const sTime = moment(calendarEvent?.start).format("HH.mm");
        }
        return () => {
            addCaEvent(calendarEvent)
        }

    }, [calendarEvent])

    let addFormFields = () => {
        if (!formValues[myIndex]) {
            let lastIndex = formValues.length - 1;
            myIndex = lastIndex;
            setMyIndex(lastIndex);
        }
        const val = myFunc(formValues[myIndex].time, formValues[myIndex].duration);
        const myDate = moment().format("MM/DD/YYYY")
        const compareTime = moment(val, 'hh:mm');
        const closestTime = timeSlots.find((time: any) => {
            const t = moment.unix(time.s_time).format("HH:mm")
            const diff = moment(t, 'hh:mm').diff(compareTime, 'minutes');
            return diff >= 0;
        });
        let nextTobeSlot = moment(myDate + ' ' + val).unix()

        const data = getNearestTime(timeSlots, nextTobeSlot)
        const timeValue = moment.unix(+data).format("HH:mm")
        const nObj = {
            appt_id: 0,
            ser_pricing_id: "",
            time: timeValue,
            formatted_time: "",
            duration: "",
            staff_id: formValues[myIndex].staff_id,
            chair: chairId ? chairId : formValues[myIndex].chair, //chairId ? chairId: formValues[myIndex].chair
            quantity: 0,
            service_name: "",
            price: 0,
            special_price: 0,
            staffs: '',
            online: 0,
            single_group: false,
            repeated_group: false,
            is_group: false,
            is_course: false,
            frequency: "",
            occurrences:"",
            schedule_id:""
        }
        const nArr = formValues.concat(nObj)
        setFormValues(nArr)
    }

    let removeFormFields = (i: number) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
    // group service client work
  const handleClientsDetailView = (c: any) => {
    // group guest booking
      addGuests(c, 'add')
      setShowCdetails(true)
  };

    const handleSearch = (e: any) => {
        setSearch([e.target.name] = e.target.value);
    }
    const handleClickCBack = () => {
        setShowClients((Cprev) => !Cprev);
    };

    const handleClickCdetailsBack = (guest: any, length:number) => {
      addGuests(guest, 'remove')
      if(length - 1 == 0){
        setShowCdetails((Cdprev) => !Cdprev);
      }
    };

    const handleCloseCreateClient = () => setShowCreateClient(false);
    const handleShowCreateClient = () => {
        setShowCreateClient(true);
    }
    const guestId = (c: any) => {
        setShowCdetails(true)
        addGuests(c, 'add');
    }
    // end client related work
    const handleDateFormater = (e: any) => {
        const { name, value } = e.target;
        const newCdate = moment(value).format('LL')
        setAppointmentDate(newCdate)
    }

    const handleNote = (e: any) => {
        setNote([e.target.name] = e.target.value)
    }

  const handleChange = (e: any, index: number) => {
    let { name, value, type, checked, selectedIndex } = e.target;
    let selectedScheduleId = selectedIndex && e.target?.options[selectedIndex]?.getAttribute('data-extra');
    let values: any = formValues.map((element, i) => {
      if (i === index) {
        if (type === "checkbox") {
          // For checkboxes, handle the logic to turn off the other switch
          return {
            ...element,
            [name]: checked,
            [name === "single_group" ? "repeated_group" : "single_group"]: !checked,
          };
        } 
        else if (selectedScheduleId){
          return{
            ...element,
            schedule_id: selectedScheduleId,
          };
        }
        else {
          // For other types of inputs, just update the value
          return {
            ...element,
            [name]: value,
          };
        }
      } else {
        return element;
      }
    });
    setFormValues(values);
  };


  const handleServiceChange = (e: any, index: number) => {
      let values: any = formValues;
      for (let itIndex in values) {
          if (+itIndex === index) {
              values[index]['ser_pricing_id'] = e?.service_pricing_id;
          }
      }
      setFormValues([...values])
  }

  const myFunc = (time: any = formValues[myIndex].time, duration: any = formValues[myIndex].duration) => {
      let str = moment(time, "HH:mm");
      if (str) {
          str.add(duration, 'minutes')
      }
      return str.format("HH:mm");
  }

  const convertedDate = moment(appointmentDate).format("YYYY-MM-DD");

  const { data: timeSlotData } = useQuery(PARTNER_TIME_SLOT);
  const { data: clientsData, error: clientsError, loading: ClientsLoading, refetch: refetchClient } = useQuery(ALL_CLIENTS, {
      variables: {
          search: search,
          count: 1000,
          page: 1,
      }
  })

  const { data: allChairs, error: chairError, loading: chairLoading } = useQuery(ALL_CHAIRS, {
      variables: {
          count: 100,
          page: 1
      }
  })
  const { data: allStaffs, error: staffError, loading: staffLoading } = useQuery(ALL_STAFF_INFO, {
      variables: {
          count: 100,
          page: 1
      },
      fetchPolicy: "network-only"
  })

    const { data: allServices, error: servicesError, loading: servicesLoading } = useQuery(GET_ALL_SERVICES, {
        variables: {
            search: "",
            type: "sale",
            count: 1000,
            page: 1
        }
    });
    const { data: allCategories, error: categoriesError, loading: categoryLoding } = useQuery(SERVICE_CATEGORIES, {
        variables: {
            type: "select",
            count: 200,
            page: 1
        }
    })
    useEffect(() => {
        if (allCategories) {
            setCategories(allCategories.serviceCategories.data)
        }
    }, [allCategories]);

    useEffect(() => {
        if (timeSlotData) {
            setTimeSlots(timeSlotData.partnerTimeSlots)
        }
    }, [timeSlotData]);
    useEffect(() => {
        if (allChairs) {
            setChairs(allChairs.chairs?.data);
        }
        if (allStaffs) {
            setStaffs(allStaffs.staffs.data);
            if (allStaffs.staffs.data.length === 1) {
                setSingleStaffId(allStaffs.staffs.data[0].id)
            }
        }
        if (allServices) {
          let formattedData: any = [];
          allServices.services.data.map((service: any) => service?.service_pricings.map((item: any) => {
          let data = {
            service_id: service?.id,
            service_pricing_id: item?.id,
            service_cat: service?.service_category_info?.name,
            service_pricing_name: item?.service_name,
            service_price: item?.special_price ? item?.special_price : item?.price,
            service_duration: item?.duration,
            value: item?.id,
            label: `${service?.service_category_info?.name} ${item?.service_name} ${item?.duration} min €${parseFloat(item?.special_price) ? item?.special_price : item?.price}`,
            // new field
            is_group: service.is_group,
            is_course: service.is_course,
          }
          formattedData.push(data)
          }));
          setServices(formattedData);
        }
    }, [allChairs, allStaffs, allServices])

    // console.log("allServices", allServices)

    useEffect(() => {
        if (clientsData) {
            refetchClient()
            setClients(clientsData.clients?.data)
        }
    }, [clientsData]);

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

    // useEffect to run the query when id, date, or time change
    useEffect(() => {
      if (servicePricingId || convertedDate || formValues[0].time) {
        fetchData(servicePricingId, convertedDate, formValues[0].time);
      }
    }, [servicePricingId, convertedDate, formValues[0].time]);

    useEffect(() => {
        if (singleServiceData) {
          console.log("🚀 ~ file: AppointmnetCreate.tsx:353 ~ useEffect ~ singleServiceData:", singleServiceData)
          if (singleServiceData?.servicePricing?.service?.is_group) {
            let groupData = {
              is_group: singleServiceData?.servicePricing?.service?.is_group,
              client_per_class: singleServiceData?.servicePricing?.service?.client_per_class,
              is_course: singleServiceData?.servicePricing?.service?.is_course,
              session_per_course: singleServiceData?.servicePricing?.service?.session_per_course,
              booked_guests: JSON.parse(singleServiceData?.servicePricing?.booked_guests || "[]"),
              total_booked: singleServiceData?.servicePricing?.total_booked,
              disabled: false
            }
            addGroupInfo(groupData);
            let values: any = formValues;
            for (let itIndex in values) {
              if (+itIndex === myIndex) {
                values[itIndex].quantity = 1;
                values[myIndex].duration = singleServiceData.servicePricing?.duration
                values[myIndex].service_name = singleServiceData.servicePricing?.service_name
                values[myIndex].price = singleServiceData.servicePricing?.price
                values[myIndex].special_price = singleServiceData.servicePricing?.special_price
                values[myIndex].staffs = singleServiceData.servicePricing?.staffs
                // new added
                values[myIndex].is_group = singleServiceData?.servicePricing?.service?.is_group
                values[myIndex].client_per_class = singleServiceData?.servicePricing?.service?.client_per_class
                values[myIndex].is_course = singleServiceData?.servicePricing?.service?.is_course
                values[myIndex].session_per_course = singleServiceData?.servicePricing?.service?.session_per_course
                // group or course service chair auto filled with first chair
                values[myIndex].chair = chairs[0]?.id
              }
            }
            setFormValues([...values])
            // set data if course avaiable
            if (singleServiceData?.servicePricing?.service?.is_course){
              const timeSlots = singleServiceData?.servicePricing?.time_slots || "[]";
              const parsedTimeSlots = JSON.parse(timeSlots);
              if (parsedTimeSlots.length > 0) {
                setCourseTimeSlots(parsedTimeSlots);
                // set first time and first slot id
                values[myIndex].schedule_id = `${parsedTimeSlots[0]?.id}`;
              } else {
                setCourseTimeSlots([]);
              }
            }
          }else{
            let groupData = {
              is_group: false,
              client_per_class: 0,
              is_course: false,
              session_per_course: 0,
              booked_guests:[],
              total_booked: 0,
              disabled: true,
            }
            addGroupInfo(groupData);
            let values: any = formValues;
            for (let itIndex in values) {
              if (+itIndex === myIndex) {
                values[itIndex].quantity = 1;
                values[myIndex].duration = singleServiceData.servicePricing?.duration
                values[myIndex].service_name = singleServiceData.servicePricing?.service_name
                values[myIndex].price = singleServiceData.servicePricing?.price
                values[myIndex].special_price = singleServiceData.servicePricing?.special_price
                values[myIndex].staffs = singleServiceData.servicePricing?.staffs
                // new added
                values[myIndex].is_group = singleServiceData?.servicePricing?.service?.is_group
                values[myIndex].client_per_class = singleServiceData?.servicePricing?.service?.client_per_class
                values[myIndex].is_course = singleServiceData?.servicePricing?.service?.is_course
                values[myIndex].session_per_course = singleServiceData?.servicePricing?.service?.session_per_course
              }
            }
            setFormValues([...values])
          }
          
        }
    }, [singleServiceData])
    //select exact time
    const goal: any = moment().format("HH:mm");
    let exact = "";
    for (let i = 0; i < timeSlots.length; i++) {
        if (moment.unix(timeSlots[i].s_time).format("HH:mm") >= goal) {
            exact = moment.unix(timeSlots[i].s_time).format("HH:mm");
            break;
        }
    }
    let exactTime = "";
    useEffect(() => {
        if (calendarEvent.start != "") {
            exactTime = appointmentTime
            let values: any = formValues;
            for (let itIndex in values) {
                if (+itIndex === myIndex) {
                    values[myIndex].time = exactTime
                }
            }
            setFormValues(values)
        } else {
            let values: any = formValues;
            for (let itIndex in values) {
                if (+itIndex === myIndex) {
                    values[myIndex].time = exact
                }
            }
            setFormValues(values)
        }
        if (chairs.length == 1) {
            let values: any = formValues;
            for (let itIndex in values) {
                if (+itIndex === myIndex) {
                    values[myIndex].chair = chairs[0]?.id
                }
            }
            setFormValues(values)
        }
        if (staffs.length == 1) {
            let values: any = formValues;
            for (let itIndex in values) {
                if (+itIndex === myIndex) {
                    values[myIndex].staff_id = staffs[0].id
                }
            }
            setFormValues(values)
        }
        return () => {
            exactTime = "";
            exact = ""
        }
    }, [exact, chairs, staffs])

    const getNearestTime = (timeList: any, currentTime: any) => {
        let nearestTime = "";
        let minValue = timeList[0].s_time > currentTime ? (timeList[0].s_time - currentTime) : (currentTime - timeList[0].s_time);

        timeList.reduce((minVal: any, hour: any) => {
            let hourDiff = (currentTime > hour.s_time) ? currentTime - hour.s_time : hour.s_time - currentTime;
            if (hourDiff <= minVal) {
                nearestTime = hour.s_time;
                return hourDiff;
            } else {
                return minVal;
            }
        }, minValue)
        return nearestTime;
    }

    let saleData = {
      "appointment": formValues,
    }

    // save appointment 
    const handleSubmit = (e: any) => {
      e.preventDefault()
      setLoading(true);
      const appoitmentPayload = formValues.map((item) => ({
        id: "",
        appt_id: "",
        date: convertedDate,
        time: item.time,
        duration: parseInt(item.duration),
        staff_id: parseInt(item.staff_id),
        chair: parseInt(item.chair),
        service_pricing_id: parseInt(item.ser_pricing_id),
      }))
      if (formValues[0].chair != "" && formValues[0].ser_pricing_id != "") {
        checkScheduleConflictForClient({
          variables: {
            client_id: guests.length > 0 ? +guests[0]?.id : 0,
            services: appoitmentPayload,
          },
        })
          .then(({data}) => {
            const {message, status} = data.checkScheduleConflictForClient || {}

            if (status === 1) {
              // No conflict, proceed with addAppointment mutation
              addAppointment({
                variables: {
                  client_id: guests.length > 0 ? +guests[0]?.id : 0,
                  note: note,
                  date: convertedDate,
                  services: appoitmentPayload,
                },
              })
                .then(({data: addAppointmentData}) => {
                  const {status, message} = addAppointmentData.addAppointment || {}
                  if (status === 0) {
                    system_log({
                      variables: {
                        ...systemLogPayload,
                        api: APPOINTMENT_CREATE_STRING,
                        type: 'appointment-add-error',
                        body: JSON.stringify({
                          client_id: guests.length > 0 ? +guests[0]?.id : 0,
                          note: note,
                          date: convertedDate,
                          services: appoitmentPayload,
                        }),
                        response: JSON.stringify(message),
                      },
                    });
                    showToast(message, 'error')
                  }
                  if (status === 1) {
                    showToast(message, 'success')
                    history.push('/calendar')
                  }
                })
                .catch((err) => {
                  showToast(err.message, 'error')
                  system_log({
                    variables: {
                      ...systemLogPayload,
                      api: APPOINTMENT_CREATE_STRING,
                      type: 'appointment-add-error',
                      body: JSON.stringify({
                        client_id: guests.length > 0 ? +guests[0]?.id : 0,
                        note: note,
                        date: convertedDate,
                        services: appoitmentPayload,
                      }),
                      exception: JSON.stringify(err),
                    },
                  })
                })
                .finally(() => {
                  setLoading(false)
                })
            }
            if (status === 0) {
              // Schedule conflict, show error message
              showToast(message, 'error')
              setLoading(false)
            }
          })
          .catch((err: any) => {
            // Handle errors from checkScheduleConflictForClient
            showToast(err.message, 'error')
            setLoading(false)
          })
      } else {
        showToast('Please select service & chair', 'warning');
        setLoading(false);
      }
    };

    const apptInformation = {
        client_id: guests.length > 0 ? +guests[0].id : 0,
        note: note,
        date: convertedDate
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
                language: "",
                photo: "",
                suite: "",
                country: "",
                eir_code: "",
            }
        }).then(({ data }) => {
            setLoading(false)
            if (data.guestProfileUpdate.status === 1) {
                // console.log(data?.guestProfileUpdate?.data)
                // guestId(data.guestProfileUpdate?.data)
                setShowCdetails(true)
                addGuests(data?.guestProfileUpdate?.data);
                showToast(data.guestProfileUpdate.message, 'success');
                setIsOverwrite(!isOverwrite);
            }
            if (data.guestProfileUpdate.status === 0) {
                showToast(data.guestProfileUpdate.message, 'error');
            }
        }).catch((e) => {
            showToast('Something went wrong!!!', 'error');
            setLoading(false);
        })
    }
    // console.log('guestId', detailClient?.id)
    useEffect(() => {
        if (overwrite === 1) {
            guestUpdate(detailClient?.id, overwriteObject);
        }
        if (overwrite === 2) {
            setIsOverwrite(!isOverwrite)
            // history.push('/guests')
        }
    }, [overwrite])
    const handleCheckout = (e: any) => {
      e.preventDefault();
      setLoading2(true)
      const checkConfiltPayloadService = 
        formValues.map((item) => ({
        id: "",
        appt_id: "",
        date: convertedDate,
        time: item.time,
        duration: parseInt(item.duration),
        staff_id: parseInt(item.staff_id),
        chair: parseInt(item.chair),
        service_pricing_id: parseInt(item.ser_pricing_id),
      }))
      
      if (formValues[0].is_group && !guests.length) {
        showToast('Please select a guest', 'warning');
        setLoading2(false);
      }
      else if (formValues[0].chair != "" && formValues[0].ser_pricing_id != "") {
        checkScheduleConflictForClient({
          variables: {
            client_id: guests.length > 0 ? +guests[0]?.id : 0,
            services: checkConfiltPayloadService,
          },
        })
          .then(({data}) => {
            const {message, status} = data.checkScheduleConflictForClient || {}
            if (status === 1) {
              addApptInfo(apptInformation)
              addApptServices(
                formValues.map((item) => ({
                  ...item,
                  date: convertedDate,
                  price: Number(item.price),
                  special_price: Number(item.special_price),
                }))
              )
              history.push('/sales-checkout')
            }
            if (status === 0) {
              // Schedule conflict, show error message
              showToast(message, 'error')
              setLoading2(false)
            }
          })
          .catch((err) => {
            showToast(err.message, 'error')
          })
          .finally(() => {
            setLoading2(false)
          })
      } else {
        setLoading2(false)
        showToast('Please Fill Up Service & Chair Info', 'warning');
      }
    }
    console.log("formValues:", formValues);
    const customStyles = {
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#007BFF' : 'white', // Example: change background color when an item is selected
        color: state.isSelected ? 'white' : 'black', // Example: change text color when an item is selected
      }),
      // You can add more styles for other components (e.g., control, menu, etc.) as needed
    };
    return (
      <>
        <section id='appointment-add' className='add-appointment-form ptc'>
          <Form>
            <div className='toolbar'>
              <Link className='close-btn' to='/calendar'>
                <i className='fas fa-times'
                onClick={()=>{
                  addGroupInfo({
                    is_group: false,
                    client_per_class: 0,
                    is_course: false,
                    session_per_course: 0,
                    booked_guests: [],
                    total_booked: 0,
                    disabled: false,
                  })
                }}
                ></i>
              </Link>
              <h2 className='page-title mb-0'>New appointment</h2>
              <div>
                <button
                  onClick={(e) => {
                    handleCheckout(e)
                  }}
                  type='submit'
                  id='checkout'
                  name='checkout'
                  className='submit-btn save-btn'
                  disabled={loading2}
                >
                  {!loading2 && <span className='indicator-label'>Checkout</span>}
                  {loading2 && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>{' '}
                &nbsp;
                <button
                  onClick={(e) => {
                    handleSubmit(e)
                  }}
                  type='submit'
                  id='save'
                  name='save'
                  className='submit-btn save-btn'
                  disabled={loading}
                >
                  {!loading && <span className='indicator-label'>Save</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-8'>
                <Card className='primary-bx-shadow p-30'>
                  <div style={{marginBottom: '15px'}}>
                    <Row>
                      <Form.Group
                        className='d-flex align-items-center apnmnt-date-wrapper'
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
                    </Row>
                  </div>
                  <div className='scheduleWrap'>
                    <div className='scheduleInner'>
                      <div className='add-pricing'>
                        {formValues.map((element, index) => (
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
                              <Form.Group as={Col} sm={4} className='starttime mb-5'>
                                <Form.Label>Start time</Form.Label>
                                {
                                  groupInfo.is_group && groupInfo.is_course  ? 
                                    <Form.Select
                                      id='datePicker'
                                      name='time'
                                      onChange={(e) => handleChange(e, index)}
                                    >
                                      {courseTimeSlots.map((slot: any) => {
                                        return (
                                          <>
                                            <option
                                              key={slot.id}
                                              selected={
                                                moment.unix(slot.time).format('HH:mm') ==
                                                  formValues[index].time
                                                  ? true
                                                  : false
                                              }
                                              value={
                                                moment.unix(slot.time).format('HH:mm')
                                              }
                                              data-extra={slot.id}
                                            >
                                              {moment.unix(slot.time).format('HH:mm')}
                                            </option>
                                          </>
                                        )
                                      })}
                                    </Form.Select> : 

                                  <Form.Select
                                    id='datePicker'
                                    name='time'
                                    onChange={(e) => handleChange(e, index)}
                                  >
                                    {timeSlots.map((time: any) => {
                                      return (
                                        <>
                                          <p>
                                            {time.time ==
                                            formValues[index].time
                                              ? 'true'
                                              : 'false'}
                                          </p>

                                          <option
                                            selected={
                                              time.time ==
                                              formValues[index].time
                                                ? true
                                                : false
                                            }
                                            value={
                                              exactTime == time.time
                                                ? exactTime
                                                : time.time
                                            }
                                          >
                                            {time.time}
                                          </option>
                                        </>
                                      )
                                    })}
                                  </Form.Select>
                                }
                              </Form.Group>
                              <Form.Group as={Col} sm={8} className='duration mb-5'>
                                <Form.Label>Service</Form.Label>
                                {/* @ts-nocheck */}
                                <Select
                                  options={services.filter((service:any)=> groupInfo.disabled ? !service.is_group : service)}
                                  getOptionLabel={(option: any) => option.label}
                                  getOptionValue={(option: any) => option.value}
                                  onChange={(e) => {
                                    setMyIndex(index)
                                    // servicePricingId(e, index)
                                    setServicePricingId(e.service_pricing_id)
                                    handleServiceChange(e, index)
                                  }} 
                                  styles={customStyles}
                                />
                                {/* <Form.Select name="ser_pricing_id" onChange={(e) => { setMyIndex(index); servicePricingId(e, index); handleChange(e, index) }}> */}
                                {/* <option value="" disabled selected>Choose</option>
                                {
                                    services.map((service: any) =>
                                    (<option value={service.service_pricing_id} selected={service.service_pricing_id == formValues[index].ser_pricing_id}>
                                        {`${service.service_pricing_name} (${service.service_duration} min, €${service.service_price})`}
                                    </option>)
                                    )
                                } */}
                                {/* {
                                  services.map((service: any) => service.service_pricings.map((itm: any) =>
                                  (<option value={itm.id} selected={itm.id == formValues[index].ser_pricing_id}>
                                      {`${itm.service_name} (${itm.duration} min, €${itm.special_price ? itm.special_price : itm.price})`}
                                  </option>)
                                  ))
                              } */}
                                {/* </Form.Select> */}
                                {formValues[index].ser_pricing_id &&
                                formValues[index].staff_id &&
                                formValues[index].staffs &&
                                formValues[index].staffs.includes(
                                  formValues[index].staff_id
                                ) ? (
                                  <span className='text-danger'>
                                    this staff doesn't provide this service, but you still book
                                    appointments for them.
                                  </span>
                                ) : (
                                  ''
                                )}
                              </Form.Group>
                              <Form.Group as={Col} sm={3} className='duration mb-5'>
                                <Form.Label>Duration</Form.Label>
                                {
                                  <Form.Select
                                    name='duration'
                                    onChange={(e) => handleChange(e, index)}
                                  >
                                    <option value='' disabled selected>
                                      Choose
                                    </option>
                                    {timeDurationArray.map((itm, i) => (
                                      <option
                                        key={itm.id}
                                        value={itm.id}
                                        selected={itm.id == +formValues[index].duration}
                                      >
                                        {itm.text}
                                      </option>
                                    ))}
                                  </Form.Select>
                                }
                              </Form.Group>
                              <Form.Group as={Col} sm={3} className='duration mb-5'>
                                <Form.Label>Chair</Form.Label>
                                <Form.Select name='chair' onChange={(e) => handleChange(e, index)}>
                                  <option value='' disabled selected>
                                    Choose
                                  </option>
                                  {chairs &&
                                    chairs.map((chair, index) => (
                                      <option
                                        key={index}
                                        value={chair.id}
                                        selected={chair.id == formValues[index]?.chair}
                                      >
                                        {chair.title}
                                      </option>
                                    ))}
                                </Form.Select>
                                {/* } */}
                              </Form.Group>
                              <Form.Group as={Col} sm={6} className='duration mb-5'>
                                <Form.Label>Staff</Form.Label>
                                <Form.Select
                                  name='staff_id'
                                  onChange={(e) => handleChange(e, index)}
                                >
                                  <option value='' disabled selected>
                                    Choose
                                  </option>
                                  {staffs &&
                                    staffs.length > 0 &&
                                    staffs.map((staff) => (
                                      // singleServiceInfo != null && singleServiceInfo.includes(staff.id) ?
                                      <option
                                        key={staff.id}
                                        value={staff.id}
                                        selected={staff.id == formValues[index].staff_id}
                                      >
                                        {staff.name}
                                      </option>
                                    ))}
                                </Form.Select>
                              </Form.Group>
                            </Row>
                          </div>
                        ))}
                        {
                          !formValues[0].is_group ?
                          <div className='add-pricing-btn-wrap ps-0'>
                            <button
                              onClick={() => addFormFields()}
                              type='button'
                              className='add-price-btn btn btn-light d-flex align-items-center'
                            >
                              <i className='fa fa-plus-circle'></i>
                              <span>Add another service</span>
                            </button>
                          </div> :
                            <div className='add-pricing-btn-wrap ps-0'>
                              <button
                                onClick={() => addFormFields()}
                                type='button'
                                disabled
                                className='add-price-btn btn btn-light d-flex align-items-center'
                              >
                                <i className='fa fa-plus-circle'></i>
                                <span>Add another service</span>
                              </button>
                            </div>

                        }
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
                          value={note}
                          onChange={handleNote}
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
                      <div className={`d-flex align-items-center justify-content-center m-2 ${groupInfo.total_booked == groupInfo.client_per_class && 'text-danger'}`}>
                        Spaces Remaining { groupInfo.client_per_class - guests?.length} of {groupInfo.client_per_class}
                      </div>
                    )}
                    {showClients ? (
                      <div>
                        {showCdetails ? (
                          <div>
                            <div>
                              {guests.map((guest: IBuyerGuest, index: number)=> {
                                return(
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
                                                onClick={()=>{handleClickCdetailsBack(guest, guests.length)}}
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

                              <div className='Client-details-body'>
                                {/* <div className="client-d-heading d-flex align-items-center justify-content-between">
                                    <div className="counter text-center">
                                        <h3 className="mb-0 fw-bolder">1</h3>
                                        <span className="text-muted">Total Bookings</span>
                                    </div>
                                    <div className="amount text-center">
                                        <h3 className="mb-0 fw-bolder">EUR 0</h3>
                                        <span className="text-muted">Total Sales</span>
                                    </div>
                                </div> */}
                                {/* <Tab.Container id="left-tabs-example" defaultActiveKey="appointments">
                                      <Nav variant="tabs" className="client-nav-list">
                                          <Nav.Item>
                                              <Nav.Link eventKey="appointments">
                                                  Appointments
                                              </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item>
                                              <Nav.Link eventKey="products">
                                                  Products
                                              </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item>
                                              <Nav.Link eventKey="invoices">
                                                  Invoices
                                              </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item>
                                              <Nav.Link eventKey="info">
                                                  Info
                                              </Nav.Link>
                                          </Nav.Item>
                                      </Nav>
                                      <div className="tab-content">
                                          <Tab.Content>
                                              <Tab.Pane eventKey="appointments">
                                                  <div className="appointments-content apn-single-tab-content">
                                                      <div className="apn-tab-heading">
                                                          <h3 className="mb-0">Past (1)</h3>
                                                      </div>
                                                      <div className="add-apn-tab-body">
                                                      </div>
                                                  </div>
                                              </Tab.Pane>
                                              <Tab.Pane eventKey="products">
                                                  <div className="products-content apn-single-tab-content">
                                                      <div className="heading">
                                                          Tab content 2
                                                      </div>
                                                  </div>
                                              </Tab.Pane>
                                              <Tab.Pane eventKey="invoices">
                                                  <div className="invoices-content apn-single-tab-content">
                                                      <div className="heading">
                                                          Tab content 3
                                                      </div>
                                                  </div>
                                              </Tab.Pane>
                                              <Tab.Pane eventKey="info">
                                                  <div className="info-content apn-single-tab-content">
                                                      <div className="heading">
                                                          Tab content 4
                                                      </div>
                                                  </div>
                                              </Tab.Pane>
                                          </Tab.Content>
                                      </div>
                                  </Tab.Container> */}
                              </div>
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
            </div>
          </Form>
        </section>

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
      </>
    )
}
export default AppointmnetCreate;
