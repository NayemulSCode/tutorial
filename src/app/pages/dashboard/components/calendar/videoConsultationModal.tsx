import React, { FC, useState, useEffect, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap-v5";
import { useSnackbar } from 'notistack';
import moment from 'moment'
import { AppContext } from '../../../../../../src/context/Context';
import { IUsers } from "../../../../../types";
import {  PARTNER_TIME_SLOT, SINGLE_APPOINTMENT, STAFF_WISE_APPOINTMENT } from '../../../../../gql/Query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { APPOINTMENT_STATUS_UPDATE } from '../../../../../gql/Mutation';
type Props = {
    isUpdateAppointment: boolean;
    handleClose: () => void
    appointmentId: any;
}

const VideoConsultationModal: FC<Props> = ({ appointmentId, isUpdateAppointment, handleClose }) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState<boolean>(false)
    const [loading2, setLoading2] = useState<boolean>(false)
    const [appointmentDate, setAppointmentDate] = useState<any>()
    const [appointmentDateChange, setAppointmentDateChange] = useState<any>()
    const [appointmentTimeChange, setAppointmentTimeChange] = useState<any>()
    const [timeSlots, setTimeSlots] = useState<Array<any>>([])

    const { data: appointmentDetails, error: appointmentDetailsError, loading: appointmentDetailsLoading, refetch: singleapppointFetch } = useQuery(SINGLE_APPOINTMENT, {
        variables: {
            id: +appointmentId
        }
    })

    const [myAppointment, setMyAppointment] = useState<any>();
    const [myAppointmentDetail, setMyAppointmentDetail] = useState<any>();
    const [statusUpdateForAppointment] = useMutation(APPOINTMENT_STATUS_UPDATE,{
        refetchQueries: [{
            query: STAFF_WISE_APPOINTMENT, variables: {
                staff_id: 0,
                chair_id: 0
            }
        }],
        awaitRefetchQueries: true,
    });

    const handleDateFormater = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newCdate = moment(value).format('LL')
        setAppointmentDateChange(newCdate)
        // setAppointmentDate(newCdate)
    }
    const handleTimeFormater = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAppointmentTimeChange(value)
        // console.log('handleTimeFormater',value, )
    }
    const convertedDate = moment(appointmentDateChange).format("DD-MM-YYYY")

    const { data: timeSlotData } = useQuery(PARTNER_TIME_SLOT);
    useEffect(() => {
        if (timeSlotData) {
            setTimeSlots(timeSlotData.partnerTimeSlots)
        }
    }, [timeSlotData]);

    useEffect(() => {
        singleapppointFetch()
        if (appointmentDetails) {
            // console.log("appt detail: ", appointmentDetails)
            setMyAppointment(appointmentDetails.appointment)
            setMyAppointmentDetail(appointmentDetails.appointment?.appointment_detail)
            setAppointmentDate(moment.unix(appointmentDetails?.appointment?.date).utcOffset('+0000').format('YYYY-MM-DD HH:mm'));
            setAppointmentDateChange(moment.unix(appointmentDetails?.appointment?.date).format('YYYY-MM-DD'));
            setAppointmentTimeChange(moment.unix(appointmentDetails?.appointment?.date).utcOffset('+0000').format('HH:mm'));
            setLoading(false)
        }

    }, [appointmentDetails])

    useEffect(() => {
        return () => {
            setLoading(false)
            setLoading2(false)

        }
    }, []);
    const handleConsultationCall =(e:any)=>{
        e.preventDefault();
        if(appointmentId){
            statusUpdateForAppointment({
                variables:{
                    id: appointmentId, 
                    status: 'Reschedule', 
                    date: convertedDate? convertedDate: appointmentDateChange, 
                    time: appointmentTimeChange, 
                    note: ""
                }
            }).then(({data})=>{
                if (data.statusUpdateForAppointment.status === 1) {
                    enqueueSnackbar(data.statusUpdateForAppointment.message, {
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
                    singleapppointFetch()
                    handleClose();
                }
                else if(data.statusUpdateForAppointment.status === 0){
                    enqueueSnackbar(data.statusUpdateForAppointment.message, {
                        variant: 'error',
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
    // console.log(appointmentId,{"appointmentTimeChange":appointmentTimeChange},{ "convertedDate": convertedDate}, {"appointmentDateChange": appointmentDateChange})
    return (
        <>
            <Modal
                dialogClassName="appoinment_update_modal"
                show={isUpdateAppointment}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Form>
                    <Modal.Header className="sale-modal-heade" closeButton>
                        <div className="">
                            <h1>Video Consultation</h1>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                        <div></div>
                        {/* <h2 className="adv-price-modal-title ml-280">Video Consultation</h2> */}
                        
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            {loading && <div className="text-center">
                                <div className="spinner-grow text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-secondary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <div className="spinner-grow text-success" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>}
                            {
                                !loading &&
                                <>
                                    <div className="col-sm-6">
                                        <Card className="primary-bx-shadow p-30">
                                            <div style={{ marginBottom: "15px" }}>
                                                <Form.Group className="d-flex align-items-center apnmnt-date-wrapper" controlId="date">
                                                    <span className='me-2'>Schedule:  {appointmentDate}</span>
                                                    
                                                </Form.Group>
                                            </div>
                                            <div className="scheduleWrap">
                                                <div className="scheduleInner">
                                                <h5>Name:  {myAppointment?.client_info?.first_name} {myAppointment?.client_info?.last_name}</h5>
                                                <h5>Email: {myAppointment?.client_info?.email}</h5>
                                                <h5>Mobile: {myAppointment?.client_info?.mobile}</h5>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="notes">
                                                <Link to={`/video-vetting/${myAppointment?.room_id}`} style={{ cursor: 'pointer' }} className='badge vatting-call fs-7 fw-bold'>
                                                    <FontAwesomeIcon icon={faVideo} /> &nbsp;Consultation Video Call
                                                </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="col-sm-6">
                                       <Card className="primary-bx-shadow p-30">
                                            <div style={{ marginBottom: "15px" }}>
                                                <h3>Reschedule Video Consultation Call</h3>
                                                <Form.Group className="d-flex align-items-center apnmnt-date-wrapper" controlId="date">
                                                    <span className='me-2'>Date: {appointmentDateChange}</span>
                                                    <div className="apnmnt-date">
                                                        <Form.Control className="apnmnt-date-input" type="date" name="date" value={appointmentDate}
                                                            onChange={handleDateFormater}
                                                        />
                                                        <i className="far fa-calendar text-dark calendar-icon"></i>
                                                    </div>
                                                </Form.Group>
                                                <Form.Label>Start time</Form.Label>
                                                <Form.Select name="time" aria-label="Default select example"
                                                    onChange={handleTimeFormater}
                                                >
                                                    <option value="" disabled selected>Choose</option>
                                                    {
                                                        timeSlots.map((time) => {
                                                            return (
                                                                <option selected={typeof appointmentTimeChange === "number" ? moment.unix(time.s_time).utcOffset('+0000').format("HH:mm") == moment.unix(+appointmentTimeChange).format("HH:mm") : moment.unix(time.s_time).utcOffset('+0000').format("HH:mm") == appointmentTimeChange}  defaultValue={appointmentTimeChange}>
                                                                    {moment.unix(time.s_time).utcOffset('+0000').format('HH:mm')}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Form.Select>
                                            </div>
                                            <button className='btn btn-primary btn-sm' onClick={handleConsultationCall}>Reschedule</button>
                                        </Card>
                                    </div>
                                </>
                            }
                        </div>

                    </Modal.Body>
                </Form>
            </Modal>
        </>
    )
}

export default VideoConsultationModal;
