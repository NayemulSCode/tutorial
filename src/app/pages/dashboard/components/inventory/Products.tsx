import React, { FC, useEffect, useState } from "react"
import '../../../../../_metronic/assets/css/custom.css';
// import { TablesWidget9 } from "../../../../../_metronic/partials/widgets";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS, SINGLE_PRODUCT } from "../../../../../gql/Query";
import { PRODUCT_DELETE } from "../../../../../gql/Mutation";
import { IProduct } from "../../../../../types";
import { Card, Table, Button, Dropdown, DropdownButton } from "react-bootstrap-v5";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ModalWidgets from "../../../../modules/widgets/components/ModalWidgets";
import Test from '../calendar/Test';
import { imageUrl } from "../../../../modules/util";

const Products: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productID, setProductID] = useState(0);
    const [loading, setLoading] = useState(false)
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(5);
    const history = useHistory()
    const [barCode, setbarCode] = useState<any>("");
    const { data: productsData, error: productsError, loading: productsLoading, refetch } = useQuery(GET_ALL_PRODUCTS, {
        variables: {
            search: "",
            type: "",
            count: count,
            page: 1
        }
    })

    const [deleteID, setDeleteID] = useState(0)

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const LoadMoreList = () => {
        setCount(count + 5)
    }

    const [deleteProduct] = useMutation(PRODUCT_DELETE, {
        refetchQueries: [{ query: GET_ALL_PRODUCTS, variables: { type: "", search: "", count: count, page: 1 } }],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (productsData) {
            refetch();
            setProducts(productsData.products.data);
            setPaginate(productsData.products?.paginatorInfo)
            setLoading(false);
            // console.log(productsData);
        }
        if (productsLoading) {
            setLoading(true)
        }
        if (productsError) {
            // console.log(productsError)
            setLoading(false);
            setProducts([]);
        }
    }, [productsData, productsLoading])

    const confirmation = (status: any) => {
        if (status === 0) {
            // console.log(status);
        }
        if (status === 1) {
            handleDeleteProduct(deleteID)
        }
    }

    const handleDeleteProduct = (id: number) => {
        if (id) {
            deleteProduct({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("Product deleted successfully", {
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
            }).catch((e) => {
                enqueueSnackbar("Product delete failed", {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    transitionDuration: {
                        enter: 300,
                        exit: 500
                    }
                });
            })
        }
    }

    useEffect(() => {
        if (barCode) {
            // console.log(barCode)
            history.push(`/inventory/product-edit/${barCode}`)
        }
    }, [])

    const handleEditProduct = (id: number) => {
        history.push(`/inventory/product-edit/${id}`)
    }
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
    const [runQuery, { data: singleProduct }] = useLazyQuery(SINGLE_PRODUCT);

    useEffect(() => {
        // console.log(typeof barCode)
        runQuery({
            variables: {
                id: "",
                barcode: barCode,
                root_barcode: ""
            }
        });
    }, [barCode]);

    useEffect(() => {
        if (singleProduct?.product != null) {
            history.push(`/inventory/product-edit/${singleProduct?.product?.id}`)
        }
    }, [singleProduct])
    const getBarcode = (code: any) => {
        setbarCode(code)
    }
    return (
      <>
        <section className='product-list-wrapper ptc'>
          <Test getBarcode={getBarcode} />
          <Card>
            <Card.Body>
              <h3>{paginate.total > 0 ? paginate.total : 'No'} Product(s) available</h3>
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
                  <thead>
                    <tr className='fw-bolder bg-light text-muted'>
                      <th className='ps-4 min-w-145px rounded-start'>Name</th>
                      <th className='min-w-140px'>Category</th>
                      <th className='min-w-140px'>Brand</th>
                      <th className='min-w-140px'>Quantity</th>
                      <th className='pe-4 min-w-100px text-end rounded-end'>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && (
                      <div className='text-center'>
                        <div className='spinner-border' role='status'>
                          <span className='sr-only'>Loading...</span>
                        </div>
                      </div>
                    )}
                    {!loading &&
                      products.length > 0 &&
                      products.map((product) => (
                        <tr key={product.id}>
                          <td className='text-dark fw-bolder fs-6 ps-4'>
                            {product.name ? product.name : 'N/A'}
                          </td>
                          <td className='text-dark fw-bolder fs-6'>
                            {product?.category_info?.name ? product?.category_info?.name : 'N/A'}
                          </td>
                          <td className='text-dark fw-bolder fs-6'>
                            {product?.brand_info?.name ? product?.brand_info?.name : 'N/A'}
                          </td>
                          <td className='text-dark fw-bolder fs-6'>
                            {product?.stock_qty ? product?.stock_qty : '0'}
                          </td>
                          <td className='text-end pe-4'>
                            <i
                              className='far fa-eye btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted me-2'
                              id='kt_drawer_example_basic_button'
                              onClick={() => setProductID(product.id)}
                            ></i>
                            <i
                              className='far fa-edit btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted me-2'
                              onClick={() => handleEditProduct(product.id)}
                            ></i>
                            <i
                              className='far fa-trash-alt btn btn-icon btn-bg-light text-hover-primary btn-sm text-muted'
                              onClick={() => openDeleteModal(product.id)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    {!loading && !products.length && (
                      <p className='text-center'>No Available Product</p>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </section>
        <ModalWidgets
          closeDeleteModal={closeDeleteModal}
          deleteModal={deleteModal}
          confirmation={confirmation}
        />

        <div
          id='kt_drawer_example_basic'
          className='pr-details-drawer'
          data-kt-drawer='true'
          data-kt-drawer-activate='true'
          data-kt-drawer-toggle='#kt_drawer_example_basic_button'
          data-kt-drawer-close='#kt_drawer_example_basic_close'
        >
          {products
            .filter((product) => product.id == productID)
            .map((itm) => (
              <div key={itm.id} className='product-details-wrap'>
                <h2 className='top-title p-30'>Product details</h2>
                <Carousel autoPlay className='product-details-carousel'>
                  {JSON.parse(itm.photos).map((image: any) => (
                    <div className='pr-details-img-wrap'>
                      <img
                        style={{height: '50%', width: '100%'}}
                        src={`${imageUrl}/uploads/product/${image}`}
                        alt=''
                      />
                    </div>
                  ))}
                </Carousel>
                <Card className='mb-25 primary-bx-shadow p-details-card mt-0'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Basic Info</h2>
                  </div>
                  <div className='pr-details-list p-30'>
                    <p className='d-flex justify-content-between mt-0'>
                      Product Name <span>{itm?.name ? itm?.name : 'N/A'}</span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Brand <span>{itm?.brand_info?.name ? itm?.brand_info?.name : 'N/A'}</span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Product category{' '}
                      <span>{itm?.category_info?.name ? itm?.category_info?.name : 'N/A'}</span>
                    </p>
                    <p className='d-flex justify-content-between mb-0'>
                      Measure{' '}
                      <span>
                        {itm?.amount && itm?.mesaurement_type
                          ? `${itm?.amount}${itm?.mesaurement_type}`
                          : 'N/A'}{' '}
                      </span>
                    </p>
                  </div>
                  <div className='p-30 border-t product-desc'>
                    <p className='mt-0'>Short description</p>
                    <span>{itm?.short_description ? itm?.short_description : 'N/A'}</span>
                    <p className=''>Product description</p>
                    <span>{itm?.description ? itm?.description : 'N/A'}</span>
                  </div>
                </Card>

                <Card className='mb-25 primary-bx-shadow p-details-card'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Stock Info</h2>
                  </div>
                  <div className='pr-details-list p-30'>
                    <p className='d-flex justify-content-between mt-0'>
                      Supply Price{' '}
                      <span>
                        {itm?.supply_price ? `${currency(countryName)}${itm?.supply_price}` : 'N/A'}
                      </span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Retail Price{' '}
                      <span>
                        {itm?.retail_price ? `${currency(countryName)}${itm?.retail_price}` : ''}
                      </span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Special Price{' '}
                      <span>
                        {itm?.special_price
                          ? `${currency(countryName)}${itm?.special_price}`
                          : 'N/A'}
                      </span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Stock Qty <span>{itm?.stock_qty}</span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Min Stock Qty <span>{itm?.min_stock_qty}</span>
                    </p>
                    <p className='d-flex justify-content-between'>
                      Max Stock Qty <span>{itm?.max_stock_qty}</span>
                    </p>
                  </div>
                </Card>
              </div>
            ))}
        </div>
        <div className='text-center'>
          {count < paginate.total && (
            <button className='btn btn-primary text-center' onClick={LoadMoreList}>
              Load More
            </button>
          )}
        </div>
      </>
    )
}

export default Products;