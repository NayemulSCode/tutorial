import React,{FC,useEffect,useState, useRef} from 'react'
import { KTSVG } from '../../../../../../_metronic/helpers';
import { Button, Form, Modal } from "react-bootstrap-v5";
import { useMutation, useQuery } from '@apollo/client';
import { ADD_BANK_DETAILS } from '../../../../../../gql/Mutation';
import { BUSINESS_SETUP_Q } from '../../../../../../gql/Query';
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage';

const BankDetails:FC = () => {
    const {showToast} = useTostMessage();
    const bankANRef = useRef<HTMLDivElement | null | any>("")
    const bankANameRef = useRef<HTMLDivElement | null | any>("")
    const bankSAddressRef = useRef<HTMLDivElement | null | any>("")
    const bankCityRef = useRef<HTMLDivElement | null | any>("")
    const ibanRef = useRef<HTMLDivElement | null | any>("")
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
    const { data: businessSetupData, loading: businessSetupDataLoading } = useQuery(BUSINESS_SETUP_Q);
    useEffect(() => {
        if (businessSetupData) {
            if (businessSetupData?.businessSetting?.bank_account !== null){
                businessSetupData?.businessSetting?.bank_account.map((item:any)=>{
                    if(Boolean(item.iban_number)){
                        setBankDetails(item);
                    } 
                })
            }
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
          showToast("Account number required", "error");
        }
        else if (bankDetails?.account_name === ""){
          bankANameRef.current.style.border = "1px solid red";
          showToast("Account name required", "error");
        }
        else if (bankDetails?.iban_number === ""){
          ibanRef.current.style.border = "1px solid red";
          showToast("IBAN number required", "error");  
        }
        else if (bankDetails?.bank_address === ""){
          bankSAddressRef.current.style.border = "1px solid red";
          showToast("Bank street address required", "error");   
        }
        else if (bankDetails?.bank_city === ""){
          bankCityRef.current.style.border = "1px solid red";
          showToast("Bank city required", "error"); 
        }
        if (bankDetails?.account_number !== "" || bankDetails === null){
            bankANRef.current.style.border = "none";
        }
        if (bankDetails?.account_name !== ""){
            bankANameRef.current.style.border = "none";
        }
        if (bankDetails?.iban_number !== ""){
            ibanRef.current.style.border = "none";
        }
        if (bankDetails?.bank_address !== ""){
            bankSAddressRef.current.style.border = "none";
        }
        if (bankDetails?.bank_city !== ""){
            bankCityRef.current.style.border = "none";
        }
        if (bankDetails !== null && bankDetails.account_number !== "" && bankDetails.account_name!==""  && bankDetails.iban_number !== "" && bankDetails.bank_city !== "" && bankDetails.bank_address !== ""){
            setLoading(true);
            addOrUpdateBankAccount({
                variables:{
                    id: bankDetails.id ?bankDetails.id : 0,
                    bank_name: bankDetails.bank_name ? bankDetails.bank_name : "",
                    account_number: bankDetails.account_number,
                    account_name: bankDetails.account_name ? bankDetails.account_name: "",
                    iban_number: bankDetails.iban_number,
                    bank_address: bankDetails.bank_address,
                    bic_address: bankDetails.bic_address ? bankDetails.bic_address :"",
                    bank_city: bankDetails.bank_city
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
      {businessSetupDataLoading ? (
        <div>Loading....</div>
      ) : (
        <>
          {bankDetails?.account_number == '' && bankEdit === false ? (
            <>
              <p>Account details not added yet.</p>
              <Button
                onClick={() => {
                  setBankEdit(true)
                }}
              >
                Add Bank Details
              </Button>
            </>
          ) : (
            <>
              {bankEdit === false && (
                <>
                  <p>
                    Bank Name: <span>{bankDetails?.bank_name}</span>
                  </p>
                  <p>
                    Account Number: <span>{bankDetails?.account_number}</span>
                  </p>
                  <p>
                    Account Name: <span>{bankDetails?.account_name}</span>
                  </p>
                  <p>
                    IBAN Number: <span>{bankDetails?.iban_number}</span>
                  </p>
                  <p>
                    Bank City: <span>{bankDetails?.bank_city}</span>
                  </p>
                  <p>
                    Bank Street Address: <span>{bankDetails?.bank_address}</span>
                  </p>
                  <p>
                    BIC Address: <span>{bankDetails?.bic_address}</span>
                  </p>
                </>
              )}
              {bankEdit === false && (
                <Button
                  className='btn btn-sm'
                  onClick={() => {
                    setBankEdit(true)
                  }}
                >
                  Edit Bank Details
                </Button>
              )}
            </>
          )}
          {bankEdit === true && (
            <Form onSubmit={handleSubmit} className='mt-3'>
              <Form.Group className='mb-3 col-md-10'>
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={bankDetails?.bank_name}
                  autoComplete='off'
                  name='bank_name'
                  placeholder='Bank Name'
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className='mb-3 col-md-10'>
                <Form.Label>Account Number*</Form.Label>
                <Form.Control
                  type='text'
                  ref={bankANRef}
                  defaultValue={bankDetails?.account_number}
                  autoComplete='off'
                  name='account_number'
                  placeholder='Account Number'
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className='mb-3 col-md-10'>
                <Form.Label> Account Name</Form.Label>
                <Form.Control
                  type='text'
                  ref={bankANameRef}
                  defaultValue={bankDetails?.account_name}
                  autoComplete='off'
                  name='account_name'
                  placeholder='Account Name'
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className='mb-3 col-md-10'>
                <Form.Label>IBAN Number*</Form.Label>
                <Form.Control
                  type='text'
                  ref={ibanRef}
                  defaultValue={bankDetails?.iban_number}
                  autoComplete='off'
                  name='iban_number'
                  placeholder='IBAN Number'
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className='mb-3 col-md-10'>
                <Form.Label>Bank Street Address*</Form.Label>
                <Form.Control
                  type='text'
                  ref={bankSAddressRef}
                  defaultValue={bankDetails?.bank_address}
                  autoComplete='off'
                  name='bank_address'
                  placeholder='Bank street address'
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className='mb-3 col-md-10'>
                <Form.Label>BIC Address</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={bankDetails?.bic_address}
                  autoComplete='off'
                  name='bic_address'
                  placeholder='BIC address'
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className='mb-5 col-md-10'>
                <Form.Label>Bank City*</Form.Label>
                <Form.Control
                  type='text'
                  ref={bankCityRef}
                  defaultValue={bankDetails?.bank_city}
                  autoComplete='off'
                  name='bank_city'
                  placeholder='Bank city'
                  onChange={handleChange}
                />
              </Form.Group>
              <Button className='btn btn-sm' type='submit' disabled={loading}>
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Saving...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              {bankEdit === true && (
                <Button
                  className='ms-5 btn btn-sm'
                  onClick={() => {
                    setBankEdit(false)
                  }}
                >
                  Cancel
                </Button>
              )}
            </Form>
          )}
        </>
      )}
    </>
  )
}

export default  BankDetails