import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Modal, Form } from 'react-bootstrap-v5'
import { useQuery, useLazyQuery } from "@apollo/client"
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { AppContext } from '../../../../../../src/context/Context';
import {
  GET_ALL_PRODUCTS,
  SINGLE_PRODUCT,
  ALL_PRODUCT_CATEGORY,
  SERVICE_CATEGORIES,
  GET_ALL_SERVICES,
  SINGLE_SERVICE,
  ALL_VOUCHERS,
  SINGLE_VOUCHER,
  SERVICE_PRICING,
  ALL_STAFF_INFO
} from '../../../../../gql/Query'
import { IProduct, IService, IProductCategory, IServiceCategory, IVoucher } from '../../../../../types'
import { useLayout } from '../../../../../_metronic/layout/core'
import { cursorTo } from 'readline'
import { currency } from '../../../../modules/util'

type Props = {
  show: boolean,
  handleClose: () => void
}
const CreateSaleModal: React.FC<Props> = ({ show, handleClose }) => {

  const { products, vouchers, services, addServices, addVouchers, addProducts, addGroupInfo } = useContext(AppContext);
  const history = useHistory()
  const [staffs, setStaffs] = useState<any>([])
  const [showProducts, setShowProducts] = React.useState(false);
  const [itemId, setItemId] = useState("");
  const [productss, setProducts] = useState<IProduct[]>([])
  const [productCategory, setProductCategory] = useState<IProductCategory[]>([])
  const [servicess, setServices] = useState<IService[]>([])
  const [serviceCategory, setServiceCategory] = useState<IServiceCategory[]>([])
  const [voucherss, setVouchers] = useState<IVoucher[]>([])
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSale, setShowSale] = useState<boolean>(false);
  const handleCloseSale = () => setShowSale(false);
  const handleShowSale = () => {
    setShowSale(true);
  }
  const { classes } = useLayout()

  const { data: productsData, error: productsError, loading: productsLoading } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      search: searchKeyword,
      type: "",
      count: 1000,
      page: 1,
    }
  })

  const { data: staffData, error: staffError, loading: staffLoading } = useQuery(ALL_STAFF_INFO, {
    variables: {
      count: 100,
      page: 1,
    },
    fetchPolicy: "network-only"
  })

  const [singleProduct, { data: singleProductData }] = useLazyQuery(SINGLE_PRODUCT);
  const [singleVoucher, { data: singleVoucherData }] = useLazyQuery(SINGLE_VOUCHER);
  const [singleService, { data: singleServiceData }] = useLazyQuery(SERVICE_PRICING);

  const productId = async (id: any, tsq: any, qty: any) => {
    if ((tsq && qty) || !tsq) {
      await singleProduct({
        variables: {
          id
        }
      });
    }


  };
  const voucherId = async (id: any) => {
    await singleVoucher({
      variables: {
        id
      }
    });
  };

  const servicePricingId = async (id: any) => {
    await singleService({
      variables: {
        id,
        date: "",
        time: ""
      },
      fetchPolicy: 'network-only'
    });
  };

  useEffect(() => {
    if (singleProductData) {
      if (singleProductData.product != null || singleProductData.product != undefined) {
        let cart = {
          ...singleProductData.product,
          discount: "",
          staff: staffs[0].id,
          unit_price_subtotal: 1 * parseInt(singleProductData?.product?.retail_price),
          total_price: parseInt(singleProductData?.product?.special_price) ? (1 * parseInt(singleProductData?.product?.special_price)) : (1 * parseInt(singleProductData?.product?.retail_price)),
          quantity: 1
        }
        addProducts(cart)
      }
      handleClose()
    }
  }, [singleProductData])

  useEffect(() => {
    if (singleVoucherData) {
      if (singleVoucherData.voucher != null || singleVoucherData.voucher != undefined) {
        let cart = {
          ...singleVoucherData.voucher,
          quantity: 1,
          staff: staffs[0].id,
          total_price: 1 * parseInt(singleVoucherData?.voucher?.retail)
        }
        addVouchers(cart)
      }
      handleClose()
    }
  }, [singleVoucherData])

  useEffect(() => {
    if (singleServiceData) {
      console.log("singleServiceData",singleServiceData)
      if (singleServiceData?.servicePricing?.service?.is_group) {
        let groupData = {
          is_group: singleServiceData?.servicePricing?.service?.is_group,
          client_per_class: singleServiceData?.servicePricing?.service?.client_per_class,
          is_course: singleServiceData?.servicePricing?.service?.is_course,
          session_per_course: singleServiceData?.servicePricing?.service?.session_per_course,
          booked_guests: singleServiceData?.servicePricing?.booked_guests || [],
          total_booked: singleServiceData?.servicePricing?.total_booked,
          disabled: false
        }
        addGroupInfo(groupData)
        let cart = {
          ...singleServiceData.servicePricing,
          quantity: 1,
          staff: staffs[0].id,
        }
        addServices(cart)
      }else if (singleServiceData.servicePricing != null || singleServiceData.servicePricing != undefined) {
        let cart = {
          ...singleServiceData.servicePricing,
          quantity: 1,
          staff: staffs[0].id,
          service_id: parseInt(singleServiceData.servicePricing?.service_id),
          price: parseInt(singleServiceData.servicePricing?.price),
          special_price: parseInt(singleServiceData.servicePricing?.special_price),
          id: parseInt(singleServiceData.servicePricing?.id),
        }
        addServices(cart)
        let groupData = {
          is_group: false,
          client_per_class: 0,
          is_course: false,
          session_per_course: 0,
          booked_guests: [],
          total_booked: 0,
          disabled: true
        }
        addGroupInfo(groupData)
      }
      handleClose()
    }
  }, [singleServiceData])

  const { data: productCategoryData, error: productCategoryError, loading: productCategoryLoading } = useQuery(ALL_PRODUCT_CATEGORY, {
    variables: {
      type: "sale",
      count: 1000,
      page: 1,
    }
  })

  const { data: servicesData, error: servicesError, loading: servicesLoading } = useQuery(GET_ALL_SERVICES, {
    variables: {
      search: searchKeyword,
      type: "",
      count: 1000,
      page: 1,
    }
  })

  const { data: serviceCatData, error: serviceCatError, loading: serviceCatLoading } = useQuery(SERVICE_CATEGORIES, {
    variables: {
      type: "sale",
      count: 1000,
      page: 1,
    }
  })

  const { data: vouchersData, error: vouchersError, loading: vouchersLoading } = useQuery(ALL_VOUCHERS, {
    variables: {
      search: searchKeyword,
      type: "sale",
      count: 1000,
      page: 1,
    }
  })
  
  useEffect(() => {
    if (staffData) {
      setStaffs(staffData.staffs.data)
    }
    if (vouchersData) {
      setVouchers(vouchersData.vouchers.data)
    }
    if (productsData) {
      setProducts(productsData.products.data)
    }
    if (productCategoryData) {
      setProductCategory(productCategoryData.productCategories.data)
    }
    if (servicesData) {
      setServices(servicesData.services.data)
    }
    if (serviceCatData) {
      setServiceCategory(serviceCatData.serviceCategories.data)
    }
  }, [productsData, vouchersData, productCategoryData, servicesData, serviceCatData, staffData])
  // Select item for sale

  const handleClickPPrev = () => {
    setShowProducts((pprev) => !pprev);
  };

  const [showServices, setShowServices] = React.useState(false);
  const handleClickSPrev = () => {
    setShowServices((sprev) => !sprev);
  };

  const [showVouchers, setShowVouchers] = React.useState(false);
  const handleClickVPrev = () => {
    setShowVouchers((vprev) => !vprev);
  };
  // Select category for sale
  const [showPCat, setShowPCat] = React.useState(false);
  const [showVCat, setShowVCat] = React.useState(false);

  const handleClickVCatPrev = () => {
    setShowVCat((pcatprev) => !pcatprev);
  };
  const handleClickPCatPrev = () => {
    setShowPCat((pcatprev) => !pcatprev);
  };

  const handleId = (id: any) => {
    console.log("category id", id)
    setItemId(id);
  }

  const handleSearch = (e: any) => {
    setSearchKeyword([e.target.name] = e.target.value);
  }

  const filteredProducts = productss.filter(p => p.product_category_id == itemId)
  const filteredServices = servicess.filter(s => (s.service_category_id).toString() == itemId)

  const userData: any = localStorage.getItem("partner");
  const parseData = JSON.parse(userData);
  const countryName = parseData?.business_info?.country;

  return (
    <Modal
      className='add-sale-modal'
      id='modal_sale_add'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog-centered mw-600px'
      show={show}
      onHide={handleClose}
    >
      <div className='sale-modal-tool'>
        <Modal.Header className='sale-modal-heade' closeButton>
          <div className=''>
            <div className='sale-s-wrap'>
              <i className='fas fa-search'></i>
              <input
                type='text'
                name='search'
                className='sale-search'
                onChange={handleSearch}
                placeholder='Scan barcode or search a item'
              />
            </div>
          </div>
        </Modal.Header>
      </div>
      <Form className='sale-item-form-wrap'>
        <div className='sale-item'>
          {showProducts ? (
            <div>
              {/* Select Product category starts */}
              <div className='sale-product-category'>
                {showPCat ? (
                  <div>
                    {/* products starts */}
                    <div className='sale-category-title d-flex align-items-center justify-content-between'>
                      <div onClick={handleClickPCatPrev} className='back-icon'>
                        <img src={toAbsoluteUrl('/media/logos/colourLeft.png')} alt='image' />
                      </div>
                      <div>
                        <h2 className='mb-0'>Select Product</h2>
                      </div>
                      <div></div>
                    </div>
                    <div className='sale-product'>
                      {/*begin:Option */}
                      {filteredProducts.map((product) => (
                        <>
                          <label
                            key={`product${product?.id}`}
                            onClick={() =>
                              productId(product.id, product.track_stock_qty, product.stock_qty)
                            }
                            className={`saleable-product d-flex align-items-center justify-content-between ${
                              product?.track_stock_qty
                                ? product?.stock_qty > 0
                                  ? ''
                                  : 'cursorNoDrop'
                                : ''
                            }`}
                          >
                            <span className='d-flex flex-column'>
                              <span className='fw-bolder fs-6'>{product?.name}</span>
                              <span
                                className={`${
                                  product?.track_stock_qty
                                    ? product?.stock_qty > 0
                                      ? 'text-muted fs-7'
                                      : 'text-danger fs-7'
                                    : 'text-muted fx-7'
                                }`}
                              >
                                {product?.brand_info?.name}{' '}
                                {product?.track_stock_qty
                                  ? product?.stock_qty > 0
                                    ? `/ ${product?.stock_qty} in stock`
                                    : '/ Out of stock'
                                  : ''}
                              </span>
                            </span>
                            <span className='symbol symbol-50px p-0'>
                              {product.special_price > 0 && (
                                <span className='badge badge-light-primary d-block mb-2'>
                                  {currency(countryName)}
                                  {product?.special_price}
                                </span>
                              )}
                              {product.special_price > 0 ? (
                                <del className='badge badge-light-primary text-muted'>
                                  {currency(countryName)}
                                  {product?.retail_price}
                                </del>
                              ) : (
                                <span className='badge badge-light-primary text-muted'>
                                  {currency(countryName)}
                                  {product?.retail_price}
                                </span>
                              )}
                            </span>
                          </label>
                        </>
                      ))}
                    </div>
                    {/* products ends */}
                  </div>
                ) : (
                  <div>
                    {/*Products Category name starts */}
                    <div className='sale-category-title d-flex align-items-center justify-content-between'>
                      <div onClick={handleClickPPrev} className='back-icon'>
                        <img src={toAbsoluteUrl('/media/logos/colourLeft.png')} alt='image' />
                      </div>
                      <div>
                        <h2 className='mb-0'>Select Product Category</h2>
                      </div>
                      <div></div>
                    </div>
                    <ul className='ul-single-item'>
                      {productCategory.map((cat: any) => (
                        <>
                          <li key={`productCat${cat.id}`}>
                            <div
                              onClick={() => {
                                setShowPCat(true)
                                handleId(cat.id)
                              }}
                              className='select-single-item'
                            >
                              <p>{cat.name}</p>
                              <i className='next-icon fas fa-angle-right'></i>
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                    {/* Products Category name ends */}
                  </div>
                )}
              </div>
              {/* Select Product category ends */}
            </div>
          ) : showServices ? (
            <div>
              {/* Select services category starts */}
              <div className='sale-product-category'>
                {showPCat ? (
                  <div>
                    {/* Services starts */}
                    <div className='sale-category-title d-flex align-items-center justify-content-between'>
                      <div onClick={handleClickPCatPrev} className='back-icon'>
                        <img src={toAbsoluteUrl('/media/logos/colourLeft.png')} alt='image' />
                      </div>
                      <div>
                        <h2 className='mb-0'>Select Service</h2>
                      </div>
                      <div></div>
                    </div>
                    <div className='sale-product'>
                      {/*begin:Option */}
                      {filteredServices.map((service: any) => 
                      !service.is_group && service.service_pricings.map((itm: any) => (
                          <>
                            <label
                              key={`service${itm.id}`}
                              onClick={() => servicePricingId(itm.id)}
                              className='saleable-product d-flex align-items-center justify-content-between cursor-pointer'
                            >
                              <span className='d-flex flex-column'>
                                <span className='fw-bolder fs-6'>
                                  {itm.service_name} {itm.pricing_name}
                                </span>
                                <span className='fs-7 text-muted'>{itm.duration} minute</span>
                              </span>
                              <span className='symbol symbol-50px'>
                                {itm.special_price > 0 && (
                                  <span className='badge badge-light-primary d-block mb-2'>
                                    {currency(countryName)}
                                    {itm.special_price}
                                  </span>
                                )}
                                {itm.special_price > 0 ? (
                                  <del className='badge badge-light-primary text-muted'>
                                    {currency(countryName)}
                                    {itm.price ? itm.price : 0}
                                  </del>
                                ) : (
                                  <span className='badge badge-light-primary text-muted'>
                                    {currency(countryName)}
                                    {itm.price ? itm.price : 0}
                                  </span>
                                )}
                              </span>
                            </label>
                          </>
                        ))
                      )}
                    </div>
                    {/* Services ends */}
                  </div>
                ) : (
                  <div>
                    {/* Services category name starts */}
                    <div className='sale-category-title d-flex align-items-center justify-content-between'>
                      <div onClick={handleClickSPrev} className='back-icon'>
                        <img src={toAbsoluteUrl('/media/logos/colourLeft.png')} alt='image' />
                      </div>
                      <div>
                        <h2 className='mb-0'>Select Service Category</h2>
                      </div>
                      <div></div>
                    </div>
                    <ul className='ul-single-item'>
                      {serviceCategory.map((cat: any) => (
                        <>
                          <li key={`serviceCat${cat.id}`}>
                            <div
                              onClick={() => {
                                setShowPCat(true)
                                handleId(cat.id)
                              }}
                              className='select-single-item'
                            >
                              <p>{cat.name}</p>
                              <i className='next-icon fas fa-angle-right'></i>
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                    {/* Services category name ends */}
                  </div>
                )}
              </div>
              {/* Select Services category ends */}
            </div>
          ) : showVouchers ? (
            <div>
              {/* Select voucher category starts */}
              <div className='sale-product-category'>
                {/* Voucher starts */}
                <div className='sale-category-title d-flex align-items-center justify-content-between'>
                  <div onClick={handleClickVPrev} className='back-icon'>
                    <img src={toAbsoluteUrl('/media/logos/colourLeft.png')} alt='image' />
                  </div>
                  <div>
                    <h2 className='mb-0'>Select Voucher</h2>
                  </div>
                  <div></div>
                </div>
                <div className='sale-product'>
                  {/*begin:Option */}
                  {voucherss.map((voucher: any) => (
                    <>
                      <label
                        key={`voucher${voucher.id}`}
                        onClick={() => voucherId(voucher.id)}
                        className='saleable-product d-flex align-items-center justify-content-between cursor-pointer'
                      >
                        <span className='d-flex flex-column'>
                          <span className='fw-bolder fs-6'>{voucher.name}</span>
                          <span className='fs-7 text-muted'>
                            {voucher?.services_included.length > 0
                              ?voucher?.services_included.map(
                                  (service: any) => service.label + ' | '
                                )
                              : 'Redeem on all services'}
                          </span>
                        </span>
                        <span className='symbol symbol-50px'>
                          <span className='badge badge-light-primary d-block mb-2'>
                            {currency(countryName)}
                            {voucher?.value}
                          </span>
                          <span className='badge badge-light-primary d-block text-muted'>
                            {currency(countryName)}
                            {voucher?.retail}
                          </span>
                        </span>
                      </label>
                    </>
                  ))}
                </div>
                {/* Vouchers ends */}
              </div>
              {/* Select voucher category ends */}
            </div>
          ) : (
            <div>
              {/* Select item starts */}
              <div
                onClick={() => {
                  setShowProducts(true)
                }}
                className='select-single-item'
              >
                <p>Products</p>
                <i className='next-icon fas fa-angle-right'></i>
              </div>
              <div
                onClick={() => {
                  setShowServices(true)
                }}
                className='select-single-item'
              >
                <p>Services</p>
                <i className='next-icon fas fa-angle-right'></i>
              </div>
              <div
                onClick={() => {
                  setShowVouchers(true)
                }}
                className='select-single-item'
              >
                <p>Vouchers</p>
                <i className='next-icon fas fa-angle-right'></i>
              </div>
              {/* Select item ends */}
            </div>
          )}
        </div>
      </Form>
    </Modal>
  )
}

export { CreateSaleModal }
