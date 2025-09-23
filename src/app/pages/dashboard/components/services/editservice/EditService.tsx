import { useMutation, useQuery } from '@apollo/client';
import React, { useState, FC, FocusEvent, useEffect, MouseEvent, Fragment } from 'react'
import { Collapse, Form, Row, Col, InputGroup, FormControl, Button, Tabs, Tab, TabContainer } from 'react-bootstrap-v5';
import { useParams, Link, useHistory } from 'react-router-dom'
import { SERVICE_UPDATE, SYSTEM_LOG } from '../../../../../../gql/Mutation';
import { ALL_STAFF_INFO, ALL_TREATEMENT_TYPE, GET_ALL_SERVICES, PROFILE_INFORMATION, SERVICE_CATEGORIES, SINGLE_SERVICE } from '../../../../../../gql/Query';
import { allowOnlyNumber, currency, occurrence, preventWhiteSpace, timeDurationArray, frequency as frequencyItem, systemLogPayload } from '../../../../../modules/util';
import { ConflictData, GroupTimeSlot, IEditService } from '../../../../../modules/generates.type';
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage';
import DateTimeForm from '../addservices/DateTimeForm';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import ConflictDateTimeShowModal from '../../../../../modules/widgets/components/ConflictDateTimeShowModal'

import GroupTimeSlotForm from '../addservices/GroupTimeSlotForm';
import moment from 'moment';
import { print } from 'graphql';
type ServiceParams = {
    id: string;
};
interface WeekTime {
  date: string;
  day: string;
  time: string;
  sameOthers?: boolean;
}
interface DateTime {
  date: string;
  day: string;
  time: string;
}

const EditService: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const {id} = useParams<ServiceParams>()
  const history = useHistory()
  const {showToast} = useTostMessage()
  const [treatmentType, setTreatmentType] = useState<Array<any>>([])
  const [serviceCat, setServiceCat] = useState<Array<any>>([])
  const [allStaffs, setAllStaffs] = useState<Array<any>>([])
  const [service, setService] = useState<IEditService>({
    name: '',
    tax: '',
    staffs: [],
    description: '',
    service_category_id: 0,
    service_available_for: '',
    voucher_sale: '',
    is_voucher: false,
    is_personal: false,
    is_group: false,
    is_course: false,
    service_group: {
      client_per_class: 0,
      session_per_course: 0,
      schedule_type: '',
      schedules: '',
      occurrences: 0,
      frequency: '',
      enroll_date: '',
      start_date: '',
    },
    special_deposit: 0.0,
  })
  const [voucherSales, setVoucherSales] = useState<boolean>(false)
  const [onlineBooking, setOnlineBooking] = useState<boolean>(false)
  const [selectedStaffs, setSelectedStaffs] = useState<Array<any>>([])
  const [staffs, setStaffs] = useState<Array<any>>([])
  const [formValues, setFormValues] = useState<Array<any>>([])
  const [updateService] = useMutation(SERVICE_UPDATE);
  const SERVICE_UPDATE_STRING = print(SERVICE_UPDATE)
  const [system_log] = useMutation(SYSTEM_LOG)
  const [isGroup, SetIsGroup] = useState<boolean>(false)
  const [isCourse, SetIsCourse] = useState<boolean>(false)
  const [weekTimes, setWeekTimes] = useState<WeekTime[]>([])
  const [dateTimes, setDateTimes] = useState<DateTime[]>([])
  const [occurrenceType, setOccurrenceType] = useState<string>('')
  const [groupType, setGroupType] = useState<string>('')
  const [groupTimeSlots, setGroupTimeSlots] = useState<GroupTimeSlot[]>([])
  const [specialDeposit, setSpecialDeposit] = useState<boolean>(false)
  const [showModal, setShowModal] = useState(false)
  const [conflictData, setConflictData] = useState<ConflictData[]>([])
  const {data: accountData} = useQuery(PROFILE_INFORMATION)
  const {
    data: singleServiceData,
    error: singleServiceError,
    loading: singleServiceLoading,
  } = useQuery(SINGLE_SERVICE, {
    variables: {
      id: +id,
    },
    fetchPolicy: 'network-only',
  })
  const {data: treatmentTpes, error: treatmentTypeError} = useQuery(ALL_TREATEMENT_TYPE, {
    variables: {
      type: 'select',
      count: 10,
      page: 1,
    },
  })
  const {data: serviceCatData} = useQuery(SERVICE_CATEGORIES, {
    variables: {
      type: '',
      count: 10,
      page: 1,
    },
  })
  const {data: allStaff} = useQuery(ALL_STAFF_INFO, {
    variables: {
      count: 10,
      page: 1,
    },
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (treatmentTpes) {
      // console.log(treatmentTpes)
      setTreatmentType(treatmentTpes.treatmentTypes.data)
    }
    if (treatmentTypeError) {
      console.log(treatmentTypeError)
    }
  }, [treatmentTpes])
  useEffect(() => {
    if (serviceCatData) {
      setServiceCat(serviceCatData.serviceCategories.data)
      // console.log(serviceCatData.serviceCategories.data)
    }
  }, [serviceCatData])
  useEffect(() => {
    if (allStaff) {
      setAllStaffs(allStaff.staffs.data)
    }
  }, [allStaff])
  useEffect(() => {
    if (singleServiceData) {
      setService(singleServiceData.service)
      setOnlineBooking(singleServiceData.service.enable_online_booking)
      SetIsGroup(singleServiceData.service.is_group)
      SetIsCourse(singleServiceData.service.is_course)
      setVoucherSales(singleServiceData.service.is_voucher)
      setSelectedStaffs(singleServiceData.service.staffs)
      setStaffs(singleServiceData.service.staffs)
      setFormValues(
        singleServiceData.service.service_pricings.map((item: any) => ({
          ...item,
          pricingName: item?.pricing_name,
          specialPrice: item?.special_price,
        }))
      )
      setSpecialDeposit(Boolean(singleServiceData.service.special_deposit))
      // need to set here weekTimes and dateTimes state
      if (singleServiceData.service.service_group?.schedule_type === 'week') {
        setWeekTimes(singleServiceData.service.service_group?.schedules.map((item:any)=>({
          day: item.day,
          date: item.date,
          time: item.time,
          sameOthers: item.sameOthers?? false
        })))
        setOccurrenceType('week');
        setGroupType(singleServiceData.service.service_group?.group_type);
      }
      if (singleServiceData.service.service_group?.schedule_type === 'date') {
        setDateTimes(singleServiceData.service.service_group?.schedules.map((item:any)=>({
          day: item.day,
          date: item.date,
          time: item.time,
          sameOthers: item.sameOthers ?? false
        })))
        setOccurrenceType('date');
        setGroupType(singleServiceData.service.service_group?.group_type);
      }
      // for group
      if (
        singleServiceData.service.service_group?.group_type === 'repeated' &&
        !singleServiceData.service?.is_course
      ) {
        setGroupTimeSlots(singleServiceData.service.service_group?.schedules)
        setGroupType(singleServiceData.service.service_group?.group_type)
      }
      if (
        singleServiceData.service.service_group?.group_type === 'single' &&
        !singleServiceData.service?.is_course
      ) {
        setGroupTimeSlots(singleServiceData.service.service_group?.schedules)
        setGroupType(singleServiceData.service.service_group?.group_type)
      }
    }
  }, [singleServiceData])
  // Add pricing options
  const {
    client_per_class,
    session_per_course,
    schedule_type,
    schedules,
    frequency,
    occurrences,
    enroll_date,
    start_date,
  } = service.service_group || {}
  let addFormFields = () => {
    const nObj = {duration: '', priceType: '', price: '', specialPrice: '', pricingName: ''}
    const nArr = formValues.concat(nObj)
    setFormValues(nArr)
  }

  let removeFormFields = (i: number) => {
    let newFormValues = [...formValues]
    newFormValues.splice(i, 1)
    setFormValues(newFormValues)
  }
  console.log('set state for eidt', service)

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setService((prevService) => {
      if (name.startsWith('service_group.')) {
        // Property is nested under service_group
        const nestedPropertyName = name.split('.')[1]
        return {
          ...prevService,
          service_group: {
            ...prevService.service_group,
            [nestedPropertyName]: value,
          },
        }
      } else {
        // Property is outside service_group
        return {
          ...prevService,
          [name]: value,
        }
      }
    })
  }
  const handleSelectUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target
    setService((prevService) => {
      if (name.startsWith('service_group.')) {
        // Property is nested under service_group
        const nestedPropertyName = name.split('.')[1]
        return {
          ...prevService,
          service_group: {
            ...prevService.service_group,
            [nestedPropertyName]: value,
          },
        }
      } else {
        // Property is outside service_group
        return {
          ...prevService,
          [name]: value,
        }
      }
    })
  }
  const handleTextareaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target
    setService((preValue) => {
      return {
        ...preValue,
        [name]: value,
      }
    })
  }
  const handleSingleCheck = (id: any) => {
    let selected = staffs
    let find = selected.indexOf(id)

    if (find > -1) {
      selected.splice(find, 1)
    } else {
      selected.push(id)
    }
    setStaffs(selected)
    setSelectedStaffs(selected)
  }
  // only for pricing update
  const handlePricingUpdate = (e: any, index: number) => {
    const {name, value} = e.target
    let values = formValues
    console.log(name, value, index, values)
    for (let itIndex in values) {
      if (+itIndex === index) {
        values[index][name] = value
        console.log(values[index][name])
      }
    }
    setFormValues(values)
  }
  const handleSelectPricingUpdate = (e: any, index: number) => {
    const {name, value} = e.target
    let values = formValues
    console.log(name, value, index, values)
    for (let itIndex in values) {
      if (+itIndex === index) {
        values[index][name] = value
        console.log(values[index][name])
      }
    }
    setFormValues(values)
  }
  const [isOk, setIsOk] = useState(false)
  const checkPriceAvailability = () => {
    setLoading(true)
    formValues.map((itm) => {
      console.log(itm)
      if (itm.price == '' || itm.price == 0) {
        showToast('Service price required', 'error')
        setLoading(false)
      } else {
        setLoading(false)
        setIsOk(true)
      }
    })
  }
  // end pricing update

  // time formater
  const formatTime = (hours: number, minutes: number) => {
    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    return `${formattedHours}:${formattedMinutes}`
  }
  const handleUpdateService = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true);
    const personal_service_input = {
      id: +id,
      service_category_id: +service.service_category_id,
      name: service.name,
      description: service.description,
      service_available_for: service.service_available_for,
      enable_online_booking: onlineBooking,
      staffs: staffs ?? [],
      service_pricings: formValues
        ? formValues.map((item) => ({
            id: item.id ?? '',
            pricingName: item.pricingName ?? '',
            duration: parseInt(item.duration),
            price: item.price.toString(),
            specialPrice: item.specialPrice > 0 ? item.specialPrice.toString() : '',
          }))
        : [],
      is_voucher: voucherSales,
      tax: service.tax,
      voucher_sale: voucherSales ? service.voucher_sale : '',
      is_personal: service?.is_personal,
      is_group: false,
      client_per_class: 0,
      is_course: false,
      session_per_course: 0,
      schedule_type: '',
      schedules: '',
      // 2nd level
      start_date: '',
      enroll_date: '',
      group_type: '',
      special_deposit: '',
      frequency: '',
      occurrences: 0,
    }
    const service_input = {
      id: +id,
      service_category_id: +service.service_category_id,
      name: service.name,
      description: service.description,
      service_available_for: service.service_available_for,
      enable_online_booking: onlineBooking,
      staffs: staffs ?? [],
      service_pricing: formValues
        ? formValues.map((item) => ({
            id: item.id ?? '',
            pricingName: item.pricingName ?? '',
            duration: parseInt(item.duration),
            price: item.price.toString(),
            specialPrice: item.specialPrice > 0 ? item.specialPrice.toString() : '',
          }))
        : [],
      is_voucher: voucherSales,
      tax: service.tax,
      voucher_sale: voucherSales ? service.voucher_sale : '',
      is_personal: service?.is_personal,
      is_group: isGroup ? isGroup : false,
      is_course: isCourse ? isCourse : false,
      client_per_class: isGroup ? +service.service_group?.client_per_class : 0,
      session_per_course: isCourse ? +service.service_group?.session_per_course : 0,
      schedule_type: occurrenceType,
      schedules:
        occurrenceType === 'date'
          ? dateTimes
          : occurrenceType === 'week'
          ? weekTimes
          : isGroup
          ? groupTimeSlots.map((slot) => ({
              day: '',
              date: '',
              time: formatTime(slot.hours, slot.minutes),
            }))
          : [],
      // 2nd level propertices added
      start_date: moment(service.service_group?.start_date).format('YYYY-MM-DD'),
      enroll_date: service.service_group?.enroll_date
        ? moment(service.service_group?.enroll_date).format('YYYY-MM-DD')
        : '',
      group_type: groupType,
      special_deposit:
        specialDeposit && service.special_deposit > 0 ? `${service.special_deposit}` : '',
      frequency: groupType === 'repeated' ? service.service_group.frequency : '',
      occurrences: groupType === 'repeated' ? +service.service_group.occurrences : 0,
    }
    if(service.is_personal){
      await updateService({
        variables: service_input,
      })
        .then(({data}) => {
          if (data) {
            showToast(data.updateService.message, 'success')
            setLoading(false)
            history.push('/services/list')
          }
        })
        .catch((e) => {
          setLoading(false)
          showToast('Service update failed', 'error')
          system_log({
            variables: {
              ...systemLogPayload,
              api: SERVICE_UPDATE_STRING,
              type: 'service-update-error',
              body: JSON.stringify(service_input),
              exception: JSON.stringify(e),
            },
          })
        })
    }else{
      if(formValues[0].price == "" && service?.is_personal === false) {
            setLoading(false);
            showToast("Service price required", 'error');
      }
      else if(parseFloat(formValues[0].price) <= parseFloat(formValues[0].specialPrice) && service?.is_personal === false) {
        setLoading(false);
          showToast("The special price is higher than the price.",'error');
      }
      if (formValues[0].price != "" && (parseFloat(formValues[0].price) > parseFloat(formValues[0].specialPrice ?? 0))) {
        if(isGroup){
          if(!service.service_group?.client_per_class){
            setLoading(false)
            showToast('Guest per class is required', 'error')
          }else if(!service.service_group?.start_date){
            setLoading(false)
            showToast('Start date is required', 'error')
        }else{
            await updateService({
              variables: service_input,
              refetchQueries: [{query: GET_ALL_SERVICES}],
          })
          .then(({data}) => {
            const { status, message } = data.updateService;
            if (status === 0) {
              const conflictMessage = JSON.parse(data.updateService?.data)
              if(!!conflictMessage?.length){
                setConflictData(conflictMessage);
                setShowModal(true);
              }
              system_log({
                variables: {
                  ...systemLogPayload,
                  api: SERVICE_UPDATE_STRING,
                  type: 'service-update-error',
                  body: JSON.stringify(service_input),
                  response: JSON.stringify(message),
                },
              });
              showToast(message, 'error');
              setLoading(false);
            }
            if (status === 1) {
              showToast(message, 'success')
              setLoading(false)
              history.push('/services/list')
            }
          })
          .catch((e) => {
            setLoading(false)
            showToast('Service update failed', 'error');
            system_log({
              variables: {
                ...systemLogPayload,
                api: SERVICE_UPDATE_STRING,
                type: 'service-update-error',
                body: JSON.stringify(service_input),
                exception: JSON.stringify(e),
              },
            })
          })
        }
        }else{
        await updateService({
              variables: service_input,
              refetchQueries: [{query: GET_ALL_SERVICES}],
          })
          .then(({data}) => {
            const { status, message } = data.updateService;
            if (status === 0) {
              const conflictMessage = JSON.parse(data.updateService?.data)
              if(!!conflictMessage?.length){
                setConflictData(conflictMessage);
                setShowModal(true);
              }
              system_log({
                variables: {
                  ...systemLogPayload,
                  api: SERVICE_UPDATE_STRING,
                  type: 'service-update-error',
                  body: JSON.stringify(service_input),
                  response: JSON.stringify(message),
                },
              })
              showToast(message, 'error')
              setLoading(false)
            }
            if (status === 1) {
              showToast(message, 'success')
              setLoading(false)
              history.push('/services/list')
            }
          })
          .catch((e) => {
            setLoading(false)
            showToast('Service update failed', 'error')
            system_log({
              variables: {
                ...systemLogPayload,
                api: SERVICE_UPDATE_STRING,
                type: 'service-update-error',
                body: JSON.stringify(service_input),
                exception: JSON.stringify(e),
              },
            })
          })
        }
      }
    }
  }
  const closeModal = () => setShowModal(false)
  const userData: any = localStorage.getItem('partner')
  const parseData = JSON.parse(userData)
  const countryName = parseData?.business_info?.country
  return (
    <>
      <section id='add-single-service' className='ptc'>
        {/* @ts-ignore */}
        <Form>
          <div className='toolbar'>
            <Link className='close-btn' to='/services/list'>
              <i className='fas fa-times'></i>
            </Link>
            <h2 className='page-title mb-0'>Update service</h2>
            <button
              onClick={handleUpdateService}
              type='submit'
              id='kt_sign_in_submit'
              className='submit-btn save-btn'
              disabled={loading}
            >
              {!loading && <span className='indicator-label'>Update</span>}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Updating...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
          <div className='basic-info add-single-service-step'>
            <div className='form-heading'>
              <h2 className='section-title'>Updatable info</h2>
              <p>Update service.</p>
            </div>
            <Row className='basic-info-form'>
              {service?.is_personal ? (
                <Form.Group as={Col} md={7} className='mb-3' controlId='service-category'>
                  <Form.Label>Service category</Form.Label>
                  <Form.Select
                    aria-label='Default select example'
                    name='service_category_id'
                    value={service.service_category_id}
                    onChange={handleSelectUpdate}
                    disabled={service?.is_personal ? true : false}
                  >
                    {serviceCat.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <Form.Group as={Col} md={7} className='mb-3' controlId='service-category'>
                  <Form.Label>Service category</Form.Label>
                  <Form.Select
                    aria-label='Default select example'
                    name='service_category_id'
                    value={service.service_category_id}
                    onChange={handleSelectUpdate}
                  >
                    {/* <option value="" disabled selected> Choose service category</option> */}
                    {serviceCat.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              {!service.is_personal && (
                <Fragment>
                  {accountData &&
                  accountData?.profileInformation?.business_info?.group_service == true ? (
                    <>
                      <div className='row'>
                        <Form.Group as={Col} md={2} className='mb-4'>
                          <Form.Check
                            type='switch'
                            name='is_group'
                            id='custom-switch'
                            label='Class Service'
                            checked={isGroup ? true : false}
                            onClick={() => SetIsGroup(!isGroup)}
                            className='group_switch'
                          />
                        </Form.Group>
                        {isGroup && (
                          <>
                            <Form.Group as={Col} md={3} className='mb-4'>
                              <Form.Label>Guests Per Class</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='number of guests'
                                name='service_group.client_per_class'
                                defaultValue={client_per_class}
                                onChange={handleUpdate}
                                onKeyDown={(event: any) => allowOnlyNumber(event)}
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={1} className='mb-4'>
                              <Form.Check
                                type='switch'
                                name='is_course'
                                id='custom-switch2'
                                label='Course'
                                checked={isCourse ? true : false}
                                onClick={() => SetIsCourse(!isCourse)}
                                className='group_switch'
                              />
                            </Form.Group>

                            {isCourse && (
                              <Form.Group as={Col} md={3} className='mb-4'>
                                <Form.Label>Sessions Per Course</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='number of sessions'
                                  name='service_group.client_per_class'
                                  defaultValue={session_per_course}
                                  onChange={handleUpdate}
                                  onKeyDown={(event: any) => allowOnlyNumber(event)}
                                />
                              </Form.Group>
                            )}
                            <div className='row align-items-center mb-3'>
                              <Form.Label className='form-label'>Start Date:</Form.Label>
                              <div className='col-md-4'>
                                <Form.Control
                                  type='date'
                                  name='service_group.start_date'
                                  defaultValue={start_date}
                                  onChange={handleUpdate}
                                  min={moment().format('YYYY-MM-DD')}
                                />
                              </div>
                            </div>
                            {isGroup && isCourse && (
                              <div className='row align-items-center mb-3'>
                                <Form.Label className='form-label'>Enrolment Last Date:</Form.Label>
                                <div className='col-md-4'>
                                  <Form.Control
                                    type='date'
                                    name='service_group.enroll_date'
                                    defaultValue={enroll_date}
                                    onChange={handleUpdate}
                                    min={moment().format('YYYY-MM-DD')}
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
                        {!isCourse && (
                          <>
                            <Form.Group as={Col} md={3}>
                              <Form.Check
                                type='switch'
                                name='service_group.group_type'
                                id={`repeated-group`} // Ensure unique IDs
                                label='Repeated Class Session'
                                className='single_group_switch'
                                checked={groupType === 'repeated' ? true : false}
                                onClick={(e: any) => {
                                  const {checked} = e.target
                                  if (checked) {
                                    setGroupType('repeated')
                                  } else {
                                    setGroupType('single')
                                  }
                                }}
                              />
                            </Form.Group>
                            {groupType === 'repeated' && (
                              <>
                                <Form.Group as={Col} sm={3} className=''>
                                  <Form.Label>Frequency</Form.Label>
                                  <Form.Select
                                    name='service_group.frequency'
                                    defaultValue={frequency}
                                    onChange={handleSelectUpdate}
                                  >
                                    <option value='' disabled selected>
                                      Choose
                                    </option>
                                    {frequencyItem &&
                                      frequencyItem.map((frequency) => (
                                        <option key={frequency.id} value={frequency.value}>
                                          {frequency.name}
                                        </option>
                                      ))}
                                  </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} sm={3} className=''>
                                  <Form.Label>Occurrences</Form.Label>
                                  <Form.Select
                                    name='service_group.occurrences'
                                    defaultValue={occurrences}
                                    onChange={handleSelectUpdate}
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
                          </>
                        )}
                      </div>
                    </>
                  ) : null}

                  {/* group event */}
                  {isGroup && !isCourse && (
                    <Fragment>
                      <GroupTimeSlotForm
                        groupTimeSlots={groupTimeSlots}
                        setGroupTimeSlots={setGroupTimeSlots}
                      />
                    </Fragment>
                  )}
                  {/* course schedule */}
                  {isCourse && (
                    <Form.Group className='' controlId='include-service'>
                      <Form.Label className='pb-3'>Schedule</Form.Label>

                      <div className='radio-buttons'>
                        <label htmlFor='occurrence-field1' className='custom-radio'>
                          <input
                            type='radio'
                            name='occurrence'
                            id='occurrence-field1'
                            defaultChecked={schedule_type === 'date' ? true : false}
                            onChange={() => setOccurrenceType('date')}
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
                            type='radio'
                            name='occurrence'
                            defaultChecked={schedule_type === 'week' ? true : false}
                            onChange={() => setOccurrenceType('week')}
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
                      {Boolean(session_per_course) && (
                        <DateTimeForm
                          numberOfFields={+session_per_course}
                          occurrence={occurrenceType}
                          setDateTimes={setDateTimes}
                          dateTimes={dateTimes}
                          setWeekTimes={setWeekTimes}
                          weekTimes={weekTimes}
                          startDate={start_date}
                        />
                      )}
                    </Form.Group>
                  )}
                </Fragment>
              )}
              <Form.Group as={Col} md={7} className='mb-3' controlId='service-name'>
                <Form.Label>Service name</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  defaultValue={service.name}
                  onChange={handleUpdate}
                  onKeyDown={(e: any) => {
                    preventWhiteSpace(e)
                  }}
                />
              </Form.Group>
              {/* <Form.Group as={Col} md={7} className="mb-3" controlId="treatment-type">
                      <Form.Label>Treatment type</Form.Label>
                      <Form.Select
                          className="treatment-input"
                          name="treatment_type_id"
                          value={service.treatment_type_id}
                          onChange={handleSelectUpdate}
                      >
                          {
                              treatmentType.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
                          }
                      </Form.Select>

                  </Form.Group> */}
              <Form.Group as={Col} md={7} className='mb-3' controlId='service-desc'>
                <div className='d-flex align-items-center justify-content-between'>
                  <Form.Label>Service description</Form.Label>
                  <span>0/1000</span>
                </div>
                <textarea
                  id='srvice-desc'
                  value={service.description}
                  name='description'
                  placeholder='Add a short description'
                  onChange={handleTextareaUpdate}
                ></textarea>
              </Form.Group>
              {!service?.is_personal && (
                <Form.Group as={Col} md={7} className='mb-3' controlId='service-available'>
                  <Form.Label>Service available for</Form.Label>
                  <Form.Select
                    aria-label='Default select example'
                    name='service_available_for'
                    value={service.service_available_for}
                    onChange={handleSelectUpdate}
                  >
                    <option value='everyone'>Everyone</option>
                    <option value='female'>Females Only</option>
                    <option value='male'>Males Only</option>
                  </Form.Select>
                </Form.Group>
              )}
            </Row>
          </div>
          {!service?.is_personal && (
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
                  checked={onlineBooking ? true : false}
                  onClick={() => {
                    setOnlineBooking(!onlineBooking)
                  }}
                />
              </div>
              {/* special deposite */}
              <div className='on-bookings-wrap'>
                <Form.Check
                  type='switch'
                  id='custom-switch'
                  label='Enable special deposit'
                  name='special_deposit'
                  checked={specialDeposit ? true : false}
                  onClick={() => {
                    setSpecialDeposit(!specialDeposit)
                  }}
                />
              </div>
              {specialDeposit && (
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
                      name='special_deposit'
                      value={service.special_deposit}
                      onChange={handleUpdate}
                      onKeyDown={(event: any) => allowOnlyNumber(event)}
                    />
                  </InputGroup>
                </Form.Group>
              )}
            </div>
          )}

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
                  <span>{allStaffs?.length}</span>
                </div>
              </Form.Group>
              <Row className='staffs-row'>
                {allStaffs.length > 0 &&
                  allStaffs.map((staff) => {
                    return (
                      service?.staffs?.length > 0 && (
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
                              defaultValue={staff.id}
                              name='staffs'
                              defaultChecked={
                                selectedStaffs?.includes(parseInt(staff.id)) ? true : false
                              }
                              onChange={(e: any) => {
                                handleSingleCheck(parseInt(staff.id))
                              }}
                            />
                            <h5 className='staff-name'>{staff.name}</h5>
                          </Form.Group>
                        </>
                      )
                    )
                  })}
              </Row>
            </div>
          </div>

          <div className='pricing-duration add-single-service-step'>
            <div className='form-heading'>
              <h2 className='section-title'>Pricing and Duration</h2>
              <p>Add the pricing options and duration of the service.</p>
            </div>
            <div className='add-pricing'>
              {formValues?.map((element: any, index) => {
                return (
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
                          name='pricingName'
                          onChange={(e) => {
                            handlePricingUpdate(e, index)
                          }}
                          defaultValue={element.pricingName}
                          placeholder='e.g. hair cut'
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={3} className='' controlId='formGridDuration'>
                        <Form.Label>Duration</Form.Label>
                        <Form.Select
                          aria-label='Default select example'
                          name='duration'
                          defaultValue={element.duration}
                          onChange={(e) => {
                            handleSelectPricingUpdate(e, index)
                          }}
                          disabled={service?.is_personal ? true : false}
                        >
                          {timeDurationArray.map((itm) => (
                            <option key={itm.id} value={itm.id}>
                              {itm.text}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      {/* <Form.Group as={Col} md={3} className="" controlId="formGridPriceType">
                                                <Form.Label>Price type</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    name="priceType"
                                                    defaultValue={element.priceType}
                                                    onChange={(e) => { handleSelectPricingUpdate(e, index) }}
                                                >
                                                    <option value="Free">Free</option>
                                                    <option value="Fixed">Fixed</option>
                                                    <option value="From">From</option>
                                                </Form.Select>
                                            </Form.Group> */}
                      <Form.Group as={Col} md={3} className='price' controlId='formGridPrice'>
                        <Form.Label>Price</Form.Label>
                        <InputGroup className='Price'>
                          <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                          <FormControl
                            id='retailPrice'
                            name='price'
                            min='1'
                            onChange={(e) => {
                              handleSelectPricingUpdate(e, index)
                            }}
                            defaultValue={element.price}
                            type='text'
                            step='.01'
                            required
                            onKeyPress={(event: any) => {
                              if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
                                event.preventDefault()
                              }
                            }}
                          />
                        </InputGroup>
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
                            name='specialPrice'
                            min='0'
                            onChange={(e) => {
                              handlePricingUpdate(e, index)
                            }}
                            defaultValue={element.specialPrice}
                            type='text'
                            step='.01'
                            onKeyPress={(event: any) => {
                              if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
                                event.preventDefault()
                              }
                            }}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                    {/* <Row className="pricing-name">
                                            <Form.Group as={Col} md={6} className="" controlId="pricing-name">
                                                <Form.Label>Pricing name <span className="text-muted">(optional)</span></Form.Label>
                                                <Form.Control type="text" name="pricingName" onChange={(e) => { handlePricingUpdate(e, index) }} defaultValue={element.pricingName} placeholder="e.g. hair cut" />
                                            </Form.Group>
                                        </Row> */}
                  </div>
                )
              })}
              <div className='add-pricing-btn-wrap'>
                {!isGroup ? (
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
                                            <Form.Select aria-label="Default select example"
                                                name="tax"
                                                value={service.tax}
                                                onChange={handleSelectUpdate}
                                            >
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
                                            checked={voucherSales ? true : false}
                                            onClick={e => setVoucherSales(!voucherSales)}
                                        />
                                    </div>
                                    {voucherSales &&
                                        <Form.Group className="mb-3" controlId="voucher-expiry-period">
                                            <Form.Label>Voucher expiry period</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                name="voucher_sale"
                                                value={service.voucher_sale}
                                                onChange={handleSelectUpdate}
                                            >
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
        <ConflictDateTimeShowModal
          closeModal={closeModal}
          showModal={showModal}
          conflictData={conflictData}
          from={'Update'}
        />
      </section>
    </>
  )
}
export default EditService;