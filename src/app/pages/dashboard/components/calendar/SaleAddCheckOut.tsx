import React, { FC, useState, useEffect, useContext } from "react"
import { Link, useHistory } from 'react-router-dom'
import {
  Card,
  Col,
  Row,
  Form,
  InputGroup,
  FormControl,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
  Container,
  FormGroup,
} from 'react-bootstrap-v5'
import { IProduct, IVoucher, IService, IUsers, IStaff, IServiceTobeCheckout, IGuest, IBuyerGuest } from "../../../../../types";
import { ALL_CLIENTS, SINGLE_CLIENT, ALL_STAFF_INFO, SINGLE_PRODUCT, UPFRONT_AMOUNT } from '../../../../../gql/Query'
import { ADD_SALE, UPDATE_SALE, GUEST_PROFILE_UPDATE, SYSTEM_LOG } from '../../../../../gql/Mutation'
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { KTSVG } from '../../../../../_metronic/helpers';
import { CreateSaleModal } from "./CreateSaleModal";
import { RedeemVoucherModal } from "./RedeemVoucherModal";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { AppContext } from '../../../../../../src/context/Context';
import CreateClientModal from "./CreateClientModal";
import Test from './Test.js';
import { useSnackbar } from 'notistack';
import { StripePayment } from "./StripePayment";
import { currency, systemLogPayload } from "../../../../modules/util";
import { useTostMessage } from "../../../../modules/widgets/components/useTostMessage";
import GuestList from "./GuestList";
import moment from "moment";
import { toast } from "react-toastify";
import { print } from "graphql";

const SaleAddCheckOut: FC = () => {
    document.title = "Sale checkout";
    const { showToast } = useTostMessage()
    const [overwrite, setOverwrite] = useState<number>(0)
    const [paymentUrl, setPaymentUrl] = useState("");
    const [invoiceNo, setInvoiceNo] = useState(0);
    const [appointId, setAppointId] = useState(0);
    const [loading, setLoading] = useState<boolean>(false)
    const [barcodeRead, setBarcodeRead] = useState("");
    const [cartDiscount, setCartDiscount] = useState<any>();
    const [totalAfterDiscount, setTotalAfterDiscount] = useState<number | undefined>()
    const [total, setTotal] = useState<any>(0)
    const [isDiscount, setIsDiscount] = useState<boolean>(false)
    const { clearContext, apptInfo, addApptInfo, appointmentSource, addAppointmentSource, products, vouchers, services, guests, addGuests, guest, addGuest, groupInfo, totalAmount, addTotalAmount, apptServices, removeApptServices, addServices, addVouchers, addProducts, removeProducts, removeVouchers, removeServices } = useContext(AppContext);
    // console.log("apptServices", apptServices)
    // console.log("services", services)
    // console.log("products", products)
    const [checkProduct, setCheckProduct] = useState<IProduct[]>([])
    const [checkVoucher, setCheckVoucher] = useState<IVoucher[]>([])
    const [checkService, setCheckService] = useState<IService[]>([])
    const [checkApptService, setCheckApptService] = useState<IServiceTobeCheckout[]>([])
    const [allstaffs, setallStaffs] = useState<IStaff[]>([])
    const [clients, setClients] = useState<IUsers[]>([])
    const [search, setSearch] = useState("");
    const [paymentType, setPaymentType] = useState<Array<string>>([]);
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory()
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherRedeemAmount, setVoucherRedeemAmount] = useState(0);
    const [cashAmount, setCashAmount] = useState(0);
    const [otherAmount, setOtherAmount] = useState(0);
    const [googleAmount, setGoogleAmount] = useState(0);
    const [overwriteObject, setOverwriteObject] = useState<any>({
        first_name: "",
        last_name: "",
        email: '',
        mobile: "",
        password: '',
        additional_mobile: "",
        client_source: "",
        display_booking: "",
        gender: "",
        dob: '',
        client_info: "",
        address: "",
        marketing_notification: '',
        email_notification: "",
        language: ""
    });
    const [detailClient, setDetailClient] = useState<any>({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: ""
    });
    const [system_log] = useMutation(SYSTEM_LOG);
    const [addSale] = useMutation(ADD_SALE, {
      onError(err) {
        const graphQLErrors = err.graphQLErrors

        if (graphQLErrors && graphQLErrors.length > 0) {
          const error = graphQLErrors[0]
          const extensions = error.extensions
          // Check if it's a validation error
          if (extensions && extensions.validation) {
            const validationErrors = extensions.validation
            // Loop through the validation errors and show each message in a toast
            Object.keys(validationErrors).forEach((key) => {
              validationErrors[key].forEach((message: any) => {
                showToast(message, "error")
              })
            })
            setLoading(false)
          } else {
            // If it's a different type of error, show the general reason
            showToast(extensions.reason || 'An unknown error occurred', "error")
            setLoading(false)
          }
        } else {
          // Handle the case where there's no detailed GraphQL error
          setLoading(false)
          showToast('An unknown error occurred',"error")
        }
      },
    })
    const [updateSale] = useMutation(UPDATE_SALE, {
      onError(err) {
        const graphQLErrors = err.graphQLErrors

        if (graphQLErrors && graphQLErrors.length > 0) {
          const error = graphQLErrors[0]
          const extensions = error.extensions
          // Check if it's a validation error
          if (extensions && extensions.validation) {
            const validationErrors = extensions.validation
            // Loop through the validation errors and show each message in a toast
            Object.keys(validationErrors).forEach((key) => {
              validationErrors[key].forEach((message: any) => {
                showToast(message, "error")
              })
            })
            setLoading(false)
          } else {
            // If it's a different type of error, show the general reason
            showToast(extensions.reason || 'An unknown error occurred', "error")
            setLoading(false)
          }
        } else {
          // Handle the case where there's no detailed GraphQL error
          setLoading(false)
          showToast('An unknown error occurred', "error")
        }
      },
    })
    const UPDATE_SALE_STRING = print(UPDATE_SALE)
    const ADD_SALE_STRING = print(ADD_SALE)
    // Show Client Details
    const [showCdetails, setShowCdetails] = React.useState(false);

    const [isOverwrite, setIsOverwrite] = React.useState(false);
    // Show Client List
    const [showClients, setShowClients] = React.useState(false);
    const [upFrontAmount, setUpFrontAmount] = React.useState(0);
    const [saleID, setSaleID] = React.useState(0);
    let saleProduct: any = [];
    let saleVoucher: any = [];
    let saleService: any = [];

    const [guestProfileUpdate] = useMutation(GUEST_PROFILE_UPDATE)

    const { data: singleClient } = useQuery(SINGLE_CLIENT, {
        variables: {
            id: guest?.id
        }
    })
    // get upfront query call
    const { data: upfrontAmountFrontUpdateModal } = useQuery(UPFRONT_AMOUNT, {
      variables: {
        appt_id: appointmentSource.appt_id ?? 0,
      }
    })
    const [runUpfrontQuery,{ data: upfrontAmountFromList }] = useLazyQuery(UPFRONT_AMOUNT)
    useEffect(() => {
      runUpfrontQuery({
        variables: {
          appt_id: appointmentSource.appt_id ?? 0,
        },
      })
    }, [appointmentSource.appt_id])

    useEffect(() => {
      if (upfrontAmountFromList) {
        setSaleID(upfrontAmountFromList?.upfrontAmount?.sale_id)
        addAppointmentSource({
          ...appointmentSource,
          sale_id: upfrontAmountFromList?.upfrontAmount?.sale_id,
        })
        setUpFrontAmount(Number(upfrontAmountFromList?.upfrontAmount?.upfront_amount))
      }
      if (upfrontAmountFrontUpdateModal) {
        setSaleID(upfrontAmountFrontUpdateModal?.upfrontAmount?.sale_id)
        addAppointmentSource({
          ...appointmentSource,
          sale_id: upfrontAmountFrontUpdateModal?.upfrontAmount?.sale_id,
        })
        setUpFrontAmount(Number(upfrontAmountFrontUpdateModal?.upfrontAmount?.upfront_amount))
      }
    }, [upfrontAmountFromList, upfrontAmountFrontUpdateModal])

    useEffect(() => {
        if (singleClient) {
            console.log(singleClient)
            setDetailClient(singleClient?.client)
            setShowClients(true)
            setShowCdetails(true)
        }
    }, [singleClient])

    products.map((product) => {
        const { id, quantity, retail_price, special_price, staff } = product;
        let newObj = {
            // id: "",
            product_id: +id,
            product_qty: +quantity,
            unit_price: retail_price.toString(),
        }
        saleProduct.push(newObj);
    })

    vouchers.map((voucher) => {
        const { id, quantity, retail, staff } = voucher;
        let newObj = {
            voucher_id: +id,
            voucher_qty: +quantity,
            unit_price: retail.toString(),
        }
        saleVoucher.push(newObj);
    })
    console.log('overwriteObject', overwriteObject)
    let addServiceFromCart:Array<any> = [];
    services.map((service) => {
        const { id, service_id, quantity, price, special_price, staff, duration } = service;
        const newObj = {
            // id: id,
            // service_id: service_id,
            service_qty: quantity,
            unit_price: price.toString(),
            duration: duration,
            service_pricing_id: id,
            staff_id: Number(staff)
        }
        const newVoucherArrayObj = {
          service_pricing_id: Number(id),
          service_id: Number(service_id),
          service_qty: quantity,
          unit_price: price.toString(),
          special_price: special_price? special_price.toString(): "",
        }
        saleService.push(newObj);
        addServiceFromCart.push(newVoucherArrayObj)
    })

    let appServiceToVoucherCheck: any = [];
    apptServices.map((item: any) => {
        const newObj = {
          service_pricing_id: Number(item?.id),
          service_id: Number(item?.service_pricing?.service_id),
          service_qty: 1,
          unit_price: item?.price.toString(),
          special_price: item?.special_price.toString(),
        }
        appServiceToVoucherCheck.push(newObj)
    })

    let voucherCheck = [...addServiceFromCart, ...appServiceToVoucherCheck]
    console.log("appServiceToVoucherCheck:", appServiceToVoucherCheck)
    console.log("voucherCheck", voucherCheck);

    let saleData = {
      products: saleProduct,
      vouchers: saleVoucher,
      services: saleService,
      appointments: apptServices?.length
        ? apptServices.map((item) => ({
            id: item.id ?? '',
            appt_id: item.appt_id ? item.appt_id : '',
            date:
              typeof item.time === 'number'
                ? moment.unix(Number(item.time)).format('YYYY-MM-DD')
                : item?.date,
            time: typeof item.time === 'number' ? item.formatted_time : item.time,
            duration: +item.duration,
            staff_id: Number(item.staff_id) ?? 0,
            chair: Number(item.chair) ?? 0,
            service_pricing_id: Number(item.ser_pricing_id) ?? 0,
          }))
        : [],
    }

    useEffect(() => {
        if (products) {
            setCheckProduct(products)
        }
        if (vouchers) {
            setCheckVoucher(vouchers)
        }
        if (services) {
            setCheckService(services)
        }
        if (apptServices) {
            setCheckApptService(apptServices)
        }
    }, [products, vouchers, services, apptServices])

    const [runQuery, { data: singleProduct }] = useLazyQuery(SINGLE_PRODUCT);
    const { data: clientsData, error: clientsError, loading: ClientsLoading, refetch } = useQuery(ALL_CLIENTS, {
        variables: {
            search: search,
            count: 1000,
            page: 1,
        }
    })

    const { data: staffData, error: staffError, loading: staffLoading } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: 10,
            page: 1
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        console.log(barcodeRead)
        runQuery({
            variables: {
                id: "",
                barcode: barcodeRead
            }
        });
    }, [barcodeRead, setBarcodeRead]);

    // state clear
    useEffect(() => {
        return () => {
          addGuest({
              id: "", user_id: "", client_id: "", first_name: "", last_name: "", email: "", mobile: ""
          });
          setDetailClient({})
        }
    }, [])

    useEffect(() => {
        if (singleProduct?.product != null) {
            let productIdx = checkProduct.findIndex(p => p.barcode === barcodeRead)
            if (productIdx == -1) {
                let cart = {
                    ...singleProduct.product,
                    discount: "",
                    staff: allstaffs[0].id,
                    quantity: 1,
                    unit_price_subtotal: 1 * singleProduct?.product?.retail_price,
                    total_price: singleProduct?.product?.special_price ? 1 * singleProduct?.product?.special_price : 1 * singleProduct?.product?.retail_price
                }
                setBarcodeRead("");
                addProducts(cart)
            } else {
                checkProduct[productIdx].quantity += 1;
                checkProduct[productIdx].unit_price_subtotal = checkProduct[productIdx].quantity * checkProduct[productIdx].retail_price;
                checkProduct[productIdx].total_price = checkProduct[productIdx].special_price ? checkProduct[productIdx].quantity * checkProduct[productIdx].special_price : checkProduct[productIdx].quantity * checkProduct[productIdx].retail_price;
                console.log(checkProduct[productIdx].quantity, checkProduct[productIdx].total_price)
                setBarcodeRead("");
                setCheckProduct([...checkProduct])
            }
        }
    }, [singleProduct])

    useEffect(() => {
        if (clientsData) {
            refetch()
            setClients(clientsData.clients?.data)
        }
        if (staffData) {
            setallStaffs(staffData.staffs?.data)
        }
    }, [clientsData, staffData])

    // Select item for sale
    const [showPayAdd, setShowPayAdd] = React.useState(false);
    const handleClickPBack = () => {
        setPaymentType([])
        setVoucherRedeemAmount(0)
        setGoogleAmount(0);
        setOtherAmount(0);
        setCashAmount(0);
        setShowPayAdd((pprev) => !pprev);
        setIsDiscount(false);
    };

    // Sale modal
    const [showSale, setShowSale] = useState<boolean>(false);
    const handleCloseSale = () => setShowSale(false);
    const handleShowSale = () => {
        setShowSale(true);
    }

    // Reedem Voucher modal
    const [showReedemVoucher, setShowReedemVoucher] = useState<boolean>(false);
    const handleCloseReedemVoucher = () => setShowReedemVoucher(false);
    const handleShowReedemVoucher = () => {
        setShowReedemVoucher(true);
    }


    // show stripe modal
    const [showStripe, setShowStripe] = useState<boolean>(false);
    const handleCloseStripe = () => setShowStripe(false);
    const handleShowStripe = () => {
        setShowStripe(true);
    }

    const handleClickCBack = () => {
        setShowClients((Cprev) => !Cprev);
    };

    const handleClickCdetailsBack = (guest: any , length: number) => {
        // setDetailClient({
        //     id: "",
        //     first_name: "",
        //     last_name: "",
        //     email: "",
        //     mobile: ""
        // })
        // addGuest(detailClient)
        // setShowClients((Cprev) => !Cprev);
        // setShowCdetails((Cdprev) => !Cdprev);
      addGuests(guest, 'remove')
      if (length - 1 == 0) {
        setShowCdetails((Cdprev) => !Cdprev);
      }
    };

    // Create client modal
    const [showCreateClient, setShowCreateClient] = useState<boolean>(false);
    const handleCloseCreateClient = () => setShowCreateClient(false);
    const handleShowCreateClient = () => {
        setShowCreateClient(true);
    }

    // checkout amount calculation
    var productsTotalPrice = products.map((product: any) => product?.total_price);
    let productSum = productsTotalPrice.reduce((a: number, b: number) => a + b, 0);

    var productsTotalUnitPrice = products.map((product: any) => product?.unit_price_subtotal);
    let productUnitSum = productsTotalUnitPrice.reduce((a: number, b: number) => a + b, 0);

    var voucherTotalPrice = vouchers.map((voucher: any) => voucher?.total_price)
    let voucherSum = voucherTotalPrice.reduce((a: number, b: number) => a + b, 0);

    var serviceTotalPrice = services.map((service: any) => service?.special_price ? service?.special_price : service?.price)
    var serviceSum = serviceTotalPrice.reduce((a: number, b: number) => a + b, 0);

    var serviceTotalUnitPrice = services.map((service: any) => service?.price)
    var serviceUnitSum = serviceTotalUnitPrice.reduce((a: number, b: number) => a + b, 0);

    var apptServiceTotalPrice = apptServices.map((service: any) => {
        // Calculate price based on special_price if available, otherwise use price
        const totalPrice = service.repeated_group ?
            (service?.special_price ? service?.special_price : service?.price) * parseInt(service?.quantity) :
            service?.special_price ? service?.special_price : service?.price;

        return totalPrice;
    });
    var apptServiceSum = apptServiceTotalPrice.reduce((a: number, b: number) => a + b, 0);

    var apptServiceTotalUnitPrice = apptServices.map((service: any) => service?.special_price ? service?.special_price : service?.price)
    var apptServiceUnitSum = apptServiceTotalUnitPrice.reduce((a: number, b: number) => a + b, 0);


    let unitPriceSubtotal = productUnitSum + serviceUnitSum + voucherSum + apptServiceUnitSum;
    console.log("unitPriceSubtotal", unitPriceSubtotal)
    let subTotal = serviceSum + productSum + voucherSum + apptServiceSum;
    let payTotal = upFrontAmount > 0 ? subTotal - upFrontAmount : subTotal;
    useEffect(() => {
      setTotal(upFrontAmount > 0 ? subTotal - upFrontAmount : subTotal)
    }, [upFrontAmount, subTotal])
    // let total = upFrontAmount > 0
    //     ? subTotal - upFrontAmount - (cartDiscount || 0)
    //     : subTotal - (cartDiscount || 0)
    addTotalAmount(total);

    // pay amount calculation

    let totalPriceWithoutVoucherAmount = totalAfterDiscount
    ? totalAfterDiscount - voucherRedeemAmount
    : total - voucherRedeemAmount;
    const handleCartDiscount = (e: any) => {
      e.preventDefault();
      const {value} = e.target
      if (+value <= payTotal ){
        setCartDiscount(value)
      }else{
        showToast(`Discount Must Be Lower Then ${upFrontAmount > 0 ? 'Payable Amount' : 'Total'}`, 'warning')
      } 
    }
    const handleCartDiscountCalculation = () => {
      setTotal(
        upFrontAmount > 0
          ? subTotal - upFrontAmount - (cartDiscount || 0)
          : subTotal - (cartDiscount || 0)
      )
      setTotalAfterDiscount(
        upFrontAmount > 0
        ? subTotal - upFrontAmount - (cartDiscount || 0)
        : subTotal - (cartDiscount || 0))
    }

    const handleProductQtyUpdate = (e: any, id: number) => {
        let qty = ([e.target.name] = e.target.value)
        if (checkProduct != undefined) {
            let product = checkProduct.find(p => p.id == id)
            if (product != undefined) {
                if ((product?.track_stock_qty && product.stock_qty >= qty) || !product.track_stock_qty) {
                    product.quantity = +qty;
                    product.unit_price_subtotal = qty * product.retail_price;
                    product.total_price = product.special_price ? qty * product.special_price : qty * product.retail_price;
                    if (checkProduct != undefined) {
                        setCheckProduct([...checkProduct, product])
                    }
                } else {
                  showToast("Limited Stock", 'error');
                }

            }
        }
    }

    const handleVoucherQtyUpdate = (e: any, id: string) => {
        let qty = ([e.target.name] = e.target.value);

        let voucher = checkVoucher.find(v => v.id == id);
        if (voucher != undefined || voucher != null) {
            if ((voucher?.limit_number_of_sales_enable && (voucher?.limit_number_of_sales - voucher?.total_sale) >= qty) || !voucher?.limit_number_of_sales_enable) {
                voucher.quantity = qty;
                voucher.total_price = +qty * +voucher.retail;
                setCheckVoucher([...checkVoucher, voucher])
                console.log(voucher.quantity, voucher.total_price);
            } else {
              showToast("Limited Stock", 'error');
            }

        }
    }

    const ProductStaffUpdate = (e: any, id: number) => {
        let staff = ([e.target.name] = e.target.value);
        let product = checkProduct.find(p => p.id == id);
        if (product != undefined) {
            product!.staff = staff;
            setCheckProduct([...checkProduct, product]);
        }
    }

    const VoucherStaffUpdate = (e: any, id: string) => {
        let staff = ([e.target.name] = e.target.value);
        let voucher = checkVoucher.find(v => v.id == id);
        if (voucher != undefined) {
            voucher!.staff = staff;
            setCheckVoucher([...checkVoucher, voucher]);
        }
    }

    const serviceStaffUpdate = (e: any, id: number) => {
        let staff = ([e.target.name] = e.target.value);
        let service = checkService.find(s => s.id == id);
        if (service != undefined) {
            service!.staff = staff;
            setCheckService([...checkService, service]);
        }
    }

    const apptServiceStaffUpdate = (e: any, id: number) => {
        let staff = ([e.target.name] = e.target.value);
        let service = checkApptService.find(s => +s.ser_pricing_id == id);
        if (service != undefined) {
            service.staff_id = staff;
            setCheckApptService([...checkApptService, service]);
        }
    }

  // group service client work
  const handleClientsDetailView = (c: any) => {
    // group guest booking
    if (!guests?.some((guest) => guest?.id == c.id)
      && groupInfo.is_group
      && guests.length !== groupInfo.client_per_class
    ) {
      addGuests(c, 'update')
      setShowCdetails(true)
    }
    // signle guest booking
    else if (!groupInfo.is_group && guests.length < 2) {
      addGuests(c, 'add');
      setShowCdetails(true)
    }
    else if (guests.length === groupInfo?.client_per_class && groupInfo.is_group) {
      showToast('Already filled your guests limit', 'warning');
    }
    else {
      showToast('Guest already have been added in the list', 'warning')
    }
  };
    const handleSearch = (e: any) => {
        setSearch([e.target.name] = e.target.value);
    }
    const guestId = (c: any) => {
        setShowCdetails(true)
        addGuests(c, 'add');
    }

    const getBarcode = (code: any) => {
        setBarcodeRead(code)
        console.log(code)
    }
    let voucherPayment = {
        "code": voucherCode,
        "payment": voucherRedeemAmount ? voucherRedeemAmount.toString() : "",

    }

    let cashAmountt = paymentType.find((t: any) => t === "cash")
    let stripAmountt = paymentType.find((t: any) => t === "stripe")
    let googleAmountt = paymentType.find((t: any) => t === "google")
    let paymentInfo = {
      voucher: voucherPayment,
      cash: cashAmountt == 'cash' ? (total - voucherRedeemAmount).toString() : '',
      stripe: stripAmountt == 'stripe' ? (total - voucherRedeemAmount).toString() : '',
      google: googleAmountt == 'google' ? (total - voucherRedeemAmount).toString() : '',
    }

    console.log("apptServices::: ", apptServices)
    console.log("apptServices:::  appointmentSource", appointmentSource)
    const handleClick = (e: any) => {
        e.preventDefault();
        setLoading(true)
        const add_sale_data = {
          ...saleData,
          payment_info: paymentInfo,
          total_amount: totalAmount.toString(),
          payment_type: paymentType,
          sub_total: unitPriceSubtotal.toString(),
          discount: cartDiscount ? cartDiscount.toString() : '',
          client_id: guests.length > 0 ? (guests[0].user_id ? +guests[0].user_id : +guests[0].id) : 0,
          note: ""
        }
        const update_sale_data = {
          ...saleData,
          id: saleID,
          payment_info: paymentInfo,
          total_amount: totalAmount.toString(),
          payment_type: paymentType,
          sub_total: unitPriceSubtotal.toString(),
          discount: cartDiscount ? cartDiscount.toString() : '',
          client_id: guests.length > 0 ? (guests[0].user_id ? +guests[0].user_id : +guests[0].id) : 0,
          note: ""
        }
        if (products || services || vouchers) {
          
            if ( apptServices.length > 0 && appointmentSource.online == 1) {
                updateSale({
                  variables: update_sale_data
                }).then(({ data }) => {
                    console.log("payment data",data);
                    if(data?.updateSale?.status === 1){
                        if (data?.updateSale?.payment_url != "") {
                            setPaymentUrl(data?.updateSale?.payment_url)
                            setInvoiceNo(data?.updateSale?.sale_id)
                            setAppointId(data?.updateSale?.appt_id)
                            setLoading(false)
                            handleShowStripe();
    
                        } else {
                          showToast("Sale Completed", 'success');
                          setLoading(false)
                          history.push(`/invoice/${data?.updateSale?.sale_id}`);
                        }
                      
                    }else if(data?.updateSale?.status === 0){
                      showToast(data?.updateSale?.message, 'warning');
                      setLoading(false);
                      system_log({
                        variables: {
                          ...systemLogPayload,
                          api: UPDATE_SALE_STRING,
                          type: 'sale-update-error',
                          body: JSON.stringify(update_sale_data),
                          response: JSON.stringify(data?.updateSale),
                          exception: JSON.stringify(data?.updateSale?.message),
                          user: userData.id ?? '',
                        },
                      })
                    }
                   

                })
            } 
            else {
                addSale({
                    variables: add_sale_data
                }).then(({ data }) => {
                    console.log("payment data",data);
                  if (data?.addSale?.status === 0){
                    showToast(data?.addSale?.message, 'error');
                    setLoading(false);
                    system_log({
                      variables: {
                        ...systemLogPayload,
                        api: ADD_SALE_STRING,
                        type: 'sale-add-error',
                        body: JSON.stringify(add_sale_data),
                        response: JSON.stringify(data?.addSale),
                        exception: JSON.stringify(data?.addSale?.message),
                        user: userData.id ?? '',
                      },
                    })
                  }
                  if (data?.addSale?.status === 1){
                    if (data?.addSale?.payment_url != "") {
                      setPaymentUrl(data?.addSale?.payment_url)
                      setInvoiceNo(data?.addSale?.sale_id)
                      setAppointId(data?.updateSale?.appt_id)
                      setLoading(false)
                      handleShowStripe();
                    } else {
                      showToast('Sale Completed', 'success');
                      setLoading(false)
                      history.push(`/invoice/${data?.addSale?.sale_id}`);
                    }
                  }

                })
            }
        }
    }

    const getVoucherRedeemAmount = (amount: number) => {
        if (amount && amount < total) {
            setPaymentType([...paymentType, "voucher"])
            setVoucherRedeemAmount(amount)
        } else if (amount && amount > total) {
            setPaymentType([...paymentType, "voucher"])
            setVoucherRedeemAmount(total)
            setShowPayAdd(true)
        } else if (amount && amount == total) {
            setPaymentType([...paymentType, "voucher"])
            setVoucherRedeemAmount(amount)
            setShowPayAdd(true)
            setIsDiscount(true)
        }
        console.log("amount", amount)
    }

    const getVoucherCode = (code: string) => {
        if (code) {
            setVoucherCode(code)
            console.log("code", code)
        }
    }

    const cashPayment = () => {
        setCashAmount(total - voucherRedeemAmount)
        setShowPayAdd(true);
        setPaymentType([...paymentType, "cash"])
        setIsDiscount(true)
    }

    const stripePayment = () => {
        setOtherAmount(total - voucherRedeemAmount)
        setShowPayAdd(true);
        setPaymentType([...paymentType, "stripe"])
        console.log("stripe pay:", paymentType)
        setIsDiscount(true)
    }
    const googlePayment = () => {
        setGoogleAmount(total - voucherRedeemAmount)
        setShowPayAdd(true);
        setPaymentType([...paymentType, "google"])
        console.log("google pay:", paymentType)
        setIsDiscount(true)
    }

    useEffect(() => {
        return () => {
            clearContext()
        }
    }, [])
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    console.log("🚀 ~ parseData:", parseData)
    const countryName = parseData?.business_info?.country;

    const guestUpdate = (guestId: any, overwriteObject: any) => {
        // console.log('overwriteObject/////',overwriteObject)
        guestProfileUpdate({
            variables: {
                id: guestId,
                first_name: overwriteObject.first_name,
                last_name: overwriteObject.last_name,
                email: overwriteObject.email,
                mobile: overwriteObject.mobile,
                dob: overwriteObject.dob,
                gender: overwriteObject.gender,
                address: overwriteObject.address,
                additional_mobile: overwriteObject.additional_mobile,
                client_source: overwriteObject.client_source,
                display_booking: overwriteObject.display_booking,
                client_info: overwriteObject.client_info,
                email_notification: overwriteObject.email_notification,
                marketing_notification: overwriteObject.marketing_notification,
                language: "",
                photo: "",
                suite: "",
                country: "",
                eir_code: "",
            }
        }).then(({ data }) => {
            setLoading(false)
            if (data.guestProfileUpdate.status === 1) {
              console.log(data?.guestProfileUpdate?.data)
              // guestId(data.guestProfileUpdate?.data)
              setShowCdetails(true)
              addGuests(data?.guestProfileUpdate?.data,'add');
              showToast(data.guestProfileUpdate.message, 'success');
              setIsOverwrite(!isOverwrite)
            }
            if (data.guestProfileUpdate.status === 0) {
              showToast(data.guestProfileUpdate.message, 'error');
            }
        }).catch((e) => {
          showToast("Something went wrong!!!", 'error');
          setLoading(false)
        })
    }
    useEffect(() => {
        if (overwrite === 1) {
            guestUpdate(detailClient?.id, overwriteObject);
        }
        if (overwrite === 2) {
            setIsOverwrite(!isOverwrite)
            // history.push('/guests')
        }
    }, [overwrite])
    return (
      <>
        {apptServices.length > 0 ||
        products.length > 0 ||
        vouchers.length > 0 ||
        services.length > 0 ? (
          <section className='empty-sales ptc'>
            <div className='toolbar'>
              <Link className='close-btn' to='/calendar'>
                <i className='fas fa-times'></i>
              </Link>
              <h2 className='page-title mb-0'>Checkout</h2>
              <div></div>
            </div>
            {/* begin::Row */}
            <Form>
              <div>
                <div className='row'>
                  <div className='col-sm-8'>
                    <Card className='primary-bx-shadow'>
                      {products &&
                        products.length > 0 &&
                        products.map((product: any) => (
                          <>
                            <div className='checkout-item' key={product.id}>
                              <div className='checkout-item-inner'>
                                <i
                                  className='close-window fa fa-times'
                                  onClick={() => removeProducts(product)}
                                  style={{cursor: 'pointer'}}
                                ></i>
                                <div className='add-price-tool checkout-tool d-flex justify-content-between'>
                                  <div className='left-info'>
                                    <div className='d-flex align-items-center'>
                                      <h3 className='me-3'>{product?.quantity}</h3>
                                      <h3 className=''>{product?.name}</h3>
                                    </div>
                                    <p className='mb-0 text-muted'>{`${
                                      product?.category_info?.name
                                    } ${
                                      product?.track_stock_qty
                                        ? product?.stock_qty > 0
                                          ? `/ ${product?.stock_qty} in stock`
                                          : '/ Out of stock'
                                        : ''
                                    }`}</p>
                                  </div>

                                  <div className='d-flex align-items-center'>
                                    <h3 className='mb-0'>{`${currency(countryName)}${
                                      product.total_price
                                    }`}</h3>
                                  </div>
                                </div>
                                <Row className='pricing-option-row'>
                                  <Form.Group as={Col} md={2} className='' controlId='pricing-name'>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                      name='quantity'
                                      autoComplete='off'
                                      min='1'
                                      max={product?.track_stock_qty && product?.stock_qty}
                                      value={product?.quantity}
                                      onChange={(e) => handleProductQtyUpdate(e, product.id)}
                                      type='number'
                                    />
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={4}
                                    className='price'
                                    controlId='formGridPrice'
                                  >
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className='Price'>
                                      <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                                      <FormControl
                                        placeholder='0.00'
                                        readOnly
                                        value={
                                          product?.special_price
                                            ? product?.special_price
                                            : product?.retail_price
                                        }
                                        type='text'
                                      />
                                    </InputGroup>
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={6}
                                    className=''
                                    controlId='formGridDuration'
                                  >
                                    <Form.Label>Staff</Form.Label>
                                    <Form.Select
                                      aria-label='Default select example'
                                      onChange={(e) => ProductStaffUpdate(e, product.id)}
                                    >
                                      <option value='' disabled selected>
                                        staff select
                                      </option>
                                      {allstaffs.map((staff) => (
                                        <option
                                          key={staff.id}
                                          value={staff.id}
                                          selected={staff.id == product.staff}
                                        >
                                          {staff.name}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                  {/* <Form.Group as={Col} md={3} className="" controlId="formGridPriceType">
                                                                <Form.Label>Discount</Form.Label>
                                                                <Form.Select aria-label="Default select example">
                                                                    <option value="No Discount">No Discount</option>
                                                                    <option value="€450">€450</option>
                                                                    <option value="€50" selected>€50</option>
                                                                </Form.Select>
                                                            </Form.Group> */}
                                </Row>
                              </div>
                            </div>
                          </>
                        ))}
                      {services &&
                        services.length > 0 &&
                        services.map((service: any) => (
                          <>
                            <div className='checkout-item' key={service.id}>
                              <div className='checkout-item-inner'>
                                <i
                                  className='close-window fa fa-times'
                                  onClick={() => removeServices(service)}
                                  style={{cursor: 'pointer'}}
                                ></i>
                                <div className='add-price-tool checkout-tool d-flex justify-content-between'>
                                  <div className='left-info'>
                                    <div className='d-flex align-items-center'>
                                      <h3 className='me-3'>
                                        {service.quantity ? service.quantity : '1'}
                                      </h3>
                                      <h3 className=''>
                                        {service?.service_name} {service?.pricing_name}
                                      </h3>
                                    </div>
                                    <p className='mb-0 text-muted'>
                                      {`${service.duration}
                                        min with ${
                                          service?.staff != undefined
                                            ? allstaffs?.find((s) => s.id == service.staff)?.name
                                            : ''
                                        }`}{' '}
                                    </p>
                                  </div>

                                  <div className='d-flex align-items-center'>
                                    <h3 className='mb-0'>
                                      {currency(countryName)}
                                      {service?.special_price
                                        ? service.special_price
                                        : service?.price}
                                    </h3>
                                  </div>
                                </div>
                                <Row className='pricing-option-row'>
                                  <Form.Group as={Col} md={2} className='' controlId='pricing-name'>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                      value={service?.quantity ? service?.quantity : 1}
                                      readOnly
                                      type='text'
                                      placeholder='1'
                                    />
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={4}
                                    className='price'
                                    controlId='formGridPrice'
                                  >
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className='Price'>
                                      <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                                      <FormControl
                                        value={
                                          service?.special_price
                                            ? service.special_price
                                            : service?.price
                                        }
                                        readOnly
                                        placeholder='0.00'
                                        type='text'
                                      />
                                    </InputGroup>
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={6}
                                    className=''
                                    controlId='formGridDuration'
                                  >
                                    <Form.Label>Staff</Form.Label>
                                    <Form.Select
                                      aria-label='Default select example'
                                      onChange={(e) => serviceStaffUpdate(e, service.id)}
                                    >
                                      <option value='' disabled selected>
                                        staff select
                                      </option>
                                      {allstaffs &&
                                        allstaffs.length > 0 &&
                                        allstaffs.map((staff) => (
                                          <option
                                            key={staff.id}
                                            value={staff.id}
                                            selected={staff.id == service.staff}
                                          >
                                            {staff.name}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Row>
                                {service.id &&
                                service.staff &&
                                service.staffs.includes(service.staff) ? (
                                  <span className='text-danger'>
                                    this staff doesn't provide this service, but you still book
                                    appointments for them.
                                  </span>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </>
                        ))}
                      {apptServices &&
                        apptServices.length > 0 &&
                        apptServices.map((service: any) => (
                          <>
                            <div className='checkout-item' key={service.ser_pricing_id}>
                              <div className='checkout-item-inner'>
                                <i
                                  className='close-window fa fa-times'
                                  onClick={() => removeApptServices(service)}
                                  style={{cursor: 'pointer'}}
                                ></i>
                                <div className='add-price-tool checkout-tool d-flex justify-content-between'>
                                  <div className='left-info'>
                                    <div className='d-flex align-items-center'>
                                      <h3 className='me-3'>{service.quantity}</h3>
                                      <h3 className=''>
                                        {service?.service_name
                                          ? service?.service_name
                                          : service?.service_pricing?.service_name}
                                      </h3>
                                    </div>
                                    <p className='mb-0 text-muted'>
                                      {`${service.duration}
                                        min with ${
                                          service?.staff_id != ''
                                            ? allstaffs?.find((s) => s.id == service.staff_id)?.name
                                            : ''
                                        }`}{' '}
                                    </p>
                                  </div>

                                  <div className='d-flex align-items-center'>
                                    <h3 className='mb-0'>
                                      {service?.special_price
                                        ? service?.special_price
                                        : service?.price}{' '}
                                      {currency(countryName)}
                                    </h3>
                                  </div>
                                </div>
                                <Row className='pricing-option-row'>
                                  <Form.Group as={Col} md={2} className='' controlId='pricing-name'>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                      value={service?.quantity}
                                      readOnly
                                      type='text'
                                      placeholder='1'
                                    />
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={4}
                                    className='price'
                                    controlId='formGridPrice'
                                  >
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className='Price'>
                                      <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                                      <FormControl
                                        value={
                                          service?.special_price
                                            ? service?.special_price
                                            : service?.price
                                        }
                                        readOnly
                                        placeholder='0.00'
                                        type='text'
                                      />
                                    </InputGroup>
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={6}
                                    className=''
                                    controlId='formGridDuration'
                                  >
                                    <Form.Label>Staff</Form.Label>
                                    <Form.Select
                                      aria-label='Default select example'
                                      onChange={(e) =>
                                        apptServiceStaffUpdate(e, service.ser_pricing_id)
                                      }
                                    >
                                      <option value='' disabled selected>
                                        staff select
                                      </option>
                                      {allstaffs &&
                                        allstaffs.length > 0 &&
                                        allstaffs.map((staff) => (
                                          <option
                                            key={staff.id}
                                            value={staff.id}
                                            selected={staff.id == service.staff_id}
                                          >
                                            {staff.name}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Row>
                                {service.staffs &&
                                service.staff_id != '' &&
                                service.staffs.includes(service.staff_id) ? (
                                  <span className='text-danger'>
                                    this staff doesn't provide this service, but you still book
                                    appointments for them.
                                  </span>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </>
                        ))}
                      {vouchers &&
                        vouchers.length > 0 &&
                        vouchers.map((voucher: any) => (
                          <>
                            <div className='checkout-item' key={voucher.id}>
                              <div className='checkout-item-inner'>
                                <i
                                  className='close-window fa fa-times'
                                  onClick={() => removeVouchers(voucher)}
                                  style={{cursor: 'pointer'}}
                                ></i>
                                <div className='add-price-tool checkout-tool d-flex justify-content-between'>
                                  <div className='left-info'>
                                    <div className='d-flex align-items-center'>
                                      <h3 className='me-3'>{voucher?.quantity}</h3>
                                      <h3 className=''>{`${currency(countryName)}${
                                        voucher.value
                                      } - ${voucher?.name}`}</h3>
                                    </div>
                                    <p className='mb-0 text-muted'>
                                      {voucher?.services_included.map(
                                        (service: any) => service.label + ' | '
                                      )}
                                    </p>
                                  </div>

                                  <div className='d-flex align-items-center'>
                                    <h3 className='mb-0'>
                                      {currency(countryName)}
                                      {voucher?.total_price}
                                    </h3>
                                  </div>
                                </div>
                                <Row className='pricing-option-row'>
                                  <Form.Group as={Col} md={2} className='' controlId='pricing-name'>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                      defaultValue={voucher?.quantity}
                                      max={
                                        voucher.limit_number_of_sales_enable &&
                                        voucher.limit_number_of_sales - voucher?.total_sale
                                      }
                                      onChange={(e) => handleVoucherQtyUpdate(e, voucher.id)}
                                      type='number'
                                      autoComplete='off'
                                      min='1'
                                    />
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={4}
                                    className='price'
                                    controlId='formGridPrice'
                                  >
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className='Price'>
                                      <InputGroup.Text>{currency(countryName)}</InputGroup.Text>
                                      <FormControl
                                        value={voucher?.retail}
                                        readOnly
                                        placeholder='0.00'
                                        type='text'
                                      />
                                    </InputGroup>
                                  </Form.Group>

                                  <Form.Group
                                    as={Col}
                                    md={6}
                                    className=''
                                    controlId='formGridDuration'
                                  >
                                    <Form.Label>Staff</Form.Label>
                                    <Form.Select
                                      aria-label='Default select example'
                                      onChange={(e) => VoucherStaffUpdate(e, voucher.id)}
                                    >
                                      <option value='' disabled selected>
                                        staff select
                                      </option>
                                      {allstaffs.map((staff) => (
                                        <option
                                          key={staff.id}
                                          value={staff.id}
                                          selected={staff.id == voucher.staff}
                                        >
                                          {staff.name}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Row>
                              </div>
                            </div>
                          </>
                        ))}
                      <div className='total-price-wrap'>
                        <Row className='total-price'>
                          <Form.Group as={Col} md={5}>
                            <div className='add-pricing-btn-wrap ps-0'>
                              <button
                                onClick={handleShowSale}
                                type='button'
                                className='add-price-btn btn btn-light d-flex align-items-center'
                              >
                                <i className='fa fa-plus-circle'></i>
                                <span>Add another item</span>
                              </button>
                              <Test getBarcode={getBarcode} />
                              <CreateSaleModal handleClose={handleCloseSale} show={showSale} />
                            </div>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md={7}
                            className='checkout-price'
                            controlId='total-price'
                          >
                            <div className='final-amount '>
                              {/* <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <h3 className="mb-0">Sub Total</h3>
                                                            <h3 className="mb-0">€{subTotal ? subTotal : 0}</h3>
                                                        </div> */}

                              {voucherRedeemAmount > 0 ? (
                                <div>
                                  <div className='d-flex align-items-center justify-content-between badge badge-success'>
                                    <p className='mb-0'>Voucher ({voucherCode})</p>
                                    <p className='mb-0'>
                                      {currency(countryName)}
                                      {voucherRedeemAmount}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                ''
                              )}
                              {cashAmount > 0 ? (
                                <div>
                                  <div className='d-flex align-items-center justify-content-between badge badge-primary'>
                                    <p className='mb-0'>Cash</p>
                                    <p className='mb-0'>
                                      {currency(countryName)}
                                      {cashAmount}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                ''
                              )}
                              {otherAmount > 0 ? (
                                <div>
                                  <div className='d-flex align-items-center justify-content-between badge badge-secondary'>
                                    <p className='mb-0'>Stripe </p>
                                    <p className='mb-0'>
                                      {currency(countryName)}
                                      {otherAmount}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                ''
                              )}
                              {googleAmount > 0 ? (
                                <div>
                                  <div className='d-flex align-items-center justify-content-between badge badge-secondary'>
                                    <p className='mb-0'>Google </p>
                                    <p className='mb-0'>
                                      {currency(countryName)}
                                      {googleAmount}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                ''
                              )}
                              <div className='d-flex align-items-center justify-content-between mb-2'>
                                <h3 className='mb-0'>Total</h3>
                                <h3 className='mb-0'>
                                  {currency(countryName)}
                                  {subTotal ? subTotal : 0}
                                </h3>
                              </div>
                              {upFrontAmount > 0 && (
                                <div className='d-flex align-items-center justify-content-between mb-2'>
                                  <h3 className='mb-0'>Partially Paid</h3>
                                  <h3 className='mb-0'>
                                    {currency(countryName)}
                                    {upFrontAmount}
                                  </h3>
                                </div>
                              )}

                              {upFrontAmount > 0 && (
                                <div className='d-flex align-items-center justify-content-between mb-2'>
                                  <h3 className='mb-0'>Payable Amount</h3>
                                  <h3 className='mb-0'>
                                    {currency(countryName)}
                                    {payTotal.toFixed(2)}
                                  </h3>
                                </div>
                              )}

                              <div className='mb-3 discount_wrapper'>
                                <Form.Control
                                  type='text'
                                  placeholder='Enter Discount Value'
                                  disabled={isDiscount}
                                  name='cartDiscount'
                                  value={cartDiscount}
                                  onChange={(e: any) => {
                                    handleCartDiscount(e)
                                  }}
                                  onKeyDown={(event: any) => {
                                    if (
                                      event.key !== 'Backspace' &&
                                      !/^[0-9]*\.?[0-9]*$/.test(event.key)
                                    ) {
                                      event.preventDefault()
                                    }
                                  }}
                                />
                                <button
                                  type='button'
                                  id='kt_sign_in_submit'
                                  className='submit-btn save-btn'
                                  onClick={handleCartDiscountCalculation}
                                >
                                  Apply Discount
                                </button>
                              </div>
                            </div>
                          </Form.Group>
                        </Row>
                      </div>
                    </Card>
                  </div>

                  <div className='col-sm-4'>
                    <Card className='primary-bx-shadow checkout-right-wrap'>
                      {showPayAdd ? (
                        // Payment Add starts
                        <div className='payment-confirmation'>
                          <div className='payment-confirm-heading border-b'>
                            {guests.length >= 0 ? (
                              guests.map((guest) => {
                                return (
                                  <div className='d-flex align-items-center'>
                                    <div className='staff-profile-symbol me-4'>
                                      <span>
                                        {guest?.first_name?.slice(0, 1)}
                                        {guest?.last_name?.slice(0, 1)}
                                      </span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                      <a href='#' className='text-dark fs-6 fw-bolder'>
                                        {guest?.first_name} {guest?.last_name}
                                      </a>
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <div className='d-flex align-items-center'>
                                <div className='symbol symbol-50px me-5'>
                                  <span className='symbol-label bg-light-info'>
                                    <i className='fas fa-walking fa-2x'></i>
                                  </span>
                                </div>
                                <div className='d-flex flex-column'>
                                  <a href='#' className='text-dark fs-6 fw-bolder'>
                                    Walk-In
                                  </a>
                                </div>
                              </div>
                            )}
                            {/* end::Item */}
                          </div>
                          <div className='pay-confirm-body'>
                            <div className='pay-status'>
                              <i className='fas fa-file-invoice-dollar fa-3x'></i>
                              <p>Full payment has been added</p>
                            </div>
                            <div className='pay-confirm-btn'>
                              <button
                                type='submit'
                                id='kt_sign_in_submit'
                                className='btn btn-lg btn-primary w-100 mb-5'
                                disabled={loading}
                                onClick={handleClick}
                              >
                                {!loading && <span className='indicator-label'>Complete Sale</span>}
                                {loading && (
                                  <span className='indicator-progress' style={{display: 'block'}}>
                                    Please wait...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                  </span>
                                )}
                              </button>
                              <div
                                onClick={handleClickPBack}
                                className='d-flex align-items-center justify-content-center btn2'
                              >
                                <i className='fas fa-angle-left me-2'></i>
                                <h4 className='mb-0 text-dark'>Back to Payments</h4>
                              </div>
                            </div>
                          </div>
                          <div></div>
                        </div>
                      ) : (
                        // Payment Add ends
                        <div>
                          <div className='checkout-right'>
                            {groupInfo.group_type == 'repeated' ? null : (
                              <div className='appn-right-heading border-b'>
                                <div className='sale-s-wrap'>
                                  <i className='fas fa-search'></i>
                                  <input
                                    autoComplete='off'
                                    onClick={(e) => {
                                      setShowClients(true)
                                    }}
                                    onChange={(e) => handleSearch(e)}
                                    type='text'
                                    name='search'
                                    className='sale-search'
                                    placeholder='Search guest here'
                                  />
                                </div>
                              </div>
                            )}
                            {groupInfo.is_group && (
                              <div
                                className={`d-flex align-items-center justify-content-center m-2 ${
                                  groupInfo.total_booked == groupInfo.client_per_class &&
                                  'text-danger'
                                }`}
                              >
                                {/* Spaces Remaining {groupInfo.total_booked + guests?.length} of {groupInfo.client_per_class} */}
                                Spaces Remaining {groupInfo.client_per_class - guests?.length} of{' '}
                                {groupInfo.client_per_class}
                              </div>
                            )}
                            {showClients || guests.length > 0 ? (
                              <div>
                                {showCdetails && guests.length > 0 ? (
                                  <div>
                                    <div>
                                      {guests.map((guest: IBuyerGuest, index: number) => {
                                        return (
                                          <div
                                            key={index}
                                            className='select-single-item text-dark border-0 py-2'
                                          >
                                            <div className='d-flex align-items-center'>
                                              <div className='staff-profile-symbol me-4'>
                                                <span>
                                                  {guest?.first_name?.slice(0, 1)}
                                                  {guest?.last_name?.slice(0, 1)}
                                                </span>
                                              </div>
                                              <div>
                                                <div className='d-flex align-items-center'>
                                                  <h5 className='staff-name mb-1 me-3'>{`${guest?.first_name} ${guest?.last_name}`}</h5>
                                                  <div>
                                                    {groupInfo.group_type == 'repeated' ? null : (
                                                      <div className='complete-sale-btn text-center'>
                                                        <i
                                                          className='fas fa-minus-circle'
                                                          onClick={() => {
                                                            handleClickCdetailsBack(
                                                              guest,
                                                              guests.length
                                                            )
                                                          }}
                                                        ></i>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <span className='text-muted d-block'>
                                                  {guest?.email}
                                                </span>
                                                <span className='text-muted d-block'>
                                                  {guest?.mobile}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })}
                                      {/* <div className="client-details-status">
                                            <span className={`badge badge-secondary fw-bolder me-auto px-2 py-1`}>
                                                New Guest
                                            </span>
                                            <div>
                                                <p className="mb-0">Guest note</p>
                                            </div>
                                        </div> */}
                                      {/* <div className="Client-details-body">
                                          <div className="client-d-heading d-flex align-items-center justify-content-between">
                                              <div className="counter text-center">
                                                  <h3 className="mb-0 fw-bolder">1</h3>
                                                  <span className="text-muted">Total Bookings</span>
                                              </div>
                                              <div className="amount text-center">
                                                  <h3 className="mb-0 fw-bolder">EUR 0</h3>
                                                  <span className="text-muted">Total Sales</span>
                                              </div>
                                          </div>
                                      </div> */}
                                    </div>
                                    <div>
                                      <div className='checkout-right-body'>
                                        <div className='pay-amount'>
                                          <h6>Pay</h6>
                                          <div className='pay-box'>
                                            {/* <h2 className='symbol-label bg-light-warning'>
                                                {currency(countryName)}{total ? total.toFixed(2) - voucherRedeemAmount : `00.00`}
                                               </h2> 
                                              */}
                                            <h2 className='symbol-label bg-light-warning'>
                                              {currency(countryName)}
                                              {totalPriceWithoutVoucherAmount
                                                ? totalPriceWithoutVoucherAmount.toFixed(2)
                                                : payTotal
                                                ? payTotal
                                                : `00.00`}
                                            </h2>
                                          </div>
                                        </div>
                                        <div className='pay-btn-wrap'>
                                          {/* cash pay */}
                                          <button
                                            onClick={cashPayment}
                                            type='submit'
                                            className='submit-btn btn-sm'
                                          >
                                            Cash
                                          </button>
                                          {/* <button onClick={otherPayment} type="submit" className="submit-btn btn-sm">Other</button> */}
                                          {/* voucher pay */}
                                          <Link
                                            to='#'
                                            onClick={handleShowReedemVoucher}
                                            type='submit'
                                            className='submit-btn btn-sm'
                                          >
                                            Voucher
                                          </Link>
                                          {/* stripe pay */}
                                          <Link
                                            to='#'
                                            onClick={stripePayment}
                                            type='submit'
                                            className='submit-btn btn-sm'
                                          >
                                            Stripe
                                          </Link>
                                          {/* google pay */}
                                          <Link
                                            to='#'
                                            onClick={googlePayment}
                                            type='submit'
                                            className='submit-btn btn-sm'
                                          >
                                            Google Pay
                                          </Link>
                                        </div>
                                      </div>
                                      {/* <div className="checkout-right-footer">
                                          <div className="complete-sale-btn text-center">
                                              <DropdownButton className="checkout-more-option" id="dropdown-basic-button" title="More Options">
                                                  <Dropdown.Item >Save Unpaid</Dropdown.Item>
                                                  <Dropdown.Item onClick={handleShowInvDetails} >Invoice Details</Dropdown.Item>
                                              </DropdownButton>
                                              <InvoiceDetailsModal handleCloseInvDetails={handleCloseInvDetails} showInvDetails={showInvDetails} />
                                          </div>
                                      </div> */}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className='client-list-wrapper'>
                                      {/* Client list starts */}
                                      <div className='sale-category-title d-flex align-items-center justify-content-between'>
                                        <div onClick={handleClickCBack} className='back-icon'>
                                          <img
                                            src={toAbsoluteUrl('/media/logos/colourLeft.png')}
                                            alt='image'
                                          />
                                        </div>
                                          <span className='ms-2'>
                                            Click Arrows for "Walk-In" payment
                                          </span>
                                        {/* <div>
                                          <div
                                            onClick={handleShowCreateClient}
                                            className='btn btn-sm btn-light'
                                          >
                                            Create Guest
                                          </div>
                                        </div> */}
                                        <CreateClientModal
                                          handleCloseCreateClient={handleCloseCreateClient}
                                          guestId={guestId}
                                          show={showCreateClient}
                                          setIsOverwrite={setIsOverwrite}
                                          setOverwriteObject={setOverwriteObject}
                                        />
                                        <div></div>
                                      </div>
                                      <GuestList
                                        clients={clients}
                                        groupInfo={groupInfo}
                                        handleClientsDetailView={handleClientsDetailView}
                                        setShowCdetails={setShowCdetails}
                                      />
                                      {/* Client list starts ends */}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <div className='checkout-right-body'>
                                  <div className='pay-amount'>
                                    <h6>Pay</h6>
                                    <div className='pay-box'>
                                      {/* <h2 className='symbol-label bg-light-warning'>
                                            {currency(countryName)}{total ? total - voucherRedeemAmount : `00.00`}
                                        </h2> */}
                                      <h2 className='symbol-label bg-light-warning'>
                                        {currency(countryName)}
                                        {totalPriceWithoutVoucherAmount
                                          ? totalPriceWithoutVoucherAmount.toFixed(2)
                                          : payTotal
                                          ? payTotal
                                          : `00.00`}
                                      </h2>
                                    </div>
                                  </div>
                                  <div className='pay-btn-wrap'>
                                    {/* cash */}
                                    <button
                                      onClick={cashPayment}
                                      type='submit'
                                      className='submit-btn me-2 btn-sm'
                                    >
                                      Cash
                                    </button>
                                    {/* voucher */}
                                    <Link
                                      to='#'
                                      onClick={handleShowReedemVoucher}
                                      type='submit'
                                      className='submit-btn btn-sm'
                                    >
                                      Voucher
                                    </Link>
                                    {/* stripe */}
                                    <Link
                                      to='#'
                                      onClick={stripePayment}
                                      type='submit'
                                      className='submit-btn btn-sm'
                                    >
                                      Stripe
                                    </Link>
                                    {/* google */}
                                    <Link
                                      to='#'
                                      onClick={googlePayment}
                                      type='submit'
                                      className='submit-btn btn-sm'
                                    >
                                      Google Pay
                                    </Link>
                                  </div>
                                </div>
                                {/* <div className="checkout-right-footer">
                                    <div className="complete-sale-btn text-center">
                                        <DropdownButton className="checkout-more-option" id="dropdown-basic-button" title="More Options">
                                            <Dropdown.Item >Save Unpaid</Dropdown.Item>
                                            <Dropdown.Item onClick={handleShowInvDetails} >Invoice Details</Dropdown.Item>
                                        </DropdownButton>
                                        <InvoiceDetailsModal handleCloseInvDetails={handleCloseInvDetails} showInvDetails={showInvDetails} />
                                    </div>
                                </div> */}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <RedeemVoucherModal
                        saleService={voucherCheck}
                        saleID={saleID}
                        totalAmount={totalAmount}
                        discount={cartDiscount || 0}
                        getVoucherCode={getVoucherCode}
                        getVoucherRedeemAmount={getVoucherRedeemAmount}
                        handleCloseReedemVoucher={handleCloseReedemVoucher}
                        showReedemVoucher={showReedemVoucher}
                      />
                      <StripePayment
                        handleCloseStripe={handleCloseStripe}
                        showStripe={showStripe}
                        paymentUrl={paymentUrl}
                        invoiceNo={invoiceNo}
                        appointId={appointId}
                      />
                    </Card>
                  </div>
                </div>
              </div>
            </Form>
            {/* end::Row */}
          </section>
        ) : (
          <div className='row g-5 g-xl-8'>
            <div className='col-xl-12'>
              <div className='container empty-paid-plans-container'>
                <div className='empty-content d-flex align-items-center'>
                  <div className='empty-content-inner'>
                    <img
                      className='empty-cart-icon'
                      src={toAbsoluteUrl('/media/Chairs/empty-cart.png')}
                      alt='icon'
                    />
                    <span className='text-muted'>
                      Your basket is empty. You haven't added any items yet
                    </span>
                    <button
                      onClick={handleShowSale}
                      className='submit-btn'
                      // data-bs-toggle='modal'
                      // data-bs-target='#modal_sale_add'
                      // id='kt_toolbar_primary_button'
                    >
                      Let's sale
                    </button>
                    <Test getBarcode={getBarcode} />
                  </div>
                  <CreateSaleModal handleClose={handleCloseSale} show={showSale} />
                </div>
              </div>
            </div>
          </div>
        )}
        <Modal
          dialogClassName='modal-90w'
          show={isOverwrite}
          onHide={!isOverwrite}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header className='' closeButton></Modal.Header>
          <Modal.Body>
            <p>This guest already exists. You want to overwrite it or keep it.</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => {
                setOverwrite(1)
              }}
              className='primaryBtn btn btn-success d-flex'
            >
              Overwrite
            </button>
            <button
              onClick={() => {
                setOverwrite(2)
              }}
              className='primaryBtn btn btn-info d-flex'
            >
              Keep it
            </button>
            {/* <Button className="category-save-btn "></Button> */}
            {/* <Button className="category-save-btn "></Button> */}
          </Modal.Footer>
        </Modal>
      </>
    )
}

export { SaleAddCheckOut }