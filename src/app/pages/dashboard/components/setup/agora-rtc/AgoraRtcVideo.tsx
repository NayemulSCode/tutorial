import React, {CSSProperties, useState} from 'react'
import AgoraUIKit, {layout} from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'
import { useHistory, useLocation } from 'react-router-dom'
const AgoraWebTRC: React.FC = () => {
 const history = useHistory()
 const location = useLocation() 
 const [isHost, setHost] = useState(true)
 const [isPinned, setPinned] = useState(false)
 const [videoCall, setVideoCall] = useState(true)
 const [username, setUsername] = useState('')
//   for channel name
    const room_info = location.pathname.split('/')
    const room_id = room_info[room_info.length-1]
    
  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Chuzeday Video Vatting</h1>
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
              rtmProps={{username: username || 'user', displayUsername: true}}
              callbacks={{
                EndCall: () => setVideoCall(false),
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
  )
}
const styles = {
  container: {
    width: '70vw',
    height: '80vh',
    display: 'flex',
    flex: 1,
    backgroundColor: '#007bff22',
  },
  heading: {textAlign: 'center' as const, marginBottom: 0},
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  } as CSSProperties,
  nav: {display: 'flex', justifyContent: 'space-around'},
  btn: {
    backgroundColor: '#007bff',
    cursor: 'pointer',
    borderRadius: 5,
    padding: '4px 8px',
    color: '#ffffff',
    fontSize: 20,
  },
  input: {display: 'flex', height: 24, alignSelf: 'center'} as CSSProperties,
}
export default AgoraWebTRC
