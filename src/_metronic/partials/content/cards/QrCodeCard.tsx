import React,{FC, useState, useEffect} from 'react'
import QRCode from "react-qr-code";
import { Modal, Button } from 'react-bootstrap-v5'
import { PARTNER_BALANCE } from '../../../../gql/Query';
import { useQuery } from '@apollo/client'

const QrCodeCard:FC = () => {

    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any>()
    const { data, loading: dataLoading, error } = useQuery(PARTNER_BALANCE, {
        onError(err: any) {
            if (err?.message == 'Unauthenticated.') {
                // localStorage.setItem("loginError", err?.message);
            }
        }
    });
    useEffect(() => {
        if (data) {
            // console.log(data)
            setState(data.partnerBalance)
            setLoading(false)
        }
        if (dataLoading) {
            setLoading(true)
        }
    }, [data, dataLoading])
    const [show, setShow] = useState<boolean>(false);
    const handleShow = () => { setShow(true) };
    const handleClose = () => { setShow(false) };
  return (
      <div className='card card-body  align-items-center'>
          <div className='qrcode-wrap'>
              <QRCode className='d-block' onClick={(e: any) => { handleShow() }} style={{ cursor: "pointer" }} value={state?.business_url ? state?.business_url : ""} id="QRCode" size={130} />
          </div>
          <>
              <div>
                  <Modal
                      id='qr_modal_wrap'
                      dialogClassName=""
                      centered
                      show={show} onHide={handleClose}
                  >
                      <Modal.Header className="sale-modal-heade" closeButton></Modal.Header>
                      <Modal.Body className='qr_modal'>
                          <QRCode className='d-block' value={state?.business_url ? state?.business_url : ""} id="QRCode" size={390} />
                      </Modal.Body>
                  </Modal>
              </div>
          </>
      </div>
      
  )
}

export {QrCodeCard}