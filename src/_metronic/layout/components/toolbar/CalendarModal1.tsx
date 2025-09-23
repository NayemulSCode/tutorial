import react from 'react-router-dom'
import { Modal, Button, Dropdown, Form } from 'react-bootstrap-v5'
import { useState } from 'react'
import { AppointmentSteps } from '../../../../app/modules/wizards/components/AppointmentSteps'

function CalendarModal1() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="calendarModal">
                <Button className="apnBtn" onClick={handleShow}>
                    New Appointment
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Appointment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="AppointmentStepsWrapper">
                            <AppointmentSteps />
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}
export {CalendarModal1}