import React, { useState, useRef, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Link, useHistory } from 'react-router-dom'
import { Modal, Form, Card, InputGroup, FormControl, Button } from 'react-bootstrap-v5'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { CHECK_PAYMENT_STATUS } from '../../../../../gql/Query'
import moment from 'moment'
import QRCode from "react-qr-code";
import { useTostMessage } from '../../../../modules/widgets/components/useTostMessage'

type Props = {
    showStripe: boolean
    handleCloseStripe: () => void
    paymentUrl: string
    invoiceNo: number
    appointId:number
}

const StripePayment: React.FC<Props> = ({ showStripe, handleCloseStripe, paymentUrl, invoiceNo, appointId }) => {

    const history = useHistory()
    const {showToast} = useTostMessage();

    const [runQuery, {data: paymentstatus, loading: loadingStatus}] = useLazyQuery(
      CHECK_PAYMENT_STATUS,
      {
        variables: {
          sale_id: invoiceNo,
          appt_id: appointId,
        },
        fetchPolicy: 'network-only',
        onError(err) {
          const graphQLErrors = err.graphQLErrors

          if (graphQLErrors && graphQLErrors.length > 0) {
            const error = graphQLErrors[0]
            const extensions = error.extensions

            if (extensions && extensions.validation) {
              const validationErrors = extensions.validation
              Object.keys(validationErrors).forEach((key) => {
                validationErrors[key].forEach((message:any) => {
                  showToast(message, 'error')
                })
              })
            } else {
              showToast(extensions.reason || error.message || 'An unknown error occurred', 'error')
            }
          } else {
            showToast('An unknown error occurred', 'error')
          }
        },
      }
    )

    const [statusChecked, setStatusChecked] = useState(false)

    useEffect(() => {
      if (statusChecked && paymentstatus) {
        if (paymentstatus?.checkPaymentStatus?.status === 0) {
          showToast('Payment Not Received Yet.', 'error')
        }

        if (paymentstatus?.checkPaymentStatus?.status === 1) {
          showToast('Payment Received.', 'success')
          history.push(`/invoice/${invoiceNo}`)
        }
        setStatusChecked(false) // Reset after showing toast
      }
    }, [paymentstatus, statusChecked])

    const checkPaymentStatus = async () => {
      setStatusChecked(true) // Set to true when manually triggering
      await runQuery({variables: {sale_id: invoiceNo, appt_id: appointId}})
    }

    return (
      <Modal
        dialogClassName='modal-90w'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        show={showStripe}
        onHide={handleCloseStripe}
      >
        <Modal.Header closeButton className='custom-close-button'>
          <h2 className='adv-price-modal-title'>Scan QRCode</h2>
        </Modal.Header>
        <Modal.Body className=' m-auto'>
          <div className='qrcode-wrap mt-5'>
            <QRCode className='d-block ' id='QRCode' value={paymentUrl} size={250} />
          </div>
        </Modal.Body>
        <Modal.Footer className='m-auto'>
          {/* <input className='btn btn-primary btn-sm my-5 text-center' type="button" value="Check Payment Status" onClick={checkPaymentStatus} /> */}

          <button
            type='submit'
            id='kt_sign_in_submit'
            className='submit-btn save-btn'
            disabled={loadingStatus}
            onClick={checkPaymentStatus}
          >
            {loadingStatus ?  (
              <span className='indicator-progress' style={{display: 'block'}}>
                Checking...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>):(
              <span className='indicator-label'>Check</span>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    )
}

export { StripePayment }