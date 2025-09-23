import React,{FC, useState} from 'react'
import { Button, FormCheck } from 'react-bootstrap-v5'
import { KTSVG } from '../../../../../_metronic/helpers';
import { useHistory } from 'react-router-dom';
const ClientNotifications:FC = () => {
    const history = useHistory();
    const [gNotication, setGNotification] = useState<any>(1);
    const [isNotificationEnable,setIsNotificationEnable] = useState<boolean>(false);
    const handleSubmitNotification =(e:any)=>{
        e.preventDefault();
        console.log("isNotificationEnable", isNotificationEnable)
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
                <h1 className='me-4 mb-0'>Guest Notifications</h1>
            </div>
            <div className='d-flex align-items-center'>
                {/* <Button onClick={handleSubmit} disabled={loading} className="btn-sm">
                    {!loading && <span onClick={handleSubmit} className='indicator-label' >Save</span>}
                    {loading && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                            Saving...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </Button> */}
            </div>
            <div className='business_subscription'>
                {
                    gNotication === 1 ? <><FormCheck defaultChecked onClick={() => { setIsNotificationEnable(false) }} ></FormCheck><span className='fs-5 text-dark subscription_check'>Email notifications enabled</span></> :
                        <><FormCheck onClick={() => { setIsNotificationEnable(true) }} ></FormCheck><span className='fs-5 text-dark subscription_check'>Email notifications disabled</span></>
                }
            </div>
            <Button onClick={(e: any) => { handleSubmitNotification(e) }} className=" mt-3">Save</Button>
        </div>
    )
}

export default ClientNotifications;
