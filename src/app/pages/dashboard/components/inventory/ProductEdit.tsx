import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory, useParams } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap-v5";
import { useForm, SubmitHandler } from "react-hook-form";
import ImageUploader from "./ImageUploader";
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { PRODUCT_CREATE, PRODUCT_UPDATE } from '../../../../../gql/Mutation';
import { ALL_BRANDS, ALL_PRODUCT_CATEGORY, SINGLE_PRODUCT } from '../../../../../gql/Query';
import { imageUrl } from "../../../../modules/util";

type Inputs = {
    brand_id: number,
    product_category_id: number,
    name: string,
    brand_code: string,
    amount: number,
    short_description: string,
    description: string,
    mesaurement_type: string,
    supply_price: number,
    track_retail_sale: boolean,
    retail_price: number,
    special_price: number,
    markup: number,
    track_stock_qty: boolean,
    stock_qty: number,
    min_stock_qty: number,
    max_stock_qty: number,
    tax: string,
    photos: string,
    brand_info: {
        id: number,
        name: string,
    },
    category_info: {
        id: number,
        name: string,
    }
};
type IDParams = {
    id: string;
};

const ProductEdit: FC = () => {
    const [loading, setLoading] = useState(false)
    const [enableRetailSales, setEnableRetailSales] = useState<boolean>(false);
    const [trackStockQty, setTrackStockQty] = useState<boolean>(false);
    const history = useHistory();
    const { id } = useParams<IDParams>()
    // console.log("eidt product id>>>>", id)
    const { enqueueSnackbar } = useSnackbar();
    const [brands, setBrands] = useState<Array<any>>([]);
    const [category, setCategory] = useState<Array<any>>([]);
    const [images, setImages] = useState<Array<any>>([]);
    // const skuFieldValues = useRef(null);
    // const [formValues, setFormValues] = useState<Array<string>>([""]);
    const [products, setProducts] = useState<Array<string>>([]);
    let newProductImages = [...images, ...products];
    // console.log(newProductImages)
    const [product, setProduct] = useState<Inputs>({
        name: "",
        brand_id: 0,
        brand_code: "",
        mesaurement_type: "",
        amount: 0,
        short_description: "",
        description: "",
        product_category_id: 0,
        supply_price: 0,
        track_retail_sale: false,
        retail_price: 0,
        special_price: 0,
        markup: 0,
        track_stock_qty: false,
        // sku: Array<string>,
        // supplier: string,
        stock_qty: 0,
        min_stock_qty: 0,
        max_stock_qty: 0,
        photos: "",
        tax: "",
        brand_info: {
            id: 0,
            name: ""
        },
        category_info: {
            id: 0,
            name: ""
        }
    });


    const { data: singleProductData, error: singleProductError } = useQuery(SINGLE_PRODUCT, {
        variables: {
            id: id
        }
    })

    useEffect(() => {
        if (singleProductData) {
            setProduct(singleProductData.product)
            setImages(singleProductData.product?.photos && JSON.parse(singleProductData.product?.photos))
            setTrackStockQty(singleProductData.product?.track_stock_qty)
            setEnableRetailSales(singleProductData.product?.track_retail_sale)
            // console.log("singleProductData", JSON.parse(singleProductData.product?.photos))
        }
    }, [singleProductData])

    const { data: brandsData, error: brandsError } = useQuery(ALL_BRANDS, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    });

    const { data: productCategoryData, error: productCategoryError, loading: productCategoryLoading } = useQuery(ALL_PRODUCT_CATEGORY, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    })
    // edit product start
    const handleUpdate = (e: any) => {
        const { name, value } = e.target;
        setProduct((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    };

    const [updateProduct] = useMutation(PRODUCT_UPDATE, {
        onError(err: any) {
            enqueueSnackbar(err?.graphQLErrors[0]?.extensions, {
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
        }
    })


    useEffect(() => {
        if (brandsData && productCategoryData) {
            setBrands(brandsData.brands.data);
            setCategory(productCategoryData.productCategories.data);
            // console.log(productCategoryData, brandsData);
        }
        if (productCategoryError || brandsError) {
            // console.log(productCategoryError, brandsError);
        }
    }, [brandsData, productCategoryData])


    const getUrl = (links: Array<string>) => {
        setProducts(links)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // console.log(product);
        if (product.name && product.retail_price) {
            setLoading(true)
            updateProduct({
                variables: {
                    id: +id,
                    name: product.name,
                    brand_id: +product.brand_id,
                    brand_code: product.brand_code,
                    mesaurement_type: product.mesaurement_type,
                    amount: +product.amount,
                    short_description: product.short_description,
                    description: product.description,
                    product_category_id: +product.product_category_id,
                    supply_price: +product.supply_price,
                    track_retail_sale: enableRetailSales,
                    retail_price: +product.retail_price,
                    special_price: +product.special_price,
                    markup: +product.markup,
                    track_stock_qty: trackStockQty,
                    // sku: Array<string>,
                    // supplier: string,
                    stock_qty: +product.stock_qty,
                    min_stock_qty: +product.min_stock_qty,
                    max_stock_qty: +product.max_stock_qty,
                    photos: JSON.stringify(newProductImages),
                    tax: product.tax,
                }
            }).then(({ data }) => {
                // console.log(data);
                if (data) {
                    enqueueSnackbar('Product Updated', {
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
                    setLoading(false)
                    history.push('/inventory/products')
                }
            }).catch((e) => {
                setLoading(true)
                enqueueSnackbar('Product name price is required', {
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
                setLoading(false)
            })
        }
        else {
            enqueueSnackbar('Product name and retail price required', {
                variant: 'warning',
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
    const handleImgDelete = (e: number) => {
        let netImg = images.filter((image: any, index: number) => index != e)
        setImages(netImg);
        // console.log(netImg)
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

    const measure = [
      {name: 'Unit (items/pieces)', value: 'items/pieces'},
      {name: 'Milliliters (ml)', value: 'ml'},
      {name: 'Liters (l)', value: 'l'},
      {name: 'Fluid ounces (Fl. oz)', value: 'fl'},
      {name: 'Grams (g)', value: 'g'},
      {name: 'Gallons (gal)', value: 'gal'},
      {name: 'Ounces (oz)', value: 'oz'},
      {name: 'Pounds (lb)', value: 'lb'},
      {name: 'Centimeters (cm)', value: 'cm'},
      {name: 'Feet (ft)', value: 'ft'},
      {name: 'Inches (in)', value: 'in'},
    ]
    const handleWhiteSpce = (e: any) => {
        e = e || window.event;
        const value = e.target.value
        let key = e.charCode;
        if (key === 32 && value === "") {
            e.preventDefault();
        }
    }
    return (
      <>
        <section id='product-add' className='ptc'>
          <Form>
            <div className='toolbar'>
              <Link className='close-btn' to='/inventory/products'>
                <i className='fas fa-times'></i>
              </Link>
              <h2 className='page-title mb-0'>Edit Product</h2>
              {/* <button type="submit" onClick={handleSubmit} disabled={loading} className="submit-btn save-btn">Update</button> */}
              <button
                onClick={handleSubmit}
                type='submit'
                id='kt_sign_in_submit'
                className='submit-btn save-btn'
                disabled={loading}
              >
                {!loading && <span className='indicator-label'>Update</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Updating...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
            {/* basic info */}
            {/* <Container className=""> */}
            <Row>
              <Col sm={8}>
                <Card className='mb-25 primary-bx-shadow'>
                  <Card.Body>
                    <Card.Text>
                      <div className='form-heading'>
                        <h2 className='section-title'>Basic info</h2>
                      </div>
                      <div className='basic-info-form'>
                        <Form.Group className='mb-3' controlId='productName'>
                          <Form.Label>Product name</Form.Label>
                          <Form.Control
                            type='text'
                            value={product.name}
                            name='name'
                            onChange={handleUpdate}
                            placeholder='Enter product name'
                            onKeyPress={(e: any) => {
                              handleWhiteSpce(e)
                            }}
                          />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='productCategory'>
                          <Form.Label>Product Category</Form.Label>
                          <Form.Select
                            aria-label='productCategory'
                            onChange={handleUpdate}
                            name='product_category_id'
                          >
                            <option disabled selected value=''>
                              Choose Category
                            </option>
                            {category.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                                selected={item.id == product.product_category_id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='productBrand'>
                          <Form.Label>Product Brand</Form.Label>
                          <Form.Select
                            aria-label='productBrand'
                            name='brand_id'
                            onChange={handleUpdate}
                          >
                            <option disabled selected value=''>
                              Choose Brand
                            </option>
                            {brands.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                                selected={item.id == product.brand_id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        {/* <Form.Group className="mb-3" controlId="productBrandCode">
                                                <Form.Label>Product Brand Code</Form.Label>
                                                <Form.Control type="text" value={product.brand_code} name="brand_code"
                                                    onChange={handleUpdate} placeholder="product brand code" />
                                            </Form.Group> */}

                        <Row>
                          <Col sm={6}>
                            <Form.Group className='mb-3' controlId='measure'>
                              <Form.Label>Measure</Form.Label>
                              <Form.Select
                                aria-label='Measure'
                                name='mesaurement_type'
                                onChange={handleUpdate}
                              >
                                <option disabled selected value=''>
                                  Choose Measure
                                </option>
                                {measure.map((item: any) => (
                                  <option
                                    key={item.value}
                                    value={item.value}
                                    selected={item.value == product?.mesaurement_type}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col sm={6}>
                            <Form.Group className='mb-3' controlId='amount'>
                              <Form.Label>Amount</Form.Label>
                              <InputGroup className='mb-3'>
                                <Form.Control
                                  type='number'
                                  autoComplete='off'
                                  min='0'
                                  value={product.amount}
                                  name='amount'
                                  onChange={handleUpdate}
                                  placeholder='Amount'
                                  onKeyPress={(event: any) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault()
                                    }
                                  }}
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className='mb-3' controlId='shortDescription'>
                          <Form.Label>Short Description</Form.Label>
                          <Form.Control
                            type='text'
                            value={product.short_description}
                            autoComplete='off'
                            name='short_description'
                            onChange={handleUpdate}
                            placeholder='Short description'
                          />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='productDescription'>
                          <Form.Label>Product Description</Form.Label>
                          <Form.Control
                            as='textarea'
                            value={product.description}
                            rows={3}
                            autoComplete='off'
                            name='description'
                            onChange={handleUpdate}
                            type='text'
                            placeholder='Product description'
                          />
                        </Form.Group>
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className='primary-bx-shadow edit-pr-img-thumbnail-wrap'>
                  <div className='form-heading'>
                    <h2 className='section-title'>Product photos</h2>
                    <p>Drag and drop a photo to change the order.</p>
                  </div>
                  <ImageUploader multiple={true} products={newProductImages} getUrl={getUrl} />
                </Card>
                <Card className='primary-bx-shadow mt-5 old-img-thumbnail'>
                  <div className='image-thumbnails'>
                    {images.map((image: any, index: number) => (
                      <span className='edit-pr-img-thumbnail'>
                        <img
                          className='image-thumbnail'
                          key={image}
                          src={`${imageUrl}/uploads/product/${image}`}
                          alt='image'
                        ></img>
                        <i
                          onClick={() => {
                            handleImgDelete(index)
                          }}
                          className='far fa-trash-alt delete-icon'
                        ></i>
                      </span>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
            {/* </Container> */}

            {/* pricing */}
            {/* <Container> */}
            <Row>
              <Col sm={8}>
                <Card className='mb-25 primary-bx-shadow'>
                  <Card.Body>
                    <Card.Text>
                      <div className='form-heading'>
                        <h2 className='section-title'>Pricing</h2>
                      </div>
                      <div className='p-30 border-b'>
                        <Row className='my-4'>
                          <Col sm={4}>
                            <Form.Group className='mb-3' controlId='supplyPrice'>
                              <Form.Label>Supply price</Form.Label>
                              <InputGroup className='mb-3'>
                                <InputGroup.Text id='basic-addon1'>
                                  {currency(countryName)}
                                </InputGroup.Text>
                                <Form.Control
                                  type='number'
                                  min='0'
                                  value={product.supply_price}
                                  name='supply_price'
                                  onChange={handleUpdate}
                                  placeholder='Supply price'
                                  onKeyPress={(event: any) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault()
                                    }
                                  }}
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col sm={4}>
                            <Form.Group className='mb-3' controlId='amount'>
                              <Form.Label>Retail price</Form.Label>
                              <InputGroup className='mb-3'>
                                <InputGroup.Text id='basic-addon1'>
                                  {currency(countryName)}
                                </InputGroup.Text>
                                <Form.Control
                                  type='number'
                                  min='0'
                                  value={product.retail_price}
                                  name='retail_price'
                                  onChange={handleUpdate}
                                  placeholder='Amount'
                                  onKeyPress={(event: any) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault()
                                    }
                                  }}
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col sm={4}>
                            <Form.Group className='mb-3' controlId='amount'>
                              <Form.Label>Special price</Form.Label>
                              <InputGroup className='mb-3'>
                                <InputGroup.Text id='basic-addon1'>
                                  {currency(countryName)}
                                </InputGroup.Text>
                                <Form.Control
                                  type='number'
                                  min='0'
                                  value={product.special_price}
                                  name='special_price'
                                  onChange={handleUpdate}
                                  placeholder='Amount'
                                  onKeyPress={(event: any) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault()
                                    }
                                  }}
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      {/* <div className="p-30">
                                            <div className="inner-heading">
                                                <h3>Retail sales</h3>
                                                <p>Allow sales of this product at checkout.</p>
                                            </div>
                                            <Form.Group className="mb-5">
                                                <Form>
                                                    <Form.Check
                                                        type="switch"
                                                        checked={enableRetailSales ? true : false}
                                                        id="custom-switch"
                                                        label="Enable retail sales"
                                                        onClick={() => { setEnableRetailSales(!enableRetailSales) }}
                                                    />
                                                </Form>
                                            </Form.Group>

                                            {
                                                enableRetailSales &&
                                                <Row className="my-4">
                                                    <Col sm={4}>
                                                        <Form.Group className="mb-3" controlId="amount">
                                                            <Form.Label>Retail price</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                                <Form.Control type="number" value={product.retail_price}
                                                                    name="retail_price" onChange={handleUpdate} placeholder="Amount" />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Group className="mb-3" controlId="amount">
                                                            <Form.Label>Special price</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                                <Form.Control type="number" value={product.special_price}
                                                                    name="special_price" onChange={handleUpdate} placeholder="Amount" />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Group className="mb-3" controlId="amount">
                                                            <Form.Label>Markup</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <InputGroup.Text id="basic-addon1">%</InputGroup.Text>
                                                                <Form.Control type="number" value={product.markup}
                                                                    name="markup" onChange={handleUpdate} placeholder="Amount" />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            }

                                            <Form.Group className="" controlId="productBrand">
                                                <Form.Label>Tax</Form.Label>
                                                <Form.Select aria-label="tax" name="tax" onChange={handleUpdate}>
                                                    {product.tax && <option>{product.tax}</option>}
                                                    {product.tax && <>
                                                        <option value="not tax">not tax</option>
                                                        <option value="tax">tax</option>
                                                    </>}
                                                </Form.Select>
                                            </Form.Group>
                                        </div> */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* </Container> */}
            {/* Inventory */}
            {/* <Container> */}
            <Row>
              <Col sm={8}>
                <Card>
                  <Card.Body className='primary-bx-shadow'>
                    <Card.Text>
                      <div className='form-heading'>
                        <h2 className='section-title'>Inventory</h2>
                        <p>Manage stock levels of this product through Chuzeday.</p>
                      </div>
                      <div className='p-30'>
                        <div className='inner-heading'>
                          <h3>Stock quantity</h3>
                        </div>
                        <Form.Group className='mb-5 mt-3'>
                          <Form>
                            <Form.Check
                              type='switch'
                              checked={trackStockQty ? true : false}
                              id='custom-switch'
                              label='Track stock quantity'
                              onClick={() => setTrackStockQty(!trackStockQty)}
                            />
                          </Form>
                        </Form.Group>
                        {trackStockQty && (
                          <>
                            <Row className='my-4'>
                              <Col sm={4}>
                                <Form.Group className='mb-3' controlId='currentStockQty'>
                                  <Form.Label>Current stock quantity</Form.Label>
                                  <Form.Control
                                    type='number'
                                    min='0'
                                    autoComplete='off'
                                    value={product.stock_qty}
                                    name='stock_qty'
                                    onChange={handleUpdate}
                                    placeholder='0'
                                    onKeyPress={(event: any) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault()
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm={4}>
                                <Form.Group className='mb-3' controlId='currentStockQty'>
                                  <Form.Label>Min stock quantity</Form.Label>
                                  <Form.Control
                                    type='number'
                                    min='0'
                                    autoComplete='off'
                                    value={product.min_stock_qty}
                                    name='min_stock_qty'
                                    onChange={handleUpdate}
                                    placeholder='0'
                                    onKeyPress={(event: any) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault()
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm={4}>
                                <Form.Group className='mb-3' controlId='currentStockQty'>
                                  <Form.Label>Max stock quantity</Form.Label>
                                  <Form.Control
                                    type='number'
                                    min='0'
                                    autoComplete='off'
                                    value={product.max_stock_qty}
                                    name='max_stock_qty'
                                    onChange={handleUpdate}
                                    placeholder='0'
                                    onKeyPress={(event: any) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault()
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </>
                        )}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* </Container> */}
          </Form>
        </section>
      </>
    )
}

export default ProductEdit;