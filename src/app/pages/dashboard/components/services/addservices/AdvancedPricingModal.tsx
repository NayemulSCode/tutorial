import React,{FC} from 'react'
import {Modal,Form,Row,Col,InputGroup,FormControl,Button} from "react-bootstrap-v5";

type Props = {
    show: boolean
    handleClose: () => void
}
const AdvancedPricingModal:FC<Props> = ({show, handleClose}) => {

    return (
        <>
            <Modal
                dialogClassName="adv-pr-modal"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="adv-pricing-mdl-header" closeButton>
                    <h2 className="adv-price-modal-title">Advanced pricing options</h2>
                </Modal.Header>
                <Form>
                    <Modal.Body className="adv-pricing-mdl-body">
                        <div className="advanced-pricing-option">
                            <h2 className="adv-price-form-title">Default pricing options</h2>
                            <Row className="default-pricing-option-row mb-3">
                                <Form.Group as={Col} md={4} className="" controlId="adv-pricing-name">
                                    <Form.Label>Pricing name</Form.Label>
                                    <Form.Control type="text" placeholder="e.g. Long hair" />
                                </Form.Group>
                                <Form.Group as={Col} md={2} className="" controlId="formGridDuration">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>1h</option>
                                        <option value="1">20min</option>
                                        <option value="2">30min</option>
                                        <option value="3">40min</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} md={2} className="" controlId="formGridPriceType">
                                    <Form.Label>Price type</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>Fixed</option>
                                        <option value="1">Free</option>
                                        <option value="2">From</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} md={2} className="price" controlId="formGridPrice">
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className="Price">
                                        <InputGroup.Text>€</InputGroup.Text>
                                        <FormControl id="inlineFormInputGroup" placeholder="0.00" />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} md={2} className="sp-price" controlId="formGridSpecialprice">
                                    <Form.Label>Special price <span className="text-muted">(optional)</span></Form.Label>
                                    <InputGroup className="Price">
                                        <InputGroup.Text>€</InputGroup.Text>
                                        <FormControl id="inlineFormInputGroup" placeholder="0.00" />
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                        </div>
                        <div className="set-price-by-staff">
                            <h2 className="adv-price-form-title">Set price by staff</h2>
                            <div className="price-by-staff">
                                <h3 className="form-title">Price by staff</h3>
                                <p className="form-desc">Add the pricing options for each staff member.</p>
                                <Row className="price-by-staff-row mb-5">
                                    <Form.Group as={Col} md={4} className="staff d-flex align-items-center" controlId="formGridStaffProfile">
                                        <div className="staff-profile">
                                            <span>HR</span>
                                        </div>
                                        <h5 className="staff-name">Hammad Rahman</h5>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="" controlId="formGridDuration">
                                        <Form.Label>Duration</Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            <option>1h</option>
                                            <option value="1">20min</option>
                                            <option value="2">30min</option>
                                            <option value="3">40min</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="" controlId="formGridPriceType">
                                        <Form.Label>Price type</Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            <option>Fixed</option>
                                            <option value="1">Free</option>
                                            <option value="2">From</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="price" controlId="formGridPrice">
                                        <Form.Label>Price</Form.Label>
                                        <InputGroup className="Price">
                                            <InputGroup.Text>€</InputGroup.Text>
                                            <FormControl id="inlineFormInputGroup" placeholder="0.00" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="sp-price" controlId="formGridSpecialprice">
                                        <Form.Label>Special price <span className="text-muted">(optional)</span></Form.Label>
                                        <InputGroup className="Price">
                                            <InputGroup.Text>€</InputGroup.Text>
                                            <FormControl id="inlineFormInputGroup" placeholder="0.00" />
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Row className="price-by-staff-row">
                                    <Form.Group as={Col} md={4} className="staff d-flex align-items-center" controlId="formGridStaffProfile">
                                        <div className="staff-profile">
                                            <span>WS</span>
                                        </div>
                                        <h5 className="staff-name">Wendy Smith</h5>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="" controlId="formGridDuration">
                                        <Form.Select aria-label="Default select example">
                                            <option>1h</option>
                                            <option value="1">20min</option>
                                            <option value="2">30min</option>
                                            <option value="3">40min</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="" controlId="formGridPriceType">
                                        <Form.Select aria-label="Default select example">
                                            <option>Fixed</option>
                                            <option value="1">Free</option>
                                            <option value="2">From</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="price" controlId="formGridPrice">
                                        <InputGroup className="Price">
                                            <InputGroup.Text>€</InputGroup.Text>
                                            <FormControl id="inlineFormInputGroup" placeholder="0.00" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md={2} className="sp-price" controlId="formGridSpecialprice">
                                        <InputGroup className="Price">
                                            <InputGroup.Text>€</InputGroup.Text>
                                            <FormControl id="inlineFormInputGroup" placeholder="0.00" />
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="adv-price-modal-footer">
                        <div className="adv-pricing-footer-btn d-flex align-items-center justify-content-between">
                            <Button type="reset" className="adv-price-reset-btn d-block">Reset overrides to defaults</Button>
                            <div className="d-flex align-items-center">
                                <Button type="submit" className="adv-price-cancel-btn">Cancel</Button>
                                <Button type="submit" className="adv-price-save-btn submit-btn">Save</Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default AdvancedPricingModal
