import React, { useState, useRef, useEffect, useContext } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Modal, Form, Card, InputGroup, FormControl, Button } from 'react-bootstrap-v5'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { MY_VOUCHER } from '../../../../../gql/Query'
import moment from 'moment'
import { useSnackbar } from 'notistack';
import { AppContext } from '../../../../../context/Context'
import { currency } from '../../../../modules/util'
import { useTostMessage } from '../../../../modules/widgets/components/useTostMessage'

type Props = {
  showReedemVoucher: boolean
  handleCloseReedemVoucher: () => void
  getVoucherRedeemAmount: (amount: number) => void
  getVoucherCode: (code: string) => void
  totalAmount: number
  discount: any
  saleID: number
  saleService: Array<any>
}

const RedeemVoucherModal: React.FC<Props> = ({
  showReedemVoucher,
  handleCloseReedemVoucher,
  getVoucherRedeemAmount,
  getVoucherCode,
  totalAmount,
  discount,
  saleService,
  saleID,
}) => {
  const {showToast} = useTostMessage()
  const [myVoucher, setmyVoucher] = useState<any>([])
  const [voucherCode, setVoucherCode] = useState('')
  const {enqueueSnackbar} = useSnackbar()
  const {guests} = useContext(AppContext)

  // console.log('reddem voucher modal guest id ', guest)
  const handleVoucherSearch = async (e: any) => {
    const {name, value} = e.target
    // setVoucherCode([e.target.name] = e.target.value)
    await runQuery({
      variables: {
        guest_id: guests?.length > 0 ? +guests[0]?.id : 0,
        sale_id: saleID ? saleID : 0,
        voucher_code: value,
        selling_service: saleService,
        grand_total: totalAmount.toString(),
        discount: discount ? discount.toString() : "" ,
        business_id: 0
      },
    })
  }

  const [runQuery, {data: myVoucherData}] = useLazyQuery(MY_VOUCHER)

  useEffect(() => {
    return () => {
      setVoucherCode('')
      setmyVoucher([])
    }
  }, [])

  useEffect(() => {
    if (myVoucherData) {
      // console.log("Voucher", myVoucherData)
      setmyVoucher(myVoucherData?.myVoucher)
    }
  }, [myVoucherData])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (myVoucher?.value > myVoucher?.remaining) {
      showToast('Insufficient balance!!!','warning');
    } else {
      if (myVoucher.voucher_code) {
        getVoucherCode(myVoucher.voucher_code)
      }
      getVoucherRedeemAmount(myVoucher?.value)
      handleCloseReedemVoucher()
    }
  }
  const userData: any = localStorage.getItem('partner')
  const parseData = JSON.parse(userData)
  const countryName = parseData?.business_info?.country
  
  return (
    <Modal
      dialogClassName='modal-90w'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      show={showReedemVoucher}
      onHide={handleCloseReedemVoucher}
    >
      <Form>
        <div className=''>
          <Modal.Header className='' closeButton>
            <h2 className='adv-price-modal-title'>Redeem Voucher</h2>
          </Modal.Header>
          <div className='reedem-vmodal-heade'>
            <div className='sale-s-wrap'>
              <i className='fas fa-search'></i>
              <input
                type='text'
                name='search'
                className='sale-search'
                autoComplete='off'
                onChange={handleVoucherSearch}
                placeholder='Enter Voucher Code'
              />
            </div>
          </div>
        </div>
        <div className='reedem-voucher-body'>
          {myVoucher != null && Object.keys(myVoucher).length > 0 ? (
            <div className='reedem-voucher-form'>
              <Card>
                <div className='status'>GIFT</div>
                <h3 style={{marginBottom: '0'}}>
                  Outstanding{' '}
                  <span>
                    {currency(countryName)}
                    {myVoucher?.remaining}
                  </span>
                </h3>
                <Form.Group className='price my-6' controlId='formGridPrice'>
                  <Form.Label>Redemption Amount</Form.Label>
                  <InputGroup className='Price'>
                    <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                    <FormControl
                      placeholder='100.00'
                      type='number'
                      min='1'
                      autoComplete='off'
                      disabled
                      max={myVoucher?.remaining}
                      value={myVoucher?.value}
                    />
                  </InputGroup>
                </Form.Group>
                {myVoucher?.value > 0 && (
                  <Button type='submit' className='submit-btn' onClick={handleSubmit}>
                    Redeem Voucher
                  </Button>
                )}
                {myVoucher?.value == 0 && <span className='text-center'>{myVoucher.message}</span>}
              </Card>
              <div className='reedem-v-short-desc-info'>
                <h5 className='mb-1'>Voucher History</h5>
                <p className='mb-0 text-dark'>
                  Purchased:{' '}
                  {myVoucher?.purchase_date != null
                    ? moment.unix(myVoucher?.purchase_date).utcOffset('+0000').format('LLLL')
                    : ''}
                </p>
                <p className='mb-0 text-dark'>
                  Expires:{' '}
                  {myVoucher?.expiry_date != null
                    ? moment.unix(myVoucher?.expiry_date).utcOffset('+0000').format('LLLL')
                    : 'Forever'}
                </p>
              </div>
            </div>
          ) : (
            <div className='reedem-voucher-inner'>
              <div className='svg-icon'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'>
                  <path
                    d='M21.3 59.4c-1.3 0-2.6-.5-3.5-1.5L1.5 41.6c-1-1-1.5-2.2-1.5-3.5s.5-2.6 1.5-3.5L28.6 7.3c.2-.2.5-.3.7-.3H51c.6 0 1 .4 1 1v22.1c0 .3-.1.5-.3.7L24.9 57.9c-1 1-2.3 1.5-3.6 1.5zM29.8 9L2.9 35.9c-.6.6-.9 1.4-.9 2.2s.3 1.6.9 2.1l16.3 16.3c1.2 1.2 3.1 1.2 4.2 0L50 29.6V9H29.8z'
                    className='st0'
                  ></path>
                  <path
                    d='M41.3 23.1c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm-34 24c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l9-9c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-9 9c-.1.2-.4.3-.7.3z'
                    className='st0'
                  ></path>
                  <path
                    d='M51.3 19.1c-.6 0-1-.4-1-1s.4-1 1-1c.5 0 1-.1 1.5-.3.5-.2 1.1 0 1.3.5.2.5 0 1.1-.5 1.3-.6.3-1.4.5-2.3.5zm-10 0c-.6 0-1-.4-1-1v-.9c0-.5.5-1 1-1 .6 0 1 .5 1 1v.9c0 .5-.4 1-1 1zm14.2-2.4c-.2 0-.4-.1-.6-.2-.4-.3-.5-1-.2-1.4.3-.4.7-1 .9-1.6.2-.5.8-.7 1.3-.4.5.2.7.8.4 1.3-.3.7-.7 1.3-1.1 1.9-.1.3-.4.4-.7.4zm-13.9-1.5h-.1c-.5-.1-.9-.6-.9-1.1.1-.7.2-1.4.3-2 .1-.5.6-.9 1.2-.8.5.1.9.6.8 1.2-.1.6-.2 1.3-.3 1.9-.1.4-.5.8-1 .8zm16.1-3h-.3c-.5-.2-.8-.7-.7-1.3.1-.4.3-.9.4-1.3 0-.2.1-.3.1-.5.1-.5.6-.9 1.2-.8.5.1.9.6.8 1.2 0 .2-.1.4-.1.7-.1.5-.3.9-.4 1.4-.2.3-.6.6-1 .6zm-15-1.9c-.1 0-.2 0-.3-.1-.5-.2-.8-.8-.6-1.3.2-.6.4-1.2.7-1.9.2-.5.8-.7 1.3-.5.5.2.7.8.5 1.3-.3.6-.5 1.2-.7 1.8-.1.4-.5.7-.9.7zm15.4-3c-.4 0-.8-.3-1-.7-.1-.6-.4-1.1-.7-1.6-.3-.5-.1-1.1.3-1.4.5-.3 1.1-.1 1.4.3.4.7.7 1.4.9 2.1.1.5-.2 1.1-.7 1.2-.1.1-.2.1-.2.1zM44.9 5.9c-.2 0-.4-.1-.6-.2-.5-.3-.6-.9-.2-1.4.4-.6.9-1.1 1.3-1.7.4-.4 1-.4 1.4-.1.4.4.4 1 .1 1.4-.4.5-.8.9-1.2 1.5-.1.3-.5.5-.8.5zm10.3-2.6c-.2 0-.4-.1-.6-.2-.5-.3-1-.6-1.5-.8-.5-.2-.8-.8-.6-1.3.2-.5.8-.8 1.3-.6.7.2 1.4.6 2 1 .5.3.6.9.3 1.4-.2.4-.6.5-.9.5zm-6.6-.8c-.4 0-.8-.2-.9-.6-.2-.5 0-1.1.5-1.3.7-.3 1.5-.5 2.2-.6.6-.1 1 .3 1.1.9.1.5-.3 1-.9 1.1-.6.1-1.1.2-1.6.4-.2.1-.3.1-.4.1zM21.3 53.1c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l9-9c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-9 9c-.1.2-.4.3-.7.3zm-8-16c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.1.2-.4.3-.7.3zm-4 4c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1-1c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-1 1c-.1.2-.4.3-.7.3zm6-2c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.1.2-.4.3-.7.3zm-4 4c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1-1c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-1 1c-.1.2-.4.3-.7.3zm7-1c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.1.2-.4.3-.7.3zm-4 4c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1-1c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-1 1c-.1.2-.4.3-.7.3zm6-2c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.1.2-.4.3-.7.3zm-4 4c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1-1c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-1 1c-.1.2-.4.3-.7.3zm7-1c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.1.2-.4.3-.7.3zm-4 4c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1-1c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-1 1c-.1.2-.4.3-.7.3z'
                    className='st0'
                  ></path>
                </svg>
              </div>
              <p>Check existing voucher status & balance</p>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  )
}

export { RedeemVoucherModal }