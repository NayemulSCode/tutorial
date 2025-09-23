import { useMutation, useQuery } from '@apollo/client';
import React, { FC, useState, useEffect } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { BUSINESS_SETTING } from '../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../gql/Query';
import { IBusinessSetting } from '../../../../../types';
import { useSnackbar } from 'notistack';
import { KTSVG } from '../../../../../_metronic/helpers';
import { useHistory } from 'react-router-dom';

const SetupInvoice:FC = () => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const businessName: any = localStorage.getItem("partner");
    const invoiceHeader = JSON.parse(businessName);
    const header = invoiceHeader?.business_info?.name;
    const [invoiceData, setInvoiceData] = useState<any>({
        inv_header: header ? (header) : "",
        inv_sub_header: "",
        inv_footer:""
    })
    const [businessSetting] = useMutation(BUSINESS_SETTING, {
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
            invoice_no:"",
            invoice_prefix: ""
        }
    });
    const [loading, setLoading]= useState<boolean>(false);
    useEffect(() => {
        if (businessSetupData) {
            setBSetting(businessSetupData?.businessSetting)
            console.log("invoice header footer",businessSetupData.businessSetting)
        }
    }, [businessSetupData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;
        setInvoiceData((preValue: any) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);
        businessSetting({
            variables: {
                header: invoiceData.inv_header,
                footer: invoiceData.inv_footer ? invoiceData.inv_footer : bSetting?.invoice?.footer,
                sub_header: invoiceData.inv_sub_header ? invoiceData.inv_sub_header : bSetting?.invoice?.sub_header,
                start_date: "",
                end_date: "",
                description: "",
                online_booking:"",
                invoice_prefix: bSetting?.invoice?.invoice_prefix,
                invoice_no: bSetting?.invoice?.invoice_no?.toString()
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
                setLoading(false);
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
                setLoading(false);
            }
        })
    }

    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
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
                <h1 className='me-4 mb-0'>Custom Invoice</h1>
            </div>
            <Form onSubmit={handleSubmit} className='mt-3'>
                <Form.Group className="mb-3 col-md-10">
                    <Form.Label>Invoice header</Form.Label>
                    <Form.Control type="text"
                        defaultValue={invoiceHeader?.business_info?.name}
                        autoComplete='off'
                        name="inv_header"
                        placeholder="business name"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3 col-md-10">
                    <Form.Label>Invoice sub-header</Form.Label>
                    <Form.Control type="text"
                        defaultValue= {bSetting?.invoice?.sub_header}
                        autoComplete='off'
                        name= "inv_sub_header"
                        placeholder="Address"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3 col-md-10">
                    <Form.Label>Invoice footer</Form.Label>
                    <Form.Control type="text"
                        defaultValue={bSetting?.invoice?.footer}
                        autoComplete='off'
                        name="inv_footer"
                        placeholder="Footer text"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button style={{ marginLeft: "10px" }} type='submit' disabled={loading}>
                    {!loading && <span className='indicator-label' >Save</span>}
                    {loading && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                            Saving...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </Button>
            </Form>
                </div>
                <div className="col-sm-6">
                <div style={{
                        width: '470px',
                        maxWidth: '470px',
                        minWidth: 0,
                        margin: '0 auto'
                    }}
                    >
                        <table
                            style={{
                                width: '100%',
                                background: '#fff',
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td colSpan={3}>
                                        <div
                                            style={{
                                                margin: '32px 0',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <h5
                                                style={{
                                                    fontWeight: 500,
                                                    fontSize: '20px',
                                                    lineHeight: '24px',
                                                    marginBottom: '4px'
                                                }}
                        >{invoiceData?.inv_header ? invoiceData?.inv_header : "Invoice Header"}
                                            </h5>
                        <span>{invoiceData?.inv_sub_header ? invoiceData?.inv_sub_header : "Sub Header"}</span><br/>
                                            <span
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 400,
                                                    color: '#67768c',
                                                    lineHeight: '18px',
                                                    marginTop: '4px'
                                                }}
                                            >Date</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '20px' }}>
                                        <h6>Name</h6>
                                        <span> Payment Status:</span>
                                    </td>
                                </tr>

                                        <tr
                                            style={{
                                                borderTop: '1px solid #eef0f2'
                                            }}
                                        >
                                            <td
                                                style={{ padding: '20px' }}
                                                className="inv-info">
                                                <span
                                                    style={{
                                                        color: '#67768c',
                                                        fontSize: '14px',
                                                        marginBottom: '2px',
                                                        display: 'block'
                                                    }}
                                                >1 item</span>
                                                <h6
                                                    style={{
                                                        marginBottom: '2px',
                                                        fontSize: '16px',
                                                        fontWeight: 500,
                                                        lineHeight: '21px'
                                                    }}
                                                >Product Name</h6>
                                            </td>
                                            <td
                                                className="inv-value"
                                                style={{ padding: '20px', textAlign: 'right' }}
                                            >
                                                <h6
                                                    style={{
                                                        marginBottom: '2px',
                                                        fontSize: '16px',
                                                        fontWeight: 500,
                                                        lineHeight: '21px'
                                                    }}
                                                >price</h6>
                                            </td>
                                        </tr>
                                <tr
                                    style={{
                                        borderTop: '1px solid #eef0f2'
                                    }}
                                >
                                    <td className="inv-info"
                                        style={{ padding: '20px' }}
                                    >
                                        <h6
                                            style={{
                                                marginBottom: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                lineHeight: '21px'
                                            }}
                                        >Sub Total</h6>
                                    </td>
                                    <td className="inv-value"
                                        style={{ padding: '20px', textAlign: 'right' }}
                                    >
                                        <h6
                                            style={{
                                                marginBottom: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                lineHeight: '21px'
                                            }}
                                        >price</h6>
                                    </td>
                                </tr>

                                <tr
                                    style={{
                                        borderTop: '1px solid #eef0f2'
                                    }}
                                >
                                    <td className="inv-info"
                                        style={{ padding: '20px' }}
                                    >
                                        <h6
                                            style={{
                                                marginBottom: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                lineHeight: '21px'
                                            }}
                                        >Discount</h6>
                                    </td>
                                    <td className="inv-value"
                                        style={{ padding: '20px', textAlign: 'right' }}
                                    >
                                        <h6
                                            style={{
                                                marginBottom: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                lineHeight: '21px'
                                            }}
                                        >price</h6>
                                    </td>
                                </tr>

                                <tr
                                    style={{
                                        borderTop: '1px solid #eef0f2'
                                    }}
                                >
                                    <td className="inv-info"
                                        style={{ padding: '20px' }}
                                    >
                                        <h6
                                            style={{
                                                marginBottom: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                lineHeight: '21px'
                                            }}
                                        >Total</h6>
                                    </td>
                                    <td className="inv-value"
                                        style={{ padding: '20px', textAlign: 'right' }}
                                    >
                                        <h6
                                            style={{
                                                marginBottom: '2px',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                lineHeight: '21px'
                                            }}
                                        >price</h6>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}><p className="text-center">{invoiceData.inv_footer ? invoiceData.inv_footer : "Footer"}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupInvoice
