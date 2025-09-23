import React, { FC, useState, useEffect, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap-v5";
import { useSnackbar } from 'notistack';
import moment from 'moment'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { AppContext } from '../../../../../../src/context/Context';
import {IUsers } from "../../../../../types";
import { WAITING_LISTS, ALL_CLIENTS,} from '../../../../../gql/Query';
import { ADD_TO_WAITING_LIST } from '../../../../../gql/Mutation';

type Props = {
    modalOpen: boolean;
    allWaitingList: Array<any>;
    handleModalClose: () => void
}

const ClientModal: FC<Props> = ({ allWaitingList, modalOpen, handleModalClose }) => {
    // console.log(allWaitingList)
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [waitingList, setWaitingList] = useState<any>()
    const [clients, setClients] = useState<IUsers[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState<boolean>(false)
    const [appointmentDate, setAppointmentDate] = useState<any>(new Date())

    const [cancellation_request] = useMutation(ADD_TO_WAITING_LIST, {
        refetchQueries: [{
            query: WAITING_LISTS, 
            variables: {
                keyword: "", 
                date_range: "",
                count: 1000, 
                page: 1
            }
        }],
        awaitRefetchQueries: true,
    })

    const handleDateFormater = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newCdate = moment(value).format('LL')
        setAppointmentDate(newCdate)
    }
    const convertedDate = moment(appointmentDate).format("MMMM Do YYYY")

    const [runQuery, { data: clientsData, error: clientsError, loading: ClientsLoading, refetch }] = useLazyQuery(ALL_CLIENTS, {
        variables: {
            search: search,
            count: 1000,
            page: 1,
        }
    })


    useEffect(() => {
        if (allWaitingList) {
            setWaitingList(allWaitingList)
        }
    }, [allWaitingList])

    useEffect(() => {
        if (modalOpen) {
            runQuery()
        }
    }, [modalOpen, search])

    useEffect(() => {
        if (clientsData) {
            // refetch()
            setClients(clientsData.clients?.data)
            // setLoading(false)
        }
        if (ClientsLoading) {
            // setClients([]);
            // setLoading(true)
        }
    }, [clientsData, ClientsLoading]);

    const handleSearch = (e: any) => {
        setSearch([e.target.name] = e.target.value);
    }


    const handleSubmit = (e: any, id: any) => {
        e.preventDefault();
        if (waitingList.length>0){
            waitingList.every((waiting: any) => {
                if (waiting.user_id == id){
                    enqueueSnackbar("Already added in the cancellation list", {
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
                }
            })
        }
        if (id && appointmentDate) {
            // setLoading(true)
            cancellation_request({
                variables: {
                    date: convertedDate,
                    guest_id: +id,
                    business_id: 0
                }
            }).then(({ data }) => {
                // console.log("cancellation list add: ", data);
                if (data.cancellation_request.status === 1) {
                    // setLoading(false);
                    enqueueSnackbar(data.cancellation_request.message, {
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
                    // refetch()
                    handleModalClose()
                }
                else if (data.cancellation_request.status === 0) {
                    // setLoading(false);
                    enqueueSnackbar(data.cancellation_request.message, {
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
        } else {
            enqueueSnackbar("Something went wrong", {
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
    }

    return (
        <>
            <Modal
                dialogClassName="appoinment_update_modal"
                show={modalOpen}
                onHide={handleModalClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Form>
                    <Modal.Header closeButton>
                        <h2 className="adv-price-modal-title">Add To Cancellation Request</h2>
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
                                    <div className="col-sm-12">
                                        <Card className="primary-bx-shadow p-30">
                                            <div style={{ marginBottom: "15px" }} className="d-flex justify-content-between">
                                                <Form.Group className="d-flex justify-content-start align-items-center apnmnt-date-wrapper" controlId="date">
                                                    <span className='me-2'>{convertedDate}</span>
                                                    <div className="apnmnt-date">
                                                        <Form.Control className="apnmnt-date-input" type="date" name="date" value={appointmentDate}
                                                            onChange={handleDateFormater}
                                                        />
                                                        <i className="far fa-calendar text-dark calendar-icon"></i>
                                                    </div>
                                                </Form.Group>
                                                <div className="sale-s-wrap ms-5"
                                                    style={{ width: '340px' }}
                                                >
                                                    <i className="fas fa-search"></i>
                                                    <input type="text" onChange={handleSearch} autoComplete="off" name="search" className="sale-search" placeholder="Search by Guest" />
                                                </div>
                                            </div>
                                            <table className='table align-middle gs-0 gy-4'>
                                                <thead>
                                                    <tr className='fw-bolder text-muted bg-light'>
                                                        <th className='rounded-start ps-4'>Name</th>
                                                        <th>Mobile</th>
                                                        <th>Email</th>
                                                        <th>Gender</th>
                                                        <th>Address</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        clients && clients.map(client => (
                                                            <tr key={client.id}>
                                                                <td>
                                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                        {`${client?.first_name} ${client?.last_name}`}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                        {client?.mobile ? client?.mobile : "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                        {client?.email ? client?.email : "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                        {client?.gender ? client?.gender : "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td >
                                                                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                                                                        {client?.address ? client?.address : "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td className="" >
                                                                    {waitingList.every((waiting: any) => waiting.user_id != client.id) ? (
                                                                        <i onClick={(e) => handleSubmit(e, client.id)} className="far fa-check-circle" style={{ fontSize: '30px', cursor: 'pointer' }} />
                                                                    ) : <i onClick={(e) => handleSubmit(e, client.id)} className="fas fa-check-circle" style={{ fontSize: '30px', cursor: 'pointer' }} />
                                                                }
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
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

export default ClientModal
