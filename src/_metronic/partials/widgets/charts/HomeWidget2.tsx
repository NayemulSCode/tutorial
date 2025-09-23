import React, {useEffect, useRef,useState} from 'react'
import { useIntl } from "react-intl"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import events from '../../../../app/pages/dashboard/components/events'
import { useQuery } from '@apollo/client'
import { PROFILE_INFORMATION, STAFF_WISE_APPOINTMENT } from '../../../../gql/Query'
import { useHistory } from 'react-router-dom'

type Props = {
  className: string
}

const HomeWidget2: React.FC<Props> = ({className}) => {
    const history = useHistory()
    const intl = useIntl()
    const localizer = momentLocalizer(moment);
    const [convertedArry, setConvertedArry] = useState<Array<any>>([])
    const [slotDuration, setSlotDuration] = useState<any>();
    const [appointmentsData, setAppointmentsData] = useState<Array<any>>([{
      id: "",
      appt_id: 0,
      title: "",
      start: new Date(),
      end: new Date()
    }]);
  const {data: profileInformation, refetch: profileInfo} = useQuery(PROFILE_INFORMATION)
  const { data: appointmentData, error: appointmentError, loading: appointmentLoading, refetch } = useQuery(STAFF_WISE_APPOINTMENT, {
    variables: {
      staff_id: 0,
      chair_id: 0
    }
  })
  useEffect(()=>{
        if(profileInformation){
            // profileInfo()
            setSlotDuration(profileInformation.profileInformation.slot_duration)
        }
    },[profileInformation])
  useEffect(() => {
    if (appointmentData) {
      refetch();
      if (appointmentData.staffWiseAppointment.length > 0) {
        refetch();
        setAppointmentsData(appointmentData.staffWiseAppointment)

      }
    }
  }, [appointmentData]);
  useEffect(() => {
    const convertArr: any[] = [];
    appointmentsData.forEach((item: any) => {
      // Object.assign(item, { "uuid": uuidv4() })
      let sDate = moment(item.start)
      let eDate = moment(item.end)
      const newObj = {
        title: item.is_group ? `${item.title}` : `${item.title}-${item.name}`,
        start: sDate.toDate(), // Use .toDate() instead of new Date(sDate)
        end: eDate.toDate(), // Use .toDate() instead of new Date(eDate)
        id: item.id,
        appt_id: item.appt_id,
        room_id: item?.room_id,
        status: item?.status,
        is_group: item?.is_group,
        is_course: item?.is_course,
      }
      convertArr.push(newObj);
      setConvertedArry(convertArr)
    })
  }, [appointmentsData]);
  let today = new Date();
  return (
    <div className={`card ${className}`}>
      <div className='Home-calendar-wrap'>
        <Calendar
          localizer={localizer}
          events={convertedArry}
          startAccessor='start'
          endAccessor='end'
          defaultView='day'
          step={slotDuration}
          min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6)}
          max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23.9)}
          messages={{
            previous: 'Prev.',
          }}
          onSelectEvent={(event) => history.push('/calendar')}
          defaultDate={new Date()}
          views={{day: true}}
          timeslots={1}
          style={{height: 500}}
          eventPropGetter={(convertedArry: any) => {
            const backgroundColor = convertedArry.room_id
              ? 'orange'
              : convertedArry.status === 'Completed'
              ? 'green'
              : convertedArry.status === 'No Show'
              ? 'red'
              : convertedArry.status === 'Cancelled'
              ? 'purple'
              : convertedArry.status === 'Google'
              ? 'darkblue'
              : Boolean(convertedArry.is_course)
              ? 'darkcyan'
              : Boolean(convertedArry.is_group) && !Boolean(convertedArry.is_course)
              ? 'chocolate'
              : 'blue'
            return {style: {backgroundColor}}
          }}
        />
      </div>
    </div>
  )
}

export { HomeWidget2}