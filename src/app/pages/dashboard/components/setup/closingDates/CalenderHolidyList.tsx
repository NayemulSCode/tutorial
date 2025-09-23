import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { GOOGLE_CALENDAR_EVENTS } from '../../../../../../gql/Query'
import { GOOGLE_CALENDAR_HOLIDAY_PERMISSION } from '../../../../../../gql/Mutation'
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage'
import moment from 'moment'
import {Card} from 'react-bootstrap-v5'

const CalenderHolidayList = () => {
      const {showToast} = useTostMessage()
      const [eventsList, setEventsList] = useState<Array<any>>([])
     const {
       data: googleCalendarLEvents,
       loading: eventsListLoading,
     } = useQuery(GOOGLE_CALENDAR_EVENTS, {
       variables: {
         type: 'holiday',
       },
     })
    const [statusUpdateGoogleCalendarEvent] = useMutation(GOOGLE_CALENDAR_HOLIDAY_PERMISSION);
    useEffect(() => {
      if (googleCalendarLEvents) {
        setEventsList(googleCalendarLEvents.googleCalendarEvents)
      }
    }, [googleCalendarLEvents]);
    const handleIsOpenShopAtHoliday = (id: number, status: boolean) => {
      if (id) {
        statusUpdateGoogleCalendarEvent({
          variables: {
            id: +id,
            status: !status,
          },
        }).then(({data}) => {
          if (data.statusUpdateGoogleCalendarEvent.status === 1) {
            console.log(
              'data.statusUpdateGoogleCalendarEvent:',
              data.statusUpdateGoogleCalendarEvent
            )
            showToast(data.statusUpdateGoogleCalendarEvent.message, 'success')
          }
        })
      }
    }
  return (
    <div>
      {eventsListLoading ? (
        <p className='mt-5'>Events List Loading....</p>
      ) : eventsList ? (
        // @ts-ignore
        <Card className='mb-30 mt-5'>
          {/* @ts-ignore */}
          <Card.Body>
            <div className='table-responsive'>
              <h1>Government Holidays</h1>
              <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
                <thead>
                  <tr className='fw-bolder bg-light text-muted'>
                    <th className='ps-4'>Event Name</th>
                    <th className='ps-4'>Event Description</th>
                    <th>Event Date</th>
                    <th className='text-center'>Close Shop</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsList.map((event: any, i: any) => {
                    return (
                      <tr key={i}>
                        <td className={`ps-4 text-dark fw-bolder fs-6`}>{event.name}</td>
                        <td className={`ps-4 text-dark fw-bolder fs-6`}>{event.description}</td>
                        <td className={`ps-4 text-dark fw-bolder fs-6`}>
                          {moment(event.started_at).format('YYYY-MM-DD')}
                        </td>
                        <td className='pe-4 text-center'>
                          <input
                            name='status'
                            id='status'
                            type='checkbox'
                            defaultChecked={event.status}
                            onChange={() => {
                              handleIsOpenShopAtHoliday(event.id, event.status)
                            }}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <p className='mt-5'>List Not Found!</p>
      )}
    </div>
  )
}

export default CalenderHolidayList