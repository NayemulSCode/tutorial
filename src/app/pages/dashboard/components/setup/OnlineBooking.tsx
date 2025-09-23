import React, { FC, useState, useEffect} from 'react'
import { Button, FormCheck,Form, Col } from 'react-bootstrap-v5'
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';
import { BUSINESS_SETTING } from '../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../gql/Query';
import { KTSVG } from '../../../../../_metronic/helpers';
import { useHistory } from 'react-router-dom';
import { useRef } from 'react';

const cancellationPolicies = [
    {
        id: 1,
        value: 1,
        policy_title: '50% within 48 hours'
    },
    {
        id: 2,
        value: 2,
        policy_title: '100% on the day of the booking'
    },
    {
        id: 3,
        value: 3,
        policy_title: 'Notify(You will receive a notification to accept or reject a charge against your guest who has cancelled within the selected.)'
    }
]

const OnlineBooking:FC = () => {
    const history = useHistory();
    var cnvt: any[] = []
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false)
    const [isOnlineBooking, setIsOnlineBooking] = useState<Boolean>(false);
    const [isVideoVetting, setIsVideoVetting] = useState<Boolean>(false);
    const [onlineBooked, setOnlineBooked] = useState<any>();
    const [videoVetting, setVideoVetting] = useState<any>();
    const [advancePayRate, setAdvancePayRate] = useState<number>(0.0)
    const [upfront, setUpfront] = useState<any>(0)
    const [selectedPolicies, setSelectedPolicies] = useState<Array<any>>([])
    const [checkedCheckboxes, setCheckedCheckboxes] = useState<Array<any>>([])
    const [policyEdit, setPolicyEdit] = useState<boolean>(false)
    const [firstTimeCpolicy, setFirstTimeCpolicy] = useState<boolean>(false)
    const [businessSetting] = useMutation(BUSINESS_SETTING,{
        refetchQueries: [{ query: BUSINESS_SETUP_Q }],
        awaitRefetchQueries: true
    });
    const { data: businessSetupData } = useQuery(BUSINESS_SETUP_Q);
    useEffect(()=>{
        if (videoVetting === "1"){
            setIsVideoVetting(true);
        }
        if(onlineBooked === "1"){
            setIsOnlineBooking(true)
        }
    }, [onlineBooked, videoVetting])
    useEffect(() => {
        if (businessSetupData) {
            setAdvancePayRate(businessSetupData?.businessSetting?.upfront_amount)
            setUpfront(businessSetupData?.businessSetting?.upfront_amount)
            setOnlineBooked(businessSetupData?.businessSetting?.online_booking)
            setVideoVetting(businessSetupData?.businessSetting?.video_vetting)
            setSelectedPolicies( businessSetupData?.businessSetting?.cancellation ?
                businessSetupData?.businessSetting?.cancellation.map((policy:any)=>({
                value: policy.value
            })) : [])
            console.log("online booking", businessSetupData.businessSetting)
        }
    }, [businessSetupData]);
    console.log('upfront', upfront)


    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);
        businessSetting({
            variables: {
                header: "",
                footer: "",
                sub_header: "",
                start_date: "",
                end_date: "",
                online_booking: isOnlineBooking === true ? "1" : "0",
                invoice_prefix: "",
                invoice_no: "",
                upfront_amount: advancePayRate ? advancePayRate : upfront,
                video_vetting: isVideoVetting === true? "1": "0",
                cancellation: policyEdit === true || firstTimeCpolicy === true ? checkedCheckboxes : selectedPolicies
            }
        }).then(({ data }) => {
            if (data?.businessSetting?.status === 1) {
                enqueueSnackbar(data?.businessSetting?.message, {
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
                setLoading(false)
                history.push("/business/settings")
            }
            else if (data?.businessSetting?.status === 0) {
                enqueueSnackbar(data?.businessSetting?.message, {
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
        })
    } 
    const depositPaymentRef = useRef<HTMLInputElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("")
    const handleWhiteSpce = (e: any) => {
        e = e || window.event;
        const value = e.target.value
        let key = e.charCode;
        if (key === 32 && value === "") {
            e.preventDefault();
        }
    }
    const inputValidation=(e:any)=>{
        const value = e.target.value;
        if( +value > 100){
            setErrorMessage("Diposite payment must be lower than 100")
        }
        else{
            setErrorMessage("")
        }
        
    }
    console.log("cancellation-->", selectedPolicies);
    console.log("selected cancelation-->",  JSON.stringify(checkedCheckboxes));
    // for add policy first time
    const handleCheckboxChange = (id:any) => {
        setFirstTimeCpolicy(true)
        const isChecked = checkedCheckboxes.some(checkedCheckbox => checkedCheckbox.value == id)
        if (isChecked) {
            setCheckedCheckboxes(
                checkedCheckboxes.filter(
                    (checkedCheckbox) => checkedCheckbox.value != id
                )
            );
        } else {
            setCheckedCheckboxes(checkedCheckboxes.concat({value: id}));
        }
    };
    const handleSingleCheck = (id: any) => {
      setPolicyEdit(true)

      // Create a shallow copy of the selectedPolicies array
      const selected = [...selectedPolicies]
      const index = selected.findIndex((i) => i.value == id)

      if (index > -1) {
        // If the item is found, create a new array without it
        setCheckedCheckboxes([...selected.slice(0, index), ...selected.slice(index + 1)])
      } else {
        // If the item is not found, create a new array with it added
        setCheckedCheckboxes([...selected, {value: id}])
      }
    }

    return (
        <div>
            <div className='flex-stack business_details_header'>
                <div className='mr-2'>
                    <button
                        onClick={() => { history.push("/business/settings") }}
                        type='button'
                        className='btn btn-lg btn-light-primary me-3'
                        data-kt-stepper-action='previous'
                    >
                        <KTSVG
                            path='/media/icons/duotune/arrows/arr063.svg'
                            className='svg-icon-4 me-1'
                        />
                    </button>
                </div>
                <h1 className='me-4 mb-0'>Online Booking</h1>
            </div>
            <span className='onlineBooking_info'>
                {
                    onlineBooked === "1" ? <><FormCheck defaultChecked onClick={() => { setIsOnlineBooking(!isOnlineBooking) }} ></FormCheck><span className='fs-5 text-dark onlineBooked_checked' >Online booking availability</span></> :
                        <><FormCheck onClick={() => { setIsOnlineBooking(!isOnlineBooking) }} ></FormCheck><span className='fs-5 text-dark onlineBooked_checked'>Online booking availability</span></>
                }
            </span>
            <span className='onlineBooking_info'>
                {
                    videoVetting === "1" ? <><FormCheck defaultChecked onClick={(e: any) => { setIsVideoVetting(!isVideoVetting) }} ></FormCheck><span className='fs-5 text-dark onlineBooked_checked'>Consultation Video Call</span></> :
                        <><FormCheck onClick={(e: any) => { setIsVideoVetting(!isVideoVetting) }} ></FormCheck><span className='fs-5 text-dark onlineBooked_checked'>Consultation Video Call</span></>
                }
            </span>
            <span className=''>The Business you are booking with requires that all new Guests complete a Consultation Video Call before completing the requested booking... please book a time to meet with the Business on-line using Chuzeday Video and discuss your planned service booking.</span>
            <Form.Group className="mb-3 col-md-4 mt-3">
                <Form.Label>Deposit Payment %</Form.Label>
                <p>If the deposit is set as 30% guest will be required to pay 30% the price of a service upon booking</p>
                <Form.Control 
                    type="text"
                    value={advancePayRate}
                    name="deposit_payment"
                    placeholder="Enter the rate of amount"
                    ref={depositPaymentRef}
                    onChange={(e: any) => { setAdvancePayRate(e.target.value); inputValidation(e) }}
                    onKeyPress={(e: any) => {
                        handleWhiteSpce(e);
                        if (/([^+0-9]+)/gi.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
                {errorMessage !== "" ? <p style={{color: 'red'}}>{errorMessage}</p> : "" }
            </Form.Group>
          
            <h2>Cancellation Policy</h2>
            <p>You can check all 3 boxes</p>
            {
                selectedPolicies?.length > 0 ? (
                    cancellationPolicies.map((policy: any, index: any) => {
                    console.log("🚀 ~ cancellationPolicies.map ~ policy:", policy)

                        return (
                          // for edit policy
                          <>
                            <Form.Group
                              as={Col}
                              md={4}
                              className='staff d-flex mb-5 align-items-center'
                            >
                              {selectedPolicies.length > 0 && selectedPolicies.some(i => i.value == policy.value) ? (
                                <Form.Check
                                  type='checkbox'
                                  className='me-2'
                                  value={policy.value}
                                  defaultChecked
                                  onChange={() => handleSingleCheck(policy.value)}
                                />
                              ) : (
                                <Form.Check
                                  type='checkbox'
                                  className='me-2'
                                  value={policy.value}
                                  onChange={() => handleSingleCheck(policy.value)}
                                />
                              )}
                              <h5 className='staff-name'>{policy.policy_title}</h5>
                            </Form.Group>
                          </>
                        )
                    })
                ):(
                    // for first time policy add
                    cancellationPolicies.map((policy: any, index: any) => {
    
                        return (
                            <>
                                <Form.Group as={Col} md={4} className="staff d-flex mb-5 align-items-center">
                                   
                                    <Form.Check type="checkbox" className="me-2"
                                        key={`cb-${index}`}
                                        value={policy.value}
                                        checked={checkedCheckboxes.some(checkedCheckbox => checkedCheckbox.value == policy.value)}
                                        onChange={() => handleCheckboxChange(policy.value)}
                                    />
                                    <h5 className="staff-name">{policy.policy_title}</h5>
                                </Form.Group>
                            </>
                        )
                    })
                )
            }
            <Button style={{ marginLeft: "10px" }} onClick={handleSubmit} disabled={loading}>
                {!loading && <span className='indicator-label' >Save</span>}
                {loading && (
                    <span className='indicator-progress' style={{ display: 'block' }}>
                        Saving...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                )}
            </Button>
        </div>
    )
}

export default OnlineBooking
