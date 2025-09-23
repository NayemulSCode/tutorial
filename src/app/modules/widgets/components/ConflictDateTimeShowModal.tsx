import React from 'react'
import { Modal } from 'react-bootstrap-v5'
import { ConflictData } from '../../generates.type'
import moment from 'moment'

type Props = {
    showModal: boolean
    closeModal: () => void
    conflictData: ConflictData[]
    from: string;
}

const ConflictDateTimeShowModal: React.FC<Props> = ({ showModal, closeModal, conflictData, from }) => {
    return (
      <Modal
        className=''
        dialogClassName='modal-90w'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton className='custom-close-button'>
          <h3 className='adv-price-modal-title'>Conflicted Date & Times</h3>
        </Modal.Header>
        <div className='text-center my-auto p-3'>
          <div className='mb-4'>
            <i className='fa fa-info-circle fa-3x text-info'></i>
          </div>
          {conflictData.map((data: ConflictData) => {
            if (data?.date_time) {
              return (
                <div key={data?.id}>
                  <p>
                    Date: {moment.unix(+data.date_time).format('YYYY-MM-DD')}, Time:{' '}
                    {moment.unix(+data.date_time).format('HH:m')}, Conflicted Slot Duration:{' '}
                    {data?.service_pricing?.duration} Min.
                  </p>
                </div>
              )
            } else {
              return (
                <p>
                  Close{' '}
                  {+data ? (
                    <span>Date : {moment.unix(+data).format('YYYY-MM-DD')}</span>
                  ) : (
                    <span>Day: {data}</span>
                  )}
                </p>
              )
            }
          })}
          <h4 className='text-center mb-5 text-info'>
            Please Reslove the Conflicted Date and Time for {from} Service
          </h4>
          {/* <div className='d-flex justify-content-center align-items-center'>
            <button
              onClick={() => {
                closeModal()
              }}
              className='btn btn-light btn-sm text-danger'
            >
              Close
            </button>
          </div> */}
        </div>
      </Modal>
    )
}

export default ConflictDateTimeShowModal;
