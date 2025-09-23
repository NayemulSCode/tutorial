import { GroupType, IRescueSale, IVideoCategory } from './../types';
import { IProduct, IVoucher, IService, IBuyerGuest, IAccountInfo,IServiceTobeCheckout, IAppointmentService, ICalendarEvent, IApptInfo } from "../types";

export type AppContextState = {
  user: IAccountInfo
  token: string
  cancelApptId: string
  totalAmount: number
  videoId: number
  appointmentSource: IRescueSale
  products: IProduct[]
  vouchers: IVoucher[]
  services: IService[]
  // howToVideo: IVideoCategory[]
  apptServices: IServiceTobeCheckout[]
  apptInfo: IApptInfo
  guest: IBuyerGuest
  guests: IBuyerGuest[]
  calendarEvent: ICalendarEvent
  groupInfo: GroupType
  addGroupInfo: (groupInfo: GroupType)=> void
  addUser: (newUser: IAccountInfo) => void
  addTotalAmount: (amount: number) => void
  addVideoItem: (vid: number) => void
  addAppointmentSource: (source: IRescueSale) => void
  addGuest: (guest: IBuyerGuest) => void
  addGuests: (guest: IBuyerGuest, isUpdate?:string) => void
  addCaEvent: (calendarEvent: ICalendarEvent) => void
  addProducts: (product: IProduct) => void
  removeProducts: (product: IProduct) => void
  removeVouchers: (voucher: IVoucher) => void
  removeServices: (service: IService) => void
  removeApptServices: (service: IServiceTobeCheckout) => void
  addVouchers: (voucher: IVoucher) => void
  addServices: (service: IService) => void
  addApptServices: (service: IServiceTobeCheckout[]) => void
  // addVideoCategories: (newCategory: IVideoCategory[]) => void
  addApptInfo: (info: IApptInfo) => void
  authToken: (token: string) => void
  appointmentCancel: (cancelApptId: string) => void
  clearContext: () => void
}