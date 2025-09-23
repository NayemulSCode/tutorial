import React, {FC, useState, useEffect} from 'react'
import {Button, Form, Modal, Spinner} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {SUBSCRIPTION, SUBSCRIPTION_INFO} from '../../../../../gql/Query'
import {useMutation, useQuery} from '@apollo/client'
import {BUSINESS_SUBSCRIPTION, UNSUBSCRIBE} from '../../../../../gql/Mutation'
import moment from 'moment'
import {ISubscriptionDetails} from '../../../../../types'
import Offboarding from './Offboarding'
import ConfirmationModal from '../../../../modules/widgets/components/ConfirmationModal'
import {useTostMessage} from '../../../../modules/widgets/components/useTostMessage'
import StripePricingTable from './stripe-subs-pricing-table/StripePricingTable'
import 'dotenv/config'

const Subscription: FC = () => {
  const history = useHistory()
  const {showToast} = useTostMessage()
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [showOffboarding, setShowOffboarding] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe')
  const [amount, setAmount] = useState<any>()
  const [subscribePackegId, setSubscribePackegId] = useState<any>()
  const [subscribedId, setSubscribedId] = useState<string>('')
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false)
  const [payment, setPayment] = useState<string>('')
  const [subscriptionId, setSubscriptionId] = useState<number>(0)
  const [subscriptionPackeg, setSubscriptionPackeg] = useState<Array<any>>([])
  const [subscriptionHsitories, setSubscriptionHsitories] = useState<Array<any>>([])
  const [confirmModal, setConfirmModal] = useState(false)

  const handleCloseOffboarding = () => setShowOffboarding(false)
  const handleShowOffboarding = () => {
    setShowOffboarding(true)
  }

  const [subscriptionInformation, setSubscriptionInformation] = useState<ISubscriptionDetails>({
    current: {
      sub_start_date: 0,
      sub_expiry_date: 0,
    },
    histories: {
      id: '',
      sub_start_date: 0,
      sub_expiry_date: 0,
      pay_status: '',
      tran_id: 0.0,
      sub_price: 0,
    },
  })

  const [subscriptionStatus, setSubscriptionStatus] = useState<number>()
  const [subscribe] = useMutation(BUSINESS_SUBSCRIPTION)
  const [unsubscribe] = useMutation(UNSUBSCRIBE)
  const {data: businessSubscription} = useQuery(SUBSCRIPTION)
  const {data: subscriptionInfo, refetch: subscriptionInfoRefetch} = useQuery(SUBSCRIPTION_INFO)

  const closeModal = () => {
    setShow(false)
  }

  useEffect(() => {
    if (businessSubscription) {
      setSubscriptionPackeg(businessSubscription.subscriptions)
    }
    if (subscriptionInfo) {
      setSubscriptionInformation(subscriptionInfo?.subscribedDetail)
      setSubscriptionHsitories(subscriptionInfo?.subscribedDetail?.histories)
      setSubscriptionStatus(subscriptionInfo?.subscribedDetail?.current?.sub_status)
      setSubscribedId(subscriptionInfo?.subscribedDetail?.current?.id)
      setIsSubscribe(subscriptionInfo?.subscribedDetail?.current?.is_subscribed)
      setPayment(subscriptionInfo?.subscribedDetail?.current?.pay_status)
      setSubscriptionId(subscriptionInfo?.subscribedDetail?.current?.sub_id)
    }
  }, [businessSubscription, subscriptionInfo])

  const handleSubscriptionSelected = (priceId: string) => {
    const subscPack = subscriptionPackeg.find((packeg) => packeg.id == priceId)
    if (subscPack) {
      setSubscribePackegId(priceId)
      handleSubscribe(subscPack)
    }
  }

  const handleSubscribe = (subscPack: any) => {
    setAmount(subscPack?.price)
    subscribe({
      variables: {
        id: +subscPack?.id,
        price: subscPack?.price,
        payment_type: 'Stripe',
      },
    }).then(({data}) => {
      const {status, message} = data?.subscribe
      if (status === 0) {
        showToast(message, 'error')
      }
      if (status === 1) {
        window.open(data.subscribe.payment_url, '__blank')
      }
    })
  }

  // show success message
  const searchParam = new URLSearchParams(useLocation().search)
  const msg = searchParam?.get('message')
  useEffect(() => {
    if (msg) {
      showToast(msg, 'info')
    }
  }, [])

  // unsubscribe modal
  const handleOpenModal = () => {
    setConfirmModal(true)
  }

  const handlecloseModal = () => {
    setConfirmModal(false)
  }

  const confirmation = (status: any) => {
    if (status === 1) {
      unsubscribe({
        variables: {
          id: +subscribedId,
        },
      }).then(({data}: any) => {
        const {status, message} = data.unsubscribe
        if (status === 1) {
          showToast(message, 'success')
          subscriptionInfoRefetch()
        }
        if (status === 0) {
          showToast(message, 'error')
          subscriptionInfoRefetch()
        }
      })
    }
  }

  return (
    <div>
      <div className='flex-stack business_details_header'>
        <div className='mr-2'>
          <button
            onClick={() => {
              history.push('/business/settings')
            }}
            type='button'
            className='btn btn-lg btn-light-primary me-3'
            data-kt-stepper-action='previous'
          >
            <KTSVG path='/media/icons/duotune/arrows/arr063.svg' className='svg-icon-4 me-1' />
          </button>
        </div>
        <h1 className='me-4 mb-0'>Business Subscription</h1>
      </div>
      <div>
        <div className='setup-toolbar d-flex align-items-center justify-content-between mt-7'>
          <div
            className={`${
              subscriptionStatus == 1
                ? 'd-flex align-items-center bg-light-success rounded min-w-125px py-3 me-4 px-4'
                : subscriptionStatus === 2
                ? 'd-flex align-items-center bg-light-danger rounded min-w-125px py-3 me-4 px-4'
                : 'd-flex align-items-center rounded min-w-125px py-3 me-4 px-4'
            }`}
          >
            {/* sub_status: 0=Inactive,1=Active,2= Expiry */}
            <div className='fs-6 fw-bolder fw-bolder text-gray-800'>
              {subscriptionStatus == 0 ? (
                <h2>
                  Subscribed{' '}
                  <span style={{fontSize: '15px'}}>
                    Expiry Date:{' '}
                    {subscriptionInformation?.current?.sub_expiry_date
                      ? moment.unix(subscriptionInformation?.current?.sub_expiry_date).format('ll')
                      : ''}
                  </span>
                </h2>
              ) : subscriptionStatus == 1 ? (
                <h2>
                  Subscribed{' '}
                  <span style={{fontSize: '15px'}}>
                    Expiry Date:{' '}
                    {subscriptionInformation?.current?.sub_expiry_date
                      ? moment.unix(subscriptionInformation?.current?.sub_expiry_date).format('ll')
                      : ''}
                  </span>
                </h2>
              ) : subscriptionStatus == 2 ? (
                <h2 style={{color: 'red'}}>
                  Subscription Expired{' '}
                  <span style={{fontSize: '15px'}}>
                    Expiry Date:{' '}
                    {subscriptionInformation?.current?.sub_expiry_date
                      ? moment.unix(subscriptionInformation?.current?.sub_expiry_date).format('ll')
                      : ''}
                  </span>
                </h2>
              ) : (
                <h2>
                  In trial{' '}
                  <span style={{fontSize: '15px'}}>
                    Expiry Date:{' '}
                    {subscriptionInformation?.current?.sub_expiry_date
                      ? moment.unix(subscriptionInformation?.current?.sub_expiry_date).format('ll')
                      : ''}
                  </span>
                </h2>
              )}
            </div>
          </div>
          <div>
            {showHistory === true ? (
              <Button
                onClick={() => {
                  setShowHistory(!showHistory)
                }}
                className='btn btn-light'
              >
                Back
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setShowHistory(!showHistory)
                }}
                className='btn btn-light'
              >
                Subscription History
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stripe subscription pricing table */}
      {!showHistory && (
        <StripePricingTable
          pricingTableId={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
          publishableKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
          onSubscriptionSelected={handleSubscriptionSelected}
        />
      )}

      {/* offboarding */}
      <div className='setup-toolbar d-flex align-items-center justify-content-between mt-7'>
        <button onClick={handleShowOffboarding} className='btn btn-primary mx-auto'>
          Offboarding
        </button>
      </div>

      {/* Choose payment method modal */}
      <>
        <Modal
          dialogClassName='modal-90w'
          show={show}
          onHide={closeModal}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header className='' closeButton>
            <h2 className='adv-price-modal-title'>Choose Payment Method</h2>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <div className='d-sm-flex justify-content-center pt-5 p-way'>
                <div className='mb-5 me-5'>
                  <input
                    className='form-check-input'
                    type='radio'
                    id='stripe'
                    name='p_way'
                    onChange={() => {
                      setPaymentMethod('stripe')
                    }}
                    checked={paymentMethod === 'stripe'}
                  />
                  <label className='ms-3 ' htmlFor='stripe'>
                    <img
                      height='100px'
                      width='100'
                      src={toAbsoluteUrl(`/media/payment/stripe.png`)}
                      alt='stripe'
                    />
                  </label>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  const subscPack = subscriptionPackeg.find(
                    (packeg) => packeg.id == subscribePackegId
                  )
                  if (subscPack) {
                    handleSubscribe(subscPack)
                  }
                  closeModal()
                }}
                className='category-save-btn submit-btn'
              >
                Continue
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>

      {/* offboarding modal */}
      <Offboarding showOffboarding={showOffboarding} CloseOffboarding={handleCloseOffboarding} />

      {/* subscription history table */}
      {showHistory === true && (
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
              <thead>
                <tr className='fw-bolder bg-light text-muted'>
                  <th className='ps-4'>Invoice</th>
                  <th>Subscription Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionHsitories.map((item, index) => (
                  <tr key={index}>
                    <td className='ps-4'>N/A</td>
                    <td>{moment.unix(item.sub_start_date).format('ll')}</td>
                    <td>{moment.unix(item.sub_expiry_date).format('ll')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* unsubscribe modal */}
      <ConfirmationModal
        bodyText='Are you sure to unsubscribe this package?'
        handlecloseModal={handlecloseModal}
        confirmModal={confirmModal}
        confirmation={confirmation}
      />

      {/* Current subscription action buttons */}
      {isSubscribe && subscriptionStatus !== 2 && (
        <div className='d-flex justify-content-center mt-7'>
          <Button onClick={handleOpenModal} className='btn btn-danger me-3'>
            Unsubscribe
          </Button>
        </div>
      )}
    </div>
  )
}

export default Subscription
