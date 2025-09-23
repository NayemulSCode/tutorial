import React, { FC, useState, useEffect, useContext, useRef } from "react"
import { Link, useParams } from 'react-router-dom'
import { Card, Form, Row, Col, InputGroup, FormControl, Dropdown, DropdownButton, Button } from 'react-bootstrap-v5';
import Select from 'react-select';
import { IService, IUsers, IStaff } from "../../../../../types";
import { ALL_STAFF_INFO } from '../../../../../gql/Query'
import { useQuery } from "@apollo/client";
import { KTSVG } from '../../../../../_metronic/helpers'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { CreateSaleModal } from "./CreateSaleModal"
import { RedeemVoucherModal } from "./RedeemVoucherModal";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { AppContext } from '../../../../../../src/context/Context';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import { INVOICE_DETAIL } from '../../../../../gql/Query'
import { useSnackbar } from 'notistack';
import ModalVoidInvoice from "../../../../modules/widgets/components/ModalVoidInvoice";
import { xllExportUrl } from "../../../../modules/util";

type InvoParams = {
    id: string;
};

type IInvoice = {
    id: string;
    inv_no: number;
    inv_pre: string;
    buyer_id: number;
    buyer_name: string;
    business_id: number;
    sub_total: number;
    total_amount: number;
    tax: number;
    discount: number;
    s_discount: number;
    payment_option: string;
    payment_status: string;
    payment_type: string;
    created_at: number;
    business_invoice: {
        id: number;
        business_id: number;
        header: string;
        footer: string;
        sub_header: string;
        invoice_no: number;
        invoice_prefix: string;
    },
    buyer_info: {
        id: number;
        first_name: string;
        last_name: string;
        mobile: string;
        email: string;
    },
    business_info: {
        id: number;
        name: string;
        vat_number: string;
    },
    payment_info: {
        amount: number;
        id:string;
        type: string;
    }[],
    sale_detail: {
        id: number;
        business_id: number;
        sale_id: number;
        product_id: number;
        product_name: string;
        product_qty: number;
        unit_price: number;
        discount: number;
        time: number;
        duration: number;
        product_type: string;
        voucher_code: string;
        created_at: number;
        expiry_date: number;
        staff_info: {
            id: number;
            name: string;
        }
    }[]
}
const ViewInvoice: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams<InvoParams>();
    const [invoice, setInvoice] = useState<IInvoice>();
    const [loading, setLoading] = useState<boolean>(false);
    const { clearContext } = useContext(AppContext);
    // console.log("invoice details",invoice)
    const invoRef = useRef(null)

   
    const {
      data: invoiceData,
      loading: dataLoading,
      refetch,
    } = useQuery(INVOICE_DETAIL, {
      variables: {
        sale_id: +id,
        appt_id: 0,
      },
    })

    useEffect(() => {
        if (invoiceData) {
            refetch()
            // console.log(invoiceData)
            setInvoice(invoiceData.invoiceDetail)
            setLoading(false)
        }
        if (dataLoading) {
            setLoading(true);
        }
    }, [invoiceData, dataLoading])

    const dataClear = () => {
        clearContext();
    }

    // console.log("invoiceData", invoice)
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;
    const currency = (countryName: any) => {
        if (countryName === 'ireland') {
            return "€";
        }
        if (countryName === 'uk') {
            return "£";
        }
        if (countryName === 'bangladesh') {
            return "৳";
        }
    }
    const [deleteModal, setDeleteModal] = useState(false);
    // const openDeleteModal = () => {
    //     setDeleteModal(true);
    // }
    const closeDeleteModal = () => setDeleteModal(false);
    const confirmation = (status: any) => {
        if (status === 0) {
            // console.log(status);
        }
        if (status === 1) {
            // console.log(status);
            fetch(`${xllExportUrl}/api/sale-options?type=void&sale_id=${id}`)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong on API server!');
                    }
                })
                .then(response => {
                    enqueueSnackbar(response.message, {
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
                }).catch(error => {
                    console.error(error);
                });
        }
    }
    const hanldeInvoiceOption =(e:any, option:string)=>{
        e.preventDefault()
        if(option==='download'){
            fetch(`${xllExportUrl}/api/sale-options?type=${option}&sale_id=${id}`)
                .then(response => {
                    if (response.status === 200) {
                        return response.blob();
                    } else {
                        throw new Error('Something went wrong on API server!');
                    }
                })
                .then(response => {
                    var a = document.createElement("a");
                    a.href = window.URL.createObjectURL(response);
                    a.download = `Invoice-${id}`;
                    a.click();
                }).catch(error => {
                    console.error(error);
                });
        }
        else{
            if (option === 'void'){
                setDeleteModal(true);
            }
            else{
                fetch(`${xllExportUrl}/api/sale-options?type=${option}&sale_id=${id}`)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            throw new Error('Something went wrong on API server!');
                        }
                    })
                    .then(response => {
                        enqueueSnackbar(response.message, {
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
                    }).catch(error => {
                        console.error(error);
                    });
            }
        }
    }
    return (
        <>
            <section className="view-invoice ptc">
                <div className="toolbar">
                    <Link className="close-btn" to="/calendar"><i className="fas fa-times"></i></Link>
                    <h2 className="page-title mb-0">View Invoice</h2>
                    <div></div>
                </div>
                {/* begin::Row */}
                {
                    loading &&
                    <div className="text-center d-flex justify-content-center align-items-center">
                        <div className="spinner-grow " role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow " role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow " role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
                {
                    !loading && invoice && (
                        <Form>
                            <div>
                                <div className='row'>
                                    <div className='col-sm-7'>
                                        <div style={{
                                            minWidth: 0,
                                            margin: '0 auto',
                                            background:'#fff',
                                            minHeight: '69vh',
                                            borderRadius: '5px'
                                        }}
                                        >
                                            <table
                                                ref={invoRef}
                                                style={{
                                                    background: '#fff',
                                                    width:'90%',
                                                    margin: '0 auto',
                                                }
                                            }
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
                                                                        fontWeight: 600,
                                                                        fontSize: '18px',
                                                                        lineHeight: '24px',
                                                                        marginBottom: '4px',
                                                                        textTransform:'capitalize'
                                                                    }}
                                                                >{invoice?.business_invoice?.header} 
                                                                </h5>
                                                                <span style={{
                                                                        fontSize: '14px',
                                                                        fontWeight: 500,
                                                                    }}>VAT ID- {invoice?.business_info?.vat_number? invoice?.business_info?.vat_number : 'N/A'}</span><br />
                                                                <span style={{
                                                                        fontSize: '14px',
                                                                        fontWeight: 500,
                                                                    }}>Invoice {invoice?.inv_pre}{invoice?.inv_no}</span><br />
                                                                <span
                                                                    style={{
                                                                        fontSize: '13px',
                                                                        fontWeight: 400,
                                                                        color: '#666',
                                                                        lineHeight: '18px',
                                                                        marginTop: '4px'
                                                                    }}
                                                                    //moment.unix(invoice?.created_at).format('')
                                                                   
                                                                >{ moment.unix(invoice?.created_at).utcOffset('+0000').format('LLLL')}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h6 style={{fontSize: '16px', fontWeight:600, margin:'0px'}}>{invoice?.buyer_name}</h6>
                                                            <span style={{fontSize: '14px', display:'block',margin:'0px'}}>{invoice?.buyer_info?.email}</span>
                                                            <span style={{fontSize: '14px'}}> Payment Status: <strong>{invoice?.payment_status == "Upfront" ? "Partilly Paid" : invoice?.payment_status}</strong></span>
                                                        </td>
                                                    </tr>

                                                    {
                                                        invoice?.sale_detail.length > 0 && invoice?.sale_detail.map(item => (
                                                            <tr key={item.id}
                                                                style={{
                                                                    borderTop: '1px solid #eee'
                                                                }}
                                                            >
                                                                <td className="inv-info" style={{padding:'4px 0px'}}>
                                                                    {/* <span
                                                                        style={{
                                                                            color: '#67768c',
                                                                            fontSize: '14px',
                                                                            marginBottom: '2px',
                                                                            display: 'block'
                                                                        }}
                                                                    >{item?.product_qty} item</span> */}
                                                                    <h6
                                                                        style={{
                                                                            marginBottom: '2px',
                                                                            fontSize: '14px',
                                                                            fontWeight: 500,
                                                                            lineHeight: '22px'
                                                                        }}
                                                                    >{item?.product_qty} &nbsp;&nbsp; {item?.product_name}</h6>
                                                                    {
                                                                        item?.voucher_code && <span style={{fontSize: '14px', display:'block'}}>Code: {item?.voucher_code}</span>
                                                                    }
                                                                    {item?.time && <span>{moment.unix(item?.time).utcOffset('+0000').format('llll')} </span>}

                                                                    {item?.staff_info?.name && <span>{`with ${item?.staff_info?.name}`}</span>}
                                                                    {
                                                                        item?.expiry_date && <span>expires on {moment.unix(item?.expiry_date).utcOffset('+0000').format("MM Do YYYY")}</span>
                                                                    }
                                                                    {/* <br /> <span>{invoice?.business_info?.name}</span> */}
                                                                </td>
                                                                <td
                                                                    className="inv-value"
                                                                    style={{ textAlign: 'right' }}
                                                                >
                                                                    <h6
                                                                        style={{
                                                                            marginBottom: '2px',
                                                                            fontSize: '14px',
                                                                            fontWeight: 500,
                                                                            lineHeight: '22px'
                                                                        }}
                                                                    >{currency(countryName)}{item?.product_qty * Number(item?.unit_price)}</h6>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                    <tr
                                                        style={{
                                                            borderTop: '1px solid #eee'
                                                        }}
                                                    >
                                                        <td className="inv-info"
                                                            style={{padding:'4px 0px'}}
                                                        >
                                                            <h6
                                                                style={{
                                                                    marginBottom: '2px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px'
                                                                }}
                                                            >Sub Total</h6>
                                                        </td>
                                                        <td className="inv-value"
                                                            style={{ padding: '4px 0px', textAlign: 'right' }}
                                                        >
                                                            <h6
                                                                style={{
                                                                    marginBottom: '2px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px'
                                                                }}
                                                            >{currency(countryName)}{invoice?.sub_total}</h6>
                                                        </td>
                                                    </tr>

                                                    <tr
                                                        style={{
                                                            borderTop: '1px solid #eee'
                                                        }}
                                                    >
                                                        <td className="inv-info"
                                                            style={{ padding: '4px 0px' }}
                                                        >
                                                            <h6
                                                                style={{
                                                                    marginBottom: '2px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px'
                                                                }}
                                                            >Discount</h6>
                                                        </td>
                                                        <td className="inv-value"
                                                            style={{ padding: '4px 0px', textAlign: 'right' }}
                                                        >
                                                            <h6
                                                                style={{
                                                                    marginBottom: '2px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px'
                                                                }}
                                                            >{currency(countryName)}{Number(invoice?.discount) + Number(invoice.s_discount)}</h6>
                                                        </td>
                                                    </tr>

                                                    <tr
                                                        style={{
                                                            borderTop: '1px solid #eee'
                                                        }}
                                                    >
                                                        <td className="inv-info"
                                                            style={{ padding: '4px 0px' }}
                                                        >
                                                            <h6
                                                                style={{
                                                                    marginBottom: '2px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px'
                                                                }}
                                                            >Total</h6>
                                                        </td>
                                                        <td className="inv-value"
                                                            style={{ padding: '4px 0px', textAlign: 'right' }}
                                                        >
                                                            <h6
                                                                style={{
                                                                    marginBottom: '2px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px'
                                                                }}
                                                            >{currency(countryName)}{invoice?.total_amount}</h6>
                                                        </td>
                                                    </tr>
                                                    {
                                                        invoice?.payment_info.length > 0 && invoice?.payment_info.map((item: any) => (
                                                            <tr key={item.id} style={{
                                                                borderTop: '1px solid #eee'
                                                            }}>
                                                                <td className="inv-info"
                                                                    style={{ padding: '4px 0px' }}
                                                                >
                                                                    <h6
                                                                        style={{
                                                                            marginBottom: '2px',
                                                                            fontSize: '14px',
                                                                            fontWeight: 500,
                                                                            lineHeight: '22px',
                                                                            textTransform:'capitalize'
                                                                        }}
                                                                    >{item.type}</h6>
                                                                </td>
                                                                <td className="inv-value"
                                                                    style={{ padding: '4px 0px', textAlign: 'right' }}
                                                                >
                                                                    <h6
                                                                        style={{
                                                                            marginBottom: '2px',
                                                                            fontSize: '14px',
                                                                            fontWeight: 500,
                                                                            lineHeight: '22px'
                                                                        }}
                                                                    >{currency(countryName)}{item.amount}</h6>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={2} style={{textAlign:'center',padding: '4px 0px'}}>
                                                            <p style={{
                                                                fontSize: '14px',
                                                                fontWeight: 400,
                                                                lineHeight: '22px',
                                                                color: '#878c93',
                                                                margin:0
                                                            }} >{moment.unix(invoice?.created_at).utcOffset('+0000').format('LLLL')}</p>
                                                            <p style={{margin:0}}>{invoice?.business_invoice?.footer}</p>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    <div className='col-sm-5'>
                                        <Card className="primary-bx-shadow checkout-right-wrap">
                                            <div className="payment-confirm-heading border-b">
                                                {
                                                    <div className='d-flex align-items-center'>
                                                        <div className="staff-profile-symbol me-4">
                                                            {
                                                                invoice?.buyer_info?.first_name ?
                                                                    <span> {invoice?.buyer_info?.first_name?.slice(0, 1)}{invoice?.buyer_info?.last_name?.slice(0, 1)}</span> :
                                                                    <span className='symbol-label'>
                                                                        <i className="fas fa-walking fa-2x" style={{lineHeight:'48px'}}></i>
                                                                    </span>
                                                            }

                                                        </div>
                                                        <div className='d-flex flex-column'>
                                                            <a href='#' className='text-dark fs-6 fw-bolder'>
                                                                {invoice?.buyer_name}
                                                            </a>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="invoice-right-body">
                                                <div className="invoice-right-status">
                                                    <img src={toAbsoluteUrl('/media/logos/checked.png')} alt="image" />
                                                    <h3>{invoice?.payment_status == "Upfront" ? "Partilly Paid" : invoice?.payment_status}</h3>
                                                    <p>{
                                                        invoice?.payment_status == "Unpaid" ? `${invoice.business_info?.name}` : 
                                                        `Payment received on ${moment.unix(invoice?.created_at).utcOffset('+0000').format('llll')} at 
                                                        ${invoice.business_info?.name}`
                                                        }
                                                    </p>
                                                </div>
                                                {/* <div className="send-invoice-wrap">
                                                    <div className="send-invoice-inner">
                                                        <Form.Label>Send Invoice</Form.Label>
                                                        <Form.Group className="send-invoice-input" controlId="invoice-mail">
                                                            <Form.Control type="email" value={invoice?.buyer_info?.email} className="me-4" placeholder="Email address" />
                                                            <Button variant="primary" type="">
                                                                Send
                                                            </Button>
                                                        </Form.Group>
                                                    </div>
                                                </div> */}
                                            </div>
                                            <div className="invoice-right-footer">
                                                <div className="invoice-footer-btn border-t">
                                                    <DropdownButton className="invoice-more-option" id="dropdown-basic-button" title="More Options">
                                                        <Dropdown.Item onClick={(e:any) => { hanldeInvoiceOption(e, 'download')}}>
                                                            Download
                                                        </Dropdown.Item>
                                                        <Dropdown.Item >
                                                            <ReactToPrint
                                                                trigger={() => <button style={{
                                                                    width: '100%',
                                                                    textAlign: 'left',
                                                                    padding: '0',
                                                                    lineHeight: '0.8'
                                                                }} type="button" className="btn btn-primary ">Print</button>}
                                                                content={() => invoRef.current}
                                                            />
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={(e: any) => { hanldeInvoiceOption(e, 'refund') }}>Refund</Dropdown.Item>
                                                        <Dropdown.Item onClick={(e: any) => { hanldeInvoiceOption(e, 'void') }}>Void</Dropdown.Item>
                                                    </DropdownButton>
                                                    <a href="/calendar" onClick={() => dataClear} className="btn btn-dark">Exit</a>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                }

                {/* end::Row */}
            </section>
            <ModalVoidInvoice
                closeDeleteModal={closeDeleteModal}
                deleteModal={deleteModal}
                confirmation={confirmation}
            />
        </>
    )
}

export { ViewInvoice }