import React from 'react'
import { Modal} from 'react-bootstrap-v5'

type Props = {
    deleteModal: boolean,
    closeDeleteModal: () => void
    confirmation: (status: any) => void
}

const ModalVoidInvoice:  React.FC<Props> = ({deleteModal, closeDeleteModal, confirmation}) => {
    return (
        <Modal
            className=""
            id='delete_modal'
            dialogClassName="modal-90w"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={deleteModal}
            onHide={closeDeleteModal}
        >
            <div className="text-center my-auto">
                <div className='mb-4'><i className="far fa-question-circle fa-3x text-danger"></i></div>
                <h3 className="text-center mb-5 mx-2">Are you sure you want to void this invoice? This action is permanent and cannot be undone.</h3>
                <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => { confirmation(0); closeDeleteModal() }} className="btn btn-light btn-sm me-4">Cancel</button>
                    <button onClick={() => { confirmation(1); closeDeleteModal() }} className="btn-sm submit-btn">Void Invoice</button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalVoidInvoice