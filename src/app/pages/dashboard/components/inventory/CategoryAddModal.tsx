import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap-v5";
import { ErrorMessage } from "@hookform/error-message";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from 'notistack';
import { useQuery, useMutation } from '@apollo/client';
import { PRODUCT_CATEGORY_CREATE } from '../../../../../gql/Mutation';
import { ALL_PRODUCT_CATEGORY } from '../../../../../gql/Query';

type Inputs = {
    categoryName: string,
    categoryDescription: string
}

type Props = {
    show: boolean
    handleClose: () => void
}

const CategoryAddModal: FC<Props> = ({ show, handleClose }) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Inputs>();
    const [addProductCategory] = useMutation(PRODUCT_CATEGORY_CREATE, {
        refetchQueries: [{
            query: ALL_PRODUCT_CATEGORY,
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
            // console.log(data);
            addProductCategory({
                variables: {
                    name: data.categoryName
                }
            }).then(({ data }) => {
                if (data) {
                    // console.log(data);
                    enqueueSnackbar('Category Added', {
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
                    history.push('/inventory/product-category');
                }
            })
            reset();
            handleClose();
        } else {
            enqueueSnackbar('Category required', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                transitionDuration: {
                    enter: 300,
                    exit: 500
                }
            });
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
                    <h2 className="adv-price-modal-title">Add Product Category</h2>
                </Modal.Header>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="service-name">
                            <Form.Label>Category name</Form.Label>
                            <Form.Control type="text" placeholder="Category name"
                            autoComplete="off" 
                            {...register("categoryName", { required: true, maxLength: 20, minLength: 3 })} />
                            <Form.Text className="text-muted">
                                {errors?.categoryName?.type === "required" && <span>This field is required</span>}
                                {errors?.categoryName?.type === "maxLength" && <span>Category Name cannot exceed 20 characters</span>}
                                {errors?.categoryName?.type === "minLength" && <span>Category Name cannot less than 3 characters</span>}
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

export default CategoryAddModal
