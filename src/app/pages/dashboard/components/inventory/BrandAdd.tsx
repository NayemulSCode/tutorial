import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Collapse, Form, Row, Col, InputGroup, FormControl, Button, Tabs, Tab, TabContainer } from 'react-bootstrap-v5';
import { ErrorMessage } from "@hookform/error-message";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from 'notistack';
// import '../Services.css'
import { useQuery, useMutation } from '@apollo/client';
import { BRAND_CREATE } from '../../../../../gql/Mutation';

type Inputs = {
    brandName: string,
    brandDescription: string
}

const BrandAdd: FC = () => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [addBrand] = useMutation(BRAND_CREATE, {
        onError(err: any) {
            enqueueSnackbar(err.graphQLErrors[0].extensions.reason, {
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
                    history.push('/add-product-brand')
                }
            })
        }
    }


    return (
        <>
            <section id="ad-product-brand" className="ptc">
                {/* <div className="container"> */}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="toolbar d-flex align-items-center justify-content-between">
                        <Link className="close-btn" to="/add-product-brand"><i className="fas fa-times"></i></Link>
                        <button type="submit" className="submit-btn save-btn">Save</button>
                    </div>
                    <div className="basic-info add-single-service-step">
                        <div className="form-heading">
                            <h2 className="section-title">Add Product Brand</h2>
                            <p>Choose a Brand name.</p>
                        </div>
                        <Row className="basic-info-form">
                            <Form.Group as={Col} md={7} className="mb-3" controlId="service-name">
                                <Form.Label>Brand name</Form.Label>
                                <Form.Control type="text" {...register("brandName", { required: true, maxLength: 20 })} />
                                <Form.Text className="text-muted">
                                    {errors?.brandName?.type === "required" && <span>This field is required</span>}
                                    {errors?.brandName?.type === "maxLength" && <span>Brand Name cannot exceed 20 characters</span>}
                                </Form.Text>
                            </Form.Group>

                            {/* <Form.Group as={Col} md={7} className="mb-3" controlId="service-desc">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Form.Label>Brand description</Form.Label>
                                        <span>0/1000</span>
                                    </div>
                                    <textarea id="srvice-desc" placeholder="Add a short description"></textarea>
                                </Form.Group> */}
                        </Row>
                    </div>

                </Form>
                {/* </div> */}
            </section>
        </>
    )
}
export default BrandAdd;