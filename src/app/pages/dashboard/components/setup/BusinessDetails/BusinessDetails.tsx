import React, { FC, useEffect, useState} from 'react'
import { useQuery } from '@apollo/client';
import { PROFILE_INFORMATION } from '../../../../../../gql/Query';
import BusinessSlider from './BusinessSlider';
import SliderEdit from './SliderEdit';
import { Button } from 'react-bootstrap-v5';
import { KTSVG } from '../../../../../../_metronic/helpers';
import { useHistory } from 'react-router-dom';

const BusinessDetails:FC = () => {
    const history = useHistory();
    const [accInfo, setAccInfo] = useState<object>({});
    const [isEdit, setIsEdit] =  useState<boolean>(true);
    const { data: accountData, error: accountError, loading, refetch } = useQuery(PROFILE_INFORMATION);
    useEffect(() => {
        if (accountData) {
            // refetch()
            setAccInfo(accountData.profileInformation)
        }
    }, [accountData])
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
                <h1 className='me-4 mb-0'>Business Details</h1>
            </div>
            <div className='mb-5 d-flex align-items-center'>
                {/* <div>
                    {isEdit === false &&<Button className="btn-sm" onClick={()=>setIsEdit(true)}>Edit</Button>}
                    {isEdit === true && <Button className="btn-sm" onClick={()=> setIsEdit(false)}>Cancel</Button>}
                </div> */}
            </div>
            {/* <BusinessSlider accInfo={accInfo} />*/}
            {/* {/* {isEdit === false && Object.keys(accInfo).length > 0 && <BusinessSlider accInfo={accInfo} />} */}
            {
                loading && (
                    <div className='m-0 m-auto'>
                        <div className="spinner-grow" role="status">
                            <span className="sr-only">Loading...</span>
                        </div><div className="spinner-grow" role="status">
                            <span className="sr-only">Loading...</span>
                        </div><div className="spinner-grow" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )
            }
            {isEdit && Object.keys(accInfo).length > 0 && <SliderEdit accInfo={accInfo} />}
        </div>
    )
}

export default BusinessDetails;
