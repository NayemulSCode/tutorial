import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { KTSVG } from '../../../../../../_metronic/helpers';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { GOOGLE_CALENDAR_LIST } from '../../../../../../gql/Query';
import { Card } from 'react-bootstrap-v5';
import { GOOGLE_CALENDAR_SYNC_PERMISSION } from '../../../../../../gql/Mutation';
import { useTostMessage } from '../../../../../modules/widgets/components/useTostMessage';
import moment from 'moment';

const CalendarPermission = () => {
  const history = useHistory()
  const {showToast} = useTostMessage()
  const client = useApolloClient()
  const [calenderList, setCalendarList] = useState<Array<any>>([])
  const {data: googleCalendarList, loading, refetch} = useQuery(GOOGLE_CALENDAR_LIST)
  const [syncPermissionGoogleCalendar] = useMutation(GOOGLE_CALENDAR_SYNC_PERMISSION)

  useEffect(() => {
    if (googleCalendarList) {
      setCalendarList(googleCalendarList.googleCalendars)
      console.log('googleCalendarList', googleCalendarList.googleCalendars)
    }
    
  }, [googleCalendarList]);

  // Get the current URL
  const currentURL = window.location.href
  const url = new URL(currentURL)
  const message = url.searchParams.get('message')
  useEffect(() => {
    if (message) {
      // Display the message as a toast or alert
      showToast(message, 'success') // You can use a toast library or custom notification component here
    }
  }, [message]) 
  const handlePermission = (id: number, action_id: number) => {
    if (action_id) {
      syncPermissionGoogleCalendar({
        variables: {
          id: id,
          action: action_id,
        },
      })
        .then(({data}) => {
          if (data.syncPermissionGoogleCalendar.status === 1) {
            showToast(data.syncPermissionGoogleCalendar.message, 'success')
            refetch()
            // eventsListRefetch()
          }
        })
        .catch(({errors}) => {
          showToast(errors.message, 'error')
        })
    }
  }
  

  return (
    <div>
      <div className='d-flex flex-stack'>
        <div className='mr-1 mb-2'>
          <button
            onClick={() => {
              history.push('/business/settings')
            }}
            type='button'
            className='btn btn-lg btn-light-primary me-3'
            data-kt-stepper-action='previous'
          >
            {/* @ts-ignore */}
            <KTSVG path='/media/icons/duotune/arrows/arr063.svg' className='svg-icon-4 me-1' />
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <p>Calendar List Loading....</p>
        ) : (
          calenderList && (
            // @ts-ignore
            <Card className='mb-30'>
              {/* @ts-ignore */}
              <Card.Body>
                <div className='table-responsive'>
                  <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
                    <thead>
                      <tr className='fw-bolder bg-light text-muted'>
                        <th className='ps-4'>Name Of Calendar</th>
                        <th>Pull From Google Calendar</th>
                        <th>Push into Google Calendar</th>
                        <th>Push/Pull</th>
                        <th className='text-center'>Current Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calenderList.map((calender: any, i: any) => {
                        return (
                          <tr key={i}>
                            <td style={{color: calender.color}} className={`ps-4 fw-bolder fs-6`}>
                              {calender.name}
                            </td>
                            <td className='pe-4 text-center'>
                              <input
                                onChange={() => {
                                  handlePermission(calender.id, 1)
                                }}
                                name='action'
                                id='1'
                                type='radio'
                                value='pull'
                                defaultChecked={calender.sync === 1}
                              />
                            </td>
                            <td className='pe-4 text-center'>
                              <input
                                onChange={() => {
                                  handlePermission(calender.id, 2)
                                }}
                                name='action'
                                id='1'
                                type='radio'
                                value='push'
                                defaultChecked={calender.sync === 2}
                              />
                            </td>
                            <td className='pe-4 text-center'>
                              <input
                                onChange={() => {
                                  handlePermission(calender.id, 3)
                                }}
                                name='action'
                                id='1'
                                type='radio'
                                value='both'
                                defaultChecked={calender.sync === 3}
                              />
                            </td>
                            <td className='pe-4 text-center'>
                              <input
                                name='status'
                                id='status'
                                type='checkbox'
                                checked={calender.status}
                                readOnly
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
          )
        )}
      </div>
    </div>
  )
}

export default CalendarPermission