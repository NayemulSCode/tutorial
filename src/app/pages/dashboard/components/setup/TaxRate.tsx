import React,{FC, useEffect, useRef, useState} from 'react'
import { KTSVG } from '../../../../../_metronic/helpers'
import { useHistory } from 'react-router-dom'
import GetIp from '../../../../modules/widgets/components/GetIp'
import { PROFILE_INFORMATION } from '../../../../../gql/Query'
import { useMutation, useQuery } from '@apollo/client'
import { Form } from 'react-bootstrap-v5'
import { VAT_NUMBER } from '../../../../../gql/Mutation'
import { useSnackbar } from 'notistack';

const TaxRate:FC = () => {
    // const cCodeName:any = GetIp();
    const { enqueueSnackbar } = useSnackbar();
    const [profileData, setProfileData] = useState<any>({});
    const [isVatRegister, setIsVatRegister] = useState<any>()
    const [isVatNumber, setIsVatNumber] = useState<any>()
    const [changeValue, setChangeValue] = useState<boolean>(false);
    const [vatRegister, setVatRegister] = useState<boolean>(true);
    const vatNumberRef =  React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const { data: accountData, error: accountError, loading, refetch } = useQuery(PROFILE_INFORMATION);
    useEffect(() => {
        if (accountData) {
            // refetch()
            setProfileData(accountData.profileInformation);
            setIsVatRegister(accountData.profileInformation?.business_info?.is_vat_register)
            setIsVatNumber(accountData.profileInformation?.business_info?.vat_number)
            console.log("accountData",accountData.profileInformation);
        }
    }, [accountData])
    const history = useHistory();
    const [addVatNumber] = useMutation(VAT_NUMBER);
    const handleVatNumber=(e:any)=>{
        e.preventDefault();
        if (isVatNumber === null && isVatRegister === true) {
                vatNumberRef.current.focus();
                vatNumberRef.current.style.border = "1px solid red";
                enqueueSnackbar('vat number required', {
                    variant: 'warning',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    transitionDuration: {
                        enter: 300,
                        exit: 500
                    }
                });
                // setLoading(false);
        }
        else if(changeValue === false){
             enqueueSnackbar('Have no change for update', {
                    variant: 'warning',
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
        else{
            addVatNumber({
                variables:{
                    is_vat_register: isVatRegister,
                    vat_number: isVatRegister === true? isVatNumber : null
                }
            }).then(({data})=>{
                if(data.addVatNumber.status === 1){
                    enqueueSnackbar(data.addVatNumber.message, {
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
                    refetch();
                    history.push('/business/settings')
                }
                // console.log("vat number",data);
            })
        }

        if (isVatNumber) {
            vatNumberRef.current.style.border = "None";
        }
    }
    console.log({'vat number': isVatNumber}, {'is register': isVatRegister})
    return (
        <>
            <div className='col-xl-6 mb-5'>
                <div className='flex-stack business_details_header mb-3'>
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
                    <h1 className='me-4 mb-0'>VAT Rates</h1>
                    {/* <div className="form-heading"><h2 className="section-title mb-0"></h2></div> */}

                </div>
                <div className='card'>
                    {
                        profileData?.business_info?.country === 'uk' &&
                        <div className="single-item-vat">
                            <div>
                                <p>
                                UK
                                </p>
                                <span className="text-muted fs-6">20% on both Products and Services</span>
                            </div>
                        </div>
                    }
                    {
                        profileData?.business_info?.country === 'ireland' &&
                        <div className="single-item-vat">
                            <div>
                                <p>
                                    Ireland
                                </p>
                                <span className="text-muted fs-6">23% on Products / 13.5% on Services</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div>
                <div style={{display:'flex'}}>
                    {
                        isVatRegister ?<>
                        <Form.Check
                        className="service_switch"
                            type="switch"
                            id="custom-switch"
                            defaultChecked={true}
                            onClick={()=>{setIsVatRegister(!isVatRegister); setChangeValue(true)} }
                        />
                        <span>Is Your Business VAT Registered?</span>
                        </>: <>
                        <Form.Check
                        className="service_switch"
                            type="switch"
                            id="custom-switch"
                            onClick={()=>{setIsVatRegister(!isVatRegister);} }
                        />
                        <span>Is Your Business VAT Registered?</span>
                        </>
                    }
                </div>
                {
                    isVatRegister ? 
                        <Form.Group className="mb-5 col-md-4">
                            <Form.Label>Business Registered VAT Number</Form.Label>
                            <Form.Control type="text"
                                ref={vatNumberRef}
                                name="description"
                                placeholder="Enter VAT Number here"
                                defaultValue={isVatNumber}
                                onChange={(e)=>{setIsVatNumber(e.target.value); setChangeValue(true)}}
                            />
                        </Form.Group>:<></>
               
                }
                <button className={`${changeValue ? 'btn btn-primary btn-sm': 'btn btn-sm disable'}`} onClick={handleVatNumber}>Save</button>
            </div>
        </>
    )
}

export default TaxRate
