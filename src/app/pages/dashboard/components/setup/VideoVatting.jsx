import React, { useState, useEffect} from 'react';
import { Jutsu } from 'react-jutsu'
import AgoraUIKit, {layout} from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { ALL_CLIENTS, NOTIFICATION_UPDATE, PROFILE_INFORMATION } from '../../../../../gql/Query';
import { AGORA_ROOM_TOKEN, APPOINTMENT_ACCEPT_OR_REJECT } from '../../../../../gql/Mutation';
import {useHistory, useHostory,useLocation }  from 'react-router-dom';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap-v5'
import ModalWidgets from '../../../../modules/widgets/components/ModalWidgets';
import { useSnackbar } from 'notistack';
const VideoVatting = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory()
    const location = useLocation();
    const room_info = location.pathname.split('/')
    const room_id = room_info[room_info.length-1]
    const [call, setCall] = useState(true);
    const [loggedinUser, setLoggedinUser] = useState()
    console.log("loggedinUser", loggedinUser);
    // agora component state
    const [isHost, setHost] = useState(true)
    const [isPinned, setPinned] = useState(false)
    const [videoCall, setVideoCall] = useState(true)
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('')
    const [isAppointment, setIsAppointment] = useState(null)
    const [agoraAccessToken] = useMutation(AGORA_ROOM_TOKEN);
    const { data: profileData } = useQuery(PROFILE_INFORMATION);
    const [appointmentAcceptOrReject] = useMutation(APPOINTMENT_ACCEPT_OR_REJECT,{
        refetchQueries: [{
            query: ALL_CLIENTS, variables: {
                search: "",
                count: 10,
                page: 1,
            }
        }],
        awaitRefetchQueries: true,
    });
    useEffect(() => {
      const fetchData = async () => {
        if (room_id) {
          const {data} = await agoraAccessToken({
            variables: {
              room_id: room_id,
            },
          })
          setToken(data.agoraAccessToken.token)
          setIsAppointment(data.agoraAccessToken.is_appointment)
          console.log('access token', data.agoraAccessToken.token)
        }
      }

      fetchData()
    }, [agoraAccessToken, room_id]);
 
    const meetingEnd =()=>{
        setVideoCall(false)
        setShow(true);
        setHost(false)
        setPinned(false)
        setUsername('')
    }
    useEffect(() => {
        if (profileData) {
            console.log('profileData', profileData);
            setLoggedinUser(profileData.profileInformation)
        }
    }, [profileData]);
    const [show, setShow] = useState(false);

    const handleUpdateAppointmentStatus =(status)=>{
        // setShow(false)
        // console.log("count--------->",status, appt_id);
        appointmentAcceptOrReject({
            variables: {
                room_id: room_id,
                status: status
            }
        }).then(({data})=>{
            if (data.appointmentAcceptOrReject.status === 1){
                enqueueSnackbar(data.appointmentAcceptOrReject.message, {
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
                history.push('/sales/appointment-list')
            }
            if (data.appointmentAcceptOrReject.status === 0) {
                enqueueSnackbar(data.appointmentAcceptOrReject.message, {
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
                history.push('/sales/appointment-list')
            }
            console.log("accept or reject dta", data)
        })
    }
    return (
      <>
        {/* agora  */}
        <div style={styles.container}>
          <div style={styles.videoContainer}>
            <h1 style={styles.heading}>Chuzeday Video Vetting</h1>
            {videoCall ? (
              <>
                {/* <div style={styles.nav}>
              <p style={{fontSize: 20, width: 200}}>You're {isHost ? 'a host' : 'an audience'}</p>
              <p style={styles.btn} onClick={() => setHost(!isHost)}>
                Change Role
              </p>
              <p style={styles.btn} onClick={() => setPinned(!isPinned)}>
                Change Layout
              </p>
            </div> */}
                <AgoraUIKit
                  rtcProps={{
                    appId: 'ef438dec0be54db487b237ffd4f7aa5d',
                    channel: room_id,
                    token: null, // add your token if using app in secured mode
                    role: isHost ? 'host' : 'audience',
                    layout: isPinned ? layout.pin : layout.grid,
                    enableScreensharing: true,
                  }}
                  rtmProps={{username: username || loggedinUser?.first_name, displayUsername: true}}
                  callbacks={{
                    EndCall: () => {
                      meetingEnd()
                    },
                  }}
                />
              </>
            ) : (
              <div style={styles.nav}>
                <input
                  style={styles.input}
                  placeholder='Your Name'
                  type='text'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                  }}
                />
                <h3 style={styles.btn} onClick={() => setVideoCall(true)}>
                  Start Call
                </h3>
              </div>
            )}
          </div>
        </div>
        <Modal
          show={show}
          dialogClassName='modal-90w'
          // onHide={handleClose}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          {!isAppointment ? (
            <>
              <Modal.Header>
                <Modal.Title>
                  <p style={{textAlign: 'center'}}>Accept this Guest Back to Your Business</p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus('3')
                  }}
                  style={{margin: '0 50px 0 80px'}}
                >
                  Unblock
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus('4')
                  }}
                >
                  Block
                </Button>
              </Modal.Body>
            </>
          ) : (
            <>
              <Modal.Header>
                <Modal.Title>
                  <p style={{textAlign: 'center'}}>Appointment Confirmation</p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus('1')
                  }}
                  style={{margin: '0 50px 0 80px'}}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateAppointmentStatus('0')
                  }}
                >
                  Cancel
                </Button>
              </Modal.Body>
            </>
          )}
        </Modal>
      </>
    ) 
};
const styles = {
  container: {
    width: '75vw',
    height: '85vh',
    display: 'flex',
    flex: 1,
    backgroundColor: '#007bff22',
  },
  heading: {textAlign: 'center', marginBottom: 0},
  videoContainer: {
    display: 'flex', 
    flexDirection: 'column',
    flex: 1,
  },
  nav: {display: 'flex', justifyContent: 'space-around'},
  btn: {
    backgroundColor: '#007bff',
    cursor: 'pointer',
    borderRadius: 5,
    padding: '4px 8px',
    color: '#ffffff',
    fontSize: 20,
  },
  input: {display: 'flex', height: 24, alignSelf: 'center'},
}

export default VideoVatting;
