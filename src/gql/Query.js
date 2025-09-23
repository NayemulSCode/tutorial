import { gql } from "@apollo/client";

// get single user info
export const SINGLE_USER = gql`
query user($id: ID){
  user(id: $id){
    id
    name
    email
    user_type
  }
}
`;

// get all users info
export const ALL_USER = gql`
query users($page: Int, $first: Int){
    users(page: $page, first: $first){
        data{
            id
            first_name
            last_name
            email
            mobile
            user_type
        }
        paginatorInfo{
            count
            total
        }
    }
}
`;

// profile information
export const PROFILE_INFORMATION = gql`
query{
  profileInformation{
    id
    business_id
    first_name
    last_name
    mobile
    email
    photo
    identify
    google_calendar
    user_type
    created_at
    updated_at
    business_type
    approved_status
    slot_duration
    business_info{
      slug
      website
      slider
      social_links{
        facebook
        instagram
        linkedin
        tiktok
      }
      thumbnail
      id
      name
      size
      team_size
      country
      location
      eir_code
      latitude
      longitude
      created_at
      updated_at  
      description
      about
      is_vat_register
      vat_number
      group_service
    }
    off_boarding{
      id
      request_date
      status
    }
  }
} 
`;

// get all products info
export const GET_ALL_PRODUCTS = gql`
query products($search: String, $type: String, $count: Int, $page: Int) {
  products(search: $search, type: $type, count: $count, page:$page){
    data{
      value
      label,
      id
      brand_id
      brand_code
      product_category_id
      name
      short_description
      description
      mesaurement_type
      amount
      photos
      supply_price
      track_retail_sale
      retail_price
      special_price
      markup
      track_stock_qty
      stock_qty
      min_stock_qty
      max_stock_qty
      tax
      brand_info{
        id
        business_id
        name
      }
      category_info{
        id
        business_id
        name
      }
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get single product info
export const SINGLE_PRODUCT = gql`
query product($id: ID, $barcode: String, $root_barcode: String){
  product(id: $id, barcode: $barcode, root_barcode:$root_barcode){
    id
    brand_id
    brand_code
    barcode
    product_category_id
    name
    short_description
    description
    mesaurement_type
    amount
    photos
    supply_price
    track_retail_sale
    retail_price
    special_price
    markup
    track_stock_qty
    stock_qty
    min_stock_qty
    max_stock_qty
    tax
    brand_info{
      id
      business_id
      name
    }
    category_info{
      id
      business_id
      name
    }
  }
}
`;

// get single brand info
export const SINGLE_BRAND = gql`
query brand($id: ID!){
  brand(id: $id){
    id
    business_id
    name
  }
}
`;

// get all brands info
export const ALL_BRANDS = gql`
query brands($type: String, $count: Int, $page: Int){
  brands(type: $type, count: $count, page: $page){
    data{
      id
      business_id
      name
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get single product category info
export const SINGLE_PRODUCT_CATEGORY = gql`
query productCategory($id: ID!){
  productCategory(id: $id){
    id
    name
    business_id
  }
}
`;

// get all products category info
export const ALL_PRODUCT_CATEGORY = gql`
query productCategories($type: String, $count: Int, $page: Int){
  productCategories(type: $type, count: $count, page: $page){
    data{
      id
      name
      business_id
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get service category
export const SERVICE_CATEGORIES = gql`
query serviceCategories($type: String, $count: Int, $page: Int){
  serviceCategories(type: $type, count: $count, page: $page){
    data{
      id
      name
      business_id
      is_personal
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

//get single serviceCategory
export const SINGLE_SERVICE_CATEGORY = gql`
query serviceCategory($id: ID!){
  serviceCategory(id: $id){
    id
    name
    business_id
  }
}
`;


export const ALL_CLIENTS = gql`
query clients($search: String, $count: Int, $page: Int){
  clients(search: $search, count: $count, page: $page){
    data{
      id
      first_name
      last_name
      email
      mobile
      client_source
      client_block{
        block_with_video
        block_without_video
      }
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

export const SINGLE_CLIENT = gql`
  query client($id: ID!){
    client(id: $id){
      id
      first_name
      last_name
      email
      mobile
      dob
      gender
      address
      additional_mobile
      client_source
      display_booking
      gender
      client_info
      email_notification
      marketing_notification
      language
      client_block{
        block_with_video
        block_without_video
      }
    }
  }
`;

// get single service
export const SINGLE_SERVICE = gql`
query service($id: ID!){
  service(id: $id){
    id
      name
      tax
      business_id
      staffs
      description
      service_category_id
      service_available_for
      enable_online_booking
      voucher_sale
      is_personal
      is_voucher
      is_group
      is_course
      special_deposit
      service_group{
        group_type
        frequency
        occurrences
        enroll_date
        start_date
        client_per_class
        session_per_course
        schedule_type
        schedules{
          id
          day
          date
          time
          hours
          minutes
          sameOthers
        }
      }
      treatment_type_info{
        id
        business_id
        name
      }
      service_category_info{
        id
        business_id
        name
      }
      service_pricings{
        id
        service_id
        service_name
        duration
        price_type
        price
        pricing_name
        special_price
      }
  }
}
`;

// get all services

export const ALL_SERVICES = gql`
query services($type: String!, $count: Int, $page: Int){
  services(type: $type, count: $count, page: $page){
    data{
      label
      value
    }
  }
}`;
export const VOUCHERS = gql`
query vouchers($type: String!, $count: Int, $page: Int){
  vouchers(type: $type, count: $count, page: $page){
    data{
      label
      value
    }
  }
}`;
export const PRODUCTS = gql`
query products($type: String!, $count: Int, $page: Int){
  products(type: $type, count: $count, page: $page){
    data{
      label
      value
    }
  }
}`;

export const GET_ALL_SERVICES = gql`
query services($search: String, $type: String!, $count: Int, $page: Int){
  services(search: $search, type: $type, count: $count, page: $page){
    data{
      id
      name
      tax
      label
      value
      business_id
      staffs
      description
      
      service_category_id
      service_available_for
      enable_online_booking
      voucher_sale
      status
      is_voucher
      is_group
      is_course
      service_group{
          client_per_class
          session_per_course
      }
      service_pricings{
        id
        service_id
        service_name
        duration
        price_type
        price
        pricing_name
        special_price
      }
      treatment_type_info{
        id
        business_id
        name
      }
      service_category_info{
        id
        business_id
        name
      }
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get single supplier information
export const SINGLE_SUPPLIER_INFO = gql`
query supplier($id: ID!){
  supplier(id: $id){
    id
    business_id
    name
    email
    mobile
    address
  }
}
`;

// get all supplier information
export const ALL_SUPPLIER_INFO = gql`
query suppliers($count: Int, $page: Int){
  data{
    id
    business_id
    name
    email
    mobile
    address
  }
  paginatorInfo{
    count
    total
  }
}
`;

// get single treatment type
export const SINGLE_TREATMENT_TYPE = gql`
query treatmentType($id: ID!){
  treatmentType(id: $id){
    id
    business_id
    name
  }
}
`;

// get all treatment types
export const ALL_TREATMENT_TYPES = gql`
query treatmentTypes($count: Int, $page: Int){
  treatmentTypes(count: $count, page: $page){
    data{
      id
      business_id
      name
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get single staff
export const SINGLE_STAFF_INFO = gql`
query staff($id: ID!){
  staff(id: $id){
    id
    business_id
    name
    photo
    email
    mobile
  }
}
`;

// get all staff information
export const ALL_STAFF_INFO = gql`
query staffs($count: Int, $page: Int){
  staffs(count: $count, page: $page){
    data{
      id
      business_id
      name
      photo
      email
      mobile
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;
// treatment type show
export const ALL_TREATEMENT_TYPE = gql`
query treatmentTypes($type: String, $count: Int, $page: Int){
  treatmentTypes(type: $type, count: $count, page: $page){
  data{
    id
    business_id
    name
  }
    paginatorInfo{
      count
      total
    }
  }
 
}
`;

// get all chair
export const ALL_CHAIRS = gql`
query chairs($count: Int, $page: Int){
  chairs(count: $count, page: $page){
    data{
      id
      business_id
      title
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get single chair
export const CHAIR = gql`
query chair($id: ID!){
  chair(id: $id){
      id
      business_id
      title
  }
}
`;

// get single voucher
export const SINGLE_VOUCHER = gql`
query voucher($id: ID!){
  voucher(id: $id){
    id
    business_id
    name
    value
    retail
    valid_for
    total_sale
    limit_number_of_sales_enable
    limit_number_of_sales
    services_included{
      value
      label
    }
    enable_online_sales
    title
    description
    color
    note
  }
}
`;
//vourcher color
export const VOUCHER_COLORS = gql`
query vouchers($count: Int, $page: Int){
  vouchers(count: $count, page: $page){
    data{
      id
      color
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;
// get all vouchers
export const ALL_VOUCHERS = gql`
query vouchers($search: String, $type: String, $count: Int, $page: Int){
  vouchers(search: $search, type: $type, count: $count, page: $page){
    data{
      id
      business_id
      name
      value
      label
      retail
      valid_for
      total_sale
      limit_number_of_sales_enable
      limit_number_of_sales
      services_included {
        label
        value
      }
      enable_online_sales
      title
      description
      color
      note
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

// get single appointment
export const SINGLE_APPOINTMENT = gql`
query appointment($id: ID!){
  appointment(id: $id){
    id
    user_id
    date
    status
    payment_status
    note
    room_id
    online
    is_group
    is_course
    clients{
      id
      first_name
      last_name
      email
      mobile
      client_source
    }
    client_info{
      id
      first_name
      last_name
      email
      mobile
    }
    appointment_detail{
      id
      time
      formatted_date
      formatted_time
      chair
      appt_id
      staff_id
      ser_pricing_id
      duration
      online
      price
      discount
      special_price
      frequency
      occurrences
      chair_info{
        id
        title
      }
      staff_info{
        id
        name
      }
      service_pricing{
        id
        service_id
        service_name
        staffs
      }
    }
  }
}
`;

// get all appointments
export const ALL_APPOINTMENTS = gql`
query appointments($type: String,$date_range: String, $keyword: String, $count: Int, $page: Int){
  appointments(type: $type, date_range: $date_range, keyword: $keyword, count: $count, page: $page){
    data{
      id
      user_id
      date
      status
      note
      sale_id
      discount
      total_amount
      payment
      payment_status
      review_status
      room_id
      online
      user_name
      created_at
      is_group
      is_course
      sale_info{
        inv_no
        inv_pre
        id
      }
      appointment_detail{
        id
        appt_id
        staff_id
        ser_pricing_id
        time
        formatted_date
        formatted_time  
        duration
        chair
      }
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;

export const STAFF_WISE_APPOINTMENT = gql`
query staffWiseAppointment($staff_id: Int!, $chair_id: Int!){
  staffWiseAppointment(staff_id: $staff_id, chair_id: $chair_id){
    id
    appt_id
    title
    name
    start
    end
    status
    p_status
    room_id
    is_group
    is_course
  }
}
`;

// service pricing query
export const SERVICE_PRICING = gql`
query servicePricing($id: ID!, $date:String, $time: String){
  servicePricing(id: $id, date: $date, time: $time){
    id
    service_id
    service_name
    duration
    price_type
    appt_note
    price
    pricing_name
    special_price
    staffs
    time_slots{
      time
    }
    total_booked
    booked_guests{
      id
      client_id
      first_name
      last_name
      mobile
      email
      is_group
      is_course
      group_type
      frequency
      occurrences
    }
    occurrences
    service{
      is_group
      is_course
      service_group{
        client_per_class
        session_per_course
        schedule_type
        group_type
        occurrences
        frequency
      }
    }
  }
}
`;

// sales query
export const SALES = gql`
query sales($keyword: String, $date_range: String, $count: Int!, $page: Int!){
  sales(keyword: $keyword, date_range: $date_range,count: $count, page: $page){
    data{
      id
      inv_no
      inv_pre
      business_id
      buyer_id
      total_amount
      payment_status
      payment_type
      payment_option
      created_at
      buyer_name
      sale_detail{
        id
        business_id
        sale_id
        product_id
        product_qty
        unit_price
        discount
        product_type
        voucher_code
      }
  }
  paginatorInfo{
    total
    count
  }
}
}
`;

// single sale query
export const SALE = gql`
query sale($id: ID!){
  sale(id: $id){
    id
    business_id
    buyer_id
    total_amount
    discount_amount
    tip_amount
    payment_type
    payment_status
    payment_option
    created_at
    sale_detail{
        id
        business_id
        sale_id
        product_id
        product_qty
        unit_price
        discount
        product_type
        voucher_code
    }
  }
}
`;

// sale voucher
export const SALE_VOUCHER = gql`
  query saleVoucher($keyword: String, $date_range: String, $count: Int!, $page: Int!){
    saleVoucher(keyword: $keyword, date_range: $date_range, count: $count, page: $page){
      data{
        id
        business_id
        buyer_id
        owner
        voucher_code
        voucher_detail{
          retail
          value
          color
          services_included{
            value
            label
          }
        }
        purchase_date
        expiry_date
        value
        redeemed
        remaining
      }
      paginatorInfo{
        total
        count
      }
    }
  }
`;

// my voucher
export const MY_VOUCHER = gql`
  query myVoucher(
    $guest_id: Int!,
    $voucher_code: String!, 
    $selling_service: [ServiceItem!]!, 
    $grand_total: String!, 
    $sale_id: Int!, 
    $discount: String!
    $business_id: Int!
  ){
    myVoucher(guest_id: $guest_id,voucher_code: $voucher_code, selling_service: $selling_service, grand_total: $grand_total, sale_id: $sale_id, discount: $discount, business_id: $business_id){
      id
      business_id
      buyer_id
      owner
      voucher_code
      voucher_detail{
        retail
        value
        color
        services_included{
          value
          label
        }
      }
      purchase_date
      expiry_date
      redeemed
      remaining
      message
      value
      status
    }
  }
`;

export const BUSINESS_TYPE = gql`
query {
  businessTypes{
    id
    name
    image
  }
}
`;
export const BUSINESS_SERVICE_TYPE = gql`
  query  businessTypeWiseCategory($business_type_ids: [Int!]){
    businessTypeWiseCategory(business_type_ids: $business_type_ids){
      id
      name
      image
    }
  }
`;

export const PARTNER_TIME_SLOT = gql`
  query partnerTimeSlots{
    partnerTimeSlots{
    s_time
    time
    }
  }
`;

export const BUSINESS_SETUP_Q = gql`
  query{
    businessSetting{
    upfront_amount
    last_inv_no
    online_booking
    video_vetting
    cancellation{
      value
    }
    slot_duration
    close_date{
      id
      start_date
      end_date
      business_id
      duration
      description
    }
    invoice{
      id
      header
      footer
      sub_header
      invoice_prefix
      invoice_no
    }
    work_hours{
      id
      business_id
      weekday
      s_time
      e_time
    }
    bank_account{
      id
      bank_name
      account_name
      account_number
      iban_number
      bic_address
      bank_address
      bank_city
    }
  }
}
`;
export const SUBSCRIPTION = gql`
query{
  subscriptions{
    id
    name
    price
    duration
    description
  }
}
`;
export const APPT_SERVICE_DETAIL = gql`
query appointmentDetail($id: ID!){
  appointmentDetail(id: $id){
    id
    time
    chair
    appt_id
    staff_id
    ser_pricing_id
    online
    duration
    price
    special_price
    discount
    is_group
    is_course
    formatted_date
    formatted_time
    chair_info{
      title
    }
    staff_info{
      name
    }
    service_pricing{
      id
      service_id
      service_name
      duration
      total_booked
      booked_guests{
        id
        client_id
        first_name
        last_name
        mobile
        email
        is_group
        is_course
        group_type
        frequency
        occurrences
      }
      time_slots{
        time
      }
      price_type
      price
      pricing_name
      staffs
      occurrences
    }
    service_group{
      client_per_class
      session_per_course
    }
  }
}
`;

export const DAILY_SALE = gql`
query dailySales($date: String!){
  dailySales(date: $date){
    tran_summary{
      product_type
      total_price
      total_qty
    }
    cash_summary{
      payment_type
      payment_collect
    }
  }
}
`;

export const INVOICE_DETAIL = gql`
query invoiceDetail($sale_id: Int!, $appt_id: Int!){
  invoiceDetail(sale_id: $sale_id, appt_id:$appt_id){
    id
    inv_no
    inv_pre
    buyer_id
    buyer_name
    business_id
    sub_total
    total_amount
    discount
    s_discount
    payment_option
    payment_status
    payment_type
    created_at
    payment_info{
      id
      business_id
      ref_id
      amount
      discount
      status
      type
      option
    }
    business_invoice{
      id
      business_id
      header
      footer
      sub_header
      invoice_no
      invoice_prefix
    }
    buyer_info{
      id
      first_name
      last_name
      email
      mobile
    }
    business_info{
      id
      name
      vat_number
    }
    sale_detail{
      id
      business_id
      sale_id
      product_id
      product_name
      product_qty
      unit_price
      discount
      staff_id
      time
      duration
      product_type
      voucher_code
      created_at
      expiry_date
      staff_info{
        id
        name
      }
    }
  }
}
`;

export const CHECK_PAYMENT_STATUS = gql`
query checkPaymentStatus($sale_id: Int!, $appt_id: Int){
  checkPaymentStatus(sale_id: $sale_id, appt_id: $appt_id){
    status
    message
  }
}
`;

export const BUSINESS_TAX = gql`
  query businessTax{
    businessTax{
      service_tax
      product_tax
    }
  }
`;

export const ANALYTICS = gql`
query analytics{
  analytics{
    total_sale{
      total
      cancel
      complete
      not_complete
    }
    total_appt{
      total
      cancel
      complete
      not_complete
    }
    total_online_appt{
      total
      cancel
      complete
      not_complete
    }
  }
}
`;

export const RECENT_SALE = gql`
query recentSales($type: String){
  recentSales(type:$type){
      date
      total_sale
      total_amount
    }
  }
`;

export const UPFRONT_AMOUNT = gql`
query upfrontAmount($appt_id: Int!){
  upfrontAmount(appt_id: $appt_id){
     upfront_amount
     sale_id
  }
}
`;

// notification
export const NOTIFICATION = gql`
  query myNotification{
    myNotification{
      data{
        id
        sender_id
        recipient_id
        ref_id
        title
        message
        target_url
        read
        read_at
        seen
        status
        created_at
        updated_at
      }
      count{
        new_notification
        total_notification
      }
    }
  }
`;

// notification seen
export const NOTIFICATION_SEEN = gql`
query myNotificationSeen{
  myNotificationSeen{
    status
    message
  }
}
`;
export const SUBSCRIPTION_INFO = gql`
  query{
  subscribedDetail{
     current{
      id
      sub_start_date
      sub_expiry_date
      pay_status
      tran_id
      sub_price
      sub_id
      business_id
      sub_name
      sub_duration
      sub_status
      is_subscribed
    }
    histories{
      id
      sub_start_date
      sub_expiry_date
      pay_status
      tran_id
      sub_price
      sub_id
      business_id
      sub_name
      sub_duration
      sub_status
    }
  }
}`;

export const PARTNER_BALANCE = gql`
  query partnerBalance{
    partnerBalance{
      pre_payout_amout
      pre_payout_date
      current_balance
      next_payout_date
      business_url
    }
  }
`;
export const GUEST_APPOINTMENT_SEARCH = gql`
query searchClientOrAppoint($search: String){
  searchClientOrAppoint(search: $search){
    clients{
      id
      first_name
      last_name
      mobile
      email
      additional_mobile
      client_source
      display_booking
      gender
      dob
      client_info
      address
      email_notification
      language
      suite
      country
      eir_code
    }
    appointments{
      id
      business_id
      sale_id
      user_id
      user_name
      date
      status
      note
      sub_total
      discount
      total_amount
      payment_status
      review_status
      appointment_detail{
        time
        chair
        formatted_date
        formatted_time
        appt_id
        duration
        service_pricing{
          service_name
        }
      }
    }
  }
}
`;

export const WAITING_LISTS = gql`
query cancellationList($keyword: String, $date_range: String, $count: Int, $page: Int){
  cancellationList(keyword: $keyword, date_range: $date_range, count: $count, page: $page){
    data{
      id
      date
      user_id
      created_at
      client_info{
        id
        first_name
        last_name
        mobile
        email
        address
        gender
      }
    }
    paginatorInfo{
      count
      total
    }
  }
}
`;
export const NOTIFICATION_UPDATE = `
query notificationUpdate($id: ID!, $status: String){
  notificationUpdate(id: $id, status: $status){
    message
    status
  }
}
`;
export const HOW_TO_VIDEOS =gql`
query {
  businessMenus{
    id
    name
    business_videos{
      id
      youtube_link
      description
    }
  }
}
`;


export const GOOGLE_CALENDAR_LIST = gql`
  query googleCalendars{
    googleCalendars{
      id
      user_id
      google_account_id
      google_calendar_id
      name
      color
      timezone
      sync
      status
      user_info {
        google_calendar
      }
    }
  }
`;
export const GOOGLE_CALENDAR_EVENTS = gql`
  query googleCalendarEvents($type: String!){
    googleCalendarEvents(type: $type){
      id
      calendar_id
      event_id
      name
      description
      allday
      started_at
      ended_at
      status
     
    }
  }
`;
