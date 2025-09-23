import React, { FC } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { SERVICE_CATEGORY_CREATE } from '../../../../../gql/Mutation';
import { useHistory } from 'react-router-dom'
import { SERVICE_CATEGORIES } from '../../../../../gql/Query';

interface IFormInputs {
    categoryName: string;
}

type Props = {
    showInvDetails: boolean
    handleCloseInvDetails: () => void
}
const InvoiceDetailsModal: FC<Props> = ({ showInvDetails, handleCloseInvDetails }) => {

    return (
        <>
            <Modal
                dialogClassName="modal-90w"
                show={showInvDetails}
                onHide={handleCloseInvDetails}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="" closeButton>
                    <h2 className="adv-price-modal-title">Invoice Details</h2>
                </Modal.Header>

                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment received by</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option value="Hammad Rahman">Hammad Rahman</option>
                                <option value="Rubel Khan">Rubel Khan</option>
                                <option value="Zihad">Zihad</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <Form.Label>Invoice notes</Form.Label>
                                <span>0/250</span>
                            </div>
                            <textarea className="invoice-notes"></textarea>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" className="category-save-btn submit-btn">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default InvoiceDetailsModal
