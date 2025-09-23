import React, { FC, MouseEvent, useRef, useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Form, Modal, InputGroup } from "react-bootstrap-v5";
import { useForm, SubmitHandler } from "react-hook-form";
import PhoneInput from 'react-phone-number-input'
import { useSnackbar } from 'notistack';
import { CUSTOMER_REGISTRATION } from '../../../../../gql/Mutation'
import { ALL_CLIENTS } from '../../../../../gql/Query'
import GetIp from '../../../../modules/widgets/components/GetIp';
import { useTostMessage } from '../../../../modules/widgets/components/useTostMessage';

type Props = {
    setIsOverwrite?: (a: boolean) => void
    setOverwriteObject?: (a: any) => void
    show: boolean
    handleCloseCreateClient: () => void
    guestId: (c: any) => void
}
type Inputs = {
    first_name: string;
    last_name: string
    email: string;
    mobile: string;
    additional_mobile: string;
    display_booking: boolean;
    client_source: string;
    address: string;
    gender: string;
    dob: string;
    client_info: string;
    email_notification: boolean;
    marketing_notification: boolean;
    language: string;
    suite: string;
    country: string;
    eir_code: string;
}

const CreateClientModal: FC<Props> = ({setIsOverwrite, setOverwriteObject, show, handleCloseCreateClient, guestId }) => {
    const IpHistory:any = GetIp()
    const {showToast} = useTostMessage()
    const { enqueueSnackbar } = useSnackbar();
    const [guestRegister] = useMutation(CUSTOMER_REGISTRATION, {
        refetchQueries: [{ query: ALL_CLIENTS, variables: { search: '', count: 100, page: 1 } }],
        awaitRefetchQueries: true,
    })
    // const nameRef = useRef<HTMLInputElement | null | undefined>(null);
    // const nameRef = useRef() as MutableRefObject<HTMLInputElement>;
    const nameRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const phoneNumberRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState<any>('IE')
    const [guest, setGuest] = useState<Inputs>({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        additional_mobile: '',
        display_booking: false,
        client_source: '',
        address: '',
        gender: '',
        dob: '',
        client_info: '',
        email_notification: false,
        marketing_notification: false,
        language: '',
        suite: '',
        country: '',
        eir_code: ''
    })
    const [phone, setPhone] = useState<any>()
    // console.log('phone', phone)
    useEffect(() =>{
         if(IpHistory){
            setCountryCode(IpHistory?.country_code)
        }
    },[IpHistory])
    useEffect(() => {
        setTimeout(() => {
            if (show) {
                nameRef.current.focus()
            }
        }, 1)
    }, [show])
    const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGuest((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    };
    const handleGuestCreate = async(e: MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        e.preventDefault();
        // console.log("guest submit", newOnj)
        if (guest.first_name === "") {
            nameRef.current.focus();
            showToast('First name required', 'error')
            setLoading(false);
        }
        else if (phone === undefined) {
            phoneNumberRef.current.focus();
            showToast('Phone number required', 'error')
            setLoading(false);
        }
        if (guest.first_name) {
            nameRef.current.style.border = "None";
        }
        if (phone) {
            phoneNumberRef.current.style.border = "None";
        }
        if (guest.first_name && phone) {
            const payloadString = phone + process.env.REACT_APP_SECRET_KEY
            const hash = await crypto.subtle
              .digest('SHA-256', new TextEncoder().encode(payloadString))
              .then((buffer) => Array.from(new Uint8Array(buffer)))
              .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''))
            setLoading(true);
            setOverwriteObject!({
                first_name: guest.first_name,
                last_name: guest.last_name,
                email: guest.email,
                mobile: phone,
                password: '',
                additional_mobile: guest.additional_mobile,
                client_source: guest.client_source,
                display_booking: guest.display_booking,
                gender: guest.gender,
                dob: guest.dob,
                client_info: guest.client_info,
                address: guest.address,
                marketing_notification: guest.marketing_notification,
                email_notification: guest.email_notification,
                language: ""
            })
            guestRegister({
              variables: {
                first_name: guest.first_name,
                last_name: guest.last_name,
                email: guest.email,
                mobile: phone,
                additional_mobile: '',
                client_source: '',
                display_booking: false,
                password: '',
                gender: '',
                dob: '',
                client_info: '',
                address: '',
                marketing_notification: false,
                email_notification: false,
                language: '',
                hash,
              },
            })
              .then(({data}) => {
                if (data) {
                  // console.log(data)
                  if (data?.guestRegister?.status === 1) {
                    guestId(data?.guestRegister?.data)
                    showToast(data?.guestRegister?.message, 'success')
                    setLoading(false)
                    handleCloseCreateClient()
                  }
                  if (data?.guestRegister?.status === 0) {
                    guestId(data?.guestRegister?.data)
                    setIsOverwrite!(true)
                    setLoading(false)
                  }
                }
              })
              .catch((e) => {
                showToast('New Guest Add Failed', 'error')
                setLoading(false)
              })
        }
    }
    return (
        <>
            <Modal
                dialogClassName="modal-90w"
                show={show}
                onHide={handleCloseCreateClient}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="" closeButton>
                    <h2 className="adv-price-modal-title">Add New Guest</h2>
                </Modal.Header>

                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="Guest's first name" autoFocus={true}
                                value={guest?.first_name} name="first_name" autoComplete="off"
                                onChange={handleUpdate}
                                ref={nameRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" autoComplete="off" placeholder="Guest's last name" value={guest?.last_name} name="last_name" onChange={handleUpdate} />
                        </Form.Group>
                        <Form.Group className="mb-3">
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
                        {/* <Form.Group className="mb-3" controlId="mobile">
                            <Form.Label>Mobile number</Form.Label>
                            <Form.Control type="text" autoComplete="off" placeholder="guest's phone number" value={guest?.mobile} name="mobile" onChange={handleUpdate} />
                        </Form.Group> */}
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" autoComplete="off" placeholder="Guest's email" value={guest?.email} name="email" onChange={handleUpdate} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="category-save-btn submit-btn" onClick={handleGuestCreate} disabled={loading}>
                            {!loading && <span className='indicator-label'>Save</span>}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }} >
                                    Please wait...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </Button>

                        {/* <Button onClick={handleGuestCreate} className="category-save-btn submit-btn">Save</Button> */}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default CreateClientModal
