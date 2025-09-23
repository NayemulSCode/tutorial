import clsx from 'clsx'
import React, { FC, useContext, useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { HeaderNotificationsMenu, HeaderUserMenu, QuickLinks } from '../../../partials'
import { useLayout } from '../../core'
import { Link, useHistory } from 'react-router-dom'
import Pusher from 'pusher-js'
import { Card, Form, Collapse } from "react-bootstrap-v5";
import Avatar from '../../../../_metronic/assets/images/avatars/blank.png'
import { AppContext } from '../../../../../src/context/Context';
import { GUEST_APPOINTMENT_SEARCH, NOTIFICATION, NOTIFICATION_SEEN, SALES } from '../../../../gql/Query'
import moment from 'moment'
import featureSearch from './RouteLinkArray.json'
import { AnySchema } from 'yup'
import { imageUrl } from '../../../../app/modules/util'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'svg-icon-1'


interface IAppintment{
  id: string;
  business_id: number;
  sale_id: number
  user_id: number
  user_name: string
  date: number
  status: string
  note: string
  sub_total:number
  discount: number
  total_amount: number
  payment_status: string
  appointment_detail:{
    time:number
    chair: number
    appt_id:number
    duration:number
    service_pricing:{
      service_name:string
    }
  }
  clients:{
  id: string
  first_name: string
  last_name: string
  mobile: string
  email: string
  client_source:string
  gender: string
  dob:string
  client_info:string
  address:string
  language:string
}
}
interface IEnter{
  title: string
  route_path: string
}

type Props = {
  unlockedItems: string[]
}

const Topbar: FC<Props> = ({unlockedItems}) => {
  const { authToken, token, user } = useContext(AppContext);
  const { config } = useLayout()
  const imageBaseURL = `${imageUrl}/uploads/partner/${user?.photo}`;

  var pusher = new Pusher('824e3c65405d5d125176', {
    cluster: 'eu',
    forceTLS: true,
  });
  const history = useHistory()
  // Show Client List
  const [showSearch, setShowSearch] = React.useState(false);
  const handleClickSBack = () => {
    setShowSearch((Sprev) => !Sprev);
  };

  // Collapse input search
  const [open1, setOpen1] = React.useState(false);
  const [arrive, setArrive] = React.useState(false);
  const [notifications, setNotifications] = useState<any>()
  // console.log("notification coutn",notifications)
  const [notiCount, { data: notificationsData, refetch }] = useLazyQuery(NOTIFICATION)
  const [runQuery, { data: seen }] = useLazyQuery(NOTIFICATION_SEEN)
// search appointment
  const [searchString,setSearchString] = useState<string>("");
  const [searchAppointment, setSearchAppointment] = useState<IAppintment[]>([]);
  const [searchGuest, setSearchGuest] = useState<IAppintment[]>([]);
  const [showSearchResult, setShowSearchResult] = useState<number>(0);

  const filterFeature = featureSearch.filter((item:any) => item.title.toUpperCase().match(new RegExp(searchString.toUpperCase())));
  const mResult = featureSearch.filter((item:any) => item.title.toUpperCase().match(new RegExp(searchString.toUpperCase())));
  // console.log("searchItem", mResult);
  const maptitle = mResult.map((item:any)=> {return item.title})
  // console.log("only title", maptitle)
  // new code 
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [suggestionIndex, setSuggestionIndex] = useState<any>(0);
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const { data: searchData, error: searchError, loading: searchLoading } = useQuery(GUEST_APPOINTMENT_SEARCH, {
    variables: {
      search: searchString,
    }
  });
  useEffect(()=>{
    // console.log("search in global",searchData);
    setSearchAppointment(searchData?.searchClientOrAppoint?.appointments)
    setSearchGuest(searchData?.searchClientOrAppoint?.clients)
  },[searchData])

// search appointment
  useEffect(() => {
    if (notificationsData) {
      // refetch()
      // console.log('notificationsData', notificationsData);
      setNotifications(notificationsData.myNotification?.count)
    }
  }, [notificationsData]);

  const notiSeen = async () => {
    await runQuery()
    // refetch()
    // console.log("noti seen")
  }

  useEffect(() => {
    // console.log("User logged in id", user?.business_id)
    const channel = pusher.subscribe(`notification-channel.${user?.business_id}`);
    channel.bind('notification', function (data: any) {
      // alert(JSON.stringify(data))
      // console.log("pusher channel data",data);
      setArrive(true)
      notiCount()
    });

  }, [user?.business_id, notificationsData]);
  
// search new 
  const handleChange = (e:any) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    if (searchString.length > 1) {
      const filterSuggestions = maptitle.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(searchString.toLowerCase()) > -1
      );
      setSuggestions(filterSuggestions);
      
      setSuggestionsActive(true);
    } else {
      setSuggestionsActive(false);
    }
  };
 
  const handleClick = (e:any) => {
    setSuggestions([]);
    // setValue(e.target.innerText);
    setValue("")
    setSuggestionsActive(false);
    setShowSearch(false);
  };

  const handleKeyDown = (e:any) => {
    // UP ARROW
    if (e.keyCode === 38) {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (suggestionIndex - 1 === suggestions.length) {
        return;
      }
      setSuggestionIndex(suggestionIndex + 1);
    }
    // ENTER

    else if (e.keyCode === 13) {
      setValue("");
      e.preventDefault();
      setSuggestionIndex(0);
      setSuggestionsActive(false);
      setShowSearch(false);
      // console.log("suggestions[suggestionIndex]",suggestions[suggestionIndex]);
      const enterkeyPressItem: IEnter | undefined = mResult.find((item: any) => { return item.title === suggestions[suggestionIndex]});
      // console.log("enterkeyPressItem", enterkeyPressItem)
      if(enterkeyPressItem?.route_path){
        history.push(enterkeyPressItem?.route_path)
      }
    }
  };
  const Suggestions = () => {
    return (
      <ul className="suggestions">
        {mResult.map((suggestion:any, index:any) => {
          return (
            <Link to={suggestion.route_path}>
              <li
                className={index === suggestionIndex ? "active_l" : ""}
                key={index}
                onClick={handleClick}
              >
                  {suggestion.title}
              </li>
            </Link>
          );
        })}
      </ul>
    );
  };
  // invoice search
  const [allSalesData, setAllSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: salesData, loading: salesDataLoading } = useQuery(SALES, {
    variables: {
      keyword: searchString,
      date_range: "",
      count: 5,
      page: 1
    }
  });
  useEffect(() => {
    if (salesData) {
      // console.log(salesData.sales.data)
      setAllSalesData(salesData?.sales?.data)
      setLoading(false)
    }
    if (salesDataLoading) {
      setAllSalesData([])
      setLoading(true);
    }
  }, [salesData, salesDataLoading]);
  const Invoice = () => {
    return (
      <ul className="suggestions">
        {allSalesData?.map((suggestion: any, index: any) => {
          return (
            <Link to={`/invoice/${suggestion?.id}`}>
              <li
                className={index === suggestionIndex ? "active_l" : ""}
                key={index}
                onClick={handleClick}
              >
                {suggestion?.inv_pre}{suggestion?.inv_no}
              </li>
            </Link>
          );
        })}
      </ul>
    );
  };
  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>

      </div>
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>

        <QuickLinks />
      </div>

      {/* Search starts */}
      <div onClick={() => { setShowSearch(true) }} className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        {/* begin::Menu wrapper */}
        <div
          className={clsx(
            'btn btn-icon btn-active-light-primary',
            toolbarButtonHeightClass
          )}
        >
          <i className="fa fa-search"></i>
        </div>
        {/* end::Menu wrapper */}
      </div>
      {
        showSearch ? (
          <div>
            <section id="searches" className="">
              <div onClick={handleClickSBack} className="close-btn d-flex cursor-pointer"><i className="fas fa-times"></i></div>
              <Form>
                <div className="">
                  <div className="header-search-input-wrap">
                    <input
                      onClick={() => setOpen1(!open1)}
                      aria-controls="sticky-search-collapse1"
                      type="search"
                      autoFocus
                      onChange={(e:any)=>{
                        setSearchString(e.target.value);
                        setShowSearchResult(showSearchResult+1);
                        handleChange(e)
                      }}
                      onKeyDown={handleKeyDown}
                      value={value}
                      placeholder="What do you need?"
                      className="service-input"
                    />
                    <span className="text-muted">Search by features</span>
                    {suggestionsActive ? <Suggestions />: ""}
                    
                    {/* {allSalesData.length === 1 ? <Invoice /> : ""} */}
                    
                    {/* <span className="text-muted">Search by guest name, mobile, email or appointment id</span> */}
                    {/* {
                      showSearchResult !== 0 ? (
                        <> <Collapse in={open1}>
                          <div id="sticky-search-collapse1" className="sticky-search-collapse1">
                            <div id="#searchList" className="recent-search-wrapper">
                              {
                                filterFeature.map((item: any, index:any) => {
                                  return (<>
                                    <Link onClick={() => {setShowSearch(false); setShowSearchResult(0)}} to={item.route_path} className="recent-search-item d-flex align-items-center">
                                      <i className="fab fa-searchengin"></i>
                                      <span key={index} onKeyPress={(e)=>{hanldeSearchList(e)}} className='search_item_list'>{item.title}</span>
                                    </Link>
                                  </>)
                                })
                              }
                            </div>
                          </div>
                        </Collapse>
                        </>
                      ):(
                          
                      (filterFeature.map((item:any) =>{
                        return (
                            <Collapse in={open1}>
                              <div id="sticky-search-collapse1" className="sticky-search-collapse1">
                                <div className="recent-search-wrapper">
                                <h5>Previous searches</h5>
                                <Link onClick={() => { setShowSearch(false); setShowSearchResult(0) }} to={item.route_path} className="recent-search-item d-flex align-items-center">
                                    <i className="fab fa-searchengin"></i>
                                    <span className='search_item_list'>{item.title}</span>
                                  </Link>
                                </div>
                              </div>
                            </Collapse>
                            )
                          }))
                      )
                    } */}
                  </div>
                </div>
                {/* <div className="row pt-30">
                  <div className='col-xl-6 mb-5'>
                    <Card className="primary-bx-shadow">
                      <div className="form-heading">
                        <h2 className="section-title mb-0">Upcoming appointments</h2>
                      </div>
                      <div className="srch-upcoming-appn-wrap">
                        {
                          searchAppointment?.length > 0? (
                            (
                              searchAppointment?.map((item:any)=>{
                                return (
                                  <div className="upcoming-appn-item">
                                    <div className="d-flex">
                                      <div className="date me-3">
                                        <h6>{moment.unix(item.date).format('D')}</h6>
                                        <span>{moment.unix(item.date).format('MMM')}</span>
                                      </div>
                                      <div className="upcoming-apn-info">
                                        <div className="d-flex">
                                          <span className="text-muted">{moment.unix(item.date).format('ddd')} {moment.unix(item.date).format('HH:mm')}</span>
                                          <span className="appn-status text-info mx-2 text-primary">{item.status}</span>
                                        </div>
                                        <div className="info-inner-item">
                                          {item?.appointment_detail.map((item: any) => <h6>{item?.service_pricing?.service_name}</h6>)}
                                          <p className="mb-0">{item.user_name}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="mb-0">€{item.total_amount}</h6>
                                    </div>
                                  </div>
                                )
                              })
                            )
                          ):(
                            "Not found!"
                          )
                        }
                        
                      </div>
                    </Card>
                  </div>
                  <div className='col-xl-6 mb-5'>
                    <Card className="primary-bx-shadow">
                      <div className="form-heading">
                        <h2 className="section-title mb-0">Guests</h2>
                      </div>
                      <div className="recently-add-client-wrap">
                        {
                          searchGuest?.map((item:any)=>{
                            const lstName = item?.last_name;
                            return (
                              <div className="recently-add-single-guest">
                                <div className="staff-profile-symbol me-4">
                                  <span>{`${item?.first_name[0]}${lstName === ""? "" : item?.last_name[0]}`}</span>
                                </div>
                                <div>
                                  <h5 className="staff-name mb-1">{`${item?.first_name} ${item?.last_name}`}</h5>
                                  <span className="text-muted d-block">{`${item?.email}`}</span>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </Card>
                  </div>
                </div> */}
              </Form>
            </section>
          </div>
        ) : (
          null
        )
      }
      {/* Search ends */}

      {/* NOTIFICATIONS */}
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        {/* begin::Menu- wrapper */}
        <div
          className={clsx(
            'btn btn-icon btn-active-light-primary position-relative',
            toolbarButtonHeightClass
          )}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        ><Link to="/notifications" onClick={notiSeen}>
            <i className={`${notifications?.new_notification > 0 ? "fas" : "far"} fa-bell bell_icon`}>
              <span className="count" style={{ display: `${notifications?.new_notification > 0 ? "block" : "none"}` }}>{notifications?.new_notification}
              </span>
            </i>
          </Link>
        </div>
      </div>

      {/* begin::User */}
      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          {/* <a>{imageBaseURL.split('/').slice(-1)}</a> */}
          {
            user?.photo ? <img className="" src={imageBaseURL} alt="image" /> : <img className="" src={Avatar} alt="avatar" />
          }

        </div>
        <HeaderUserMenu unlockedItems={unlockedItems} />
        {/* end::Toggle */}
      </div>
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {
        config.header.left === 'menu' && (
          <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
            <div
              className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
              id='kt_header_menu_mobile_toggle'
            >
              <KTSVG path='/media/icons/duotune/text/txt001.svg' className='svg-icon-1' />
            </div>
          </div>
        )
      }
    </div >
  )
}
export { Topbar }
