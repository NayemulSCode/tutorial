import React, { FC, useState } from 'react'
import { Modal, Form } from 'react-bootstrap-v5'

type Props = {
    bodyText: string,
    confirmModal: boolean,
    handlecloseModal: () => void
    confirmation: (status: any) => void
}

const ConfirmationModal: React.FC<Props> = ({bodyText, confirmModal, handlecloseModal, confirmation }) => {

    return (
        <Modal
            className=""
            id='delete_modal'
            dialogClassName="modal-90w"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={confirmModal}
            onHide={handlecloseModal}
        >
            <div className="text-center my-auto">
                <div className='mb-4'><i className="far fa-question-circle fa-3x text-danger"></i></div>
                <h3 className="text-center mb-5">{bodyText}</h3>
                <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => { confirmation(1); handlecloseModal() }} className="btn-sm submit-btn me-4">Yes</button>
                    <button onClick={() => { confirmation(0); handlecloseModal() }} className="btn btn-light btn-sm">Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmationModal