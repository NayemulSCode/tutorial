import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap-v5";
import { useForm, SubmitHandler } from "react-hook-form";
import ImageUploader from "./ImageUploader";
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PRODUCT_CREATE } from '../../../../../gql/Mutation';
import { ALL_BRANDS, ALL_PRODUCT_CATEGORY, SINGLE_PRODUCT } from '../../../../../gql/Query';
import Test from '../calendar/Test';

type Inputs = {
    name: string,
    barcode: string
    brand_id: string,
    brand_code: string,
    mesaurement_type: string,
    amount: number,
    short_description: string,
    description: string,
    product_category_id: string,
    supply_price: number,
    track_retail_sale: boolean,
    retail_price: number,
    special_price: number,
    markup: number,
    track_stock_qty: boolean,
    stock_qty: any,
    tax: string,
    min_stock_qty: number,
    max_stock_qty: number,
    category_name: string,
    brand_name: string
};

const ProductAdd: FC = () => {
    const [barCode, setbarCode] = useState<any>("");
    const [trackRetailSales, setTrackRetailSales] = useState<boolean>(false);
    const [trackStockQty, setTrackStockQty] = useState<boolean>(false);
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const [brands, setBrands] = useState<Array<any>>([]);
    const [category, setCategory] = useState<Array<any>>([]);
    const [productBrand, setProductBrand] = useState("");
    const [productCat, setProductCat] = useState("");
    const [product, setProduct] = useState<Inputs>({
        name: "",
        barcode: "",
        brand_id: "",
        brand_code: "",
        mesaurement_type: "",
        amount: 0,
        short_description: "",
        description: "",
        product_category_id: "",
        supply_price: 0,
        track_retail_sale: false,
        retail_price: 0,
        special_price: 0,
        markup: 0,
        track_stock_qty: false,
        stock_qty: null,
        tax: "",
        min_stock_qty: 0,
        max_stock_qty: 0,
        category_name: "",
        brand_name: "",
    });
    const [productPhotos, setProductPhotos] = useState<Array<string>>([]);

    const [runQuery, { data: singleProduct }] = useLazyQuery(SINGLE_PRODUCT);

    useEffect(() => {
        // console.log(typeof barCode)
        runQuery({
            variables: {
                id: "",
                barcode: "",
                root_barcode: barCode
            }
        });
    }, [barCode]);

    const getBarcode = (code: any) => {
        setbarCode(code)
    }

    useEffect(() => {
        if (singleProduct?.product != null) {
            // console.log(singleProduct)
            setProduct(singleProduct.product)
            setProductBrand(singleProduct.product?.brand_info?.name)
            setProductCat(singleProduct.product?.category_info?.name)
        }
        // else {
        //     enqueueSnackbar("Product not found", {
        //         variant: 'error',
        //         anchorOrigin: {
        //             vertical: 'top',
        //             horizontal: 'right',
        //         },
        //         transitionDuration: {
        //             enter: 300,
        //             exit: 500
        //         }
        //     });
        // }
    }, [singleProduct])


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

    const [addProduct] = useMutation(PRODUCT_CREATE, {
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
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setProduct((preValue: any) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // console.log(product)
        try {
            if (!product.barcode) {
                enqueueSnackbar('Barcode Required', {
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
            else if (!product.name) {
                enqueueSnackbar('Name Required', {
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
            else if (!product.product_category_id) {
                enqueueSnackbar('Category Required', {
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
            else if (!product.retail_price) {
                enqueueSnackbar('Retail Price Required', {
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
            else if (product != undefined && trackStockQty == true && !product.stock_qty) {
                enqueueSnackbar('Stock Info Required', {
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
            else if (product != undefined && product.name && product.barcode && product.retail_price) {
                setLoading(true);
                addProduct({
                    variables: {
                        brand_id: +product.brand_id,
                        product_category_id: parseInt(product.product_category_id),
                        name: product.name,
                        brand_code: product.brand_code ? product.brand_code : "",
                        short_description: product.short_description ? product.short_description : '',
                        description: product.description ? product.description : "",
                        mesaurement_type: product.mesaurement_type ? product.mesaurement_type : '',
                        amount: +product.amount,
                        supply_price: +product.supply_price,
                        track_retail_sale: trackRetailSales,
                        retail_price: +product.retail_price,
                        special_price: +product.special_price,
                        markup: +product.markup,
                        track_stock_qty: trackStockQty,
                        stock_qty: +product.stock_qty,
                        min_stock_qty: +product.min_stock_qty,
                        max_stock_qty: +product.max_stock_qty,
                        tax: product.tax,
                        photos: JSON.stringify(productPhotos),
                        barcode: barCode != "" ? barCode : product.barcode,
                        category_name: productCat ? productCat : "",
                        brand_name: productBrand ? productBrand : '',
                    }
                }).then(({ data }) => {
                    if (data) {
                        enqueueSnackbar('Product Added', {
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
                        setLoading(false);
                        history.push('/inventory/products')
                    }
                }).catch((e) => {
                    enqueueSnackbar('Error uploading product', {
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
            } else {
                enqueueSnackbar('Name, Barcode & Retail Price is Required', {
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
        } catch (err) {
            enqueueSnackbar('Validation failed', {
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
    }


    const getUrl = (links: Array<string>) => {
        setProductPhotos(links)
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
            <section id="product-add" className="add-product-form ptc">
                <Test getBarcode={getBarcode} />
                <Form onSubmit={handleSubmit}>
                    <div className="toolbar">
                        <Link className="close-btn" to="/inventory/products"><i className="fas fa-times"></i></Link>
                        <h2 className="page-title mb-0">Add new product</h2>
                        <button
                            type='submit'
                            id='kt_sign_in_submit'
                            className="submit-btn save-btn"
                            disabled={loading}
                        >
                            {!loading && <span className='indicator-label' >Save</span>}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }}>
                                    Saving...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </button>
                    </div>
                    {/* basic info */}
                    <Row>
                        <Col sm={8} >
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title mb-0">Basic info</h2>
                                        </div>
                                        <div className="basic-info-form">
                                            <Form.Group className="mb-3" controlId="productBarcode">
                                                <Form.Label>Product Barcode</Form.Label>
                                                <Form.Control type="text" placeholder="Enter product barcode" autoComplete="off"
                                                    aria-label="productBarcode" name="barcode" value={product?.barcode} onChange={handleChange}
                                                    onKeyPress={(e: any) => { handleWhiteSpce(e) }}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="productName">
                                                <Form.Label>Product name</Form.Label>
                                                <Form.Control type="text" placeholder="Enter product name" autoComplete="off"
                                                    name="name" value={product?.name} onChange={handleChange}
                                                    onKeyPress={(e: any) => { handleWhiteSpce(e) }}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="productCategory">
                                                <Form.Label>Product Category</Form.Label>
                                                <Form.Select aria-label="productCategory" name="product_category_id" onClick={handleChange} >
                                                    <option disabled selected value="">Choose Category</option>
                                                    {
                                                        category.map((item => <option key={item.id} value={item.id}>{item.name}</option>))
                                                    }
                                                </Form.Select>
                                                {/* {
                                                    !productCat &&
                                                    <Form.Select aria-label="productCategory" name="product_category_id" onClick={handleChange} >
                                                        <option disabled selected value="">Choose Category</option>
                                                        {
                                                            category.map((item => <option key={item.id} value={item.id}>{item.name}</option>))
                                                        }
                                                    </Form.Select>
                                                }
                                                {
                                                    productCat &&
                                                    <Form.Select aria-label="productcat" name="product_category_id">
                                                        <option disabled selected>{productCat}</option>
                                                    </Form.Select>
                                                } */}
                                            </Form.Group>


                                            <Form.Group className="mb-3" controlId="productBrand">
                                                <Form.Label>Product Brand</Form.Label>
                                                {
                                                    productBrand &&
                                                    <Form.Select aria-label="productBrand" name="brand_id">
                                                        <option disabled selected>{productBrand}</option>
                                                    </Form.Select>

                                                }
                                                {
                                                    !productBrand &&
                                                    <Form.Select aria-label="productBrand" name="brand_id" onClick={handleChange}>
                                                        <option disabled selected value="">Choose Brand</option>
                                                        {
                                                            brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
                                                        }
                                                    </Form.Select>
                                                }
                                            </Form.Group>



                                            <Row>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="measure">
                                                        <Form.Label>Measure</Form.Label>
                                                        <Form.Select aria-label="Measure" name="mesaurement_type" onClick={handleChange}>
                                                            <option disabled selected value="">Choose Measure</option>
                                                            {
                                                                measure.map((item: any) =>
                                                                    <option key={item.value} value={item.value} selected={item.value == product?.mesaurement_type}>{item.name}</option>)
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Amount</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="Amount" autoComplete="off" min="0"
                                                                name="amount" value={product?.amount} onChange={handleChange}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3" controlId="shortDescription">
                                                <Form.Label>Short Description</Form.Label>
                                                <Form.Control type="text" placeholder="Short description" autoComplete="off"
                                                    name="short_description" value={product?.short_description} onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="productDescription">
                                                <Form.Label>Product Description</Form.Label>
                                                <Form.Control as="textarea" rows={3} type="text" placeholder="Product description"
                                                    name="description" value={product?.description} onChange={handleChange} />
                                            </Form.Group>


                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={4}>
                            <Card className="primary-bx-shadow">
                                <div className="form-heading">
                                    <h2 className="section-title">Product photos</h2>
                                    <p>Drag and drop a photo to change the order.</p>
                                </div>
                                <ImageUploader multiple={true} products={productPhotos} getUrl={getUrl} />
                            </Card>
                        </Col>
                    </Row>
                    {/* pricing */}
                    <Row>
                        <Col sm={8}>
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title mb-0">Pricing</h2>
                                        </div>
                                        <div className="p-30 border-b">

                                            <Row className="my-4">
                                                <Col sm={4}>
                                                    <Form.Group className="mb-3" controlId="supplyPrice">
                                                        <Form.Label>Supply price</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="number" placeholder="Supply price" min="0" autoComplete="off"
                                                                name="supply_price" value={product?.supply_price} onChange={handleChange}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Retail price</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="number" placeholder="Amount" autoComplete="off" min="0" name="retail_price"
                                                                value={product?.retail_price} onChange={handleChange}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Special price</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="number" placeholder="Amount" autoComplete="off" min="0" name="special_price"
                                                                value={product?.special_price} onChange={handleChange}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
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
                                                        // value={product?.track_retail_sale}
                                                        name="track_retail_sale"
                                                        id="custom-switch"
                                                        label="Enable retail sales"
                                                        onClick={(e) => { setTrackRetailSales(!trackRetailSales) }}
                                                    />
                                                </Form>
                                            </Form.Group>

                                            {
                                                trackRetailSales &&
                                                <Row className="my-4">
                                                    <Col sm={4}>
                                                        <Form.Group className="mb-3" controlId="amount">
                                                            <Form.Label>Retail price</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                                <Form.Control type="number" placeholder="Amount" autoComplete="off" min="0" name="retail_price"
                                                                    value={product?.retail_price} onChange={handleChange} />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Group className="mb-3" controlId="amount">
                                                            <Form.Label>Special price</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                                <Form.Control type="number" placeholder="Amount" autoComplete="off" min="0" name="special_price"
                                                                    value={product?.special_price} onChange={handleChange} />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Group className="mb-3" controlId="amount">
                                                            <Form.Label>Markup</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <InputGroup.Text id="basic-addon1">%</InputGroup.Text>
                                                                <Form.Control type="number" placeholder="Amount" min="0" autoComplete="off"
                                                                    value={product?.markup} name="markup" onChange={handleChange} />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            }

                                            <Form.Group className="" controlId="productBrand">
                                                <Form.Label>Tax</Form.Label>
                                                <Form.Select aria-label="tax" name="tax" onClick={handleChange}>
                                                    <option value="not tax">not tax</option>
                                                    <option value="tax">tax</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </div> */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {/* Inventory */}
                    <Row>
                        <Col sm={8}>
                            <Card>
                                <Card.Body className="primary-bx-shadow">
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title">Inventory</h2>
                                            <p>Manage stock levels of this product through Chuzeday.</p>
                                        </div>
                                        {/* <div className="form-inventory p-30 border-b">
                                                {formValues.map((element, index) => (
                                                    <div className="d-flex bd-highlight" key={index} ref={skuFieldValues}>
                                                        <Form.Group className="mb-3 flex-grow-1 bd-highlight" controlId="sku">
                                                            <Form.Label>SKU <span className="text-muted">(Stock Keeping Unit)</span></Form.Label>
                                                            <Form.Control type="text" placeholder="Stock keeping unit"
                                                                key={index} // important to include key with field's id
                                                                {...register(`sku.${index}`)}
                                                            />
                                                        </Form.Group>
                                                        {index ?
                                                            <i className="fas fa-trash bd-highlight" style={{ cursor: 'pointer' }}
                                                                onClick={() => removeFormFields(index)}></i>
                                                            : null
                                                        }
                                                    </div>
                                                ))}

                                                <button className="generate-sku-link d-block">Generate SKU automatically</button>
                                                <button onClick={() => addFormFields()} type="button" className="add-sku-btn"><i className="fas fa-plus-circle"></i>Add another SKU code</button>
                                            </div> */}

                                        {/* <Form.Group className="p-30 border-b" controlId="supplier">
                                                <Form.Label>Supplier</Form.Label>
                                                <Form.Select aria-label="supplier" {...register("supplier", { required: true })} >
                                                    <option value="1">suplier one</option>
                                                    <option value="2">supplier two</option>
                                                    <option value="2">supplier three</option>
                                                </Form.Select>
                                                <Form.Text className="text-muted">
                                                    {errors.supplier && <span>This field is required</span>}
                                                </Form.Text>
                                            </Form.Group> */}

                                        <div className="p-30">
                                            <div className="inner-heading">
                                                <h3>Stock quantity</h3>
                                            </div>
                                            <Form.Group className="mb-5 mt-3">
                                                <Form>
                                                    <Form.Check
                                                        type="switch"
                                                        // value={product?.track_stock_qty}
                                                        name="track_stock_qty"
                                                        id="custom-switch"
                                                        label="Track stock quantity"
                                                        onClick={() => setTrackStockQty(!trackStockQty)}
                                                    />
                                                </Form>
                                            </Form.Group>

                                            {
                                                trackStockQty && (
                                                    <>
                                                        <Row className="my-4">
                                                            <Col sm={4}>
                                                                <Form.Group className="mb-3" controlId="currentStockQty">
                                                                    <Form.Label>Current stock quantity</Form.Label>
                                                                    <Form.Control type="number" placeholder="0" autoComplete="off" min="0" name="stock_qty"
                                                                        value={product?.stock_qty} onChange={handleChange}
                                                                        onKeyPress={(event: any) => {
                                                                            if (!/[0-9]/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col sm={4}>
                                                                <Form.Group className="mb-3" controlId="currentStockQty">
                                                                    <Form.Label>Min stock quantity</Form.Label>
                                                                    <Form.Control type="number" placeholder="0" autoComplete="off" min="0" name="min_stock_qty"
                                                                        value={product?.min_stock_qty} onChange={handleChange}
                                                                        onKeyPress={(event: any) => {
                                                                            if (!/[0-9]/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col sm={4}>
                                                                <Form.Group className="mb-3" controlId="currentStockQty">
                                                                    <Form.Label>Max stock quantity</Form.Label>
                                                                    <Form.Control type="number" placeholder="0" autoComplete="off" min="0" name="max_stock_qty"
                                                                        value={product?.max_stock_qty} onChange={handleChange}
                                                                        onKeyPress={(event: any) => {
                                                                            if (!/[0-9]/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            }
                                        </div>

                                        {/* <div className="p-30">
                                                    <div className="inner-heading">
                                                        <h3>Reorder point</h3>
                                                        <p>Choose if you would like to set a reorder point when your stock reaches a certain quantity. Fresha will automatically pre-fill the reorder quantity set when you create a purchase order for that supplier.</p>
                                                    </div>
                                                    <Form.Group className="mb-3">
                                                        <Form>
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label="Enable reorder point"
                                                            />
                                                        </Form>
                                                    </Form.Group>

                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-3" controlId="reorderPoint">
                                                                <Form.Label>Reorder point</Form.Label>
                                                                <Form.Control type="number" placeholder="0" {...register("reorderPoint", { required: true })} />
                                                                <Form.Text className="text-muted">
                                                                    {errors.reorderPoint && <span>This field is required</span>}
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-3" controlId="reorderQty">
                                                                <Form.Label>Reorder quantity</Form.Label>
                                                                <Form.Control type="number" placeholder="0" {...register("reorderQty", { required: true })} />
                                                                <Form.Text className="text-muted">
                                                                    {errors.reorderQty && <span>This field is required</span>}
                                                                </Form.Text>
                                                            </Form.Group>

                                                        </Col>
                                                    </Row>
                                                </div> */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* <Col sm={8}>
                            <Card className="mt-5 primary-bx-shadow" >
                                <div className="form-heading">
                                    <h2 className="section-title mb-0">Bar Code</h2>
                                </div>
                                <div className="pr-brcode-wrap p-30">
                                    <div ref={qrcodeRef}>
                                        <svg ref={inputRef} />
                                    </div>
                                    <div className="ms-lg-6 mt-4">
                                        <ReactToPrint
                                            trigger={() => <button type="button" className="btn btn-primary ">Print</button>}
                                            content={() => qrcodeRef.current}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col> */}
                    </Row>
                    {/* </Container> */}
                </Form>
            </section >
        </>
    )
}

export default ProductAdd;