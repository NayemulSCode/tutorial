import React, { FC, useState, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { Button, Card } from 'react-bootstrap-v5'
import Pusher from 'pusher-js'
import { PROFILE_INFORMATION, NOTIFICATION} from '../../../gql/Query'
import { CLEAR_NOTIFICATION, NOTIFICATION_UPDATE } from '../../../gql/Mutation'
import moment from 'moment'
import { useTostMessage } from '../../modules/widgets/components/useTostMessage'

const NotificationWrapper: FC = () => {
    const {showToast} = useTostMessage()
    document.title = 'Notifications'
    const [loggedinUser, setLoggedinUser] = useState<any>()
    const [notifications, setNotifications] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    // delete notification 
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false)
    const [isCheck, setIsCheck] = useState<any>([]);

    const [notificationDelete] = useMutation(CLEAR_NOTIFICATION)
    const [notificationUpdate] = useMutation(NOTIFICATION_UPDATE)
    const { data: profileData } = useQuery(PROFILE_INFORMATION)
    const [runQuery, { data: notificationsData, loading: notiLoading, refetch }] = useLazyQuery(NOTIFICATION)
    console.log("🚀 ~ notificationsData:", notificationsData)

    var pusher = new Pusher('824e3c65405d5d125176', {
        cluster: 'eu',
        forceTLS: true,
    });

    const handleSelectAll = (e:any) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(notifications.map((li:any) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };
    const handleClick = (e:any) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item:any) => item !== id));
    }
  };
  const handleDeleteNotification =()=>{
    // console.log('button click');
    notificationDelete({
        variables:{
            ids: JSON.stringify(isCheck)
        }
    }).then(({data})=>{
       if (data.notificationDelete.status === 1) {
                showToast(data.notificationDelete.message, 'success');
                refetch();
                setIsCheck([]);
            }
            else if (data.notificationDelete.status === 0) {
                showToast(data.notificationDelete.message, 'success');
                refetch()

            }
    })
  }
    // console.log('ischeck array', isCheck)
    useEffect(() => {
        if (profileData) {
            runQuery()
            // console.log('profileData', profileData);
            setLoggedinUser(profileData.profileInformation)
        }
    }, [profileData])
    useEffect(() => {
        if (notificationsData) {
            refetch()
            // console.log('notificationsData', notificationsData);
            setNotifications(notificationsData.myNotification?.data)
            setLoading(false)
        }
        if (notiLoading) {
            setNotifications([])
            setLoading(true)
        }
    }, [notificationsData, notiLoading])

    useEffect(() => {
        if (loggedinUser?.id) {
            // console.log("User logged in id", loggedinUser?.business_id)
            const channel = pusher.subscribe(`notification-channel.${loggedinUser?.business_id}`);
            channel.bind('notification', function (data: any) {
                // alert(JSON.stringify(data))
                // console.log(data);
                runQuery()
            });
        }
    }, [loggedinUser?.id, notificationsData])
    const handleAppointmentCancellation=(id:string, status:string)=>{
        notificationUpdate({
            variables:{
                id: id,
                status: status
            }
        }).then(({data})=>{
            if (data.notificationUpdate.status === 1) {
                showToast(data.notificationUpdate.message, 'success');
                refetch();
            }
            else if (data.notificationUpdate.status === 0) {
                showToast(data.notificationUpdate.message,'success');
                refetch();
            }
        })

    }
    return (
        <div>
            {
                loading && (
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </>
                )
            }
            {notifications && !loading &&<div className='d-flex align-items-center justify-content-between mb-4' >
                <h3 className='mb-0' >Notifications</h3>
                <div>
                    {
                        notifications && notifications.length > 0 &&<>
                        <input 
                        className='me-1'
                        type='checkbox'
                        name="selectAll"
                        id="selectAll"
                        onChange={handleSelectAll}
                        checked = {isCheckAll}
                    />
                    <span className='me-3 fw-bold'>Select all</span></>
                    }
                    {isCheck&& isCheck.length>0 &&<button className='btn btn-sm btn-danger' onClick={handleDeleteNotification}>{`${isCheck.length} items`} <i className='fa fa-trash-alt text-light ms-1'></i> </button>}
                </div>
            </div>}
            {
                
                notifications && notifications.map((notification: any, sta: any) => {
                    // console.log("notification", notification)
                    const paymentS = notification?.status;
                    const paymentSString = paymentS?.toUpperCase()
                    return(
                        <>
                        <Card className="p-3 mb-3" key={notification.id}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='d-flex align-items-center'>
                                    <input
                                        className='me-1'
                                        key={notification.id}
                                        type="checkbox"
                                        name={notification?.title}
                                        id={notification.id}
                                        onChange={handleClick}
                                        checked={isCheck.includes(notification.id)}
                                    />
                                    <h6 className='mb-0 '>{notification?.title}</h6>
                                </div>
                                {
                                        notification?.status === 'refund_charging_acceptance' ? 
                                            <div>
                                                <Button onClick={() => { handleAppointmentCancellation(notification.id, "1")}} className='btn btn-danger btn-sm mx-3'>Take Deposit</Button>
                                                <Button onClick={() => { handleAppointmentCancellation(notification.id, "0") }} className='btn btn-sm'>Refund</Button></div> 
                                                : 
                                                <span className=" badge badge-info">{(paymentSString).replace('_', " ")}</span>
                                }
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                {
                                    notification?.target_url !== null ? <a href={`${notification?.target_url}`}><p className='mb-0' style={{color:'blue'}}>{notification?.message}</p></a>:<p className='mb-0'>{notification?.message}</p>
                                }
                                <a style={{minWidth: "250px",textAlign: "right"}} >{moment.unix(notification?.created_at).utcOffset('+0000').format("ll, HH:mm")}</a>
                            </div>
                        </Card>
                            </>
                        )
                    }
                    
                )
            }
            {
                !loading && notifications && notifications.length <= 0 && (
                    <Card className="p-3 m-2">
                        <div className="d-flex align-items-center">
                            <p>No new notifications</p>
                        </div>
                    </Card>
                )
            }
        </div>
    )
}

export default NotificationWrapper
