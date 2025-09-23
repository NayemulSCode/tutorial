import { useMutation } from '@apollo/client';
import React, { useState, FC } from 'react';
import { useSnackbar } from 'notistack';
import { Button, Form, Modal } from 'react-bootstrap-v5';
import { STAFF_WISE_APPOINTMENT } from '../../../../../gql/Query';
import { APPOINTMENT_STATUS_UPDATE } from '../../../../../gql/Mutation';

type Props = {
    isCancelAppointment: boolean;
    handleClose: () => void
    appointmentId: any;
    servicePricingIds?: Array<any>;
}

const AppointmentCancelationNoteModal: FC<Props> = ({ appointmentId, isCancelAppointment, handleClose, servicePricingIds }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [appointCancelationNote, setAppointCancelationNote] = useState('');

    const [statusUpdateForAppointment] = useMutation(APPOINTMENT_STATUS_UPDATE, {
        refetchQueries: [{
            query: STAFF_WISE_APPOINTMENT,
            variables: {
                staff_id: 0,
                chair_id: 0
            }
        }],
        awaitRefetchQueries: true,
        onError(err: any) {
            enqueueSnackbar(err.message, {
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

    const apptStatusUpdate = (e: any) => {
        e.preventDefault();
        const { name, value } = e.target;
        setLoading(true);
        statusUpdateForAppointment({
            variables: {
                id: appointmentId,
                status: 'Cancelled',
                service_pricing_ids: servicePricingIds,
                date: "",
                time: "",
                note: appointCancelationNote
            }
        }).then(({ data}:any) => {
            if (data?.statusUpdateForAppointment?.status == 1) {
                enqueueSnackbar(data?.statusUpdateForAppointment?.message, {
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
                handleClose()
            }
            else if (data?.statusUpdateForAppointment?.status == 0) {
                enqueueSnackbar(data?.statusUpdateForAppointment?.message, {
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
                handleClose()
            }
            setLoading(false)
        })
    }

    return (
        <Modal
            dialogClassName="appoinment_update_modal"
            show={isCancelAppointment}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Form onSubmit={() => apptStatusUpdate}>
                <Modal.Header className="sale-modal-heade" closeButton>
                    <h2 className="adv-price-modal-title">Appointment Cancelation Note</h2>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="notes">
                            <Form.Group className="date" controlId="exampleForm.ControlInput1">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" placeholder="add an appointment cancelation note)"
                                    name="note"
                                    defaultValue={appointCancelationNote}
                                    onChange={(e) => setAppointCancelationNote(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} className='btn btn-sm' variant="danger" >Cancel</Button>
                    <Button className='btn btn-sm' variant="primary" type="submit" disabled={loading}  onClick={(e) => apptStatusUpdate(e)}>
                        {!loading && <span className='indicator-label'>Submit</span>}
                        {loading && (
                            <span className='indicator-progress' style={{ display: 'block' }} >
                                Submitting
                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default AppointmentCancelationNoteModal