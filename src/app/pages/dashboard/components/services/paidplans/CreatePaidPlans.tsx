import React, { useState,FC,FocusEvent } from 'react'
import { Link } from 'react-router-dom'
import { Collapse,Form,Row,Col,InputGroup,FormControl,Button, Tabs, Tab, TabContainer} from 'react-bootstrap-v5';
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";


const CreatePaidPlans: FC = () => {

    return (
        <>
        <section id="add-single-service">
            <div className="container">
                Paid Plans
                    {/* <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="offer-top-toolbar d-flex align-items-center justify-content-between">
                <Link className="close-btn" to="/services/services"><i className="fas fa-times"></i></Link>
                <button type="submit" className="submit-btn save-btn">Save</button>
            </div>
                    <h2 className="page-title">Add a new single service</h2>
                        <div className="basic-info add-single-service-step">
                            <div className="form-heading">
                                <h2 className="section-title">Basic info</h2>
                                <p>Add a service name and choose the treatment type.</p>
                            </div>
                            <Row className="basic-info-form">
                                <Form.Group as={Col} md={7} className="mb-3" controlId="service-name">
                                    <Form.Label>Service name</Form.Label>
                                    <Form.Control type="text"
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md={7} className="mb-3" controlId="treatment-type">
                                    <Form.Label>Treatment type</Form.Label>
                                    <div className="treatment-type-wrap">
                                        <i className="arrow-down fa fa-angle-down"></i>
                                        <Form.Control
                                            aria-controls="treatment-type-collapse"
                                            type="search"
                                            placeholder="Select Treatment Type"
                                            className="treatment-input"
                                        />
                                        <Collapse in={openttype}>
                                            <div id="treatment-type-collapse">
                                                <div className="t-type-collapse-inner">
                                                    <div className="t-type-category">
                                                        <h5>Hair</h5>
                                                        <span>Japanese Straightening</span>
                                                        <span>Haircuts and Hairdressing</span>
                                                        <span>Hair Transplants</span>
                                                    </div>
                                                    <div className="t-type-category">
                                                        <h5>Body</h5>
                                                        <span>Multi Polar Radio Frequency Treatment</span>
                                                        <span>Acoustic Wave Therapy</span>
                                                        <span>Acupuncture</span>
                                                    </div>
                                                    <div className="t-type-category">
                                                        <h5>Face</h5>
                                                        <span>Brow Lift</span>
                                                        <span> Chemical Skin Peel</span>
                                                        <span>Dermaplaning</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                    <Form.Text className="text-muted">
                                        Choose the most relevant treatment type. This won't be visible to your clients.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group as={Col} md={7} className="mb-3" controlId="service-category">
                                    <Form.Label>Service category</Form.Label>
                                    <Form.Select {...register("serviceCategory", { 
                                        required: "Service category is required" })} 
                                        aria-label="Default select example"
                                    >
                                        <option value="" disabled selected>Select Service Category</option>
                                        <option value="1">Hair</option>
                                        <option value="2">Nails</option>
                                        <option value="3">Face</option>
                                    </Form.Select>
                                    <ErrorMessage
                                        errors={errors}
                                        name="serviceCategory"
                                        render={({message }) => <p style={{color: "red"}}>{message}</p>}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md={7} className="mb-3" controlId="service-desc">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Form.Label>Service description</Form.Label>
                                        <span>0/1000</span>
                                    </div>
                                    <textarea name="srvice-desc" id="srvice-desc" placeholder="Add a short description"></textarea>
                                </Form.Group>
                                <Form.Group as={Col} md={7} className="mb-3" controlId="service-available">
                                    <Form.Label>Service available for</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>Eeveryone</option>
                                        <option value="1">Females Only</option>
                                        <option value="2">Males Only</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                        </div>

                        <div className="online-bookings add-single-service-step">
                            <div className="form-heading">
                                <h2 className="section-title">Online booking</h2>
                                <p>Enable online bookings, choose who the service is available for and add a short description.</p>
                            </div>
                            <div className="on-bookings-wrap">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Enable online bookings"
                                />
                            </div>
                        </div>

                        <div className="staff add-single-service-step">
                            <div className="form-heading">
                                <h2 className="section-title">Staff</h2>
                                <p>Assign staff to the service and manage staff commission</p>
                            </div>
                            <div className="select-staffs">
                                <Form.Group className="select-all d-flex align-items-center mb-3" id="formGridCheckbox">
                                    <Form.Check type="checkbox" />
                                    <h5>Select All</h5>
                                    <div className="staff-count">
                                        <span>2</span>
                                    </div>
                                </Form.Group>
                                <Row className="staffs-row">
                                    <Form.Group as={Col} md={6} className="staff d-flex align-items-center" controlId="formGridCheckbox">
                                        <Form.Check type="checkbox" />
                                        <div className="staff-profile">
                                            <span>HR</span>
                                        </div>
                                        <h5 className="staff-name">Hammad Rahman</h5>
                                    </Form.Group>
                                    <Form.Group as={Col} md={6} className="staff d-flex align-items-center" controlId="formGridCheckbox">
                                        <Form.Check type="checkbox" />
                                        <div className="staff-profile">
                                            <span>WS</span>
                                        </div>
                                        <h5 className="staff-name">Wendy Smith</h5>
                                    </Form.Group>
                                </Row>
                            </div>
                            <div className="Staff-commission">
                                <div className="inner-heading">
                                    <h3 className="">Staff commission</h3>
                                    <p>Calculate staff commission when the service is sold.</p>
                                </div>
                                <div className="enable-staff-commission">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Enable staff commission"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pricing-duration add-single-service-step">
                            <div className="form-heading">
                                <h2 className="section-title">Pricing and Duration</h2>
                                <p>Add the pricing options and duration of the service.</p>
                            </div>
                            <div className="add-pricing">
                            </div>
                            <div className="extra-time">
                                <div className="inner-heading">
                                    <h3 className="">Extra time</h3>
                                    <p>Enable extra time after the service.</p>
                                </div>
                                <div className="enable-extra-time">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Enable extra time"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sales-settings add-single-service-step">
                            <div className="form-heading">
                                <h2 className="section-title">Sales settings</h2>
                            </div>
                            <div className="set-tax-rate">
                                <div className="inner-heading">
                                    <h3 className="">Set the tax rate</h3>
                                </div>
                                <div className="tax-rate-inner">
                                    <Form.Group as={Col} md={7} className="mb-3" controlId="select-tax">
                                        <Form.Label>Tax <span className="text-muted">(Included in price)</span></Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            <option>Default: No tax</option>
                                            <option value="1">No tax</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="voucher-sales">
                                <div className="inner-heading">
                                    <h3 className="">Voucher sales</h3>
                                </div>
                                <div className="enable-voucher-sales">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Enable voucher sales"
                                    />
                                </div>
                                <Form.Group as={Col} md={7} className="mb-3" controlId="voucher-expiry-period">
                                    <Form.Label>Voucher expiry period</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>Default(6 Months)</option>
                                        <option value="1">14 Days</option>
                                        <option value="1">1 Month</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </Form> */}
            </div>
        </section>
        </>
    )
}
export default CreatePaidPlans;