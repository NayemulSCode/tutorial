import React from 'react'
import { Modal } from 'react-bootstrap-v5'
type Props = {
    blockGuestModal: boolean,
    isUnblockGuest: boolean,
    closeBlockGuestModal: () => void
    handleSubmit: (e: any) => void
}
const GuestBlockConfirmation: React.FC<Props> = ({ blockGuestModal, closeBlockGuestModal, handleSubmit, isUnblockGuest }) => {
    return (
        <Modal
            className=""
            id='delete_modal'
            dialogClassName="modal-90w"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={blockGuestModal}
            onHide={closeBlockGuestModal}
        >{
            isUnblockGuest ?
            <div className="text-center my-auto">
                <div className='mb-4'><i className="far fa-question-circle fa-3x text-danger"></i></div>
                <h3 className="text-center mb-5">Are you sure you want to unblock this guest?</h3>
                <div className="d-flex justify-content-center align-items-center">
                    <button onClick={(e: any) => { handleSubmit(e); closeBlockGuestModal() }} className="btn-sm submit-btn me-4">Yes</button>
                    <button onClick={() => { closeBlockGuestModal() }} className="btn btn-light btn-sm">No</button>
                </div>
            </div>:
            <div className="text-center my-auto">
                <div className='mb-4'><i className="far fa-question-circle fa-3x text-danger"></i></div>
                <h3 className="text-center mb-5">Are you sure you want to block this guest?</h3>
                <div className="d-flex justify-content-center align-items-center">
                    <button onClick={(e: any) => { handleSubmit(e); closeBlockGuestModal() }} className="btn-sm submit-btn me-4">Yes</button>
                    <button onClick={() => { closeBlockGuestModal() }} className="btn btn-light btn-sm">No</button>
                </div>
            </div>
        }
        </Modal>
    )
}

export default GuestBlockConfirmation