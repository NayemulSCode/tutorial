import { useMutation, useQuery } from '@apollo/client';
import { disableCursor } from '@fullcalendar/react';
import React, { FC, useState, useEffect,useRef} from 'react';
import { Button, Modal, Form } from 'react-bootstrap-v5';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BUSINESS_SETTING, CLOSE_DATE_DELETE, CLOSE_DATE_UPDATE } from '../../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../../gql/Query';
import { IBusinessSetting } from '../../../../../../types';
import SetCloseDates from './SetCloseDates';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { KTSVG } from '../../../../../../_metronic/helpers';
import { date } from 'yup/lib/locale';
import { maybeDependOnExistenceOfEntity } from '@apollo/client/cache/inmemory/entityStore';
import CloseDateDeleteModal from '../../../../../modules/widgets/components/CloseDateDeleteModal'
import CalenderHolidayList from './CalenderHolidyList';

type Props = {
    className: string
}

const ClosingDates: React.FC<Props> = ({ className }) => {
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar();
    const [closedDays, setClosedDays] = useState<Array<any>>([]);
    const [editableData, setEditableData] = useState<any>({
        start_date: "",
        end_date: "",
        description: "",
        id: ""

    });
    const startDateRef = useRef<HTMLInputElement | null>(null);
    const endDateRef = useRef<HTMLInputElement | null>(null);
    const [isCloseDateEdit, setIsCloseDateEdit] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    // date edit states
    const [startDate, setStartDate] = useState<Date | null | undefined>(null);
    const [endDate, setEndDate] = useState<Date | null | undefined>(null);
    const [eLoading, setELoading] = useState<boolean>(false)
    const [description, setDescription] = useState<string>("");
    const [previousSDate, setPreviousSDate]= useState<any>();
    const [previousEDate, setPreviousEDate]= useState<any>();
    const [saveEnable, setSaveEnable] = useState<any>();
    const sDate = moment(startDate).format('DD-MMM-YYYY');
    const eDate = moment(endDate).format('DD-MMM-YYYY');
    useEffect(()=>{
        const S_Date = moment.unix(editableData.start_date).format('MM/DD/YYYY');
        const E_Date = moment.unix(editableData.end_date).format('MM/DD/YYYY');
        setPreviousSDate(S_Date);
        setStartDate(new Date(S_Date))
        setEndDate(new Date(E_Date))
        setPreviousEDate(E_Date)
        console.log(S_Date, E_Date)
    },[show])
    // date edit stat
    const [updateCloseDate] = useMutation(CLOSE_DATE_UPDATE,{
        refetchQueries: [{ query: BUSINESS_SETUP_Q }],
        awaitRefetchQueries: true,
    });
    const [businessSetting] = useMutation(BUSINESS_SETTING);
    const [deleteCloseDate] = useMutation(CLOSE_DATE_DELETE, {
        refetchQueries: [{ query: BUSINESS_SETUP_Q}],
        awaitRefetchQueries: true,
    });
    const { data: businessSetupData, loading: loading } = useQuery(BUSINESS_SETUP_Q);
    const [bSetting, setBSetting] = useState<IBusinessSetting>({
        online_booking: "",
        close_date: {
            id: "",
            business_id: 0,
            start_date: 0,
            end_date: 0,
            duration: 0,
            description: ""
        },
        invoice: {
            id: "",
            business_id: 0,
            header: "",
            footer: "",
            sub_header: "",
            invoice_no: "",
            invoice_prefix: ""
        }
    });
    useEffect(() => {
        if (businessSetupData) {
            setBSetting(businessSetupData?.businessSetting);
            setClosedDays(businessSetupData?.businessSetting?.close_date);
            // console.log("businessSetupData---", businessSetupData);
        }
    }, [businessSetupData]);
    const [deleteID, setDeleteID] = useState('')

    const [deleteModal, setDeleteModal] = useState(false)
    const openDeleteModal = (id: any) => {
      setDeleteID(id)
      setDeleteModal(true)
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const handleCloseDayDelete = (id: string) => {
        if (id) {
            deleteCloseDate({
                variables: {
                    id: id
                }
            }).then((data:any) => {
                if (data) {
                        enqueueSnackbar("Close date deleted", {
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
                }
            })
        }
    }
    const handleCloseDayEdit = (id: string)=>{
         setIsCloseDateEdit(true);
        const filterDate = closedDays.find((date)=> date.id === id)
        setEditableData(filterDate)
    }
    const handleShow = () => {setShow(true)};
    const handleClose = () => {setShow(false); setSaveEnable(false)};
    const handleSubmitDateChange=()=>{
        setELoading(true)
        // if (startDate !== null && startDate !== null){
            updateCloseDate({
                variables:{
                    id: editableData?.id,
                    start_date: sDate? sDate : moment(previousSDate).format('DD-MMM-YYYY') ,
                    end_date: eDate ? eDate : moment(previousEDate).format('DD-MMM-YYYY'),
                    description: description? description :  editableData?.description
                }
            }).then(({data})=>{
                if (data.updateCloseDate.status === 1){
                    enqueueSnackbar(data.updateCloseDate.message, {
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
                    handleClose();
                    setELoading(false)
                }
                if (data.updateCloseDate.status === 0) {
                    enqueueSnackbar(data.updateCloseDate.message, {
                        variant: 'warning',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        transitionDuration: {
                            enter: 300,
                            exit: 500
                        }
                    });
                    handleClose();
                    setELoading(false)
                }
                console.log("close date udpated", data)
            })
        // }
       
    }
    const confirmation = (status: any) => {
      if (status === 0) {
        console.log(status)
      }
      if (status === 1) {
        handleCloseDayDelete(deleteID)
      }
    }
    return (
      <div>
        <div className='d-flex flex-stack'>
          <div className='mr-1 mb-2'>
            <button
              onClick={() => {
                history.push('/business/settings')
              }}
              type='button'
              className='btn btn-lg btn-light-primary me-3'
              data-kt-stepper-action='previous'
            >
              {/* @ts-ignore */}
              <KTSVG path='/media/icons/duotune/arrows/arr063.svg' className='svg-icon-4 me-1' />
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <p>Closing Date List Loading....</p>
          ) : closedDays.length > 0 ? (
            <>
              <div className={`card ${className}`}>
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mb-1'>List Of Closed Dates</span>
                  </h3>
                  {/* @ts-ignore */}
                  <Button
                    className='btn-sm'
                    onClick={() => {
                      history.push('/setup/closed-date-set')
                    }}
                  >
                    New Closed Date
                  </Button>
                </div>
                <div className='card-body py-3'>
                  <div className='table-responsive'>
                    <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                      <thead>
                        <tr className='fw-bolder bg-light text-muted'>
                          <th className='ps-4'>No. of days</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closedDays.map((item) => {
                          return (
                            <tr>
                              <td className='ps-4'>{item.duration}</td>
                              <td>{moment.unix(item.start_date).format('ll')}</td>
                              <td>{moment.unix(item.end_date).format('ll')}</td>
                              <td>{item.description}</td>
                              <td>
                                <span
                                  style={{cursor: 'pointer', color: 'red'}}
                                  onClick={() => {
                                    openDeleteModal(item.id)
                                  }}
                                >
                                  Delete
                                </span>
                                <span
                                  style={{cursor: 'pointer', color: 'green', marginLeft: '5px'}}
                                  onClick={(e: any) => {
                                    handleCloseDayEdit(item.id)
                                    handleShow()
                                  }}
                                >
                                  Edit
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`card ${className}`}>
                <div className='card-header border-0 pt-5'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bolder fs-3 mb-1'>List Of Closed Dates</span>
                  </h3>
                  {/* @ts-ignore */}
                  <Button
                    className='btn-sm'
                    onClick={() => {
                      history.push('/setup/closed-date-set')
                    }}
                  >
                    New Closed Date
                  </Button>
                </div>
                <div className='card-body py-3'>
                  <div className='table-responsive'>
                    <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                      {/* @ts-ignore */}
                      <thead>
                        <tr className='fw-bolder bg-light text-muted'>
                          <th className='ps-4'>No. of days</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {/* calender holiday events */}
        {/* @ts-ignore */}
        <CalenderHolidayList />
        {isCloseDateEdit === true && (
          <>
            {/* @ts-ignore */}
            <Modal
              className=''
              dialogClassName='modal-90w'
              // aria-labelledby="contained-modal-title-vcenter"
              centered
              show={show}
              onHide={handleClose}
            >
              {/* @ts-ignore */}
              <Modal.Header closeButton>
                {/* @ts-ignore */}
                <Modal.Title>Edit Close Date</Modal.Title>
              </Modal.Header>
              {/* @ts-ignore */}
              <Modal.Body>
                <div className=''>
                  <div className='col-md-4 mb-3' ref={startDateRef}>
                    {/* @ts-ignore */}
                    <Form.Label>Start Date</Form.Label>
                    {/* @ts-ignore */}
                    <DatePicker
                      className='sales-datepicker'
                      placeholderText={`${previousSDate}`}
                      selected={startDate}
                      onChange={(date: any) => {
                        setStartDate(date)
                        setSaveEnable(true)
                      }}
                      dateFormat='dd/MM/yyyy'
                    />
                  </div>
                  <div className='col-md-4 mb-3' ref={endDateRef}>
                    {/* @ts-ignore */}
                    <Form.Label>End Date</Form.Label>
                    {/* @ts-ignore */}
                    <DatePicker
                      className='sales-datepicker'
                      placeholderText={`${previousEDate}`}
                      selected={endDate}
                      onChange={(date: any) => {
                        setEndDate(date)
                        setSaveEnable(true)
                      }}
                      dateFormat='dd/MM/yyyy'
                    />
                  </div>
                </div>
                {/* @ts-ignore */}
                <Form.Group className='mb-5 col-md-8'>
                  {/* @ts-ignore */}
                  <Form.Label>Description</Form.Label>
                  {/* @ts-ignore */}
                  <Form.Control
                    type='text'
                    name='description'
                    placeholder='e.g. public holiday'
                    defaultValue={editableData?.description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                  />
                </Form.Group>

                <div className='d-flex'>
                  {/* @ts-ignore */}
                  <Button
                    onClick={() => {
                      handleClose()
                    }}
                    className='btn btn-light me-4'
                  >
                    Cancel
                  </Button>
                  {saveEnable === true ? (
                    //  @ts-ignore
                    <Button
                      id='kt_sign_in_submit'
                      onClick={() => {
                        handleSubmitDateChange()
                      }}
                      className=' submit-btn'
                      disabled={eLoading}
                    >
                      {!eLoading && <span className='indicator-label'>Save</span>}
                      {eLoading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>
                  ) : (
                    <button disabled className='btn btn-light'>
                      Save
                    </button>
                  )}
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
        {/* @ts-ignore */}
        <CloseDateDeleteModal
          closeDeleteModal={closeDeleteModal}
          deleteModal={deleteModal}
          confirmation={confirmation}
        />
      </div>
    )
}

export default ClosingDates
