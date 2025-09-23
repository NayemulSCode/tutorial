import React, { createContext, useState, FC } from "react";
import { IProduct, IVoucher, IService, IBuyerGuest, IAccountInfo, IServiceTobeCheckout, IAppointmentService, ICalendarEvent, IApptInfo, IVideoCategory, GroupType, IRescueSale } from "../types";
import { AppContextState } from "./type";

const contextDefaultValues: AppContextState = {
  user: {
    id: '',
    business_id: '',
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    photo: '',
    user_type: '',
    business_type: [],
    approved_status: '',
    created_at: 0,
    updated_at: 0,
    business_info: {
      id: '',
      name: '',
      thumbnail: '',
      team_size: '',
      slider: [],
      website: '',
      social_links: {facebook: '', instagram: '', linkedin: '', tiktok: ''},
      location: '',
      eir_code: '',
      latitude: 0,
      longitude: 0,
      created_at: 0,
      updated_at: 0,
      description: '',
      about: '',
    },
  },
  token: '',
  cancelApptId: '',
  totalAmount: 0,
  videoId: 0,
  appointmentSource: {
    online: 0,
    sale_id: 0,
    appt_id: 0,
  }, // 0 means waking, 1 means online
  products: [],
  vouchers: [],
  services: [],
  apptServices: [],
  // howToVideo: [],
  apptInfo: {
    client_id: 0,
    note: '',
    date: '',
  },
  guest: {
    id: '',
    user_id: '',
    client_id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
  },
  guests: [],
  calendarEvent: {
    start: '',
    end: '',
  },
  // multiple gest add at appointment
  groupInfo: {
    is_group: false,
    client_per_class: 0,
    is_course: false,
    session_per_course: 0,
    booked_guests: [],
    total_booked: 0,
    disabled: false,
  },
  addGroupInfo: () => {},
  addUser: () => {},
  addTotalAmount: () => {},
  addVideoItem: () => {},
  addAppointmentSource: () => {},
  addGuest: () => {},
  addGuests: () => {},
  addCaEvent: () => {},
  addProducts: () => {},
  removeProducts: () => {},
  addVouchers: () => {},
  removeVouchers: () => {},
  addServices: () => {},
  removeServices: () => {},
  addApptServices: () => {},
  // addVideoCategories: () => {},
  removeApptServices: () => {},
  addApptInfo: () => {},
  authToken: () => {},
  appointmentCancel: () => {},
  clearContext: () => {},
}

export const AppContext = createContext<AppContextState>(
  contextDefaultValues
);
const ContextProvider: FC = ({ children }) => {
  const partner: IAccountInfo = JSON.parse(localStorage.getItem('partner')!);
  const [user, setUser] = useState<IAccountInfo>(partner || contextDefaultValues.user);
  const [token, setToken] = useState<string>(contextDefaultValues.token);
  const [totalAmount, setTotalAmount] = useState<number>(contextDefaultValues.totalAmount);
  const [videoId, setVideoId] = useState<number>(contextDefaultValues.videoId);
  const [appointmentSource, setAppointmentSource] = useState<IRescueSale>(contextDefaultValues.appointmentSource);
  const [guest, setGuest] = useState<IBuyerGuest>(contextDefaultValues.guest);
  const [guests, setGuests] = useState<IBuyerGuest[]>(contextDefaultValues.guests);
  const [calendarEvent, setCalendarEvent] = useState<ICalendarEvent>(contextDefaultValues.calendarEvent);
  const [products, setProducts] = useState<IProduct[]>(contextDefaultValues.products)
  const [vouchers, setVouchers] = useState<IVoucher[]>(contextDefaultValues.vouchers)
  const [services, setServices] = useState<IService[]>(contextDefaultValues.services)
  const [apptServices, setApptServices] = useState<IServiceTobeCheckout[]>(contextDefaultValues.apptServices)
  const [groupInfo, setGroupInfo] = useState<GroupType>(contextDefaultValues.groupInfo)
  // const [howToVideo, setHowToVideo] = useState<IVideoCategory[]>(contextDefaultValues.howToVideo)
  const [apptInfo, setApptInfo] = useState<IApptInfo>(contextDefaultValues.apptInfo)
  const [cancelApptId, setCancelApptId] = useState<string>(contextDefaultValues.cancelApptId)
  // console.log("apptServices", apptServices)
  // console.log("guest", guest)
  // console.log("apptInfo", apptInfo)
  // console.log("calendarEvent", calendarEvent)
  // console.log("calendarEvent cancel appt id", cancelApptId)
  const addGroupInfo = (groupInfo: GroupType) => setGroupInfo(groupInfo)
  const addUser = (newUser: IAccountInfo) => setUser(newUser)
  const authToken = (newToken: string) => {
    setToken(newToken);
  };
  const appointmentCancel = (cancelid:string)=>{
    setCancelApptId(cancelid)
  }
  const addTotalAmount = (amount: number) => setTotalAmount(amount);
  const addVideoItem = (videoId: number) => setVideoId(videoId);
  const addAppointmentSource = (source: IRescueSale) => setAppointmentSource(source); // source 0 mean walking, 1 mean online
  const addGuest = (newGuest: IBuyerGuest) => setGuest(newGuest);
  const addGuests = (newGuest: IBuyerGuest, isUpdate?:string) => {
    // Check if newGuest already exists in the array
    if (guests.some((guest) => guest?.user_id === newGuest?.id)) {
      setGuests((prev) => prev.filter((guest) => guest.id !== newGuest.id));
    } else if (isUpdate === 'update'){
      if (guests.some((guest) => guest?.id === newGuest?.id))   {
        setGuests((prev) =>
          prev.map((guest) => (guest.id === newGuest.id ? newGuest : guest))
        );
      }else{
        setGuests((prev) => [...prev, newGuest]);
      }   
    }else if(isUpdate === 'remove'){
      if(guests.some((guest)=> guest.user_id)){
        setGuests((prev) => prev.filter((guest) =>guest.user_id !== newGuest.user_id));
      }else{
        setGuests((prev) => prev.filter((guest) => guest.id !== newGuest.id));

      }
    }else if(isUpdate === 'add'){
      // Add the newGuest to the array
      setGuests((prev) => [newGuest]);
    }
  };
  const addCaEvent = (newEvent: ICalendarEvent) => setCalendarEvent(newEvent);
  const addProducts = (newProduct: IProduct) => setProducts((product) => [...product.filter(p => p?.id !== newProduct?.id), newProduct]);
  const removeProducts = (newProduct: IProduct) => setProducts(products.filter(product => product.id !== newProduct.id));
  const addVouchers = (newVoucher: IVoucher) => setVouchers((voucher) => [...voucher.filter(v => v.id !== newVoucher.id), newVoucher]);
  const removeVouchers = (newVoucher: IVoucher) => setVouchers(vouchers.filter(voucher => voucher.id !== newVoucher.id))
  const addServices = (newService: IService) => setServices((services) => [...services.filter(service => service.id !== newService.id), newService]);
  const removeServices = (newService: IService) => setServices(services.filter(service => service.id !== newService.id))
  const addApptServices = (newApptServices: IServiceTobeCheckout[]) => setApptServices(newApptServices)
  // const addVideoCategories = (howToVideo: IVideoCategory[]) => setHowToVideo(howToVideo)
  const removeApptServices = (newApptServices: IServiceTobeCheckout) => setApptServices(apptServices.filter(service => service.ser_pricing_id !== newApptServices.ser_pricing_id))
  const addApptInfo = (apptInfo: IApptInfo) => setApptInfo(apptInfo)

  const clearContext = () => {
    setProducts([]);
    setVouchers([]);
    setServices([]);
    setApptServices([]);
    setGuests([]);
    setGroupInfo(contextDefaultValues.groupInfo)
    setTotalAmount(0);
  }

  return (
    <AppContext.Provider
      value={{
        apptInfo,
        addApptInfo,
        user,
        addUser,
        token,
        authToken,
        products,
        addProducts,
        removeProducts,
        vouchers,
        addVouchers,
        removeVouchers,
        services,
        addServices,
        removeServices,
        guest,
        calendarEvent,
        addGuest,
        guests,
        addGuests,
        addCaEvent,
        totalAmount,
        addTotalAmount,
        clearContext,
        apptServices,
        addApptServices,
        removeApptServices,
        cancelApptId,
        appointmentCancel,
        // howToVideo,
        // addVideoCategories,
        videoId,
        addVideoItem,
        appointmentSource,
        addAppointmentSource,
        groupInfo,
        addGroupInfo
      }}
    >
      {children}
    </AppContext.Provider>
  )
};

export default ContextProvider;