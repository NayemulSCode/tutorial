import React, { useState, FC, FocusEvent, useEffect, useContext, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Collapse, Form, Row, Col, InputGroup, FormControl, Button, Tabs, Tab, TabContainer } from 'react-bootstrap-v5';
import { ErrorMessage } from "@hookform/error-message";
import { useForm, useFieldArray } from "react-hook-form";
import '../Services.css'
import AdvancedPricingModal from './AdvancedPricingModal'
import { useMutation, useQuery } from '@apollo/client';
import { SERVICE_CREATE, SYSTEM_LOG } from '../../../../../../gql/Mutation'
import { ALL_TREATEMENT_TYPE, SERVICE_CATEGORIES, ALL_STAFF_INFO, PROFILE_INFORMATION } from '../../../../../../gql/Query'
import { yupResolver } from '@hookform/resolvers/yup';
import { AppContext } from '../../../../../../context/Context';
import { allowOnlyNumber, currency, frequency, occurrence, systemLogPayload, timeDurationArray } from '../../../../../modules/util';
import { ConflictData, GroupTimeSlot, IServiceInputTypes } from '../../../../../modules/generates.type'
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage';
import { addServiceValidationSchema } from './addServiceValidationSchema';
import DateTimeForm from './DateTimeForm';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import GroupTimeSlotForm from './GroupTimeSlotForm';
import ConflictDateTimeShowModal from '../../../../../modules/widgets/components/ConflictDateTimeShowModal';
import moment from 'moment';
import { toast } from 'react-toastify';
import { print } from 'graphql';
interface DayTime {
  date: string;
  day: string;
  time: string;
}
interface WeekTime {
  date: string;
  day: string;
  time: string;
  sameOthers?: boolean;
}
const AddSingleService: FC = () => {
    const history = useHistory();
    const {showToast} = useTostMessage()
    const {addVideoItem} = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCat, setServiceCat] = useState<Array<any>>([]);
    const [treatmentType, setTreatmentType] = useState<Array<any>>([]);
    const [allStaffs, setAllStaffs] = useState<Array<any>>([]);
    const [show, setShow] = useState<boolean>(false);
    const [serviceStaffs, setServiceStaffs] = useState<boolean>(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }
    const [isPersonal, setIsPersonal] = useState<boolean>(false);
    const [voucherSales, setVoucherSales] = useState<boolean>(false);
    const [groupService, setGroupService] = useState<boolean>(false);
    const [course, setCourse] = useState<boolean>(false);
    // const [openttype, setOpenttype] = useState<boolean>(false);
    // add for course service time date 
    const [weekTimes, setWeekTimes] = useState<WeekTime[]>([]);
    const [dateTimes, setDateTimes] = useState<DayTime[]>([]);
    const [showModal, setShowModal] = useState(false)
    const [conflictData, setConflictData] = useState<ConflictData[]>([])
    const closeModal = () => setShowModal(false);
    const [groupTimeSlots, setGroupTimeSlots] = useState<GroupTimeSlot[]>([
        // {
        //   "id": 1,
        //   "hours": 10,
        //   "minutes": 0
        // },
        // {
        //   "id": 2,
        //   "hours": 15,
        //   "minutes": 0
        // },
        // {
        //   "id": 3,
        //   "hours": 21,
        //   "minutes": 0
        // }
    ]);
    const [startDate,setStartDate]=useState<string>('')
    const [errorMessage, setErrorMessage]=useState<string>('')
    const [addService] = useMutation(SERVICE_CREATE, {
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
            setLoading(false)
          } else {
            // If it's a different type of error, show the general reason
            showToast(extensions.reason || 'An unknown error occurred', 'error')
            setLoading(false)
          }
        } else {
          // Handle the case where there's no detailed GraphQL error
          showToast('An unknown error occurred', 'error')
        }
      },
    })
    const ADD_SERVICE_STRING = print(SERVICE_CREATE);
    const [system_log] = useMutation(SYSTEM_LOG)
    const { data: serviceCatData, error: serviceCatError } = useQuery(SERVICE_CATEGORIES, {
        variables: {
            type: "",
            count: 10,
            page: 1
        }
    })
    const { data: treatmentTpes, error: treatmentTypeError } = useQuery(ALL_TREATEMENT_TYPE, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    })
    const { data: allStaff, error: allStaffError } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: 10,
            page: 1
        },
        fetchPolicy: "network-only"
    })
    const { data: accountData} = useQuery(PROFILE_INFORMATION)

    const {
      register,
      control,
      handleSubmit,
      watch,
      formState: {errors},
      setValue,
    } = useForm<IServiceInputTypes>({
      criteriaMode: 'all',
      mode: 'onChange',
      resolver: yupResolver(addServiceValidationSchema),
    });
    const isStartDate = watch('start_date')

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
        {
            control,
            name: "pricing"
        }
    );
    useEffect(() => {
        if (allStaff) {
            setAllStaffs(allStaff.staffs.data)
            // console.log("all staffs", allStaff.staffs.data);
        }
    }, [allStaff])
    useEffect(() => {
        if (treatmentTpes) {
            // console.log(treatmentTpes)
            setTreatmentType(treatmentTpes.treatmentTypes.data)
        }
        if (treatmentTypeError) {
            // console.log(treatmentTypeError)
        }
    }, [treatmentTpes])
    useEffect(() => {
        if (serviceCatData) {
            setServiceCat(serviceCatData.serviceCategories.data);
            // console.log(serviceCatData.serviceCategories.data)
        }
    }, [serviceCatData])
    // time formater
    const formatTime = (hours: number, minutes: number) => {
      const formattedHours = hours.toString().padStart(2, '0')
      const formattedMinutes = minutes.toString().padStart(2, '0')
      return `${formattedHours}:${formattedMinutes}`
    }
    //reseting the setWeekTimes and setDateTimes state
    useEffect(()=>{
      setWeekTimes([]);
      setDateTimes([])
    },[startDate])

    const onSubmit = (data: IServiceInputTypes) => {
      setLoading(true);
      const serviceInput = {
        is_personal: data.is_personal,
        service_category_id: +data.serviceCategory,
        name: data.serviceName,
        description: data.serviceDescription,
        service_available_for: data.serviceFor,
        enable_online_booking: data.onlineService,
        staffs:
          typeof data?.staff === 'string' ?  [parseInt(data?.staff)] :
          typeof data?.staff === 'object' ? data.staff.map((staff) => parseInt(staff))
            : [],
        service_pricing: data.pricing
          ? data.pricing.map((pric) => ({
              id: '',
              pricingName: pric.pricingName,
              duration: parseInt(pric.duration),
              price: pric.price.toString(),
              specialPrice: pric.specialPrice > 0 ? pric.specialPrice.toString() : '',
            }))
          : [],
        tax: '',
        is_voucher: voucherSales,
        voucher_sale: voucherSales ? data.voucherPeriod : '',
        is_group: data.group_service ? data.group_service : false,
        client_per_class: data.group_service ? +data.guest_per_class : 0,
        is_course: data.course ? data.course : false,
        session_per_course: data.course ? +data.sessions_per_course : 0,
        // new propertices for course event
        schedule_type: data.occurrence ? data.occurrence : '',
        schedules:
          data.occurrence === 'date'
            ? dateTimes
            : data.occurrence === 'week'
            ? weekTimes
            : groupService
            ? groupTimeSlots &&
              groupTimeSlots.map((slot) => ({
                day: '',
                date: '',
                time: formatTime(slot.hours, slot.minutes),
              }))
            : [],
        // 2nd level propertices added
        start_date: moment(data.start_date).format('YYYY-MM-DD'),
        enroll_date: data.enrolment_date ? moment(data.enrolment_date).format('YYYY-MM-DD') : '',
        group_type: data.course ? 'course' : data.repeated_group ? 'repeated' : 'single',
        special_deposit: data.is_special_deposit ? `${data.special_deposit}` : '',
        frequency: data.repeated_group ? data.group_frequency : '',
        occurrences: data.repeated_group ? +data.group_occurrences : 0,
      }
      const personalServiceInput = {
        is_personal: data.is_personal,
        service_category_id: +data.serviceCategory,
        name: data.serviceName,
        description: data.serviceDescription,
        service_available_for: '',
        enable_online_booking: false,
        staffs: [parseInt(allStaffs[0].id)],
        service_pricing: data.pricing
          ? data.pricing.map((pric) => ({
              id: '',
              pricingName: pric.pricingName,
              duration: parseInt(pric.duration),
              price: pric.price.toString(),
              specialPrice: pric.specialPrice > 0 ?  pric.specialPrice.toString() : "",
            }))
          : [],
        tax: '',
        is_voucher: voucherSales,
        voucher_sale: voucherSales ? data.voucherPeriod : '',
        is_group: false,
        client_per_class: 0,
        is_course: false,
        session_per_course: 0,
        schedule_type: '',
        schedules: [],
        // 2nd level propertices
        start_date: '',
        enroll_date: '',
        special_deposit: '',
        frequency: '',
        occurrences: 0,
        group_type: '',
      }
      if(isPersonal){
         addService({
           variables: personalServiceInput,
         })
           .then(({data}) => {
             if (data) {
               showToast('Service Added successfully', 'success')
               setLoading(false)
               history.push('/services/list')
             }
           })
           .catch((e:any) => {
            system_log({
              variables: {
                ...systemLogPayload,
                api: ADD_SERVICE_STRING,
                type: 'service-add-error',
                body: JSON.stringify(personalServiceInput),
                exception: JSON.stringify(e),
              },
            })
             showToast('Service Add filed', 'error')
             setLoading(false)
           })
      }else{
        if (data.staff.length > 0) {
          addService({
            variables: serviceInput,
          })
            .then(({data, errors}) => {
              // Check for errors in response
              if (errors && errors.length > 0) {
                system_log({
                  variables: {
                    ...systemLogPayload,
                    api: ADD_SERVICE_STRING,
                    type: 'service-add-error',
                    body: JSON.stringify(personalServiceInput),
                    exception: JSON.stringify(errors),
                  },
                })
                showToast(errors[0]?.message || 'Error occurred', 'error')
                setLoading(false)
                return
              }

              // If data is not present or undefined
              if (!data || !data.addService) {
                system_log({
                  variables: {
                    ...systemLogPayload,
                    api: ADD_SERVICE_STRING,
                    type: 'service-add-error',
                    body: JSON.stringify(personalServiceInput),
                    exception: JSON.stringify(errors),
                  },
                })
                showToast('Failed to add service. Please try again.', 'error')
                setLoading(false)
                return
              }

              const {status, message} = data.addService
              if (status === 0) {
                const conflictMessage = JSON.parse(data.addService?.data || '[]')
                if (conflictMessage?.length) {
                  setConflictData(conflictMessage)
                  setShowModal(true)
                }
                showToast(message, 'error')
                setLoading(false)
                system_log({
                  variables: {
                    ...systemLogPayload,
                    api: ADD_SERVICE_STRING,
                    type: 'service-add-error',
                    body: JSON.stringify(personalServiceInput),
                    response: JSON.stringify(data.addService),
                  },
                })
              } else if (status === 1) {
                showToast(message, 'success')
                setLoading(false)
                history.push('/services/list')
              }
            })
            .catch((e) => {
              console.log('Error in onSubmit:', e)
              showToast('Service Add failed', 'error')
              setLoading(false)
              system_log({
                variables: {
                  ...systemLogPayload,
                  api: ADD_SERVICE_STRING,
                  type: 'service-add-error',
                  body: JSON.stringify(personalServiceInput),
                  exception: JSON.stringify(e),
                },
              })
            })
        } else {
          showToast('Please, select at least one staff', 'warning')
          setLoading(false)
        }

      }
    }

    // Add pricing options
    const [formValues, setFormValues] = useState<Array<object>>([{}]);
    // console.log("array of from vlaues", formValues)
    let addFormFields = () => {
        setFormValues([...formValues, {}])
    }

    let removeFormFields = (i: number) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
  const number_of_sessions_dates = watch('sessions_per_course');
  const occurrence_type = watch('occurrence');
    // for type free price type
    const watchFieldArray = watch("pricing");
    const typeOfPrice = watchFieldArray?.map(item => item.priceType);
    // detect personal service
    const detectedServiceCAtegory:any = watch('serviceCategory');
    useEffect(() => {
      if (detectedServiceCAtegory){
      const isPersonal = serviceCat
        .find((cat: any) => cat.id == detectedServiceCAtegory)
        .is_personal === true
        setIsPersonal(isPersonal);
        setValue("is_personal", isPersonal)
      }
    }, [detectedServiceCAtegory])
    const handleRedirectVideoSection = () => {
      addVideoItem(5)
      history.push({
        pathname: '/setup/how-to',
        state: {title: 'add service'},
      })
    }
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;
   
    const handleWhiteSpace = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      const key = e.key
      if (key === ' ' && value === '') {
        e.preventDefault()
      } else if (value?.length >= 45) {
        e.preventDefault()
        showToast('Maximum characters reached', 'warning')
      }
    }
    // special deposit not more than 100
    const inputValidation = (e: any) => {
      const value = e.target.value;
      if (+value > 100) {
        setErrorMessage("Diposite payment must be lower than 100")
      }
      else {
        setErrorMessage("")
      }
    }
    return (
      <>
        <section id='add-single-service' className='ptc'>
          {/* @ts-ignore */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='toolbar'>
              <Link className='close-btn' to='/services/list'>
                <i className='fas fa-times'></i>
              </Link>
              <h2 className='page-title mb-0'>Add a new service</h2>
              {/* <button type="submit" className="submit-btn save-btn">Save</button> */}
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='submit-btn save-btn'
                disabled={loading}
              >
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Saving...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
            <div className='basic-info add-single-service-step'>
              <div className='form-heading d-flex justify-content-between'>
                <div>
                  <h2 className='section-title'>Basic info</h2>
                  <p>
                    Select a Service Category then add your New Service Name and details.
                    <br />
                    <span className='service-note'>
                      NOTE: You need to Create Service Categories before adding a Service.
                    </span>
                  </p>
                </div>
                <button
                  type='button'
                  style={{background: '#ebc11a'}}
                  onClick={handleRedirectVideoSection}
                  className='btn btn-md text-light h-50 fw-bold ms-5'
                >
                  How To
                </button>
              </div>
              <Row className='basic-info-form'>
                <Form.Group as={Col} md={7} className='mb-3' controlId='service-category'>
                  <Form.Label>Service category</Form.Label>
                  <Form.Select
                    {...register('serviceCategory', {
                      required: 'Service category is required',
                    })}
                    aria-label='Default select example'
                  >
                    <option value='' disabled selected>
                      {' '}
                      Choose service category
                    </option>
                    {serviceCat.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  <ErrorMessage
                    errors={errors}
                    name='serviceCategory'
                    render={({message}) => <p style={{color: 'red'}}>{message}</p>}
                  />
                </Form.Group>
                {!isPersonal && (
                  <Fragment>
                    {accountData &&
                    accountData?.profileInformation?.business_info?.group_service == true ? (
                      <>
                        <div className='row'>
                          <Form.Group as={Col} md={2} className='mb-4'>
                            <Form.Check
                              type='switch'
                              {...register('group_service')}
                              id='custom-switch'
                              label='Class Service'
                              onClick={() => setGroupService(!groupService)}
                              className='group_switch'
                            />
                          </Form.Group>
                          {groupService && (
                            <>
                              <Form.Group as={Col} md={3} className='mb-4'>
                                <Form.Label>Guests Per Class</Form.Label>
                                <Form.Control
                                  type='text'
                                  autoComplete='off'
                                  min='0'
                                  placeholder='Number of guests'
                                  {...register('guest_per_class')}
                                  onKeyDown={(event: any) => allowOnlyNumber(event)}
                                />
                                {errors.guest_per_class && (
                                  <p style={{color: 'red'}}>{errors.guest_per_class.message}</p>
                                )}
                              </Form.Group>
                              <Form.Group as={Col} md={1} className='mb-4'>
                                <Form.Check
                                  type='switch'
                                  {...register('course')}
                                  id='custom-switch2'
                                  label='Course'
                                  onClick={() => setCourse(!course)}
                                  className='group_switch'
                                />
                              </Form.Group>
                              {course && (
                                <Form.Group as={Col} md={3} className='mb-4'>
                                  <Form.Label>Sessions Per Course</Form.Label>
                                  <Form.Control
                                    type='text'
                                    autoComplete='off'
                                    min='0'
                                    placeholder='Number of sessions'
                                    {...register('sessions_per_course')}
                                    onKeyDown={(event: any) => allowOnlyNumber(event)}
                                  />
                                  {errors.sessions_per_course && (
                                    <p style={{color: 'red'}}>
                                      {errors.sessions_per_course.message}
                                    </p>
                                  )}
                                </Form.Group>
                              )}
                              <div className='row align-items-center mb-3'>
                                <Form.Label className='form-label'>Start Date:</Form.Label>
                                <div className='col-md-4'>
                                  <Form.Control
                                    type='date'
                                    {...register('start_date')}
                                    onChange={(e: any) => {
                                      setStartDate(e.target.value)
                                    }}
                                    min={moment().format('YYYY-MM-DD')}
                                  />
                                </div>
                                {errors.start_date && (
                                  <p style={{color: 'red'}}>{errors.start_date.message}</p>
                                )}
                              </div>
                              {watch('course') && (
                                <div className='row align-items-center mb-3'>
                                  <Form.Label className='form-label'>
                                    Enrolment Last Date:
                                  </Form.Label>
                                  <div className='col-md-4'>
                                    <Form.Control
                                      type='date'
                                      {...register('enrolment_date')}
                                      min={moment().format('YYYY-MM-DD')}
                                      max={moment(startDate).format('YYYY-MM-DD')}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {/* <div className='col-md-3 mb-4'>
                        <Form.Label className='mb-1'>
                          {' '}
                          <span style={{color: 'red'}}>Group Service</span> for multiple Guests
                        </Form.Label>
                        <small>(Eg: Class with 10 Guests)</small>
                      </div> */}
                        </div>
                        {/* repeated gorup event */}
                        <div className='row'>
                          {!watch('course') && (
                            <>
                              <Form.Group as={Col} md={3} className='mb-4'>
                                <Form.Check
                                  type='switch'
                                  {...register('repeated_group')}
                                  id={`repeated-group`} // Ensure unique IDs
                                  label='Repeated Class Session'
                                  className='group_switch'
                                />
                              </Form.Group>
                            </>
                          )}
                          {watch('repeated_group') && !watch('course') && (
                            <>
                              <Form.Group as={Col} md={3} className='mb-4'>
                                <Form.Label>Frequency</Form.Label>
                                <Form.Select {...register('group_frequency')}>
                                  <option value='' disabled selected>
                                    Choose
                                  </option>
                                  {frequency &&
                                    frequency.map((frequency) => (
                                      <option key={frequency.id} value={frequency.value}>
                                        {frequency.name}
                                      </option>
                                    ))}
                                </Form.Select>
                                {errors.group_frequency && (
                                  <p style={{color: 'red'}}>{errors.group_frequency.message}</p>
                                )}
                              </Form.Group>
                              <Form.Group as={Col} md={3} className='mb-4'>
                                <Form.Label>Occurrences</Form.Label>
                                <Form.Select
                                  {...register('group_occurrences', {
                                    required: 'Occurence is required',
                                  })}
                                >
                                  <option value='' disabled selected>
                                    Choose
                                  </option>
                                  {occurrence &&
                                    occurrence.map((occurrence) => (
                                      <option key={occurrence.id} value={occurrence.value}>
                                        {occurrence.value}
                                      </option>
                                    ))}
                                </Form.Select>
                              </Form.Group>
                            </>
                          )}
                        </div>
                      </>
                    ) : null}

                    {/* group event */}
                    {groupService && !course && (
                      <Fragment>
                        <GroupTimeSlotForm
                          groupTimeSlots={groupTimeSlots}
                          setGroupTimeSlots={setGroupTimeSlots}
                        />
                      </Fragment>
                    )}

                    {/* course event */}
                    {course && (
                      <Form.Group className='' controlId='include-service'>
                        <Form.Label className='pb-3'>Schedule</Form.Label>
                        <div className='radio-buttons'>
                          <label htmlFor='occurrence-field1' className='custom-radio'>
                            <input
                              {...register('occurrence')}
                              type='radio'
                              name='occurrence'
                              id='occurrence-field1'
                              value='date'
                            />
                            <span className='radio-btn'>
                              <i className='las la-check'></i>
                              <div className='hobbies-icon'>
                                <img src={toAbsoluteUrl('/media/icons/date.png')} alt='icon' />
                                <h3 className=''>By Date</h3>
                              </div>
                            </span>
                          </label>
                          <label htmlFor='occurrence-field2' className='custom-radio'>
                            <input
                              {...register('occurrence')}
                              type='radio'
                              name='occurrence'
                              value='week'
                              id='occurrence-field2'
                            />
                            <span className='radio-btn'>
                              <i className='las la-check'></i>
                              <div className='hobbies-icon'>
                                <img src={toAbsoluteUrl('/media/icons/week.png')} alt='icon' />
                                <h3 className=''>By Week</h3>
                              </div>
                            </span>
                          </label>
                        </div>
                        {Boolean(number_of_sessions_dates) && (
                          <DateTimeForm
                            numberOfFields={+number_of_sessions_dates}
                            occurrence={occurrence_type}
                            setDateTimes={setDateTimes}
                            dateTimes={dateTimes}
                            setWeekTimes={setWeekTimes}
                            weekTimes={weekTimes}
                            startDate={startDate}
                          />
                        )}
                      </Form.Group>
                    )}
                  </Fragment>
                )}
                {/* <Form.Group as={Col} md={7} className="mb-3" controlId="treatment-type">
                        <Form.Label>Treatment type</Form.Label>
                        <Form.Select
                            placeholder="Select Treatment Type"
                            className="treatment-input"
                            {...register("treatment", {
                                required: "Treatment type is required"
                            })}
                        >
                            <option value="" disabled selected> Choose Treatment type</option>
                            {
                                treatmentType.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
                            }
                        </Form.Select>
                        <ErrorMessage
                            errors={errors}
                            name="treatment"
                            render={({ message }) => <p style={{ color: "red" }}>{message}</p>}
                        />
                    </Form.Group> */}
                <Form.Group as={Col} md={7} className='mb-3' controlId='service-name'>
                  <Form.Label>
                    Service name<span style={{color: 'red'}}> (max:45 characters)</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='e.g.hair cut'
                    autoComplete='off'
                    {...register('serviceName')}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      handleWhiteSpace(e)
                    }}
                  />
                  {errors.serviceName && <p style={{color: 'red'}}>{errors.serviceName.message}</p>}
                </Form.Group>
                <Form.Group as={Col} md={7} className='mb-3' controlId='service-desc'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <Form.Label>Service description</Form.Label>
                    <span>0/1000</span>
                  </div>
                  <textarea
                    id='srvice-desc'
                    placeholder='Add a short description'
                    {...register('serviceDescription', {required: false, maxLength: 1000})}
                  ></textarea>
                  {errors.serviceDescription && (
                    <p style={{color: 'red'}}>{errors.serviceDescription.message}</p>
                  )}
                </Form.Group>
                {!isPersonal && (
                  <Form.Group as={Col} md={7} className='mb-3' controlId='service-available'>
                    <Form.Label>Service available for</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      {...register('serviceFor', {
                        required: false,
                      })}
                    >
                      <option value='everyone' selected>
                        Everyone
                      </option>
                      <option value='female'>Females Only</option>
                      <option value='male'>Males Only</option>
                    </Form.Select>
                  </Form.Group>
                )}
              </Row>
            </div>
            {!isPersonal && (
              <div className='online-bookings add-single-service-step'>
                <div className='form-heading'>
                  <h2 className='section-title'>Online booking</h2>
                  <p>
                    Enable online bookings, choose who the service is available for and add a short
                    description.
                  </p>
                </div>
                <div className='on-bookings-wrap'>
                  <Form.Check
                    type='switch'
                    id='custom-switch'
                    label='Enable online bookings'
                    {...register('onlineService', {required: false})}
                  />
                </div>
                <div className='on-bookings-wrap'>
                  <Form.Check
                    type='switch'
                    id='custom-switch'
                    label='Enable special deposit'
                    {...register('is_special_deposit')}
                  />
                </div>
                {watch('is_special_deposit') && (
                  <Form.Group
                    as={Col}
                    md={3}
                    className='price on-bookings-wrap pt-0'
                    controlId='formGridPrice'
                  >
                    <Form.Label>Special Deposit(%)</Form.Label>
                    <InputGroup className='Price'>
                      <FormControl
                        placeholder='0'
                        type='text'
                        min='1'
                        autoComplete='off'
                        {...register('special_deposit')}
                        onChange={(e: any) => {
                          inputValidation(e)
                        }}
                        onKeyDown={(event: any) => allowOnlyNumber(event)}
                      />
                    </InputGroup>
                    {
                      <p style={{color: 'red'}}>
                        {errorMessage ? errorMessage : errors.special_deposit?.message}
                      </p>
                    }
                  </Form.Group>
                )}
              </div>
            )}
            {!isPersonal ? (
              <div className='staff add-single-service-step'>
                <div className='form-heading'>
                  <div>
                    <h2 className='section-title'>Staff</h2>
                    <p>Assign staff to the service.</p>
                  </div>
                </div>
                <div className='select-staffs border-0'>
                  <Form.Group
                    className='select-all d-flex align-items-center mb-3'
                    id='formGridCheckbox'
                  >
                    <h5>Staffs</h5>
                    <div className='staff-count'>
                      <span>{allStaffs.length}</span>
                    </div>
                  </Form.Group>
                  <Row className='staffs-row'>
                    {allStaffs.map((staff) => {
                      return (
                        <>
                          <Form.Group
                            key={staff.id}
                            as={Col}
                            md={4}
                            className='staff d-flex mb-5 align-items-center'
                          >
                            <Form.Check
                              type='checkbox'
                              className='me-2'
                              value={staff.id}
                              {...register('staff', {required: true})}
                            />
                            <h5 className='staff-name'>{staff.name}</h5>
                          </Form.Group>
                        </>
                      )
                    })}
                    {/* <ErrorMessage
                                        errors={errors}
                                        name="staff"
                                        render={({ message }) => <p style={{ color: "red" }}>{message}</p>}
                                    /> */}
                  </Row>
                </div>
              </div>
            ) : (
              <div className='staff add-single-service-step'>
                <div className='form-heading'>
                  <div>
                    <h2 className='section-title'>Staff</h2>
                    <p>Assign staff to the service.</p>
                  </div>
                </div>
                <div className='select-staffs border-0'>
                  <Form.Group
                    className='select-all d-flex align-items-center mb-3'
                    id='formGridCheckbox'
                  >
                    <h5>Staffs</h5>
                    <div className='staff-count'>
                      <span>{allStaffs.length}</span>
                    </div>
                  </Form.Group>
                  <Row className='staffs-row'>
                    {allStaffs.map((staff) => {
                      return (
                        <>
                          <Form.Group
                            key={staff.id}
                            as={Col}
                            md={4}
                            className='staff d-flex mb-5 align-items-center'
                          >
                            <Form.Check
                              type='checkbox'
                              className='me-2'
                              value={allStaffs[0].id}
                              defaultChecked={allStaffs[0].id ? true : false}
                              {...register('staff')}
                            />
                            <h5 className='staff-name'>{staff.name}</h5>
                          </Form.Group>
                        </>
                      )
                    })}
                  </Row>
                </div>
              </div>
            )}

            <div className='pricing-duration add-single-service-step'>
              <div className='form-heading'>
                <h2 className='section-title'>Pricing and Duration</h2>
                <p>Add the pricing options and duration of the service.</p>
              </div>
              <div className='add-pricing'>
                {formValues.map((element, index) => (
                  <div className='Pricing-option1'>
                    <div className='add-price-tool d-flex align-items-center justify-content-between'>
                      <h3>Pricing option {index + 1}</h3>
                      {index ? (
                        <i
                          className='close-adv-price fa fa-times'
                          style={{cursor: 'pointer'}}
                          onClick={() => removeFormFields(index)}
                        ></i>
                      ) : null}
                    </div>
                    <Row className='pricing-option-row mb-3'>
                      <Form.Group as={Col} md={3} className='' controlId='pricing-name'>
                        <Form.Label>
                          Pricing name <span className='text-muted'>(optional)</span>
                        </Form.Label>
                        <Form.Control
                          type='text'
                          autoComplete='off'
                          placeholder='e.g. hair cut'
                          {...register(`pricing.${index}.pricingName`, {required: false})}
                        />
                      </Form.Group>
                      {!isPersonal ? (
                        <Form.Group as={Col} md={3} className='' controlId='formGridDuration'>
                          <Form.Label>Duration</Form.Label>
                          <Form.Select
                            aria-label='Default select example'
                            {...register(`pricing.${index}.duration`, {required: false})}
                          >
                            {timeDurationArray.map((itm) => (
                              <option key={itm.id} value={itm.id}>
                                {itm.text}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      ) : (
                        <Form.Group as={Col} md={3} className='' controlId='formGridDuration'>
                          <Form.Label>Duration</Form.Label>
                          <Form.Select
                            aria-label='Default select example'
                            {...register(`pricing.${index}.duration`)}
                          >
                            <option value={30} selected>
                              30 min
                            </option>
                          </Form.Select>
                        </Form.Group>
                      )}
                      <Form.Group as={Col} md={3} className='price' controlId='formGridPrice'>
                        <Form.Label>Price</Form.Label>
                        <InputGroup className='Price'>
                          <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                          <FormControl
                            defaultValue={0}
                            id='retailPrice'
                            placeholder='0.00'
                            type='text'
                            min='1'
                            autoComplete='off'
                            {...register(`pricing.${index}.price`)}
                            onKeyDown={(event: any) => allowOnlyNumber(event)}
                          />
                        </InputGroup>
                        {<p style={{color: 'red'}}>{errors.pricing?.[index]?.price?.message}</p>}
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md={3}
                        className='sp-price'
                        controlId='formGridSpecialprice'
                      >
                        <Form.Label>Special price</Form.Label>
                        {/* <span className="text-muted">(optional)</span> */}
                        <InputGroup className='Price'>
                          <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                          <FormControl
                            id='specialPrice'
                            defaultValue={0}
                            autoComplete='off'
                            placeholder='0.00'
                            min='0'
                            type='text'
                            {...register(`pricing.${index}.specialPrice`, {required: false})}
                            onKeyDown={(event: any) => allowOnlyNumber(event)}
                          />
                        </InputGroup>
                        {
                          <p style={{color: 'red'}}>
                            {errors.pricing?.[index]?.specialPrice?.message}
                          </p>
                        }
                      </Form.Group>
                    </Row>
                  </div>
                ))}
                <div className='add-pricing-btn-wrap'>
                  {!watch('group_service') ? (
                    <button
                      onClick={() => addFormFields()}
                      type='button'
                      className='add-price-btn btn btn-light d-flex align-items-center'
                    >
                      <i className='fa fa-plus-circle'></i>
                      <span>Add pricing option</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* <div className="sales-settings add-single-service-step">
                        <div className="form-heading">
                            <h2 className="section-title">Sales settings</h2>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="set-tax-rate border-0">
                                    <div className="inner-heading">
                                        <h3 className="">Set the tax rate</h3>
                                    </div>
                                    <div className="tax-rate-inner">
                                        <Form.Group className="mb-3" controlId="select-tax">
                                            <Form.Label>Tax <span className="text-muted">(Included in price)</span></Form.Label>
                                            <Form.Select aria-label="Default select example" {...register("tax", { required: false })}>
                                                <option value="no" selected> No tax</option>
                                                <option value="yes" selected>tax only</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="voucher-sales">
                                    <div className="inner-heading">
                                        <h3 className="">Voucher sales</h3>
                                    </div>
                                    <div className="enable-voucher-sales">
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Enable voucher sales"
                                            onClick={e => setVoucherSales(!voucherSales)}
                                        />
                                    </div>
                                    {voucherSales &&
                                        <Form.Group className="mb-3" controlId="voucher-expiry-period">
                                            <Form.Label>Voucher expiry period</Form.Label>
                                            <Form.Select aria-label="Default select example" {...register("voucherPeriod", { required: false })} >
                                                <option value="14 days">14 Days</option>
                                                <option value="1 month">1 Month</option>
                                                <option value="2 months">2 Month</option>
                                                <option value="3 months">3 Month</option>
                                                <option value="4 months">4 Month</option>
                                                <option value="6 months">6 Months</option>
                                                <option value="1 year">1 Year</option>
                                                <option value="2 years">2 Years</option>
                                                <option value="3 years">3 Years</option>
                                            </Form.Select>
                                        </Form.Group>
                                    }
                                </div>
                            </div>
                        </div>
                    </div> */}
          </Form>
          {/* @ts-ignore */}
          <AdvancedPricingModal handleClose={handleClose} show={show} />
          {/* @ts-ignore */}
          <ConflictDateTimeShowModal
            closeModal={closeModal}
            showModal={showModal}
            conflictData={conflictData}
            from={'Create'}
          />
        </section>
      </>
    )
}
export default AddSingleService;