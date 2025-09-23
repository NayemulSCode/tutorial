import { useIntl } from "react-intl"
import React, { FC, useContext, useEffect, useState } from "react"
import { Link, useHistory } from 'react-router-dom'
import { PageTitle } from "../../../_metronic/layout/core"
import { useMutation, useQuery } from "@apollo/client"
import { ALL_VOUCHERS } from "../../../gql/Query"
import { IVoucher } from "../../../types"
import { VOUCHER_DELETE } from "../../../gql/Mutation"
import { useSnackbar } from 'notistack';
import { ShowServices } from "./components/ShowServices"
import ModalWidgets from "../../modules/widgets/components/ModalWidgets"
import { AppContext } from "../../../context/Context"

const VouchersWrapper: FC = () => {
    document.title = "Vouchers";
    const {addVideoItem} = useContext(AppContext)
    const history = useHistory()
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(6);
    const [visible, setVisible] = useState(20);
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl()
    const [vouchers, setVouchers] = useState<IVoucher[]>([])
    const [deleteID, setDeleteID] = useState("")

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const confirmation = (status: any) => {
        if (status === 0) {
            // console.log(status);
        }
        if (status === 1) {
            HandleDeleteVoucher(deleteID)
        }
    }
    const LoadMoreList = () => {
        setCount(count + 4)
    }

    const { data: voucherData, error: voucherError, loading: vourcherLoading, refetch } = useQuery(ALL_VOUCHERS, {
        variables: {
            type: "",
            count: count,
            page: 1
        }
    })
    const [deleteVoucher] = useMutation(VOUCHER_DELETE, {
        refetchQueries: [{ query: ALL_VOUCHERS, variables: { type: "", count: 4, page: 1 } }],
        awaitRefetchQueries: true
    })

    const HandleDeleteVoucher = (id: string) => {
        if (id) {
            deleteVoucher({
                variables: {
                    id: id
                }
            }).then(({ data }) => {
                if (data.deleteVoucher.status === 1) {
                    if (data.deleteVoucher.message) {
                        enqueueSnackbar(data.deleteVoucher.message, {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            transitionDuration: {
                                enter: 300,
                                exit: 500
                            }
                        });
                    }
                }
            })
        }
    }
    useEffect(() => {
        if (voucherData) {
            refetch()
            setVouchers(voucherData.vouchers?.data)
            setPaginate(voucherData.vouchers?.paginatorInfo)
            setLoading(false)
        }
        if (vourcherLoading) {
            setVouchers([])
            setLoading(true)
        }
    }, [voucherData, vourcherLoading]);
    const userData: any = localStorage.getItem("partner");
    const parseData = JSON.parse(userData);
    const countryName = parseData?.business_info?.country;
    const currency = (countryName: any) => {
        if (countryName === 'ireland') {
            return "€";
        }
        if (countryName === 'uk') {
            return "£";
        }
        if (countryName === 'bangladesh') {
            return "৳";
        }
    }
    const HandleRedirectVideoSection=()=>{
        addVideoItem(3);
        history.push('/setup/how-to')
    }
    return (
      <>
        <div className='voucher-wrap'>
          <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.Vouchers'})}</PageTitle>
          <div className='toolbar'>
            <div className='ms-auto'>
              <Link to='/voucher-add' className='btn secondaryBtn'>
                Create Voucher
              </Link>
              <button
              type="button"
                style={{background: '#ebc11a'}}
                onClick={HandleRedirectVideoSection}
                className='btn btn-sm text-light ms-5'
              >
                How To
              </button>
            </div>
          </div>
          {loading && (
            <div className='text-center d-flex justify-content-center align-items-center'>
              <div className='spinner-grow ' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
              <div className='spinner-grow ' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
              <div className='spinner-grow ' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          )}
          {!loading && vouchers.length <= 0 && (
            <>
              <div className='row g-5 g-xl-8'>
                <div className='col-xl-12'>
                  <div className='container empty-paid-plans-container'>
                    <div className='empty-content d-flex align-items-center'>
                      <div className='empty-content-inner'>
                        <span className='text-muted'>You have no active voucher types.</span>
                        <Link className='submit-btn' to='/voucher-add'>
                          Add Voucher item
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className='ptc'>
            <div className='row'>
              {!loading &&
                vouchers.length > 0 &&
                vouchers.slice(0, visible).map((item: any, index: number) => (
                  <>
                    <div className={`col-xl-6 mb-5 `} key={index}>
                      <div style={{background: `${item.color}`}} className='card voucher p-9'>
                        <div className='v-actions'>
                          <Link to={`/edit-voucher/${item.id}`} className='me-4'>
                            <i className='far fa-edit'></i>
                          </Link>
                          <span
                            onClick={() => {
                              openDeleteModal(item.id)
                            }}
                          >
                            <i className='far fa-trash-alt'></i>
                          </span>
                        </div>
                        <div className='card-body voucher-body'>
                          <div className='voucher-info'>
                            <div className='value'>
                              <p className='v-title'>Voucher value</p>
                              <p className='v-value mb-6'>{`${currency(countryName)}${
                                item.value
                              }`}</p>
                            </div>
                            <div className='earning'>
                              <p className='avg-earning'>{item.name}</p>
                              {item.services_included.length <= 0 ? (
                                <p className='redeem-service'>Redeem on all services</p>
                              ) : (
                                <div className='include-service'>
                                  <ShowServices content={item.services_included} />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='voucher-price-wrap'>
                            <div className='price-inner'>
                              <p className='voucher-price'>{`${currency(countryName)}${
                                item.retail
                              }`}</p>
                              <span className='fw-bold'>
                                Save {(((item.value - item.retail) / item.value) * 100).toFixed()}%
                              </span>
                              <p className='fw-bold'>
                                Sold {item?.total_sale}/{item?.limit_number_of_sales}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              <div className='text-center'>
                {count < paginate.total && (
                  <button className='btn btn-primary text-center' onClick={LoadMoreList}>
                    Load More
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ModalWidgets
          closeDeleteModal={closeDeleteModal}
          deleteModal={deleteModal}
          confirmation={confirmation}
        />
      </>
    )
}

export { VouchersWrapper }