import { useMutation, useQuery } from '@apollo/client';
import React,{FC,useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { OFFBOARDING_REQUEST, OFFBOARDING_REQUEST_CANCEL } from '../../../../../gql/Mutation';
import { useSnackbar } from 'notistack';
import { PROFILE_INFORMATION } from '../../../../../gql/Query';
import { Modal } from 'react-bootstrap-v5';
type Props = {
    showOffboarding: boolean
    CloseOffboarding: () => void
}
const Offboarding: FC<Props> = ({showOffboarding,CloseOffboarding}) => {
    const { enqueueSnackbar } = useSnackbar();
   const[newsletter, setNewsletter] = useState<boolean>(false);
    const [offboardingInfo, setOffboardingInfo] = useState<any>()
    const [offBoardingRequest] = useMutation(OFFBOARDING_REQUEST);
    const [offBoardingCancel] = useMutation(OFFBOARDING_REQUEST_CANCEL);
   const { data: accountData, error: accountError, loading, refetch } = useQuery(PROFILE_INFORMATION);
    useEffect(() => {
        if (accountData) {
            console.log("accountData.profileInformation",accountData.profileInformation.off_boarding)
            // refetch()
            setOffboardingInfo(accountData.profileInformation.off_boarding)
        }
    }, [accountData]);
    // off bording
    const handleOffboarding = ()=>{
        console.log('request for ofboarding')
        offBoardingRequest({
            variables:{
                news_letters: newsletter? newsletter : false
            }
        }).then(({data})=>{
            if (data.offBoardingRequest.status === 1) {
                enqueueSnackbar(data.offBoardingRequest.message, {
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
                refetch()
                CloseOffboarding()

            }
            else if (data.offBoardingRequest.status === 0) {
                enqueueSnackbar(data.offBoardingRequest.message, {
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
                CloseOffboarding()
            }
        })
    }
    const handleOffboardingCancel = ()=>{
        offBoardingCancel().then(({data})=>{
            if(data.offBoardingCancel.status === 1){
                enqueueSnackbar(data.offBoardingCancel.message, {
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
                refetch()
                CloseOffboarding()
            }
            else if(data.offBoardingCancel.status === 0){
                enqueueSnackbar(data.offBoardingCancel.message, {
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
                CloseOffboarding()
            }
            console.log('cancel request data', data);
        })
    }
  return (
    <Modal
            dialogClassName="revolut_modal"
            show={showOffboarding}
            onHide={CloseOffboarding}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="">
                <h2 className="adv-price-modal-title mx-auto">OffBoarding</h2>
            </Modal.Header>

         <Modal.Body>
            <div className='card p-7 mt-7'>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        {offboardingInfo &&<button className='btn btn-danger btn-sm' onClick={handleOffboardingCancel}>Cancel Offboarding</button>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 border-2 border-end">
                            <div>
                            <h2>Do You Wish To Leave Chuzeday?</h2>
                            <p>You'll continue to enjoy the same benefits until the end of your subscription period ends.</p>
                            <p>Come back at any time in the next 10 months and all your clients, business settings, preferences and detials will still be here</p>
                            {offboardingInfo === null&&<p>
                                <input className='me-1' type="checkbox"
                                    onChange={()=>{setNewsletter(!newsletter)}}
                                />
                                <strong>Email me about Chuzeday Newsletters</strong>
                            </p>}
                            <div>
                                {offboardingInfo === null&&<button className='btn btn-success btn-sm me-3' onClick={handleOffboarding}>Offboarding</button>}
                                <button onClick={()=>{CloseOffboarding()}} className='btn btn-secondary btn-sm me-3'>Go Back</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <ul>
                            <h2>Reasons To Stay With Us:</h2>
                            <li><h3>Time Saved</h3></li>
                            <li><h3>Website Traffic and Revicews</h3></li>
                            <li><h3>Future Appointments</h3></li>
                            <li><h3>No Show + Late Cancellations</h3></li>
                            <li><h3>Community Engagement</h3></li>
                            <li><h3>Revenue Growth</h3></li>
                        </ul>
                    </div>
                </div>
            </div>
         </Modal.Body>
        </Modal>
  )
}

export default Offboarding