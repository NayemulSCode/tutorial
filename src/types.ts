export interface IStaff {
  id: string
  name: string;
  photo: string;
  email: string;
  mobile: string;
}
export interface IVoucher {
  total_sale: number,
  total_price: number,
  quantity: number,
  staff: number,
  id: string,
  business_id: number,
  name: string,
  value: number,
  retail: number,
  valid_for: string,
  limit_number_of_sales_enable: boolean,
  limit_number_of_sales: number,
  services_included: string,
  enable_online_sales: boolean,
  title: string,
  description: string,
  color: string,
  note: string
}

export interface IProduct {
  unit_price_subtotal: number,
  min_stock_qty: number,
  max_stock_qty: number,
  total_price: number,
  quantity: number,
  staff: number,
  id: number,
  name: string,
  brand_id: string,
  brand_code: string,
  barcode: string,
  mesaurement_type: string,
  amount: number,
  short_description: string,
  description: string,
  product_category_id: string,
  supply_price: number,
  track_retail_sale: boolean,
  retail_price: number,
  special_price: number,
  markup: number,
  track_stock_qty: boolean,
  stock_qty: number,
  // sku: Array<string>,
  // supplier: string,
  photos: string,
  tax: string,
  category_info: {
    name: string,
  },
  brand_info: {
    name: string,
  },
}
export interface IApptInfo {
  client_id: number | string,
  date: string,
  note: string
}
export interface IServiceTobeCheckout {
  id?: string | number;
  appt_id: string | number;
  ser_pricing_id: string;
  time: string;
  formatted_time: string;
  duration: string;
  staff_id: string;
  chair: string;
  quantity: number;
  service_name: string;
  price: number;
  special_price: number;
  staffs: string;
  online: number;
  is_group?: boolean;
  is_course?: boolean;
  single_group?: boolean;
  repeated_group?:boolean;
  frequency?:string;
  occurrences?:string;
  schedule_id?:string;
  date?: string;
}
export interface IVideoCategory {
  id: string
  name: string
}
export interface IService { 
  time: string,
  duration: string
  service_id: number,
  price: number,
  special_price: number,
  staff: string | number,
  staff_id: string | number,
  quantity: number,
  id: number,
  name: string,
  tax: string,
  status: boolean,
  business_id: number,
  staffs: any,
  description: string,
  treatment_type_id: number,
  service_category_id: number,
  service_available_for: string,
  enable_online_booking: boolean,
  is_voucher: boolean,
  service_pricing: [
    {
      duration: string,
      priceType: string,
      price: string,
      specialPrice: string,
      pricingName: string,
    }
  ],
  voucher_sale: string,
  treatment_type_info: {
    id: number,
    business_id: number,
    name: string,
  },
  service_category_info: {
    id: number,
    business_id: number,
    name: string
  }
}

export interface IservicePricing {
  service_id: number,
  pricing_name: string,
  duration: number,
  price_type: number,
  price: number,
  special_price: number,
}
export interface IincludeService {
  service_id: number,
  label: string,
  value: string
}

export interface IUsers {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  mobile: string;
  user_type: string;
  photo: string;
  token: string;
  address: string;
  gender: string;
  client_source: string;
}

export interface IGuest {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  address: string;
  user_type: string;
  client_info: string;
  email_notification: boolean;
  marketing_notification: boolean;
  language: string;
  additional_mobile: string;
  client_source: string;
  display_booking: boolean;
}

export interface IBuyerGuest {
  id: string;
  user_id:string;
  client_id:string;
  first_name: string;
  last_name: string
  email: string;
  mobile: string;
  client_source?:string;
  repeated?:boolean;
  occurrences?:string | number | undefined;
  frequency?:string;
  // client_block: boolean | null | undefined;
}

export interface IAppointments {
  id: number;
  user_id: number;
  date: number;
  status: string
  note: string
  appointment_detail: {
    id: number;
    appt_id: number;
    staff_id: number;
    ser_pricing_id: number;
    time: number;
    duration: number;
    chair: number;
    // client_source: string;
  }
}

export interface IAppointmentService {
  id: string;
  client_id: string | number;
  note: string;
  date: string;
  services: {
    id: string;
    time: string;
    service_id: string;
    price: string;
    service_name: string;
    service_pricing_name: string;
    duration: string;
    staff_id: string;
    chair: string;
  }[];
}
export interface IProductCategory {
  id: string;
  name: string;
  business_id: string;
}

export interface IServiceCategory {
  id: string;
  name: string;
  business_id: string;
}

export interface IRescueSale{
  online: number;
  sale_id?: number;
  appt_id?: number;
}
export interface IAccountInfo {
  id: string
  business_id: string
  first_name: string
  last_name: string
  mobile: string
  email: string
  photo: string
  user_type: string
  created_at: number
  updated_at: number
  business_type: Array<string>
  approved_status:any
  business_info: {
    id: string
    name: string
    thumbnail: string
    team_size: string
    slider: Array<string>
    website: string
    social_links: {
      facebook: string;
      instagram: string;
      linkedin: string;
      tiktok: string;
    }
    location: string
    eir_code: string
    latitude: number
    longitude: number
    created_at: number
    updated_at: number
    description: string
    about: string
  }
}
export interface ICalendarEvent {
  start: "";
  end: "";
}
export interface IBusinessSetting {
  online_booking: string;
  close_date: {
    id: string;
    business_id: number;
    start_date: number;
    end_date: number;
    duration: number;
    description: string;

  },
  invoice: {
    id: string;
    business_id: number;
    header: string;
    footer: string;
    sub_header: string;
    invoice_no: string;
    invoice_prefix: string;
  }
}
export interface ISubscriptionDetails{
  current: {
    sub_start_date: number,
    sub_expiry_date: number
  },
  histories: {
    id: string,
    sub_start_date: number,
    sub_expiry_date: number,
    pay_status: string,
    tran_id: number,
    sub_price: number
  }
}
export type GroupType = {
  is_group: boolean,
  client_per_class:number,
  is_course:boolean,
  session_per_course: number,
  booked_guests: {id: string, user_id: string}[] | [],
  total_booked: number,
  group_type?: string,
  frequency?: string,
  occurrences?: number | string,
  disabled?: boolean
}

export interface systemLogTypes{
    api: string;
    user: string;
    body: string;
    response: string;
    exception: string;
    source: string;
    version: string;
    priority: string;
    device: string;
}