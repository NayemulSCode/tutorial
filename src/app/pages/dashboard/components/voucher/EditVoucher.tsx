import { useMutation, useQuery } from "@apollo/client";
import React, { FC, useState, useEffect, useRef, MouseEvent } from "react"
import { useParams, Link, useHistory } from "react-router-dom";
import { SINGLE_VOUCHER } from "../../../../../gql/Query";
import { Card, Form, Row, Col, InputGroup } from "react-bootstrap-v5";
import Select from 'react-select';
import { check } from "prettier";
import { VOUCHER_UPDATE } from "../../../../../gql/Mutation";
import { useSnackbar } from 'notistack';
import { ALL_SERVICES } from "../../../../../gql/Query";
type QuizParams = {
    id: string;
};
type IVoucherData = {
    name: string,
    value: number,
    retail: number,
    valid_for: string,
    limit_number_of_sales_enable: false,
    limit_number_of_sales: number,
    services_included: any,
    enable_online_sales: boolean,
    title: string,
    description: string,
    color: string,
    note: string
}

const EditVoucher: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const { id } = useParams<QuizParams>();
    const [services, setServices] = useState<Array<any>>([]);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [colorCode, setColorCode] = useState<string>("");
    const [selectedSerivces, setSelectedSerivces] = useState<Array<any>>([]);
    const [saleLimitofVourcher, setSaleLimitofVourcher] = useState<boolean>(false);
    const [onlineSale, setOnlineSale] = useState<boolean>(false)
    // console.log("is limited sale ture>",saleLimitofVourcher,"online sale>",onlineSale);
    let nameRef = useRef<HTMLInputElement | null>(null);
    let titleRef = useRef<HTMLInputElement | null>(null);
    const [voucher, setVoucher] = useState<IVoucherData>({
        name: "",
        value: 0,
        retail: 0,
        valid_for: "",
        limit_number_of_sales_enable: false,
        limit_number_of_sales: 0,
        services_included: [],
        enable_online_sales: false,
        title: "",
        description: "",
        color: "",
        note: ""
    })
    const { data: serviceData, error: serviceError, loading: serviceLoading, refetch: serviceRefetch } = useQuery(ALL_SERVICES, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    })
    useEffect(() => {
        if (serviceData) {
            setServices(serviceData.services.data)
        }
    }, [serviceData])
    // console.log("services", services)
    // console.log("selectedSerivces-----------", selectedSerivces)
    const { data: voucherData, error: vourcherDataError, loading: vourcherDataLoading, refetch } = useQuery(SINGLE_VOUCHER, {
        variables: {
            id: +id
        }
    });
    const [updateVoucher] = useMutation(VOUCHER_UPDATE, {
        onError(err: any) {
            if (err) {
                enqueueSnackbar(err.message, {
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
            }
        }
    });

    const handleSelectService = (selectedOption: any) => {
        console.log(selectedOption)
        setSelectedSerivces(selectedOption)
    }
    const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVoucher((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    };
    const handleSelectUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVoucher((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    };
    const handleTextareaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVoucher((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    // console.log(typeof(voucher.value))
    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const voucherUpdatePayload ={
            id: +id,
            name: voucher.name,
            value: +voucher.value,
            retail: +voucher.retail,
            valid_for: voucher.valid_for,
            limit_number_of_sales_enable: saleLimitofVourcher,
            limit_number_of_sales: +voucher.limit_number_of_sales,
            services_included: selectedSerivces.map((item)=>({value: item.value, label: item.label})) ?? [],
            enable_online_sales: onlineSale,
            title: voucher.title,
            description: voucher.description,
            color: voucher.color,
            note: voucher.note
        }
        if (voucher.name === "") {
            nameRef.current?.focus();
            enqueueSnackbar("Name field is empty", {
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
        else if (voucher.title === "") {
            titleRef.current?.focus();
            enqueueSnackbar("Title field is empty", {
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
        else if (voucher.name && voucher.title) {
            setLoading(true)
            updateVoucher({
              variables: voucherUpdatePayload,
            })
              .then(({data}) => {
                if (data) {
                  if (data.updateVoucher.status === 1) {
                    enqueueSnackbar(data.updateVoucher.message, {
                      variant: 'success',
                      anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                      },
                      transitionDuration: {
                        enter: 300,
                        exit: 500,
                      },
                    })
                    setLoading(false)
                    history.push('/vouchers')
                  } else if (data.updateVoucher.status === 0) {
                    enqueueSnackbar(data.updateVoucher.message, {
                      variant: 'error',
                      anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                      },
                      transitionDuration: {
                        enter: 300,
                        exit: 500,
                      },
                    })
                    setLoading(false)
                  }
                }
                console.log(data)
              })
              .catch((e) => {
                enqueueSnackbar('Cannot update voucher!!!', {
                  variant: 'error',
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  transitionDuration: {
                    enter: 300,
                    exit: 500,
                  },
                })
                setLoading(false)
              })
        }

    }
    useEffect(() => {
        if (voucherData) {
            console.log("single voucher data", voucherData.voucher)
            setVoucher(voucherData.voucher)
            setOnlineSale(voucherData.voucher.enable_online_sales)
            setSaleLimitofVourcher(voucherData.voucher.limit_number_of_sales_enable)
            if (voucherData.voucher.services_included !== "") {
                setSelectedSerivces(voucherData?.voucher?.services_included)
            }
        }
    }, [voucherData]);
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
    const handleWhiteSpce = (e: any) => {
        e = e || window.event;
        const value = e.target.value;
        let key = e.charCode;
        if (key === 32 && value === "") {
            e.preventDefault();
        }
    }
    return (
        <>
            <section id="product-add" className="add-product-form ptc">
                <Form>
                    <div className="toolbar">
                        <Link className="close-btn" to="/vouchers"><i className="fas fa-times"></i></Link>
                        {/* <button type="submit" onClick={handleSubmit} className="submit-btn save-btn">Update</button> */}

                        <button
                            onClick={handleSubmit}
                            type='submit'
                            id='kt_sign_in_submit'
                            className="submit-btn save-btn"
                            disabled={loading}
                        >
                            {!loading && <span className='indicator-label' >Update</span>}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }}>
                                    Updating...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </button>
                    </div>
                    <Row>
                        <div className="col-xl-6 mb-5" >
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title">Voucher details</h2>
                                            <p>Add voucher type info.</p>
                                        </div>
                                        <div className="p-30">
                                            <Form.Group className="mb-3" controlId="voucherName">
                                                <Form.Label>Voucher name</Form.Label>
                                                <Form.Control type="text" placeholder="Enter voucher name"
                                                    name="name"
                                                    value={voucher.name}
                                                    onChange={handleUpdate}
                                                    ref={nameRef}
                                                    required
                                                    autoComplete="off"
                                                    onKeyPress={(e: any) => { handleWhiteSpce(e) }}
                                                />
                                            </Form.Group>

                                            <Row className="my-4">
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Value</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="text" step=".01" min="0"
                                                                name="value"
                                                                value={voucher.value}
                                                                onChange={handleUpdate}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />

                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Retail price</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="text" step=".01" min="0"
                                                                name="retail"
                                                                value={voucher.retail}
                                                                onChange={handleUpdate}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />

                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-5" controlId="valid-for">
                                                <Form.Label>Valid for</Form.Label>
                                                <Form.Select aria-label="valid-for"
                                                    name="valid_for"
                                                    value={voucher.valid_for}
                                                    onChange={handleSelectUpdate}
                                                >
                                                    <option value="14 days">14 days</option>
                                                    <option value="1 month">1 month</option>
                                                    <option value="6 months">6 months</option>
                                                    <option value="5 years">5 years</option>
                                                    <option value="forever">Forever</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="my-5" controlId="sales-limit">
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Limit amount of sales"
                                                    checked={saleLimitofVourcher ? true : false}
                                                    onClick={() => { setSaleLimitofVourcher(!saleLimitofVourcher) }}
                                                />
                                            </Form.Group>
                                            {
                                                saleLimitofVourcher &&
                                                <Form.Group className="mb-3" controlId="num-of-sales">
                                                    <Form.Label>Number of sales</Form.Label>
                                                    <Form.Select aria-label="num-of-sales" name="limit_number_of_sales"
                                                        value={voucher.limit_number_of_sales}
                                                        onChange={handleSelectUpdate}
                                                    >
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="30">30</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            }
                                            <Form.Group className="my-5" controlId="sales-online">
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Online sale available?"
                                                    checked={onlineSale ? true : false}
                                                    onClick={() => { setOnlineSale(!onlineSale) }}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="border-t p-30">
                                            <div className="form-heading border-0 p-0">
                                                <h2 className="section-title mb-5">Services included</h2>
                                            </div>
                                            <Form.Group className="" controlId="include-service">
                                                <Form.Label>Included services</Form.Label>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    isSearchable
                                                    value={selectedSerivces}
                                                    options={services}
                                                    onChange={options => handleSelectService(options)}

                                                />
                                            </Form.Group>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-xl-6 mb-5" >
                            <Card className="mb-25 primary-bx-shadow">
                                <Card.Body>
                                    <Card.Text>
                                        <div className="form-heading">
                                            <h2 className="section-title">Customise voucher</h2>
                                            <p>Customise voucher type.</p>
                                        </div>
                                        <div className="p-30">
                                            <Form.Group className="mb-3" controlId="voucherName">
                                                <Form.Label>Voucher title</Form.Label>
                                                <Form.Control type="text" placeholder="Add a voucher title"
                                                    name="title"
                                                    value={voucher.title}
                                                    autoComplete="off"
                                                    onChange={handleUpdate}
                                                    ref={titleRef}
                                                    onKeyPress={(e: any) => { handleWhiteSpce(e) }}
                                                />

                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="voucher-desc">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <Form.Label>Voucher description</Form.Label>
                                                    <span>0/500</span>
                                                </div>
                                                <textarea id="srvice-desc" placeholder="Add a short description"
                                                    name="description"
                                                    value={voucher.description}
                                                    onChange={handleTextareaUpdate}
                                                ></textarea>
                                            </Form.Group>
                                        </div>
                                        <div className="border-t p-30">
                                            <div className="form-heading border-0 p-0 mb-5">
                                                <h2 className="section-title">Voucher colour</h2>
                                                <p>Choose a colour so that you can remember your business.</p>
                                            </div>
                                            <Form.Group className="" controlId="include-service">
                                                <Form.Label>Pick a colour</Form.Label>
                                                <ul className="v-color-switcher">
                                                    <li>
                                                        <label htmlFor="color-field1">
                                                            <input
                                                                className="color_input_field"
                                                                type="radio"
                                                                name="color"
                                                                id="color-field1"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(95, 171, 255) 0%, rgb(11, 109, 217) 100%) repeat scroll 0% 0%"
                                                                onChange={handleUpdate}
                                                            />
                                                            <div className={`${(colorCode === "1" || voucher.color === "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(95, 171, 255) 0%, rgb(11, 109, 217) 100%) repeat scroll 0% 0%") ? "color_picker" : ""}`} onClick={e => setColorCode("1")}>
                                                                <span title="blue" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(95, 171, 255) 0%, rgb(11, 109, 217) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field2">
                                                            <input
                                                                className="color_input_field"

                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(32, 48, 71) 0%, rgb(16, 25, 40) 100%) repeat scroll 0% 0%"
                                                                id="color-field2"
                                                                onChange={handleUpdate}
                                                            />
                                                            <div className={`${(colorCode === "2" || voucher.color === "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(32, 48, 71) 0%, rgb(16, 25, 40) 100%) repeat scroll 0% 0%") ? "color_picker" : ""}`} onClick={e => setColorCode("2")}>
                                                                <span title="dark" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(32, 48, 71) 0%, rgb(16, 25, 40) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field3">
                                                            <input
                                                                className="color_input_field"
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(0, 166, 156) 0%, rgb(0, 157, 98) 100%) repeat scroll 0% 0%"
                                                                id="color-field3"
                                                                onChange={handleUpdate}
                                                            />
                                                            <div className={`${(colorCode === "3" || voucher.color === "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(0, 166, 156) 0%, rgb(0, 157, 98) 100%) repeat scroll 0% 0%") ? "color_picker" : ""}`} onClick={e => setColorCode("3")}>
                                                                <span title="green" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(0, 166, 156) 0%, rgb(0, 157, 98) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field4">
                                                            <input
                                                                className="color_input_field"
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(237, 176, 27) 0%, rgb(222, 100, 38) 100%) repeat scroll 0% 0%"
                                                                id="color-field4"
                                                                onChange={handleUpdate}
                                                            />
                                                            <div className={`${(colorCode === "4" || voucher.color === "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(237, 176, 27) 0%, rgb(222, 100, 38) 100%) repeat scroll 0% 0%") ? "color_picker" : ""}`} onClick={e => setColorCode("4")}>
                                                                <span title="orange" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(237, 176, 27) 0%, rgb(222, 100, 38) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field5">
                                                            <input
                                                                className="color_input_field"
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(190, 74, 244) 0%, rgb(92, 55, 246) 100%) repeat scroll 0% 0%"
                                                                id="color-field5"
                                                                onChange={handleUpdate}
                                                            />
                                                            <div className={`${(colorCode === "5" || voucher.color === "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(190, 74, 244) 0%, rgb(92, 55, 246) 100%) repeat scroll 0% 0%") ? "color_picker" : ""}`} onClick={e => setColorCode("5")}>
                                                                <span title="purple" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(190, 74, 244) 0%, rgb(92, 55, 246) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </Form.Group>
                                        </div>
                                        <div className="border-t p-30">
                                            <div className="form-heading border-0 p-0 mb-5">
                                                <h2 className="section-title">Notes for the guest</h2>
                                                <p>Add a note which will be visible always.</p>
                                            </div>
                                            <Form.Group className="mb-3" controlId="client-note">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <Form.Label>Note</Form.Label>
                                                    <span>0/500</span>
                                                </div>
                                                <textarea id="client-note" name="note" value={voucher.note}
                                                    onChange={handleTextareaUpdate}
                                                ></textarea>
                                            </Form.Group>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </Row>

                </Form>
            </section>
        </>
    )
}
export { EditVoucher };