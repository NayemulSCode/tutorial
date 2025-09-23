
import React, { FC, useState, useEffect, useRef, MouseEvent } from "react"
import { Link, useHistory, useParams } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, InputGroup, TabContent } from "react-bootstrap-v5";
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-number-input'
import { GUEST_PROFILE_UPDATE } from '../../../../../gql/Mutation';
import { GET_ALL_SERVICES, ALL_PRODUCT_CATEGORY, ALL_STAFF_INFO, SINGLE_CLIENT } from '../../../../../gql/Query';
import { IStaff } from "../../../../../types";
import moment from 'moment'
import GetIp from "../../../../modules/widgets/components/GetIp";
import GuestBlockConfirmation from "../../../../modules/widgets/components/GuestBlockConfirmation";

type QuizParams = {
    id: string;
};
type IData = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    address: string;
    additional_mobile: string;
    client_source: string;
    display_booking: boolean;
    client_info: string;
    language: string;
    marketing_notification: boolean;
    email_notification: boolean;
    photo: string;
    suite: string;
    country: string;
    eir_code: string;
    block_with_video:boolean;
    block_without_video:boolean;
}

const ClientEdit: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { id } = useParams<QuizParams>();
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [displayBooking, setDisplayBooking] = useState<boolean>(false);
    const [emailNotification, setEmailNotification] = useState<boolean>(false);
    const [marketingNotification, setMarketingNotification] = useState<boolean>(false);
    const [blockWithVideo, setBlockWithVideo] = useState<boolean>(false);
    const [blockWithoutVideo, setBlockWithoutVideo] = useState<boolean>(false);
    const [unblockConfirmation, setUnblockConfirmation] = useState<boolean>(false);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);
    // guest block confirmation modal
    const [blockGuestModal, setBlockGuestModal] = useState(false);
    const openBlockGuestModal = () => setBlockGuestModal(true);
    const closeBlockGuestModal = () => setBlockGuestModal(false);

    const guestGender = ["Male", "Female", "Others"];
    const IpHistory:any = GetIp()
    const [countryCode, setCountryCode] = useState<any>('IE')
    const [phone, setPhone] = useState<any>()  
    const [client, setClient] = useState<IData>({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        dob: "",
        gender: "",
        address: "",
        additional_mobile: "",
        client_source: "",
        display_booking: false,
        client_info: "",
        email_notification: false,
        marketing_notification: false,
        language: "",
        photo: "",
        suite: "",
        country: "",
        eir_code: "",
        block_with_video: false,
        block_without_video:false
    });
    const nameRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const mobileRef =React.useRef() as React.MutableRefObject<HTMLInputElement>;
    // let mobile = useRef<HTMLInputElement | null>(null);
    // console.log("initial state>>>>>", client)
    const { data: clientData, error: clientError, refetch } = useQuery(SINGLE_CLIENT, {
        variables: {
            id: +id
        }
    });
    useEffect(() =>{
         if(IpHistory){
            setCountryCode(IpHistory?.country_code)
        }
    },[IpHistory])
    useEffect(() => {
        if (clientData) {
            // console.log("client data for edit>>", clientData)
            refetch();
            setClient(clientData.client);
            setPhone(clientData?.client?.mobile)
            setEmailNotification(clientData?.client?.email_notification);
            setMarketingNotification(clientData?.client?.marketing_notification);
            setDisplayBooking(clientData?.client?.display_booking);
            setBlockWithVideo(clientData?.client?.client_block?.block_with_video);
            setDisabledButton(clientData?.client?.client_block?.block_with_video)
            setBlockWithoutVideo(clientData?.client?.client_block?.block_without_video);
            setUnblockConfirmation(clientData?.client?.client_block?.block_without_video);
        }
        if (clientData?.client.dob) {
            setDateOfBirth(moment.unix(clientData?.client?.dob).format('YYYY-MM-DD'))
        }
        if (clientError) {
            // console.log(clientError)
        }
    }, [clientData])

    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [guestProfileUpdate] = useMutation(GUEST_PROFILE_UPDATE, {
        onError(err: any) {
            setLoading(false)
            // if (err?.graphQLErrors[0]?.extensions?.validation?.email) {
            //     enqueueSnackbar(err?.graphQLErrors[0]?.extensions?.validation?.email[0], {
            //         variant: 'error',
            //         anchorOrigin: {
            //             vertical: 'top',
            //             horizontal: 'right',
            //         },
            //         transitionDuration: {
            //             enter: 300,
            //             exit: 500
            //         }
            //     });
            //     setLoading(false)
            // }
            if (err?.graphQLErrors[0]?.extensions?.validation?.mobile) {
                enqueueSnackbar(err?.graphQLErrors[0]?.extensions?.validation?.mobile[0], {
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
                setLoading(false)
            }
        }
    });

    const handleUpdate = (e: any) => {
        const { name, value } = e.target;
        // console.log("update", name, value)
        setClient((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (client.first_name === "") {
            nameRef.current.focus();
            nameRef.current.style.border = "1px solid red";
            enqueueSnackbar("First name is empty", {
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
        } else if (phone === "" || undefined) {
            mobileRef.current.focus();
            mobileRef.current.style.border = "1px solid red";
            enqueueSnackbar("Mobile number is empty", {
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
        } else {
            setLoading(true)
            guestProfileUpdate({
                variables: {
                    id: client.id,
                    first_name: client.first_name,
                    last_name: client.last_name,
                    email: client.email,
                    mobile: phone,
                    dob: dateOfBirth,
                    gender: client.gender,
                    address: client.address,
                    additional_mobile: client.additional_mobile,
                    client_source: client.client_source,
                    display_booking: displayBooking,
                    client_info: client.client_info,
                    email_notification: emailNotification,
                    marketing_notification: marketingNotification,
                    block_with_video: blockWithVideo,
                    block_without_video: blockWithoutVideo,
                    language: "",
                    photo: "",
                    suite: "",
                    country: "",
                    eir_code: "",
                }
            }).then(({ data }) => {
                // console.log("guest update",data);
                setLoading(false)
                if (data.guestProfileUpdate.status === 1){
                    enqueueSnackbar(data.guestProfileUpdate.message, {
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
                    history.push('/guests')
                }
                if (data.guestProfileUpdate.status === 0) {
                    enqueueSnackbar(data.guestProfileUpdate.message, {
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
            }).catch((e) => {
                enqueueSnackbar("Something went wrong!!!", {
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
                setLoading(false)
            })
        } 
        if (client.first_name) {
            nameRef.current.style.border = "None";
        }
        if (phone) {
            mobileRef.current.style.border = "None";
        }
    };

    const toggleBlock=( video:boolean, value: boolean)=>{
        if(video){
            setBlockWithVideo(value)
            if(blockWithoutVideo){
                setBlockWithoutVideo(false)
            }
        }else{
            setBlockWithoutVideo(value)
            if(blockWithVideo){
                setBlockWithVideo(false);
            }
        }
    }
    // console.log("unblockConfirmation && blockWithoutVideo", unblockConfirmation , blockWithoutVideo)
    return (
        <>
            <section id="product-add" className="add-product-form ptc">
                <Form >
                    <div className="toolbar">
                        <Link className="close-btn" to="/guests"><i className="fas fa-times"></i></Link>
                        <h2 className="page-title mb-0">Update guest</h2>
                        {/* <button type="submit" onClick={handleSubmit} className="submit-btn save-btn">Update</button> */}

                        <button
                            onClick={(e:any)=>{
                                if (blockWithVideo || blockWithoutVideo) {
                                    e.preventDefault();
                                    openBlockGuestModal();
                                }
                                else if(unblockConfirmation && blockWithoutVideo === false){
                                    e.preventDefault();
                                    openBlockGuestModal();
                                }
                                else{
                                    handleSubmit(e);
                                }
                            }}
                            type='submit'
                            id='kt_sign_in_submit'
                            className="submit-btn save-btn"
                            disabled={loading}
                        >
                            {!loading && <span className='indicator-label' >Update</span>}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }}>
                                    Updating...
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
                                                        <Form.Control ref={nameRef} type="text" placeholder="Guests first name" name="first_name" autoComplete="off"
                                                            value={client?.first_name} onChange={handleUpdate} />

                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="lastName">
                                                        <Form.Label>Last name</Form.Label>
                                                        <Form.Control type="text" placeholder="Guests last name" name="last_name" autoComplete="off"
                                                            onChange={handleUpdate} value={client?.last_name} />
                                                    </Form.Group>

                                                </Col>
                                                <Col sm={6}>
                                                <Form.Group className="mb-3"  >
                                                    <Form.Label htmlFor="inlineFormInputGroup">
                                                        Mobile Number*
                                                    </Form.Label>
                                                    <InputGroup className="Number d-block" ref={mobileRef}>
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
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">mobile</InputGroup.Text>
                                                            <Form.Control ref={mobileRef} type="text" placeholder="guests mobile number" name="mobile" autoComplete="off"
                                                                onChange={handleUpdate} value={client.mobile} />

                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col> */}
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="email">
                                                        <Form.Label>Email address</Form.Label>
                                                        <Form.Control type="email" placeholder="Guests email" name="email" autoComplete="off"
                                                            onChange={handleUpdate} value={client.email} />

                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3" controlId="gender">
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Select aria-label="gender" name="gender" onChange={handleUpdate}>
                                                    <option value="" disabled selected>Choose</option>
                                                    {
                                                        guestGender.map(user => <option value={user} selected={user == client.gender}>{user}</option>)
                                                    }
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="dob">
                                                <Form.Label>Date of birth</Form.Label>
                                                <Form.Control type="date" name="dob" onChange={(e) => { setDateOfBirth(e.target.value); }}
                                                    value={dateOfBirth}
                                                />
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
                                                <Form.Control as="textarea" name="client_info" onChange={handleUpdate}
                                                    value={client.client_info} rows={3} type="text" placeholder="E.g. allergy to shampoos with sodium" />
                                            </Form.Group>
                                            <Form.Group className="staff d-flex align-items-center">
                                                <Form.Check type="checkbox" className="me-3" name="display_booking"
                                                    onClick={() => { setDisplayBooking(!displayBooking) }} checked={displayBooking ? true : false} />
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
                                                    <Form.Control type="number" name="additional_mobile" onChange={handleUpdate}
                                                        value={client.additional_mobile} placeholder="Guests additional phone number" />
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="clientSource">
                                                <Form.Label>Guest source</Form.Label>
                                                <Form.Select aria-label="clientSource" name="client_source" onChange={handleUpdate} value={client.client_source} >
                                                    <option value="Walkin">Walk-In</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="address">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control type="text" name="address" onChange={handleUpdate} value={client.address} placeholder="Guests address" />
                                            </Form.Group>
                                        </div>

                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-sm-4">
                            <Card className="primary-bx-shadow mb-5">
                                <div className="form-heading">
                                    <h2 className="section-title">Block Guest</h2>
                                    <p>Prevent this Guest making further booking, either Fully Block OR Allow a Video Consultation before making your final decision</p>
                                    <p>Cancel all Future Appointments OR 'Put on Hold' for 1 week to allow a Video Call After 1 week with no Video Call all future Appointments will be Cancelled</p>
                                </div>
                                <div className="border-b p-30">
                                    <div className="inner-heading">
                                        <h3 className="">Block: Video Call & Hold Appointments</h3>
                                    </div>

                                    <Form.Group className="my-5" controlId="notification">
                                        <Form.Check
                                            checked={blockWithVideo ? true : false}
                                            disabled={disabledButton ? true : false}
                                            type="switch"
                                            id="custom-switch"
                                            label="Guest will be notified to arrange Video Consultation within 1 week or all future appointments will be cancelled"
                                            onChange={()=>{toggleBlock(true, !blockWithVideo);}}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="border-b p-30">
                                    <div className="inner-heading">
                                        <h3 className="">Block: No Call & Cancel Appointments</h3>
                                    </div>
                                    <Form.Group className="my-5" controlId="m-notification">
                                        <Form.Check
                                            checked={blockWithoutVideo ? true : false}
                                            type="switch"
                                            id="custom-switch"
                                            label="Guest will be notified that they can no longer make bookings with your Business and all Future Appointments have been cancelled"
                                           onChange={()=>{toggleBlock(false, !blockWithoutVideo); }}
                                        />
                                    </Form.Group>
                                </div>
                            </Card>
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
                                            checked={emailNotification ? true : false}
                                            type="switch"
                                            id="custom-switch"
                                            label="Send email notifications"

                                            onClick={() => { setEmailNotification(!emailNotification) }}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="border-b p-30">
                                    <div className="inner-heading">
                                        <h3 className="">Marketing notifications</h3>
                                    </div>
                                    <Form.Group className="my-5" controlId="m-notification">
                                        <Form.Check
                                            checked={marketingNotification ? true : false}
                                            type="switch"
                                            id="custom-switch"
                                            label="Guest accepts marketing notifications"
                                            onClick={() => { setMarketingNotification(!marketingNotification) }}
                                        />
                                    </Form.Group>
                                </div>
                            </Card>
                        </div>

                    </div>
                </Form>
                <GuestBlockConfirmation
                    blockGuestModal={blockGuestModal}
                    isUnblockGuest = {unblockConfirmation && blockWithoutVideo === false ? true : false}
                    closeBlockGuestModal={closeBlockGuestModal}
                    handleSubmit={handleSubmit}
                />
            </section>
        </>
    )
}

export { ClientEdit };