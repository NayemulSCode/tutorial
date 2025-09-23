
import React, { Suspense, lazy, useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { FallbackView } from '../../_metronic/partials'
import { Horizontal } from '../modules/wizards/components/Horizontal'
import { HomeWrapper } from '../pages/dashboard/HomeWrapper'
import { CalendarWrapper } from '../pages/dashboard/CalendarWrapper'
import { SaleAddCheckOut } from '../pages/dashboard/components/calendar/SaleAddCheckOut'
import { ViewInvoice } from '../pages/dashboard/components/calendar/ViewInvoice'
import { SalesWrapper } from '../pages/dashboard/SalesWrapper'
import { VouchersWrapper } from '../pages/dashboard/VouchersWrapper'
import VoucherAdd from '../pages/dashboard/components/voucher/VoucherAdd'
import { ClientsWrapper } from '../pages/dashboard/ClientsWrapper'
import ClientAdd from '../pages/dashboard/components/clients/ClientAdd'
import { Chairs } from '../pages/dashboard/Chairs'
import { StaffWrapper } from '../pages/dashboard/StaffWrapper'
import StaffAdd from '../pages/dashboard/components/staff/StaffAdd'
import { ServicesWrapper } from '../pages/dashboard/ServicesWrapper'
import { InventoryWrapper } from '../pages/dashboard/InventoryWrapper'
import { AnalyticsWrapper } from '../pages/dashboard/AnalyticsWrapper'
import { SetupWrapper } from '../pages/dashboard/components/setup/SetupWrapper'
//Add Services
import OfferStep1 from '../pages/dashboard/components/services/addservices/OfferStep1'
import OfferStep2 from '../pages/dashboard/components/services/addservices/OfferStep2'
import AddSingleService from '../pages/dashboard/components/services/addservices/AddSingleService'
// import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import ProductAdd from '../pages/dashboard/components/inventory/ProductAdd'
import { EditVoucher } from '../pages/dashboard/components/voucher/EditVoucher'
import { ClientEdit } from '../pages/dashboard/components/clients/ClientEdit'
import {CalendeEvents} from '../pages/dashboard/CalenderWrapper'
import { FullCalendarTest } from '../pages/dashboard/components/calendar/FullCalendarTest'
import AppointmnetCreate from '../pages/dashboard/components/calendar/AppointmnetCreate'
import SetupInvoice from '../pages/dashboard/components/setup/SetupInvoice'
import SetupLocaiton from '../pages/dashboard/components/setup/SetupLocation'
import SetupAddress from '../pages/dashboard/components/setup/SetupAddress'
import TaxRate from '../pages/dashboard/components/setup/TaxRate'
import OnlineBooking from '../pages/dashboard/components/setup/OnlineBooking'
import PaymentFails from '../pages/dashboard/components/setup/PaymentFails'
import BusinessDetails from '../pages/dashboard/components/setup/BusinessDetails/BusinessDetails'
import SliderEdit from '../pages/dashboard/components/setup/BusinessDetails/SliderEdit'
import ClosingDates from '../pages/dashboard/components/setup/closingDates/ClosingDates'
import InvoiceSequenc from '../pages/dashboard/components/setup/InvoiceSequenc'
import ClientNotifications from '../pages/dashboard/components/setup/ClientNotifications'
import Subscription from '../pages/dashboard/components/setup/Subscription'
import VideoPlayer from '../pages/dashboard/components/setup/VideoPlayer'
import WorkingHours from '../pages/dashboard/components/setup/WorkingHours'
import SetCloseDates from '../pages/dashboard/components/setup/closingDates/SetCloseDates'
import NotificationWrapper from '../pages/dashboard/NotificationWrapper'
import VideoVatting from '../pages/dashboard/components/setup/VideoVatting'
import ShareWrapper from '../pages/ShareWrapper'
import BankDetailsWrapper from '../pages/dashboard/components/setup/bank/BankDetailsWrapper'
import CookiePolicy from '../pages/privacy-terms/CookiePolicy'
import PaymentSuccess from '../pages/dashboard/components/setup/PaymentSuccess'
import { AppContext } from '../../context/Context'
import AwaitApproval from '../pages/privacy-terms/AwaitApproval'
import AgoraWebTRC from '../pages/dashboard/components/setup/agora-rtc/AgoraRtcVideo'
import CalendarPermission from '../pages/dashboard/components/setup/BusinessDetails/CalendarPermission'

export function PrivateRoutes() {
  const {user} = useContext(AppContext)
    // console.log("PrivateRoutes.tsx:61 ~ PrivateRoutes ~ user:", user)
    const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
    const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
    const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
    const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
    const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
    const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))

    return (
      <Suspense fallback={<FallbackView />}>
        {user.business_type?.length === 0 ? (
          <Switch>
            <Route path='/account/setup' component={Horizontal} />
            <Redirect to={'/account/setup'} />
          </Switch>
        ) : user.approved_status !== 1 && user.business_type?.length !== 0 ? (
          <Switch>
            <Route path='/awaiting-approval' component={AwaitApproval} />
            <Redirect to={'/awaiting-approval'} />
          </Switch>
        ) : (
          <Switch>
            <Route path='/home' component={HomeWrapper} />
            <Route path='/notifications' component={NotificationWrapper} />
            {/* <Route path='/calendar' component={CalendarWrapper} /> */}
            <Route path='/calendar' component={CalendeEvents} />
            <Route path='/full-calender' component={FullCalendarTest} />
            <Route path='/sales-checkout' component={SaleAddCheckOut} />
            <Route path='/invoice/:id' component={ViewInvoice} />
            {/* <Route path='/appointment/add' component={AppointmentAdd} /> */}
            <Route path='/appointment/add' component={AppointmnetCreate} />
            <Route path='/sales' component={SalesWrapper} />
            <Route path='/vouchers' component={VouchersWrapper} />
            <Route path='/voucher-add' component={VoucherAdd} />
            <Route path='/edit-voucher/:id' component={EditVoucher} />
            <Route path='/guests' component={ClientsWrapper} />
            <Route path='/add-guest' component={ClientAdd} />
            <Route path='/guest/edit/:id' component={ClientEdit} />
            <Route path='/staff' component={StaffWrapper} />
            <Route path='/staff-add' component={StaffAdd} />

            <Route path='/chairs' component={Chairs} />
            <Route path='/services' component={ServicesWrapper} />
            <Route path='/inventory' component={InventoryWrapper} />
            {/* <Route path='/product-edit/:id' component={ProductEdit} /> */}
            <Route path='/product-add' component={ProductAdd} />
            <Route path='/payment-fail' component={PaymentFails} />
            <Route path='/payment-success' component={PaymentSuccess} />
            <Route path='/analytics/dashboard' component={AnalyticsWrapper} />
            <Route path='/business/settings' component={SetupWrapper} />
            <Route path='/share' component={ShareWrapper} />
            <Route path='/offer-step1' component={OfferStep1} />
            <Route path='/offer-step2' component={OfferStep2} />
            <Route path='/add-service' component={AddSingleService} />
            {/* <Route path='/dashboard' component={DashboardWrapper} /> */}
            <Route path='/builder' component={BuilderPageWrapper} />
            <Route path='/crafted/pages/profile' component={ProfilePage} />
            <Route path='/crafted/pages/wizards' component={WizardsPage} />
            <Route path='/crafted/widgets' component={WidgetsPage} />
            <Route path='/account' component={AccountPage} />
            <Route path='/apps/chat' component={ChatPage} />
            <Route path='/menu-test' component={MenuTestPage} />
            {/* account setup */}
            <Route path='/setup/invoice-setup' component={SetupInvoice} />
            <Route path='/setup/location' component={SetupLocaiton} />
            <Route path='/setup/tax' component={TaxRate} />
            <Route path='/setup/online-booking' component={OnlineBooking} />
            <Route path='/setup/business-details' component={BusinessDetails} />
            <Route path='/setup/bank-details' component={BankDetailsWrapper} />
            <Route path='/setup/slider-edit' component={SliderEdit} />
            <Route path='/setup/closed-dates' component={ClosingDates} />
            <Route path='/setup/closed-date-set' component={SetCloseDates} />
            <Route path='/setup/calendar' component={CalendarPermission} />
            <Route path='/setup/invoice-sequencing' component={InvoiceSequenc} />
            <Route path='/setup/guest-notifications' component={ClientNotifications} />
            <Route path='/setup/subscription' component={Subscription} />
            <Route path='/setup/how-to' component={VideoPlayer} />
            <Route path='/setup/working-hours' component={WorkingHours} />
            <Route path='/cookie-policy' exact component={CookiePolicy} />
            <Route path='/video-vetting/:id' component={VideoVatting} />
            <Redirect from='/auth' to='/home' />
            <Redirect exact from='/' to='/home' />
            {/* <Redirect to='error/404' /> */}
          </Switch>
        )}
      </Suspense>
    )
}
