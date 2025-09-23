import React, { FC, useState, useRef, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap-v5';
import { useMutation,useQuery } from '@apollo/client';
import { BUSINESS_SETTING } from '../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../gql/Query';
import { IBusinessSetting } from '../../../../../types';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { KTSVG } from '../../../../../_metronic/helpers';

const InvoiceSequenc:FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false)
    let invStartRef = useRef<HTMLInputElement | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [lastInvoiceNumber, setLastInvoiceNumber] = useState<number>(0);
    const [businessSetting] = useMutation(BUSINESS_SETTING,{
        refetchQueries: [{ query: BUSINESS_SETUP_Q }],
        awaitRefetchQueries: true
    });
    const { data: businessSetupData } = useQuery(BUSINESS_SETUP_Q);
    const [bSetting, setBSetting] = useState<IBusinessSetting>({
        online_booking: "",
        close_date: {
            id: "",
            business_id: 0,
            start_date: 0,
            end_date: 0,
            duration: 0,
            description: ""
        },
        invoice: {
            id: "",
            business_id: 0,
            header: "",
            footer: "",
            sub_header: "",
            invoice_no: "",
            invoice_prefix: ""
        }
    });
    const [invoiceInfo,setInvoiceInfo] = useState<any>();
    useEffect(() => {
        if (businessSetupData){
            setBSetting(businessSetupData?.businessSetting);
            setLastInvoiceNumber(businessSetupData.businessSetting.last_inv_no)
            setInvoiceInfo(businessSetupData.businessSetting.invoice)
            console.log("invoice sequence",businessSetupData.businessSetting)
        }
    }, [businessSetupData]);
    const [iseqID, setIseqId] = useState<string>("")
    const [iseqNumber, setIseqNumber] = useState<string>("");
    console.log("is sequence number",iseqNumber, lastInvoiceNumber);
    const handleSubmit=()=>{
        if (iseqNumber !== "" || iseqID){
            if (parseInt(iseqNumber) >= lastInvoiceNumber){
                setLoading(true);
                businessSetting({
                    variables: {
                        header: bSetting?.invoice?.header ? bSetting?.invoice?.header : "",
                        footer: bSetting?.invoice?.footer ? bSetting?.invoice?.footer : "",
                        sub_header: bSetting?.invoice?.sub_header ? bSetting?.invoice?.sub_header : "",
                        start_date: "",
                        end_date: "",
                        online_booking: "",
                        invoice_prefix: iseqID ? iseqID : bSetting?.invoice?.invoice_prefix,
                        invoice_no: iseqNumber ? iseqNumber : bSetting?.invoice?.invoice_no
                    }
                }).then(({ data }) => {
                    if (data?.businessSetting?.status === 1) {
                        enqueueSnackbar("Business Invoice Updated", {
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
                        setIsEdit(false);
                        setLoading(false)
                    }
                    else if (data?.businessSetting?.status === 0) {
                        enqueueSnackbar("Error", {
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
            else{
                invStartRef.current?.focus();
                enqueueSnackbar(`Number is already taken! number should be greater than ${lastInvoiceNumber} `, {
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
            
        }
        else if (iseqNumber === "") {
            invStartRef.current?.focus();
            enqueueSnackbar("Next invoice number required", {
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
                <h1>Invoice Sequencing</h1>
            </div>
            {isEdit === false && <div className='card-body py-3'>
                <div className='table-responsive'>
                    <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                        <thead>
                            <tr className='fw-bolder bg-light text-muted'>
                                <th style={{paddingLeft:"10px"}}>Invoice No. Prefix</th>
                                <th>Next Invoice Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{paddingLeft:"20px"}}>
                                <td className='ps-4'>{invoiceInfo?.invoice_prefix}</td>
                                <td>{invoiceInfo?.invoice_no}</td>
                                <td style={{cursor:"pointer"}} onClick={() => { setIsEdit(true) }}>Change</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>}
           {
                isEdit === true &&
                <div>
                
                <h1>Change sequencing</h1> 
                <Form.Group className="mb-3 col-md-4">
                    <Form.Label>Invoice No. Prefix</Form.Label>
                    <Form.Control type="text"
                        autoComplete='off'
                        defaultValue={bSetting?.invoice?.invoice_prefix}
                        name="invoice_no"
                        placeholder="e.g H22"
                        onLoadedDataCapture={(e: any) => { setIseqId(e.target.value) }}
                        onChange={(e:any) => { setIseqId(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group className="mb-3 col-md-4">
                    <Form.Label>Next Invoice Number</Form.Label>
                    <Form.Control type="text"
                        defaultValue={bSetting?.invoice?.invoice_no}
                        autoComplete='off'
                        name="invoice_prefix"
                        placeholder="Enter a number"
                        ref={invStartRef}
                        onKeyPress = {(event:any) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(e:any) => { setIseqNumber(e.target.value) }}
                    />
                </Form.Group>
                        <Button  onClick={() => { setIsEdit(false) }}>Cancel</Button>
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
           }
        </div>
    )
}

export default InvoiceSequenc
