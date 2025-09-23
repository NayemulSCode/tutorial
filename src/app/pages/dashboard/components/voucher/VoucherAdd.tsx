import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap-v5";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerables } from "chart.js";
import { useMutation, useQuery } from '@apollo/client'
import { ALL_SERVICES } from "../../../../../gql/Query";
import { IService } from "../../../../../types";
import Select from 'react-select';
import { ADD_VOUCHER } from "../../../../../gql/Mutation";
import { useSnackbar } from 'notistack';

interface IFormInputs {
    name: string
    voucherValue: number
    retailPrice: number
    validitytime: string
    numberOfValeVourcher: string
    serviceType: string
    title: string
    description: string
    color: string
    note: string
}


const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vourcher name is required"),
    voucherValue: yup
        .number()
        .typeError("Voucher value is required")
        .positive()
        .required(),
    retailPrice: yup
        .number()
        .typeError("Retail price is required")
        .positive()
        .required(),
    title: yup
        .string()
        .required("Vourcher title is required"),
})
const VoucherAdd: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const history = useHistory()
    // validation react hook form
    const { register, formState: { errors }, handleSubmit, setValue, control, watch } = useForm<IFormInputs>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const [colorCode, setColorCode] = useState<string>("");
    const [clientNote, setClientNote] = useState<boolean>(false);
    const [saleLimitofVourcher, setSaleLimitofVourcher] = useState<boolean>(false);
    const [onlineSale, setOnlineSale] = useState<boolean>(false)
    const [services, setServices] = useState<IService[]>([]);
    const [selectedSerivces, setSelectedSerivces] = useState<Array<any>>([])
    const [addVoucher] = useMutation(ADD_VOUCHER);
    const { enqueueSnackbar } = useSnackbar();
    const { data: serviceData, error: serviceError, loading: serviceLoading, refetch } = useQuery(ALL_SERVICES, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    })
    const handleSelectService = (selectedOption: any) => {
        console.log(selectedOption)
        setSelectedSerivces(selectedOption)
    }
    useEffect(() => {
        if (serviceData) {
            setServices(serviceData.services.data)
        }
        if (serviceError) {
            console.log("service api error", serviceError)
        }
    }, [serviceData])
    const onSubmit = (data: IFormInputs) => {
        setLoading(true)
        const voucherPayload = {
          name: data.name,
          value: data.voucherValue,
          retail: data.retailPrice,
          valid_for: data.validitytime,
          limit_number_of_sales_enable: saleLimitofVourcher,
          limit_number_of_sales: saleLimitofVourcher ? parseInt(data.numberOfValeVourcher) : 0,
          services_included: selectedSerivces.length > 0
              ? selectedSerivces.map((item: any) => ({value: item.value, label: item.label}))
              : [],
          enable_online_sales: onlineSale,
          title: data.title,
          description: data.description,
          color: data.color
            ? data.color
            : 'rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(197, 164, 86) 0%, rgb(96, 65, 49) 100%) repeat scroll 0% 0%',
          note: clientNote ? data.note : '',
        }
        addVoucher({
          variables: voucherPayload,
        })
          .then(({data}) => {
            if (data) {
              if (data.addVoucher.status === 1) {
                enqueueSnackbar(data.addVoucher.message, {
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
              } else if (data.addVoucher.status === 0) {
                enqueueSnackbar(data.addVoucher.message, {
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
            setLoading(false)
            enqueueSnackbar('Voucher cannot added!!!', {
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
          })
        // console.log("submited data",newdata)
    };
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
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="toolbar">
                        <Link className="close-btn" to="/vouchers"><i className="fas fa-times"></i></Link>
                        <h2 className="page-title mb-0">Create voucher</h2>
                        {/* <button type="submit" className="submit-btn save-btn">Save</button> */}
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
                                                    autoComplete="off"
                                                    {...register("name")}
                                                    onKeyPress={(e: any) => { handleWhiteSpce(e) }} 
                                                />
                                                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
                                            </Form.Group>

                                            <Row className="my-4">
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Value</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="text" step=".01" min="0"
                                                                {...register("voucherValue")}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                            {errors.voucherValue && <p style={{ color: "red" }}>{errors.voucherValue.message}</p>}
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="amount">
                                                        <Form.Label>Retail price</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text id="basic-addon1">{currency(countryName)}</InputGroup.Text>
                                                            <Form.Control type="text" step=".01" min="0"
                                                                {...register("retailPrice")}
                                                                onKeyPress={(event: any) => {
                                                                    if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                            {errors.retailPrice && <p style={{ color: "red" }}>{errors.retailPrice.message}</p>}
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-5" controlId="valid-for">
                                                <Form.Label>Valid for</Form.Label>
                                                <Form.Select aria-label="valid-for" {...register("validitytime")}>
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
                                                    onClick={() => { setSaleLimitofVourcher(!saleLimitofVourcher) }}
                                                />
                                            </Form.Group>
                                            {
                                                saleLimitofVourcher &&
                                                <Form.Group className="mb-3" controlId="num-of-sales">
                                                    <Form.Label>Number of sales</Form.Label>
                                                    <Form.Select aria-label="num-of-sales" {...register("numberOfValeVourcher")} >
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
                                                    options={services}
                                                    onChange={(options) => handleSelectService(options)}

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
                                                <Form.Control type="text" placeholder="Add a voucher title" {...register("title")} 
                                                    onKeyPress={(e: any) => { handleWhiteSpce(e) }} 
                                                />
                                                {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="voucher-desc">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <Form.Label>Voucher description</Form.Label>
                                                    <span>0/500</span>
                                                </div>
                                                <textarea id="srvice-desc" placeholder="Add a short description" {...register("description")} ></textarea>
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
                                                                {...register("color")}
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(95, 171, 255) 0%, rgb(11, 109, 217) 100%) repeat scroll 0% 0%"
                                                                id="color-field1"
                                                            />
                                                            <div className={`${colorCode === "1" ? "color_picker" : ""}`} onClick={e => setColorCode("1")}>
                                                                <span title="blue" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(95, 171, 255) 0%, rgb(11, 109, 217) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field2">
                                                            <input
                                                                className="color_input_field"
                                                                {...register("color")}
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(32, 48, 71) 0%, rgb(16, 25, 40) 100%) repeat scroll 0% 0%"
                                                                id="color-field2"
                                                            />
                                                            <div className={`${colorCode === "2" ? "color_picker" : ""}`} onClick={e => setColorCode("2")}>
                                                                <span title="dark" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(32, 48, 71) 0%, rgb(16, 25, 40) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field3">
                                                            <input
                                                                className="color_input_field"
                                                                {...register("color")}
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(0, 166, 156) 0%, rgb(0, 157, 98) 100%) repeat scroll 0% 0%"
                                                                id="color-field3"
                                                            />
                                                            <div className={`${colorCode === "3" ? "color_picker" : ""}`} onClick={e => setColorCode("3")}>
                                                                <span title="green" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(0, 166, 156) 0%, rgb(0, 157, 98) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field4">
                                                            <input
                                                                className="color_input_field"
                                                                {...register("color")}
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(237, 176, 27) 0%, rgb(222, 100, 38) 100%) repeat scroll 0% 0%"
                                                                id="color-field4"
                                                            />
                                                            <div className={`${colorCode === "4" ? "color_picker" : ""}`} onClick={e => setColorCode("4")}>
                                                                <span title="orange" style={{ background: "rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(237, 176, 27) 0%, rgb(222, 100, 38) 100%) repeat scroll 0% 0%" }} ></span>
                                                            </div>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor="color-field5">
                                                            <input
                                                                className="color_input_field"
                                                                {...register("color")}
                                                                type="radio"
                                                                name="color"
                                                                value="rgba(0, 0, 0, 0) linear-gradient(-45deg, rgb(190, 74, 244) 0%, rgb(92, 55, 246) 100%) repeat scroll 0% 0%"
                                                                id="color-field5"
                                                            />
                                                            <div className={`${colorCode === "5" ? "color_picker" : ""}`} onClick={e => setColorCode("5")}>
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
                                            <Form.Group className="my-5" controlId="client-notes">
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Enable notes for guests"
                                                    onClick={() => { setClientNote(!clientNote) }}
                                                />
                                            </Form.Group>

                                            {
                                                clientNote &&
                                                <Form.Group className="mb-3" controlId="client-note">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <Form.Label>Note</Form.Label>
                                                        <span>0/500</span>
                                                    </div>
                                                    <textarea id="client-note" {...register("note")} ></textarea>
                                                </Form.Group>
                                            }
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

export default VoucherAdd;