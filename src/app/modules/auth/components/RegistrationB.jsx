import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import { Form, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap-v5';
import Gmap from "./Gmap";
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { CAMPAIGN_TRAFFIC, PARTNER_REGISTRATION, SYSTEM_LOG } from '../.../../../../../gql/Mutation';
import { useSnackbar } from 'notistack';
import 'react-phone-number-input/style.css'
// import { getCode} from 'country-list'
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"
import { toast } from 'react-toastify';
import GoogleM from './GoogleM';
import GlMap from './GlMap';
import country from './CountryList.json'
import Eircode from './Eircode';
import useGetIpInfo from '../../widgets/useGetIpInfo';
import { useTostMessage } from '../../widgets/components/useTostMessage';
import { print } from 'graphql';
import { systemLogPayload } from '../../util';

const schema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  firstName: yup
    .string()
    .matches(/^([^0-9]*)$/, "First name shouldn't contain numbers")
    .required('First name is required'),
  // location: yup
  //     .string()
  //     .required("Business location is required"),
  // country: yup
  //     .string()
  //     .matches(/^([^0-9]*)$/, "Country name shouldn't contain numbers")
  //     .required("Country name is required"),
  phoneNumber: yup
      .string()
      .required("phone number is required")
      .nullable(),
  email: yup.string().email('Email should have correct format').required('Email is required'),
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/])[A-Za-z\d@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and one special case Character'
    ),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Confirm Password does not match'),
  acceptTerms: yup.bool().oneOf([true], 'Accept Terms & privacy policy'),
})

const RegistrationB = () => {
    const history = useHistory();
    const location = useLocation(); // Get the location object
    const [countryName, setCountryName] = useState("");
    const {showToast} = useTostMessage()
    const [loading, setLoading] = useState(false)
    const [locationInforamton, setLocationInforamton] = useState({
        country: countryName ? countryName : "",
        address: "",
        lat: 0.0,
        lng: 0.0
    });
    const [address, setAddress] = useState();
    const [lati, setlati] = useState();
    const [lang, setLang] = useState();
    const [eIRcode, setEIRcode] = useState("");
    const [system_log] = useMutation(SYSTEM_LOG)

    // Set referral code in cookies on component mount using vanilla JavaScript
    useEffect(() => {
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        };
    
        const setReferralCookie = (referralCode) => {
          const d = new Date();
          d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000)); // Set the cookie to expire in 30 days
          const expires = `expires=${d.toUTCString()}`;
          document.cookie = `referralCode=${encodeURIComponent(referralCode)};${expires};path=/`;
        };
    
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        
        if (referralCode) {
          if (!getCookie('referralCode')) {
            setReferralCookie(referralCode);
          }
        }
    }, []);

    // Function to get cookie value by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const referralCode1 = getCookie("referralCode"); 
        console.log("referralCode1", referralCode1)

    const mapInformation = (address, lat, lng, countryName) => {
        setLocationInforamton({
            country:(address?.split(",")?.[address.split(",").length - 1] || '').trim(),
            address: address,
            lat: lat,
            lng: lng
        })
    }
    // Country code 
    const [countryCode, setCountryCode] = useState("IE");
    const getUserCountryCode = useGetIpInfo()
    useEffect(() => {
        if (getUserCountryCode.hasOwnProperty('country_code')) {
          setCountryCode(getUserCountryCode.country_code)
        }
    }, [getUserCountryCode])
    useEffect(()=>{
        const mapInformation = (address, lat, lng, countryName) => {
            setLocationInforamton({
                country: countryName,
                address: address,
                lat: lat,
                lng: lng
            })
            // console.log("from googlemap", address, lat, lng, countryName)
        }
    }, []);
    useEffect(()=>{
        setAddress(locationInforamton?.address);
        setlati(locationInforamton?.lat);
        setLang(locationInforamton?.lng);
        const eirextract = locationInforamton?.address?.split(",");
        let EIRCode = (eirextract[eirextract.length - 2] || "").trim();
        setEIRcode(EIRCode);
        let CountryName = (eirextract[eirextract.length - 1] || "").trim();
        setCountryName(CountryName)
        
    }, [locationInforamton])
    // console.log("country", locationInforamton.country.trim())
    const nameOfC = country.find((cnt) => cnt.name == locationInforamton.country.trim());
    // console.log("dial code", nameOfC)
    // password hide and show
    const [isPasswordShown1, setIsPasswordShown1] = useState(false);
    const [isPasswordShown2, setIsPasswordShown2] = useState(false)
    const togglePass1 = () => {
        setIsPasswordShown1(!isPasswordShown1)
    }
    const togglePass2 = () => {
        setIsPasswordShown2(!isPasswordShown2)
    }
    // validation react hook form
    const { register, formState: { errors }, handleSubmit, control } = useForm({
        // mode: "onChange",
        resolver: yupResolver(schema),
    });
    const [partnerRegister, { data: signupData, error: signupError, loading: signupLoading }] = useMutation(PARTNER_REGISTRATION, {
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
                validationErrors[key].forEach((message) => {
                    showToast(message, 'error')
                })
                })
            } else {
                // If it's a different type of error, show the general reason
                showToast(extensions.reason, 'error')
            }
            } else {
            // Handle the case where there's no detailed GraphQL error
            showToast('An unknown error occurred', 'error')
            }
        },
            
    });
    const PARTNER_REGISTRATION_STRING = print(PARTNER_REGISTRATION)
    const onSubmit = async data => {
        // console.log('submit')
        setLoading(true);
        const { firstName, lastName, email, phoneNumber, password, country, Status, businessName, location, eirCode, latitude, longitude } = data;
        // alert(JSON.stringify(data))
        const referralCode = getCookie("referralCode"); // Get the referral code from cookies
        const registerData= {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            mobile: phoneNumber? phoneNumber : "",
            business_name: businessName,
            eir_code: eIRcode ? eIRcode : "",
            location: locationInforamton.address,
            country: countryName,
            latitude: locationInforamton.lat,
            longitude: locationInforamton.lng,
            referral_code: referralCode ?? "",
        }
                    // Generate the hash using SHA-256
        const payloadString = email + process.env.REACT_APP_SECRET_KEY;
        const hash = await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(payloadString))
        .then((buffer) => Array.from(new Uint8Array(buffer)))
        .then((hashArray) =>
            hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
        );
        partnerRegister({
            variables: {...registerData, hash}
        }).then(({ data }) => {
            // console.log(data)
            if (data) {
                showToast(data.partnerRegister.message, 'success')
                history.push("/")
            }
            setLoading(false);
        }).catch(e => {
            system_log({
              variables: {
                ...systemLogPayload,
                api: PARTNER_REGISTRATION_STRING,
                type: 'partner-registration-error',
                body: JSON.stringify({...registerData, password: ""}),
                exception: JSON.stringify(e),
              },
            })
            console.log(e);
            showToast('Registration failed', 'error')
            setLoading(false);
        })
        // console.log(data)
    }

    useEffect(() => {
        if (signupData) {
            // console.log(signupData);
        }
        if (signupError) {
            // console.log(signupError);
        }
    }, [signupData])
    const toggleVisibility = async () => {
        const getPassword = document.getElementById("password");
        if (getPassword.type === "password") {
            getPassword.type = "text";
        }
        else {
            getPassword.type = "password";

        }
    }
    const toggleconfirm_password = async () => {
        const getPassword = document.getElementById("confirm_password");
        if (getPassword.type === "password") {
            getPassword.type = "text";
        }
        else {
            getPassword.type = "password";

        }
    }
    const handleWhiteSpce = (e) => {
        e = e || window.event;
        const value = e.target.value;
        let key = e.charCode;
        if (key === 32 && value === "") {
            e.preventDefault();
        }
    }

    const referralCode = getCookie("referralCode");
    const [campaignTraffic] = useMutation(CAMPAIGN_TRAFFIC, {
        refetchQueries: [{
            referral_code: referralCode,
        }],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (referralCode) {
        campaignTraffic({
            variables: {
              referral_code: referralCode,
            },
          });
        }
      }, [referralCode, campaignTraffic]);

    return (
      <div className='w-lg-700px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
        <section id='businessSignUp'>
          <div className='mailLoginWrap'>
            <div className='LoginInner'>
              <div className='LogoWrap'>
                {/* <Link to="/login" className="BackHome">
                                <img src={arrow} alt="icon" />
                            </Link>
                            <Link to="/home" className="Logo">
                                <img src={Logo} alt="Logo" />
                            </Link> */}
                <span></span>
              </div>
              <div className='LoginTop'>
                <h1 className='text-dark mb-4 text-center'>30 Day Trial of Chuzeday Business</h1>
                <Form onSubmit={handleSubmit(onSubmit)} className='signUpForm'>
                  <div className='formInput'>
                    <Row className='mb-3'>
                      <Form.Group className='' controlId='formGridBusinessName'>
                        <Form.Label className='required'>Business Name</Form.Label>
                        <Form.Control
                          className={clsx('form-control form-control-md form-control-solid')}
                          type='text'
                          name='businessName'
                          {...register('businessName')}
                          autoComplete='off'
                          onKeyPress={(e) => {
                            handleWhiteSpce(e)
                          }}
                          error={!!errors.businessName}
                        />
                        <span style={{color: 'red', fontSize: '14px'}}>
                          {errors?.businessName?.message}
                        </span>
                      </Form.Group>
                    </Row>
                    <Row className=''>
                      <span className='text-gray-400 fw-bold mb-3'>Owner</span>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='pe-sm-3 mb-3'
                        controlId='formGridFirstName'
                      >
                        <Form.Label className='required'>First Name</Form.Label>
                        <Form.Control
                          className={clsx('form-control form-control-md form-control-solid')}
                          type='text'
                          placeholder='First Name'
                          name='firstName'
                          {...register('firstName')}
                          autoComplete='off'
                          onKeyPress={(e) => {
                            handleWhiteSpce(e)
                          }}
                          error={!!errors.firstName}
                        />
                        <span style={{color: 'red', fontSize: '14px'}}>
                          {errors?.firstName?.message}
                        </span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='ps-sm-3 mb-3'
                        controlId='formGridLastName'
                      >
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          className={clsx('form-control form-control-md form-control-solid')}
                          type='text'
                          placeholder='Last Name'
                          name='lastName'
                          {...register('lastName')}
                          autoComplete='off'
                        />
                        {/* <span style={{ color: 'red', fontSize: "14px" }}>{errors?.lastName?.message}</span> */}
                      </Form.Group>
                    </Row>

                    <Row className=''>
                      <span className='text-gray-400 fw-bold mb-3'>Address</span>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='pe-sm-3 mb-4'
                        controlId='formGridCountryName'
                      >
                        {/* <Form.Label>Country</Form.Label>
                                            <Form.Control readOnly style={{cursor: 'no-drop'}} type="text" className={clsx('form-control form-control-md form-control-solid')} placeholder="Contry Name" defaultValue={countryName ? countryName : locationInforamton.country} {...register('country')}
                                            /> */}
                        {/* <Form.Label>Country</Form.Label>
                                        <Form.Select
                                            className={clsx('form-select form-select-md form-select-solid')}
                                            value={countryName}
                                            {...register('country')}
                                        >
                                            <option value="">Country</option>
                                            <option value="Ireland">Ireland</option>
                                            <option value="UK">UK</option>
                                        </Form.Select>

                                            <span style={{ color: 'red', fontSize: "13px" }}>{errors?.country?.message}</span> */}
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='ps-sm-3 mb-4'
                        controlId='formGridEirCode'
                      >
                        {/* <Form.Label>EIR Code</Form.Label>
                                            <Form.Control type="text" className={clsx('form-control form-control-md form-control-solid')} placeholder="Town Name" name="eirCode" {...register('eirCode')} /> */}
                        {/* <Eircode mapInformation={mapInformation} /> */}
                      </Form.Group>
                    </Row>
                    <Row className='mb-4'>
                      <div className='map'>
                        {/* <Gmap /> */}
                        <Eircode mapInformation={mapInformation} />
                        {/* <GlMap mapInformation={mapInformation} address={address} lati={lati} lang={lang} /> */}
                        {/* <GoogleM mapInformation={mapInformation} /> */}
                      </div>
                    </Row>
                    <Row className='b-location-bottom-row'>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='mb-3 pe-sm-3'
                        controlId='formGridMobileNo'
                      >
                        <Form.Label className='required'>Mobile number</Form.Label>
                        <InputGroup className='mb-3'>
                          <InputGroup.Text id='basic-addon1' className='input-mobile'>
                            {' '}
                            <PhoneInputWithCountry
                              countrySelectProps={{unicodeFlags: true}}
                              autoComplete='off'
                              defaultCountry={countryCode}
                              name='phoneNumber'
                              control={control}
                              placeholder='Enter phone number'
                              international
                              withCountryCallingCode
                              error={!!errors.phoneNumber}
                            />
                          </InputGroup.Text>
                        </InputGroup>
                        <span style={{color: 'red', fontSize: '14px'}}>
                          {errors?.phoneNumber?.message}
                        </span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='mb-3 ps-sm-3'
                        controlId='formGridEmail'
                      >
                        <Form.Label className='required'>Email address</Form.Label>
                        <Form.Control
                          className={clsx('form-control form-control-md form-control-solid')}
                          type='email'
                          placeholder='Your Email Address'
                          name='email'
                          {...register('email')}
                          autoComplete='off'
                          onKeyPress={(e) => {
                            handleWhiteSpce(e)
                          }}
                          error={!!errors.email}
                        />
                        <span style={{color: 'red', fontSize: '14px'}}>
                          {errors?.email?.message}
                        </span>
                      </Form.Group>
                    </Row>
                    <Row className='mb-md-4 mb-4'>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='pe-sm-3 mb-3 mb-md-0'
                        controlId='formGridPassword'
                      >
                        <Form.Label className='required'>Password</Form.Label>
                        <div className='passWrap1'>
                          <Form.Control
                            className={clsx('form-control form-control-md form-control-solid')}
                            type='password'
                            id='password'
                            placeholder='Create Password'
                            {...register('password')}
                            onKeyPress={(e) => {
                              handleWhiteSpce(e)
                            }}
                            error={!!errors.password}
                          />
                          <span>
                            <i
                              className={`${toggleVisibility ? 'fa fa-eye' : 'fa fa-eye-slash'}`}
                              onClick={toggleVisibility}
                            ></i>
                          </span>
                          {/* <span><input type="checkbox" onClick={toggleVisibility} /></span> */}
                        </div>
                        <span style={{color: 'red', fontSize: '14px'}}>
                          {errors?.password?.message}
                        </span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md={6}
                        className='ps-sm-3 mb-3 mb-md-0'
                        controlId='formGridConfirmPassword'
                      >
                        <Form.Label className='required'>Confirm Password</Form.Label>
                        <div className='passWrap2'>
                          <Form.Control
                            className={clsx('form-control form-control-md form-control-solid')}
                            type='password'
                            placeholder='Confirm Password'
                            id='confirm_password'
                            {...register('confirm_password')}
                            onKeyPress={(e) => {
                              handleWhiteSpce(e)
                            }}
                            error={!!errors.confirm_password}
                          />
                          <span>
                            <i
                              className={`${
                                toggleconfirm_password ? 'fa fa-eye' : 'fa fa-eye-slash'
                              }`}
                              onClick={toggleconfirm_password}
                            ></i>
                          </span>
                          {/* <span><input type="checkbox" onClick={toggleconfirm_password} /></span> */}
                        </div>
                        <span style={{color: 'red', fontSize: '14px'}}>
                          {errors?.confirm_password?.message}
                        </span>
                      </Form.Group>
                    </Row>
                    <div className='reg-check-wrap d-flex'>
                      <Form.Group className='mb-3 me-2' id='formGridCheckbox'>
                        <Form.Check
                          className='form-check-sm form-check-custom form-check-solid'
                          type='checkbox'
                          name='acceptTerms'
                          {...register('acceptTerms')}
                          error={!!errors.acceptTerms}
                        />
                      </Form.Group>
                      <span className='text-dark fs-6 fw-bolder'>
                        I agree to the
                        <a
                          className='privacy-terms'
                          href='https://chuzeday.com/system/privacy-policy'
                          target='_blank'
                        >
                          {' '}
                          privacy policy
                        </a>
                        ,
                        <a className='privacy-terms' href='/website-terms' target='_blank'>
                          {' '}
                          website terms
                        </a>{' '}
                        and
                        <a className='privacy-terms' href='/booking-terms' target='_blank'>
                          {' '}
                          booking terms
                        </a>
                      </span>
                    </div>
                    <span style={{color: 'red', fontSize: '14px'}}>
                      {errors?.acceptTerms?.message}
                    </span>
                  </div>
                  {/* <Button className='btn btn-lg btn-primary w-100 my-4' type="submit">
                                    Sign Up
                                </Button> */}
                  <div className='text-center'>
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-lg btn-primary w-100 mb-5'
                      disabled={loading}
                    >
                      {!loading && <span className='indicator-label'>Sign Up</span>}
                      {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </button>
                  </div>
                </Form>
              </div>
              <div className='LoginBottom text-center'>
                <h3>Already have an account?</h3>
                <Link to='/auth/login' className='link-primary fs-6 fw-bolder'>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
}

export default RegistrationB
