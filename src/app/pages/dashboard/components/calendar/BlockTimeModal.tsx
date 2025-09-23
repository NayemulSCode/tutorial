import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap-v5";

type Props = {
    show: boolean
    handleClose: () => void
}

const BlockTimeModal: FC<Props> = ({ show, handleClose }) => {
    
    return (
        <>
            <Modal
                dialogClassName="modal-90w"
                show={show}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="" closeButton>
                    <h2 className="adv-price-modal-title">Please Select a Block Time</h2>
                </Modal.Header>
            </Modal>
        </>
    )
}

export default BlockTimeModal
