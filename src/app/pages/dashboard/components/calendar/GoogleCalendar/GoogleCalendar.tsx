
import React, { FC, useEffect, useState } from 'react'
import {CALENDAR_DISCONNECT, SYSTEM_LOG} from '../../../../../../gql/Mutation'
import { useMutation, useQuery } from '@apollo/client'
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage'
import { PROFILE_INFORMATION } from '../../../../../../gql/Query'
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers'

const GoogleCalendar: FC = () => {
  const {showToast} = useTostMessage();
  const [isConnected, setIsConnected] = useState<boolean>(false);
   const [identity, setIdentity] = useState<string>('')
   const {data: accountData, refetch} = useQuery(PROFILE_INFORMATION)
   const [disconnectGoogleAccount] = useMutation(CALENDAR_DISCONNECT)

   useEffect(() => {
     if (accountData) {
       setIdentity(accountData.profileInformation?.identify);
       setIsConnected(accountData.profileInformation?.google_calendar);
     }
   }, [accountData])

   const handleConnect = () => {
     if(Boolean(identity)){
       window.location.host.includes('localhost:3011') ||
       window.location.host.includes('testbusiness.chuzeday.com')
         ? window.location.replace(
             `https://testbackend.chuzeday.com/calendar/permission/${identity}`
           )
         : window.location.replace(`https://backend.chuzeday.com/calendar/permission/${identity}`)
     }else{
      showToast('Please Try Again', 'error');
     }
   }
  const handleDisconnect = () => {
    disconnectGoogleAccount().then(({data})=>{
      if(data.disconnectGoogleAccount){
        showToast(data.disconnectGoogleAccount?.message, 'success');
        refetch();
      }
    }).catch(({error})=>{
      console.log('error');
       showToast(error?.message, 'error')
    })
  }
  return (
    <div>
      {isConnected ? (
        <button onClick={handleDisconnect} className='google-calendar-button'>
          <img
            src={toAbsoluteUrl('/media/icons/google-calendar.png')}
            alt='Google Calendar Icon'
          />
          <span>Disconnect Google Calendar</span>
        </button>
      ) : (
        <button
          onClick={() => {
            handleConnect()
          }}
          className='google-calendar-button'
        >
          <img
            src={toAbsoluteUrl('/media/icons/google-calendar.png')}
            alt='Google Calendar Icon'
          />
          <span>Connect Google Calendar</span>
        </button>
      )}
    </div>
  )
}

export default GoogleCalendar