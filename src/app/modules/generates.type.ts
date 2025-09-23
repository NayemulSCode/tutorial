export interface IServiceInputTypes {
  serviceName: string
  treatment: string
  serviceCategory: string
  serviceDescription: string
  serviceFor: string
  onlineService: string
  tax: string
  staff: Array<string>
  // processing: string;
  // blocked: string;
  is_voucher: string
  voucherPeriod: string
  pricing: {
    duration: string
    price: number
    priceType: string
    specialPrice: number
    pricingName: string
  }[]
  is_personal: boolean
  group_service: boolean
  repeated_group: boolean
  group_frequency:string
  group_occurrences: string
  start_date: string
  enrolment_date:string
  course: boolean
  guest_per_class: number
  sessions_per_course: number
  occurrence: string
  is_special_deposit:boolean
  special_deposit: number
  group_type: string
}

export type IEditService = {
  name: string;
  tax: string;
  // business_id: number;
  staffs: Array<string>;
  description: string;
  service_category_id: number;
  service_available_for: string;
  voucher_sale: string;
  is_voucher: boolean;
  is_personal: boolean;
  // enable_online_booking: boolean;
  is_group: boolean;
  is_course: boolean;
  service_group:{
    client_per_class: number ;
    session_per_course: number;
    schedule_type: string;
    schedules: string;
    start_date: string;
    enroll_date: string;
    occurrences: number;
    frequency: string;
  }
  special_deposit: number;

}

export type GroupTimeSlot= {
  id: number;
  hours: number;
  minutes: number;
};
export type ConflictData={
  id: number;
  date_time: string;
  service_pricing:{
    id: number;
    duration: string;
  }
}
export type EventDateTime ={
  date: string;
  date_show: string;
  time: string;
}
export type ShouldRepeated={
  occurrences: string;
  frequency: string;
}