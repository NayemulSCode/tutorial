/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Link } from 'react-router-dom'
import { Dropdown1 } from '../../../_metronic/partials'
import { useHistory, useLocation } from 'react-router'
import { IAccountInfo } from '../../../types';
import ReactDOM from 'react-dom';
import QRCode from "react-qr-code";
import { Modal, Button } from 'react-bootstrap-v5'
import { AppContext } from '../../../context/Context'
import {useSnackbar} from 'notistack'
import { imageUrl } from '../util'

const AccountHeader: React.FC<{ accInfo: any }> = ({ children, accInfo }) => {
  const {enqueueSnackbar} = useSnackbar()
  const location = useLocation();
  const history = useHistory();
  const [show, setShow] = useState<boolean>(false);
  const [saveEnable, setSaveEnable] = useState<any>();
  const handleShow = () => { setShow(true) };
  const handleClose = () => { setShow(false); setSaveEnable(false) };
  const {addVideoItem} = useContext(AppContext)
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard
      .writeText(`www.chuzeday.com/${accInfo?.business_info?.slug}`)
      .then(() => {
        enqueueSnackbar('Link Copied!!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          transitionDuration: {
            enter: 200,
            exit: 300,
          },
        })
      })
      .catch((error) => {
        enqueueSnackbar(`Failed to copy link:, ${error}`, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          transitionDuration: {
            enter: 200,
            exit: 300,
          },
        })
      })
  }
  const handleRedirectVideoSection = () => {
    addVideoItem(9)
    history.push('/setup/how-to')
  }
  const onImageCownload = () => {
    const svg = document.getElementById("QRCode");
    let svgData = "";
    if(svg != null){
      svgData = new XMLSerializer().serializeToString(svg);
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if(ctx != null){
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };
  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9'>
        <div className='d-flex flex-wrap flex-sm-nowrap'>
          <div className='me-7'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <img
                className='TTTT'
                src={
                  accInfo?.photo
                    ? `${imageUrl}/uploads/partner/${accInfo?.photo}`
                    : toAbsoluteUrl('/media/avatars/blank.png')
                }
                alt='Chuzeday'
              />
              <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                    {`${accInfo ? accInfo?.first_name : ''} ${accInfo ? accInfo?.last_name : ''}`}
                  </a>
                  <a href='#'>
                    <KTSVG
                      path='/media/icons/duotune/general/gen026.svg'
                      className='svg-icon-1 svg-icon-primary'
                    />
                  </a>
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com006.svg'
                      className='svg-icon-4 me-1'
                    />
                    Business
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen018.svg'
                      className='svg-icon-4 me-1'
                    />
                    {accInfo?.business_info?.location}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com011.svg'
                      className='svg-icon-4 me-1'
                    />
                    {accInfo?.email}
                  </a>
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/account/overview' && 'active')
                    }
                    to='/account/overview'
                  >
                    Overview
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname === '/account/settings' && 'active')
                    }
                    to='/account/settings'
                  >
                    Settings
                  </Link>
                </li>
              </ul>
              <button
                type='button'
                style={{background: '#ebc11a'}}
                onClick={handleRedirectVideoSection}
                className='btn btn-sm text-light ms-auto me-5 d-block'
              >
                How To
              </button>
            </div>
          </div>
          <div className='qrcode-wrap'>
            <QRCode
              onClick={(e: any) => {
                handleShow()
              }}
              className='d-block mb-4'
              style={{cursor: 'pointer'}}
              id='QRCode'
              value={`${imageUrl}/${accInfo?.business_info?.slug}`}
              size={130}
            />
            <input
              className='btn btn-primary btn-sm'
              type='button'
              value='Download QR'
              onClick={onImageCownload}
            />
            <button
              className='btn btn-primary btn-sm mt-1 copy_link'
              type='button'
              onClick={handleClick}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
      <>
        <div>
          <Modal id='qr_modal_wrap' dialogClassName='' centered show={show} onHide={handleClose}>
            <Modal.Header className='sale-modal-heade' closeButton></Modal.Header>
            <Modal.Body style={{marginLeft: '19px'}}>
              <QRCode
                className='d-block'
                id='QRCode'
                value={`www.chuzeday.com/${accInfo?.business_info?.slug}`}
                size={400}
              />
            </Modal.Body>
          </Modal>
        </div>
      </>
    </div>
  )
}

export { AccountHeader }
