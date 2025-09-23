import React,{FC, useContext} from 'react'
import { Link } from 'react-router-dom'
import { GroupType, IUsers } from '../../../../../types'
type GuestProps ={
    clients: IUsers[]
    groupInfo: GroupType
    handleClientsDetailView:(c: any)=> void
    setShowCdetails:(a: boolean)=>void
}
const GuestList: FC<GuestProps> = ({ clients, groupInfo, handleClientsDetailView, setShowCdetails }) => {
  return (
      <ul className='ul-single-item appn-clients-list'>
          {clients && clients.map((client) => (
              <li key={client.id}>
                  <Link
                      to='#'
                      onClick={() => {
                        //   if (groupInfo.is_group) {
                        //       handleClientsDetailView(client)
                        //   } else {
                            //   setShowCdetails(true)
                              handleClientsDetailView(client)
                        //   }
                      }}
                      className='select-single-item text-dark'
                  >
                      <div className='d-flex align-items-center'>
                          <div className='staff-profile-symbol me-4'>
                              <span>
                                  {client?.first_name?.slice(0, 1)}
                                  {client?.last_name?.slice(0, 1)}
                              </span>
                          </div>
                          <div>
                              <h5 className='staff-name'>{`${client.first_name} ${client?.last_name}`}</h5>
                              <span className='text-muted'>{client?.email}</span>
                              <span
                                  className={`badge badge-secondary fw-bolder`}
                              >
                                  {client?.client_source}
                              </span>
                          </div>
                      </div>
                      <div></div>
                  </Link>
              </li>
          ))}
      </ul>
  )
}

export default GuestList