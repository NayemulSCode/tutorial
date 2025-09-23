import React, { FC, useState, useEffect} from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { Button, Form } from 'react-bootstrap-v5';
import { BUSINESS_SETTING } from '../../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../../gql/Query';
import { useMutation, useQuery } from '@apollo/client';
import { IBusinessSetting } from '../../../../../../types';
import { useSnackbar } from 'notistack';
import {useHistory} from 'react-router-dom'

const SetCloseDates: FC<{ settingInfo: any }> = ({ settingInfo }) => {
    const { enqueueSnackbar } = useSnackbar();
    const history  = useHistory()
    console.log("set close time data found", settingInfo)
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
    const [startDate, setStartDate] = useState<Date | null | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | null | undefined>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [description, setDescription] = useState<string>("");
    const sDate = moment(startDate).format('DD-MMM-YYYY');
    const eDate = endDate? moment(endDate).format('DD-MMM-YYYY') : null;
    const duration = moment(sDate).diff(eDate, 'days');
    const [businessSetting] = useMutation(BUSINESS_SETTING,{
            refetchQueries: [{ query: BUSINESS_SETUP_Q }],
            awaitRefetchQueries: true
        }
    );
    const { data: businessSetupData } = useQuery(BUSINESS_SETUP_Q);
    const handleSubmit=(e:any)=>{
        e.preventDefault();
        setLoading(true)
        const newObj={
            start_date: sDate,
            end_date: eDate? eDate : "",
            total_days: Math.abs(duration),
            description: description
        }
        console.log("close date object",newObj)
        businessSetting({
            variables: {
                header: "",
                footer: "",
                sub_header: "",
                start_date: sDate ? sDate : bSetting?.close_date?.start_date,
                end_date: eDate ? eDate : sDate,
                description: description ? description : "",
                online_booking: "",
                invoice_prefix: "",
                invoice_no: ""
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
                history.push("/setup/closed-dates")
                setLoading(false)
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
    useEffect(() => {
        if (businessSetupData) {
            setBSetting(businessSetupData?.businessSetting)
        }
    }, [businessSetupData]);
    return (
        <div> 
           
            <h3 className='mt-5'>New Closed Dates </h3>
            <div className='col-md-8 d-flex'>
                <div className='col-md-4 mb-3'>
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                        className="sales-datepicker"
                        selected={startDate}
                        onChange={(date: any) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"  
                    />
                </div>
                <div className='col-md-4 mb-3'>
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                        className="sales-datepicker"
                        placeholderText="Select a date(optional)"
                        selected={endDate}
                        onChange={(date: any) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
            </div>
            <Form.Group className="mb-5 col-md-4">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text"
                    name="description"
                    placeholder="e.g. public holiday"
                    onChange={(e)=>{setDescription(e.target.value)}}
                />
            </Form.Group>
            <Button onClick={() => { history.push("/setup/closed-dates") }}>Close</Button>
            {/* <Button style={{ marginLeft: "18px" }} onClick={handleSubmit}>Save</Button> */}
            {/* <div className='text-center'> */}
                <Button
                    id='kt_sign_in_submit'
                    style={{ marginLeft: "18px" }} 
                    disabled={loading}
                    onClick={handleSubmit}
                    >
                    {!loading && <span className='indicator-label' >Save</span>}
                    {loading && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </Button>
            {/* </div> */}
        </div>
    )
}

export default SetCloseDates;
