import { gql } from "@apollo/client";

export const AUTH_LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            access_token
            user{
                id
                first_name
                last_name
                email
                mobile
                photo
                business_type
                approved_status
                user_type
                business_id
                business_info{
                    id
                    name
                    location
                    slug
                    country
                    business_type
                }
            }
        }     
    }   
`;
export const FORGOT_PASSWORD = gql`
    mutation forgotPassword($email: String!){
        forgotPassword(email: $email){
            status
            message
        }
    }
`;
export const RESET_PASSWORD = gql`
    mutation resetPassword(
        $email: String!,
        $token: String!,
        $password: String!,
        $password_confirmation: String!
    ){
        resetPassword(email: $email, token: $token, password: $password, password_confirmation: $password_confirmation){
            status
            message 
        }
    }

`;

export const UPDATE_PASSWORD = gql`
    mutation updatePassword(
        $old_password: String!
        $password: String!
        $password_confirmation: String!
    ){
        updatePassword(
            old_password: $old_password, 
            password: $password,
            password_confirmation: $password_confirmation
        ){
            status
            message
        }
    }
`;


export const GOOGLE_CALENDAR_SYNC_PERMISSION = gql`
    mutation syncPermissionGoogleCalendar(
       $id: ID!
       $action: Int!
    ){
        syncPermissionGoogleCalendar(
            id: $id,
            action: $action
        ){
            status
            message
        }
    }
`;

export const CALENDAR_DISCONNECT = gql`
    mutation disconnectGoogleAccount{
        disconnectGoogleAccount{
            status
            message
        }
    }   
`;
export const GOOGLE_CALENDAR_HOLIDAY_PERMISSION = gql`
    mutation statusUpdateGoogleCalendarEvent(
       $id: ID!
       $status: Boolean!
    ){
        statusUpdateGoogleCalendarEvent(
            id: $id,
            status: $status
        ){
            status
            message
        }
    }
`;

export const PARTNER_EMAIL_UPDATE = gql`
    mutation partnerEmailUpdate(
        $email: String!
        $password: String!
    ){
        partnerEmailUpdate(email: $email, password: $password){
            status
            message
        }
    }
`;
export const CUSTOMER_REGISTRATION = gql`
    mutation guestRegister(
        $first_name: String!, 
        $last_name: String, 
        $mobile: String, 
        $email: String, 
        $password: String,
        $additional_mobile: String,
        $client_source: String,
        $display_booking: Boolean,
        $gender: String,
        $dob: String,
        $client_info: String
        $address: String,
        $email_notification: Boolean,
        $marketing_notification: Boolean,
        $language: String,
        $hash: String!
    ){
        guestRegister(
            first_name: $first_name, 
            last_name: $last_name, 
            mobile: $mobile, 
            email: $email, 
            password: $password,
            additional_mobile: $additional_mobile,
            client_source: $client_source,
            display_booking: $display_booking,
            gender: $gender,
            dob: $dob,
            client_info: $client_info,
            address: $address,
            email_notification: $email_notification,
            marketing_notification: $marketing_notification,
            language: $language,
            hash: $hash
        ){
            status
            message
            data{
                id
                first_name,
                last_name,
                email
                mobile
            }
        }
    }
`;

export const PARTNER_REGISTRATION = gql`
    mutation partnerRegister(
        $first_name: String!, 
        $last_name: String, 
        $email: String!, 
        $password: String!, 
        $mobile: String,
        $business_name: String!, 
        $country: String,
        $location: String!, 
        $eir_code: String, 
        $latitude: Float!,  
        $longitude: Float!, 
        $referral_code: String, 
        $hash: String!
    ){
        partnerRegister(
            first_name: $first_name, 
            last_name: $last_name, 
            email: $email, 
            password: $password, 
            mobile: $mobile, 
            business_name: $business_name, 
            country: $country,
            location: $location, 
            eir_code: $eir_code, 
            latitude: $latitude, 
            longitude: $longitude,
            referral_code: $referral_code,
            hash: $hash
        ){
            status
            message
        }
    }
`;

export const GUEST_PROFILE_UPDATE = gql`
    mutation guestProfileUpdate(
        $id: ID
        $first_name: String!
        $last_name: String
        $mobile: String
        $email: String
        $gender: String
        $dob: String
        $client_info: String
        $address: String
        $email_notification: Boolean
        $marketing_notification: Boolean
        $language: String
        $additional_mobile: String
        $client_source: String
        $display_booking: Boolean
        $photo: String
        $suite: String
        $country: String
        $eir_code: String
        $block_with_video: Boolean
        $block_without_video: Boolean
  ){
    guestProfileUpdate(
        id: $id
        first_name: $first_name
        last_name: $last_name
        mobile: $mobile
        email: $email
        gender: $gender
        dob: $dob
        client_info: $client_info
        address: $address
        email_notification: $email_notification
        marketing_notification: $marketing_notification
        language: $language
        additional_mobile: $additional_mobile
        client_source: $client_source
        display_booking: $display_booking
        photo: $photo
        suite: $suite
        country: $country
        eir_code: $eir_code
        block_with_video: $block_with_video
        block_without_video: $block_without_video
    ){
        status
        message
        data{
            id
            first_name
            last_name
            email
            mobile
            
        }
    }
}
`;
// partner profile update
export const PARTNER_PROFILE_UPDATE = gql`
mutation partnerProfileUpdate(
    $first_name: String!
    $last_name: String
    $mobile: String
    $business_name: String!
    $business_size: String
    $team_size: String
    $thumbnail: String
    $slider: [String!]
    $location: String
    $eir_code: String
    $longitude: Float
    $latitude: Float
    $photo: String
    $website: String
    $social_links: SocialInput!
    $description: String
    $about:String
){
    partnerProfileUpdate(
        first_name: $first_name,
        last_name: $last_name
        mobile: $mobile
        business_name: $business_name
        business_size: $business_size
        team_size: $team_size
        thumbnail: $thumbnail
        slider: $slider
        location: $location
        eir_code: $eir_code
        longitude: $longitude
        latitude: $latitude
        photo: $photo
        website: $website
        social_links: $social_links
        description: $description
        about: $about
    )
    {
        status
        message
        photo
    }
}
`;

// product mutation (add/update/delete)
export const PRODUCT_CREATE = gql`
mutation addProduct(
    $name: String!, 
    $brand_id: Int, 
    $brand_code: String,
    $mesaurement_type: String,
    $amount: Float,
    $short_description: String, 
    $description: String, 
    $product_category_id: Int, 
    $supply_price: Float,
    $track_retail_sale: Boolean,
    $retail_price: Float!,
    $special_price: Float,
    $markup: Int,
    $tax: String,
    $track_stock_qty: Boolean,
    $stock_qty: Int,
    $photos: String,
    $barcode: String!
    $min_stock_qty: Int,
    $max_stock_qty: Int
    $brand_name: String
    $category_name: String
){
    addProduct(
        brand_id: $brand_id,
        product_category_id: $product_category_id,
        name: $name,
        brand_code: $brand_code,
        amount: $amount,
        short_description: $short_description,
        description: $description,
        mesaurement_type: $mesaurement_type,
        supply_price: $supply_price,
        track_retail_sale: $track_retail_sale,
        retail_price: $retail_price,
        special_price: $special_price,
        markup: $markup,
        track_stock_qty: $track_stock_qty,
        stock_qty: $stock_qty,
        tax: $tax,
        photos: $photos,
        barcode: $barcode,
        min_stock_qty: $min_stock_qty,
        max_stock_qty: $max_stock_qty,
        category_name: $category_name
        brand_name: $brand_name
    ){
        status
        message
    }
}
`;

export const PRODUCT_UPDATE = gql`
mutation updateProduct(
    $id: ID!
    $name: String!, 
    $brand_id: Int, 
    $brand_code: String,
    $mesaurement_type: String,
    $amount: Float,
    $short_description: String, 
    $description: String, 
    $product_category_id: Int, 
    $supply_price: Float,
    $track_retail_sale: Boolean,
    $retail_price: Float!,
    $special_price: Float,
    $markup: Int,
    $tax: String
    $track_stock_qty: Boolean,
    $stock_qty: Int,
    $max_stock_qty: Int,
    $min_stock_qty: Int,
    $photos: String,
){
    updateProduct(
        id: $id,
        brand_id: $brand_id,
        product_category_id: $product_category_id,
        name: $name,
        brand_code: $brand_code,
        amount: $amount,
        short_description: $short_description,
        description: $description,
        mesaurement_type: $mesaurement_type,
        supply_price: $supply_price,
        track_retail_sale: $track_retail_sale,
        retail_price: $retail_price,
        special_price: $special_price,
        markup: $markup,
        track_stock_qty: $track_stock_qty,
        stock_qty: $stock_qty,
        max_stock_qty: $max_stock_qty,
        min_stock_qty: $min_stock_qty,
        tax: $tax,
        photos: $photos,
    ){
        status
        message
    }
}
`;

export const PRODUCT_DELETE = gql`
mutation deleteProduct($id: ID!){
    deleteProduct(id: $id){
        status
        message
    }
}
`;

// brand mutation (add/update/delete)
export const BRAND_CREATE = gql`
mutation addBrand($name: String!){
    addBrand(name: $name){
        status
        message
    }
}
`;

// Campaign Traffic mutation
export const CAMPAIGN_TRAFFIC = gql`
mutation campaignTraffic($referral_code: String!){
    campaignTraffic(referral_code: $referral_code){
        status
        message
    }
}
`;

export const BRAND_UPDATE = gql`
mutation updateBrand($id: ID!, $name: String!){
    updateBrand(id: $id, name: $name){
        status
        message
    }
}
`;

export const BRAND_DELETE = gql`
mutation deleteBrand($id: ID!){
    deleteBrand(id: $id){
        status
        message
    }
}
`;

// product category mutation (add/update/delete)
export const PRODUCT_CATEGORY_CREATE = gql`
mutation addProductCategory($name: String!){
    addProductCategory(name: $name){
        status
        message
    }
}
`;

export const PRODUCT_CATEGORY_UPDATE = gql`
mutation updateProductCategory($id: ID!, $name: String!){
    updateProductCategory(id: $id, name: $name){
        status
        message
    }
}
`;

export const PRODUCT_CATEGORY_DELETE = gql`
mutation deleteProductCategory($id: ID!){
    deleteProductCategory(id: $id){
        status
        message
    }
}
`;

// service category mutation (add/delete)
export const SERVICE_CATEGORY_CREATE = gql`
mutation addServiceCategory($name: String!){
    addServiceCategory(name: $name){
        status
        message
    }
}
`;

export const SERVICE_CATEGORY_DELETE = gql`
mutation deleteServiceCategory($id: ID!){
    deleteServiceCategory(id: $id){
        status
        message
    }
}
`;

export const SERVICE_CATEGORY_UPDATE = gql`
mutation updateServiceCategory($id: ID!, $name: String!){
    updateServiceCategory(id: $id, name: $name){
        status
        message
    }
}
`;

// service mutation (add/update/delete)
export const SERVICE_CREATE = gql`
mutation addService(
    $service_category_id: Int!,
    $name: String!,
    $description: String,
    $service_available_for: String,
    $enable_online_booking: Boolean,
    $staffs: [Int!],
    $service_pricing: [ServicePricingInput!]!,
    $tax: String,
    $voucher_sale: String,
    $is_voucher: Boolean,
    $is_personal: Boolean!,
    $is_group: Boolean!,
    $client_per_class: Int,
    $is_course: Boolean!,
    $session_per_course: Int,
    $schedule_type: String,                
    $schedules: [ServiceScheduleInput!],
    $special_deposit:String,
    $start_date: String,
    $enroll_date: String,
    $occurrences: Int,
    $frequency: String,
    $group_type: String!
){
    addService(
        service_category_id: $service_category_id,
        name: $name,
        description: $description,
        service_available_for: $service_available_for,
        enable_online_booking: $enable_online_booking,
        staffs: $staffs,
        service_pricing: $service_pricing,
        tax: $tax,
        voucher_sale: $voucher_sale,
        is_voucher: $is_voucher,
        is_personal: $is_personal,
        is_group: $is_group,
        client_per_class: $client_per_class,
        is_course: $is_course,
        session_per_course: $session_per_course,
        schedule_type: $schedule_type,                
        schedules: $schedules,
        special_deposit: $special_deposit,
        start_date: $start_date,
        enroll_date: $enroll_date,
        occurrences: $occurrences,
        frequency: $frequency,
        group_type: $group_type
    ){
        status
        message
        data
    }
}
`;

export const SERVICE_DELETE = gql`
mutation deleteService($id: ID!){
    deleteService(id: $id){
        status
        message
    }
}
`;
export const SERVICE_UPDATE = gql`
    mutation updateService(
        $id: ID! 
        $service_category_id: Int!
        $name: String!
        $description: String
        $service_available_for: String
        $enable_online_booking: Boolean
        $staffs: [Int!]
        $service_pricing: [ServicePricingInput!]!
        $tax: String
        $is_voucher: Boolean
        $voucher_sale: String
        $is_personal: Boolean!
        $is_group: Boolean!
        $client_per_class: Int
        $is_course: Boolean!
        $session_per_course: Int
        $schedule_type: String                
        $schedules: [ServiceScheduleInput!]
        $special_deposit: String
        $start_date: String
        $enroll_date: String
        $occurrences: Int
        $frequency: String
        $group_type: String!
    ){
        updateService(
            id: $id
            service_category_id: $service_category_id
            name: $name
            description: $description
            service_available_for: $service_available_for
            enable_online_booking: $enable_online_booking
            staffs: $staffs
            service_pricing: $service_pricing
            tax: $tax
            is_voucher: $is_voucher
            voucher_sale: $voucher_sale
            is_personal: $is_personal
            is_group: $is_group
            client_per_class: $client_per_class
            is_course: $is_course
            session_per_course: $session_per_course
            schedule_type: $schedule_type              
            schedules: $schedules
            special_deposit: $special_deposit
            start_date: $start_date
            enroll_date: $enroll_date
            occurrences: $occurrences
            frequency: $frequency
            group_type: $group_type
        ){
            status
            message
            data
        }
    }
`;

// supplier mutation (add/update/delete)
export const SUPPLIER_CREATE = gql`
mutation addSupplier($name: String!, $email: String!, $mobile: String!, $address: String!){
    addSupplier(name: $name, email: $email, mobile:$mobile, address: $address) {
        status
        message
    }
}
`;

export const SUPPLIER_UPDATE = gql`
mutation updateSupplier($id: ID!, $name: String!, $email: String, $mobile: String!, $address: String!){
    updateSupplier(id: $id, name: $name, email: $email, mobile: $mobile, address: $address){
        status
        message
    }
}
`;

export const SUPPLIER_DELETE = gql`
mutation deleteSupplier($id: ID!){
    deleteSupplier(id: $id){
        status
        message
    }
}
`;

// treatment type mutation(add/update/delete)
export const TREATMENT_TYPE_CREATE = gql`
mutation addTreatmentType($name: String!){
    addTreatmentType(name: $name){
        status
        message
    }
}
`;

export const TREATMENT_TYPE_UPDATE = gql`
mutation updateTreatmentType($id: ID!, $name: String!){
    updateTreatmentType(id: $id, name: $name){
        status
        message
    }
}
`;

export const TREATMENT_TYPE_DELETE = gql`
mutation deleteTreatmentType($id: ID!){
    deleteTreatmentType(id: $id){
        status
        message
    }
}
`;

// staff mutation (add/update/delete)
export const STAFF_CREATE = gql`
mutation addStaff($name: String!, $photo: String, $email: String!, $mobile: String){
    addStaff(name: $name, email: $email, mobile: $mobile, photo: $photo){
        status
        message
    }
}
`;

export const STAFF_UPDATE = gql`
mutation updateStaff($id: ID!, $name: String!, $photo: String, $email: String!, $mobile: String){
    updateStaff(id: $id, name: $name, photo: $photo, email: $email, mobile: $mobile){
        status
        message
    }
}
`;

export const STAFF_DELETE = gql`
mutation deleteStaff($id: ID!){
    deleteStaff(id: $id){
        status
        message
    }
}
`;

// Treatment add/update/delete start
export const ADD_TREATMENT = gql`
mutation addTreatmentType( $name: String!){
    addTreatmentType(name: $name ){
        status
        message
    }
        
}
`;

// Treatment add/update/delete end


// char add/delete/show

export const CHAIR_CREATE = gql`
mutation addChair($title: String!){
    addChair(title: $title){
        status
        message
    }
}
`;

export const CHAIR_DELETE = gql`
mutation deleteChair($id: ID!){
    deleteChair(id: $id){
        status
        message
    }
}
`;

export const CHAIR_UPDATE = gql`
mutation updateChair($id: ID!, $title: String! ){
    updateChair(id: $ID, title: $title){
        status
        message
    }
}
`;
//char add/delete/show

// voucher mutation(add/update/delete)
// Voucher add/update/delete start
export const ADD_VOUCHER = gql`
      mutation addVoucher( 
        $name: String!
        $value: Float!
        $retail: Float!
        $valid_for: String
        $limit_number_of_sales_enable: Boolean
        $limit_number_of_sales: Int
        $services_included: [ServicesIncludedInput!]
        $enable_online_sales: Boolean
        $title: String!
        $description: String
        $color: String
        $note: String
    ){
        addVoucher(
            name: $name
            value: $value
            retail: $retail
            valid_for: $valid_for
            limit_number_of_sales_enable:  $limit_number_of_sales_enable
            limit_number_of_sales: $limit_number_of_sales
            services_included: $services_included
            enable_online_sales:  $enable_online_sales
            title:  $title
            description:  $description
            color: $color
            note: $note
        ){
            status
            message
        }
    }
`;

export const VOUCHER_UPDATE = gql`
mutation updateVoucher(
    $id: ID!,
    $name: String!,
    $value: Float!,
    $retail: Float!
    $valid_for: String,
    $limit_number_of_sales_enable: Boolean,
    $limit_number_of_sales: Int,
    $services_included: [ServicesIncludedInput!],
    $enable_online_sales: Boolean,
    $title: String!
    $description: String,
    $color: String,
    $note: String,
){
    updateVoucher(
        id: $id,
        name: $name,
        value: $value,
        retail: $retail,
        valid_for: $valid_for,
        limit_number_of_sales_enable: $limit_number_of_sales_enable,
        limit_number_of_sales: $limit_number_of_sales,
        services_included: $services_included,
        enable_online_sales: $enable_online_sales,
        title: $title,
        description: $description,
        color: $color,
        note: $note,
    ){
        status
        message
    }
}
`;

export const VOUCHER_DELETE = gql`
mutation deleteVoucher($id: ID!){
    deleteVoucher(id: $id){
        status
        message
    }
}
`;

// appointmet mutation(add/update/delete)
export const APPOINTMENT_CREATE = gql`
mutation addAppointment(
    $client_id: Int, 
    $note: String!, 
    $date: String!, 
    $services: [AppointmentServiceInput!]!
){
    addAppointment(
    client_id: $client_id, 
    note: $note, 
    date: $date, 
    services: $services
    ){
        status
        message
    }
}
`;
export const APPOINTMENT_UPDATE_FROM_CALENDER = gql`
mutation appointmentUpdateFromCalendar(
    $id: ID!
    $date: String!
    $s_time: String!
    $e_time: String!
){
    appointmentUpdateFromCalendar(
        id: $id
        date: $date
        s_time: $s_time
        e_time: $e_time
    ){
        message
    }
}
`;
export const APPOINTMENT_UPDATE = gql`
    mutation updateAppointment(
    $id: ID!
    $date: String!
    $services: [AppointmentServiceInput!]!
    $client_id: Int
    $note: String
){
    updateAppointment(
        id: $id
        date: $date
        services: $services
        client_id: $client_id
        note: $note
    ){
        message
        status
    }
}
`;

// sale item
export const ADD_SALE = gql`
    mutation addSale(
        $client_id: Int!
        $services: [SaleServiceInput!]!
        $products: [SaleProductInput!]!
        $vouchers: [SaleVoucherInput!]!
        $appointments: [AppointmentServiceInput!]!
        $payment_info: SalePaymentInfoInput!
        $payment_type: [String!]!
        $sub_total: String!
        $total_amount: String!
        $discount: String!
        $note: String!
    ){
        addSale(
            client_id: $client_id
            services: $services
            products: $products
            vouchers: $vouchers
            appointments: $appointments
            payment_info: $payment_info
            payment_type: $payment_type
            sub_total: $sub_total
            total_amount: $total_amount
            discount: $discount
            note: $note
        ){
            status
            message
            sale_id
            appt_id
            payment_url
            payment_amount
        }
    }
`;

export const UPDATE_SALE = gql`
    mutation updateSale(
        $id: ID!
        $client_id: Int!
        $services: [SaleServiceInput!]!
        $products: [SaleProductInput!]!
        $vouchers: [SaleVoucherInput!]!
        $appointments: [AppointmentServiceInput!]!
        $payment_info: SalePaymentInfoInput!
        $payment_type: [String!]!
        $sub_total: String!
        $total_amount: String!
        $discount: String!
        $note: String!
    ){
        updateSale(
            id: $id
            client_id: $client_id
            services: $services
            products: $products
            vouchers: $vouchers
            appointments: $appointments
            payment_info: $payment_info
            payment_type: $payment_type
            sub_total: $sub_total
            total_amount: $total_amount
            discount: $discount
            note: $note
        ){
            status
            message
            sale_id
            appt_id
            payment_url
            payment_amount
        }
    }
`;

export const BUSINESS_SETUP = gql`
    mutation businessSetup(
        $business_type_ids: [Int!]
        $daily_work_hours: String!
        $number_of_chairs: Int!
        $service_category_ids: String!
        $subscription: String
        $team_size: String
        $about: String
    ){
        businessSetup(
            business_type_ids:  $business_type_ids
            daily_work_hours: $daily_work_hours
            number_of_chairs: $number_of_chairs
            service_category_ids: $service_category_ids
            subscription: $subscription
            team_size: $team_size
            about: $about
        ){
            message
            status
            user{
                id
                first_name
                last_name
                email
                mobile
                photo
                business_type
                approved_status
                user_type
                business_id
                business_info{
                    id
                    name
                    location
                    slug
                    country
                    business_type
                }
            }
        }
    }
`;

export const BUSINESS_SETTING = gql`
    mutation businessSetting(
        $header: String
        $footer: String
        $sub_header: String
        $start_date: String
        $end_date: String
        $invoice_no: String
        $invoice_prefix: String
        $online_booking: String
        $upfront_amount: String
        $video_vetting: String
        $description: String
        $cancellation: [CancellationInput!]
    ){
        businessSetting(
            header: $header
            footer: $footer
            sub_header: $sub_header
            start_date: $start_date
            end_date: $end_date
            invoice_no: $invoice_no
            invoice_prefix: $invoice_prefix
            online_booking: $online_booking
            upfront_amount: $upfront_amount
            video_vetting: $video_vetting
            description: $description
            cancellation: $cancellation
        ){
            status
            message
        }
    }
`;
export const CLOSE_DATE_DELETE = gql`
mutation deleteCloseDate($id: ID!){
    deleteCloseDate(id: $id){
        status
        message
    }
}
`;

export const WORKING_HOURS_UPDATE = gql`
mutation updateBusinessWorkingHour($daily_work_hours: String!, $slot_duration: String){
    updateBusinessWorkingHour(daily_work_hours: $daily_work_hours, slot_duration: $slot_duration){
        status
        message
    }
}
`;

export const APPOINTMENT_STATUS_UPDATE = gql`
mutation statusUpdateForAppointment($id: ID!,  $service_pricing_ids: [ID]!, $status: String!, $date: String, $time: String, $note: String){
    statusUpdateForAppointment(id: $id, service_pricing_ids: $service_pricing_ids, status: $status, date: $date, time: $time, note: $note){
        status,message
    }
}
`;
export const CLOSE_DATE_UPDATE = gql`
mutation updateCloseDate(
    $id: ID!
    $start_date: String!
    $end_date: String!
    $description: String
    ){
        updateCloseDate(
        id: $id
        start_date: $start_date
        end_date: $end_date
        description: $description
    ){
        message
        status
    }
}
`;

export const BUSINESS_SUBSCRIPTION = gql`
mutation subscribe(
        $id: Int!
        $price: Float!
        $payment_type: String!
    ){
        subscribe(
            id: $id
            price: $price
            payment_type: $payment_type

        ){
            status
            message
            payment_url
            payment_amount
            subscribed_id

        }
    } 
`;

export const ADD_TO_WAITING_LIST = gql`
mutation cancellation_request($date: String!, $guest_id: Int, $business_id: Int){
    cancellation_request(date: $date, guest_id: $guest_id, business_id: $business_id){
        status
        message
    }
}
`;

export const APPOINTMENT_ACCEPT_OR_REJECT = gql`
mutation appointmentAcceptOrReject(
    $room_id: String
    $status: String
){
    appointmentAcceptOrReject(room_id: $room_id, status: $status){
        status
        message
    }
}
`;
export const NOTIFICATION_UPDATE = gql`
mutation notificationUpdate($id: ID!,$status: String){
    notificationUpdate(id: $id, status: $status){
        status
        message
    }
}
`;
export const NO_SHOW_APPNT_UPDATE = gql`
mutation appointmentNoShowUpdate($id: ID!,$status: String){
    appointmentNoShowUpdate(id: $id, status: $status){
        status
        message
    }
}
`;
export const ADD_BANK_DETAILS = gql`
mutation addOrUpdateBankAccount(
    $id: ID,
    $bic_address: String,
    $bank_name: String,
    $bank_address: String,
    $bank_city: String
    $account_number: String!,
    $account_name: String,
    $iban_number: String
    ){
        addOrUpdateBankAccount(
        id: $id,
        bic_address: $bic_address,
        bank_name: $bank_name,
        bank_address:  $bank_address,
        bank_city: $bank_city,
        account_number: $account_number,
        account_name: $account_name,
        iban_number: $iban_number
    ){
        status
        message
    }
}
`;

export const REVOLUTPAYMENTPUBLICID = gql`
mutation revolutPaymentPublicId(
    $amount: Float!,
    $currency: String!
    ){ revolutPaymentPublicId(
        amount: $amount,
        currency: $currency
    ){
        id
        public_id
    }
}
`;
export const REVOLUT_PAY_CONFIRM = gql`
    mutation revolutPaymentForSubscribed(
        $subscribed_id: Float!
        $order_id: String!
    ){
        revolutPaymentForSubscribed(
            subscribed_id: $subscribed_id
            order_id: $order_id
        ){
            status
            message
            payment_url
        }     
    }   
`;
export const SERVICE_ACTIVE_OR_INACTIVE = gql`
mutation updateServiceStatus($id: ID!, $status: Boolean!){
    updateServiceStatus(id: $id, status: $status){
        status
        message
    }
}`
export const ONLINE_ACTIVE_OR_INACTIVE = gql`
mutation updateServiceOnlineStatus($id: ID!, $online_booking: Boolean!){
    updateServiceOnlineStatus(id: $id, online_booking: $online_booking){
        status
        message
    }
}`

export const CLEAR_NOTIFICATION = gql`
    mutation notificationDelete(
        $ids: String!
    ){
        notificationDelete(
            ids: $ids
        ){
           status
           message
        }     
    }   
`;
export const OFFBOARDING_REQUEST = gql`
    mutation offBoardingRequest($news_letters: Boolean){
        offBoardingRequest(
            news_letters: $news_letters
        ){
           status
           message
        }     
    }   
`;
export const OFFBOARDING_REQUEST_CANCEL = gql`
    mutation offBoardingCancel{
        offBoardingCancel{
            status
            message
        }
    }        
`;
export const VAT_NUMBER = gql`
    mutation addVatNumber($is_vat_register: Boolean, $vat_number: String){
        addVatNumber(
            is_vat_register: $is_vat_register,
            vat_number: $vat_number
        ){
           status
           message
        }     
    }   
`;

export const AGORA_ROOM_TOKEN = gql`
mutation agoraAccessToken($room_id: String!){
    agoraAccessToken(room_id: $room_id){
        status
        token
        message
        is_appointment
    }
}`;


// payment log mutation
export const SYSTEM_LOG = gql`
    mutation system_log(
        $api: String!
        $user: String!
        $body: String!
        $response: String!
        $exception: String!
        $source: String!
        $version: String!
        $priority: String!
        $device: String!
        $type: String
    ){
        system_log(
            api: $api
            user: $user
            body: $body
            response: $response
            exception: $exception
            source: $source
            version: $version
            priority: $priority
            device: $device
            type: $type
        ){
            status
            message
        }     
    }   
`;
// conflict checking
export const  CONFLICT_CHECKING = gql`
    mutation checkScheduleConflictForClient(
        $client_id: Int!
        $services: [AppointmentServiceInput!]!
    ){
        checkScheduleConflictForClient(
         client_id: $client_id
         services: $services
    ){
        status
        message
        data
    }
}`;
// group and course update
export const  ADD_OR_UPDATE_GROUP_COUSE = gql`
    mutation addOrUpdateGroupAppointment(
        $date: String!
        $note: String!
        $clients: [GroupClient!]!
        $service:  AppointmentServiceInput!
    ){
        addOrUpdateGroupAppointment(
         date: $date
         note: $note
         clients: $clients
         service: $service
    ){
        status
        message
    }
}`;
// unsubscribe 
export const UNSUBSCRIBE = gql`
mutation unsubscribe($id: Int!){
    unsubscribe(id: $id){
        status
        message
    }
}
`;