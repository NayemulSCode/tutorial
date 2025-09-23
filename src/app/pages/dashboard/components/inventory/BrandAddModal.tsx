import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { ErrorMessage } from "@hookform/error-message";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from 'notistack';
import { useQuery, useMutation } from '@apollo/client';
import { BRAND_CREATE } from '../../../../../gql/Mutation';
import { ALL_BRANDS } from '../../../../../gql/Query';

type Inputs = {
    brandName: string,
    brandDescription: string
}

type Props = {
    show: boolean
    handleClose: () => void
}

const BrandAddModal: FC<Props> = ({ show, handleClose }) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Inputs>();
    const [addBrand] = useMutation(BRAND_CREATE, {
        refetchQueries: [{
            query: ALL_BRANDS,
            variables: {
                type: "select",
                count: 10,
                page: 1
            }
        }],
        awaitRefetchQueries: true,
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        if (data) {
            addBrand({
                variables: {
                    name: data.brandName
                }
            }).then(({ data }) => {
                if (data) {
                    enqueueSnackbar('Brand Added', {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        transitionDuration: {
                            enter: 300,
                            exit: 500
                        }
                    });
                    reset();
                    handleClose();
                    history.push('/inventory/product-brand')
                }
            })
        }
    }

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
                    <h2 className="adv-price-modal-title">Add Product Brand</h2>
                </Modal.Header>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="service-name">
                            <Form.Label>Brand name</Form.Label>
                            <Form.Control type="text" placeholder="Brand name" 
                            autoComplete="off"
                            {...register("brandName", { required: true, maxLength: 20, minLength: 3 })} />
                            <Form.Text className="text-muted">
                                {errors?.brandName?.type === "required" && <span>This field is required</span>}
                                {errors?.brandName?.type === "maxLength" && <span>Brand Name cannot exceed 20 characters</span>}
                                {errors?.brandName?.type === "minLength" && <span>Brand Name cannot less than 3 characters</span>}

                            </Form.Text>
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

export default BrandAddModal
