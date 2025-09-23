import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-number-input'
import { Card, Button, Form, Container, Row, Col, InputGroup,Modal } from "react-bootstrap-v5";
import { CUSTOMER_REGISTRATION, GUEST_PROFILE_UPDATE } from '../../../../../gql/Mutation';
import { SINGLE_USER, ALL_USER } from '../../../../../gql/Query';
import GetIp from "../../../../modules/widgets/components/GetIp";
import { useTostMessage } from "../../../../modules/widgets/components/useTostMessage";

type Inputs = {
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    additionalMobile: string,
    clientSource: string,
    displayBooking: Boolean,
    gender: string,
    dob: string,
    clientInfo: string,
    address: string,
    marketing_notification: boolean
    email_notification: boolean
    language: string,
}
const ClientAdd: FC = () => {
    const {showToast} = useTostMessage()
    const [loading, setLoading] = useState<boolean>(false)
    const [overwrite, setOverwrite] = useState<number>(0)
    const [guestId, setGuestId] = useState<number>(0)
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const guestGender = ["Male", "Female", "Others"];
    const [show, setShow] = useState<boolean>(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [overwriteObject, setOverwriteObject]=useState<any>({
        first_name:"",
        last_name: "",
        email: '',
        mobile: "",
        password: '',
        additional_mobile: "",
        client_source: "",
        display_booking: "",
        gender: "",
        dob:'',
        client_info:"",
        address: "",
        marketing_notification: '',
        email_notification: "",
        language: ""
    })
    const phoneNumberRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const IpHistory:any = GetIp()
    const [countryCode, setCountryCode] = useState<any>('IE')
    const [phone, setPhone] = useState<any>()  
    // console.log('phone number', phone)   
    const [guestProfileUpdate] = useMutation(GUEST_PROFILE_UPDATE)
    const [clientRegister] = useMutation(CUSTOMER_REGISTRATION, {
      onError(err) {
        const graphQLErrors = err.graphQLErrors

        if (graphQLErrors && graphQLErrors.length > 0) {
          const error = graphQLErrors[0]
          const extensions = error.extensions
          // Check if it's a validation error
          if (extensions && extensions.validation) {
            const validationErrors = extensions.validation
            // Loop through the validation errors and show each message in a toast
            Object.keys(validationErrors).forEach((key) => {
              validationErrors[key].forEach((message: any) => {
                showToast(message, 'error')
              })
            })
            setLoading(false)
          } else {
            // If it's a different type of error, show the general reason
            showToast(extensions.reason || 'An unknown error occurred', 'error')
            setLoading(false)
          }
        } else {
          // Handle the case where there's no detailed GraphQL error
          showToast('An unknown error occurred', 'error')
        }
      },
    })
    useEffect(() =>{
         if(IpHistory){
            setCountryCode(IpHistory?.country_code)
        }
    },[IpHistory])
    // console.log("overwrite***********",overwrite);
    const onSubmit: SubmitHandler<Inputs> = async (data,e:any )=> {
         e.preventDefault();
        setLoading(true)
        if (data && phone) {
            setOverwriteObject({
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                mobile: phone,
                password: '',
                additional_mobile: data.additionalMobile,
                client_source: data.clientSource,
                display_booking: data.displayBooking,
                gender: data.gender,
                dob: data.dob,
                client_info: data.clientInfo,
                address: data.address,
                marketing_notification: data.marketing_notification,
                email_notification: data.email_notification,
                language: ""
            })
            const payloadString = phone + process.env.REACT_APP_SECRET_KEY
            const hash = await crypto.subtle
              .digest('SHA-256', new TextEncoder().encode(payloadString))
              .then((buffer) => Array.from(new Uint8Array(buffer)))
              .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''))
            clientRegister({
              variables: {first_name: data.firstName,
              last_name: data.lastName,
              email: data.email,
              mobile: phone,
              password: '',
              additional_mobile: data.additionalMobile,
              client_source: data.clientSource,
              display_booking: data.displayBooking,
              gender: data.gender,
              dob: data.dob,
              client_info: data.clientInfo,
              address: data.address,
              marketing_notification: data.marketing_notification,
              email_notification: data.email_notification,
              language: '',
              hash}
            })
              .then(({data}) => {
                if (data) {
                  if (data.guestRegister.status === 1) {
                    showToast(data?.guestRegister?.message, 'success')
                    setLoading(false)
                    history.push('/guests')
                  }
                  console.log('data.guestRegister.status------', data.guestRegister.status)
                  if (data.guestRegister.status === 0) {
                    handleShow()
                    setLoading(false)
                    setGuestId(data.guestRegister.data.id)
                    console.log('data-----overwrite-', overwrite)
                  }
                }
              })
              .catch((e) => {
                showToast(e.message, 'error')
                setLoading(false)
              })
            
        }
        else if (phone === undefined) {
                phoneNumberRef.current.focus();
                phoneNumberRef.current.style.border = "1px solid red";
                showToast('Phone number required', 'warning');
                setLoading(false);
        }
        if (phone) {
            phoneNumberRef.current.style.border = "None";
        }
    };

    const handleWhiteSpce = (e: any) => {
        e = e || window.event;
        const value = e.target.value
        let key = e.charCode;
        if (key === 32 && value === "") {
            e.preventDefault();
        }
    }

    const guestUpdate=(guestId:any, overwriteObject:any)=>{
        // console.log('overwriteObject/////',overwriteObject)
        guestProfileUpdate({
            variables: {
                id: guestId,
                first_name: overwriteObject.first_name,
                last_name: overwriteObject.last_name,
                email: overwriteObject.email,
                mobile: overwriteObject.mobile,
                dob: overwriteObject.dob,
                gender: overwriteObject.gender,
                address: overwriteObject.address,
                additional_mobile:overwriteObject.additional_mobile,
                client_source: overwriteObject.client_source,
                display_booking: overwriteObject.display_booking,
                client_info:  overwriteObject.client_info,
                email_notification: overwriteObject.email_notification,
                marketing_notification: overwriteObject.marketing_notification,
                language: "",
                photo: "",
                suite: "",
                country: "",
                eir_code: "",
            }
        }).then(({ data }) => {
            setLoading(false)
            if (data.guestProfileUpdate.status === 1){
                showToast(data.guestProfileUpdate.message, 'success')
                history.push('/guests')
            }
            if (data.guestProfileUpdate.status === 0) {
                showToast(data.guestProfileUpdate.message, 'error')
            }
        }).catch((e) => {
            showToast(e.message, 'error');
            setLoading(false)
        })
    }
    useEffect(() => {
        if(overwrite===1){
            guestUpdate(guestId, overwriteObject);
        }
        if(overwrite===2){
            handleClose();
            history.push('/guests')
        }
    }, [overwrite])
    return (
        <>
            <section id="product-add" className="add-product-form ptc">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="toolbar">
                        <Link className="close-btn" to="/guests"><i className="fas fa-times"></i></Link>
                        <h2 className="page-title mb-0">Add new guest</h2>
                        {/* <button type="submit" className="submit-btn save-btn">Save</button> */}
                        <button
                            type='submit'
                            id='kt_sign_in_submit'
                            className="submit-btn save-btn"
                            disabled={loading}
                        >
                            {!loading && <span className='indicator-label' >Save</span>}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }}>
                                    Saving...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="row">
                        <div className="col-sm-8">
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title mb-0">Basic info</h2>
                                        </div>
                                        <div className="basic-info-form">
                                            <Row>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="firstName">
                                                        <Form.Label>First name</Form.Label>
                                                        <Form.Control type="text" autoComplete="off" placeholder="Guests's first name" {...register("firstName", { required: true, maxLength: 20 })} />
                                                        <Form.Text className="text-danger">
                                                            {errors?.firstName?.type === "required" && <span>This field is required</span>}
                                                            {errors?.firstName?.type === "maxLength" && <span>first name cannot exceed 20 characters</span>}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="lastName">
                                                        <Form.Label>Last name</Form.Label>
                                                        <Form.Control type="text" autoComplete="off" placeholder="Guests's last name" {...register("lastName")} />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                <Form.Group className="mb-3"  >
                                                    <Form.Label htmlFor="inlineFormInputGroup">
                                                        Mobile Number*
                                                    </Form.Label>
                                                    <InputGroup className="Number d-block" ref={phoneNumberRef}>
                                                        <PhoneInput
                                                            international={true}
                                                            defaultCountry={countryCode}
                                                            className="mbl_input"
                                                            placeholder="Enter phone number"
                                                            name="phone"
                                                            value={phone}
                                                            onChange={setPhone}
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                                </Col>
                                                {/* <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="mobile">
                                                        <Form.Label>Mobile number</Form.Label>
                                                        <Form.Control type="text" autoComplete="off" placeholder="guests mobile number" {...register("mobile")} 
                                                         onKeyPress={(event: any) => {
                                                            handleWhiteSpce(event)
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                        />
                                                    </Form.Group>
                                                </Col> */}
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="email">
                                                        <Form.Label>Email address</Form.Label>
                                                        <Form.Control type="email" autoComplete="off" placeholder="Guest's email" {...register("email")} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3" controlId="gender">
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Select aria-label="gender" {...register("gender")} >
                                                    <option value="" disabled selected>Choose</option>
                                                    {
                                                        guestGender.map(user => <option value={user}>{user}</option>)
                                                    }
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="dob">
                                                <Form.Label>Date of birth</Form.Label>
                                                <Form.Control type="date" {...register("dob")} />
                                            </Form.Group>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title">Important guest info</h2>
                                            <p>Guest info will be visible to you and staff members.</p>
                                        </div>
                                        <div className="p-30">
                                            <Form.Group className="mb-6" controlId="clientInfo">
                                                <Form.Label>Guest info</Form.Label>
                                                <Form.Control as="textarea" rows={3} type="text" {...register("clientInfo")} placeholder="E.g. allergy to shampoos with sodium" />
                                            </Form.Group>
                                            <Form.Group className="staff d-flex align-items-center">
                                                <Form.Check type="checkbox" className="me-3"{...register("displayBooking")} />
                                                <h6 className="staff-name">Display on all bookings</h6>
                                            </Form.Group>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title">Additional info</h2>
                                        </div>

                                        <div className="p-30">
                                            <Form.Group className="mb-3" controlId="mobile">
                                                <Form.Label>Additional phone number</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text id="basic-addon1">phone</InputGroup.Text>
                                                    <Form.Control type="text" autoComplete="off" placeholder="Guest's additional phone number" 
                                                    {...register("additionalMobile")} 
                                                    onKeyPress={(event: any) => {
                                                        handleWhiteSpce(event)
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="clientSource">
                                                <Form.Label>Guest source</Form.Label>
                                                <Form.Select aria-label="clientSource" {...register("clientSource")} >
                                                    <option value="Walkin">Walk-In</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="address">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control type="text" autoComplete="off" placeholder="Guests's address" {...register("address")} />
                                            </Form.Group>
                                        </div>

                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            {/* <Card>
                                <Card.Body className="primary-bx-shadow">
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title">Address</h2>
                                        </div>

                                        <div className="p-30">
                                            <div className="add-pricing-btn-wrap">
                                                <button type="button" className="add-price-btn btn btn-light d-flex align-items-center">
                                                    <i className="fa fa-plus-circle"></i>
                                                    <span>Add new address</span>
                                                </button>
                                            </div>
                                            <Form.Group className="mb-3" controlId="address">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control type="text" placeholder="Clients's address" {...register("address")} />
                                            </Form.Group>
                                        </div>


                                    </Card.Text>
                                </Card.Body>
                            </Card> */}
                        </div>
                        <div className="col-sm-4">
                            <Card className="primary-bx-shadow">
                                <div className="form-heading">
                                    <h2 className="section-title">Notifications</h2>
                                    <p>Choose how you'd like to keep this guest up to date about their appointments and sales, like vouchers and paid plans.</p>
                                </div>
                                <div className="border-b p-30">
                                    <div className="inner-heading">
                                        <h3 className="">Guest notifications</h3>
                                    </div>
                                    <Form.Group className="my-5" controlId="notification">
                                        <Form.Check
                                            {...register("email_notification")}
                                            type="switch"
                                            id="custom-switch"
                                            label="Send email notifications"
                                        />
                                    </Form.Group>
                                </div>
                                <div className="border-b p-30">
                                    <div className="inner-heading">
                                        <h3 className="">Marketing notifications</h3>
                                    </div>
                                    <Form.Group className="my-5" controlId="m-notification">
                                        <Form.Check
                                            {...register("marketing_notification")}
                                            type="switch"
                                            id="custom-switch"
                                            label="Guest accepts marketing notifications"
                                        />
                                    </Form.Group>
                                </div>
                                {/* <div className="p-30">
                                    <Form.Group className="" controlId="language">
                                        <Form.Label>Preferred language</Form.Label>
                                        <Form.Select aria-label="language" {...register("language")}>
                                            <option value="Select language">Select language</option>
                                            <option value="English">English</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="Bengali">Bengali</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div> */}
                            </Card>
                        </div>
                    </div>
                </Form>
                <Modal
                    dialogClassName="modal-90w"
                    show={show}
                    onHide={handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header className="" closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <p>This guest already exists. You want to overwrite it or keep it.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={()=>{setOverwrite(1)}} className="primaryBtn btn btn-success d-flex" >Overwrite</button>
                        <button onClick={()=>{setOverwrite(2)}}  className="primaryBtn btn btn-info d-flex" >Keep it</button>
                        {/* <Button className="category-save-btn "></Button> */}
                        {/* <Button className="category-save-btn "></Button> */}
                    </Modal.Footer>
                </Modal>
            </section>
        </>
    )
}
export default ClientAdd;