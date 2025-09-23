import { useMutation, useQuery } from '@apollo/client';
import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap-v5';
import { ADD_BANK_DETAILS } from '../../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../../gql/Query';
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage';
const RevoluteAccountDetails:FC = () => {
    const {showToast} = useTostMessage();
    const bankANRef = useRef<HTMLDivElement | null | any>("")
    const bankANameRef = useRef<HTMLDivElement | null | any>("")
    
    const [loading, setLoading] = useState<boolean>(false);
    const [bankEdit, setBankEdit] = useState<boolean>(false);
    const [bankDetails, setBankDetails] = useState<any>({
        id: 0,
        bank_name: "", 
        account_number: "",
        account_name: "",
        iban_number: "",
        bank_address: "",
        bic_address: "",
        bank_city: ""
    });
    const [addOrUpdateBankAccount] = useMutation(ADD_BANK_DETAILS, {
        refetchQueries: [{ query: BUSINESS_SETUP_Q }],
        awaitRefetchQueries: true
    });
    const { data: businessSetupData } = useQuery(BUSINESS_SETUP_Q);
    useEffect(() => {
        if (businessSetupData) {
            if (businessSetupData?.businessSetting?.bank_account !== null){
                businessSetupData?.businessSetting?.bank_account.map((item:any)=>{
                    if(!Boolean(item.iban_number)){
                        setBankDetails(item);
                    } 
                })
            }
            // console.log("bank_account", businessSetupData?.businessSetting?.bank_account)
        }
    }, [businessSetupData]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBankDetails((preValue: any) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (bankDetails?.account_number === "" || bankDetails === null){
            bankANRef.current.style.border = "1px solid red";
            showToast("Account number required", "error")
        }
        if (bankDetails?.account_number !== "" || bankDetails === null){
            bankANRef.current.style.border = "none";
        }
        if (bankDetails !== null && bankDetails.account_number !== ""){
            setLoading(true);
            addOrUpdateBankAccount({
                variables:{
                    id: bankDetails.id ? bankDetails.id: 0,
                    bank_name: "",
                    account_number: bankDetails.account_number,
                    account_name: bankDetails.account_name ? bankDetails.account_name: "",
                    iban_number: "",
                    bank_address: "",
                    bic_address: "",
                    bank_city: ""
                }
            }).then(({data}) =>{
                if(data?.addOrUpdateBankAccount?.status === 1){
                    showToast(data?.addOrUpdateBankAccount?.message, "success");
                    setBankEdit(false);
                    setLoading(false);
                }
                else if (data?.addOrUpdateBankAccount?.status === 0) {
                    showToast(data?.addOrUpdateBankAccount?.message, "error");
                    setLoading(false);
                }
            })
        }
    }
    return (
        <>
        {
            ( bankDetails?.account_number == '' && bankEdit === false) ? <>
                <p>Account details not added yet.</p>
                <Button onClick={()=>{setBankEdit(true)}}>Add Revolut Details</Button>
            </>:
            <>{
                bankEdit === false && <>
                    <p>Revolut Account Number: <span>{bankDetails?.account_number}</span></p>
                    <p>Revolut Account Name: <span>{bankDetails?.account_name}</span></p>
                </>
            }
            {
                bankEdit === false && 
                    <Button className='btn btn-sm' onClick={()=>{setBankEdit(true)}}>Edit Revolut Details</Button>
            }</>
        }
                {
            bankEdit === true &&
            <Form onSubmit={handleSubmit} className='mt-3'>
                
                <Form.Group className="mb-3 col-md-10">
                    <Form.Label>Revolut Account Number*</Form.Label>
                    <Form.Control type="text"
                        ref={bankANRef}
                        defaultValue={bankDetails?.account_number}
                        autoComplete='off'
                        name="account_number"
                        placeholder="Account Number"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3 col-md-10">
                    <Form.Label>Revolut Account Name</Form.Label>
                    <Form.Control type="text"
                        ref={bankANameRef}
                        defaultValue={bankDetails?.account_name}
                        autoComplete='off'
                        name="account_name"
                        placeholder="Account Name"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button className='btn btn-sm' type='submit' disabled={loading}>
                    {!loading && <span className='indicator-label' >Save</span>}
                    {loading && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                            Saving...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </Button>
                {
                        bankEdit ===true &&  <Button className='btn btn-sm ms-5' onClick={() => { setBankEdit(false) }}>Cancel</Button>
                }
            </Form>
        }
        </>
  )
}

export default RevoluteAccountDetails