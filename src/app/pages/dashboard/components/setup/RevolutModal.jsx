import React,{useState, useRef, useEffect} from 'react'
import { Button, Form, Modal, Spinner } from "react-bootstrap-v5";
import RevolutCheckout from "@revolut/checkout";
import { useHistory } from 'react-router-dom';
import { getData } from "country-list";
import { REVOLUT_PAY_CONFIRM } from '../../../../../gql/Mutation';
import GetIp from '../../../../modules/widgets/components/GetIp'
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';

const RevolutModal = ({showRevolut, closeModalRevolut, order, revolutId, amount, subscribeId}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [code, setCode] = useState("IE");
    const rcRef = useRef(null);
    const cardElementRef = useRef(null);
    const [cardErrors, setCardErrors] = useState([]);
    const [loader, setLoader] = useState(false);
    const userLocation = GetIp();
    const history = useHistory();
    const [revolutPaymentForSubscribed] = useMutation(REVOLUT_PAY_CONFIRM);
    useEffect(() => {
        if (!order) return;
        const mode =
          window.location.host.includes('localhost:3011') ||
          window.location.host.includes('partner.chuzeday.teknotunes.com')
            ? 'sandbox'
            : 'prod'
        RevolutCheckout(order, mode).then((RC) => {
          rcRef.current = RC.createCardField({
            target: cardElementRef.current,
            hidePostcodeField: true,
            styles: {
              default: {
                color: '#212529',
                '::placeholder': {
                  color: '#666',
                },
              },
              autofilled: {
                color: '#212529',
              },
            },
            onValidation(errors) {
              setCardErrors(errors)
              if (errors.length > 0) {
                setLoader(false)
              }
            },
            onSuccess() {
              revolutPaymentForSubscribed({
                variables: {
                  subscribed_id: subscribeId,
                  order_id: revolutId,
                },
              })
                .then(({data}) => {
                  console.log(data)
                  if (data.revolutPaymentForSubscribed) {
                    setLoader(false)
                    if (data.revolutPaymentForSubscribed.status === 1) {
                        console.log('if success block', data.revolutPaymentForSubscribed)
                      enqueueSnackbar(data.revolutPaymentForSubscribed.message, {
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
                      closeModalRevolut()
                      history.push('/payment-success')
                      // window.open(data.revolutPaymentForSubscribed.payment_url, "__blank");
                    } else {
                    console.log('else error block', data.revolutPaymentForSubscribed)
                      enqueueSnackbar(data.revolutPaymentForSubscribed.message, {
                        variant: 'warning',
                        anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                        },
                        transitionDuration: {
                          enter: 300,
                          exit: 500,
                        },
                      })
                      closeModalRevolut()
                      history.push('/payment-fail')
                    }
                  }
                })
                .catch((e) => {
                  console.log('error catch', e)
                  enqueueSnackbar('Internal server error!', {
                    variant: 'warning',
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                    transitionDuration: {
                      enter: 300,
                      exit: 500,
                    },
                  })
                  closeModalRevolut()
                  history.push('/payment-fail')
                  setLoader(false)
                })
            },
            onError(error) {
              console.log('error.message enError block', error.message)
              enqueueSnackbar(error.message, {
                variant: 'warning',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                transitionDuration: {
                  enter: 300,
                  exit: 500,
                },
              })
              setLoader(false)
            },
            onCancel() {
              renewOrder(order)
              setLoader(false)
            },
          })
        })

        return () => {
            rcRef.current.destroy();
        };
    }, [order]);

    //-----------------country code from IP address-----------------------
    useEffect(() => {
        if (userLocation) {
            setCode(userLocation.country_code)
        }
    }, [userLocation])

    async function handleFormSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data.get("name"), data.get("email"), data.get("region"), data.get("city"), data.get("streetLine1"), data.get("streetLine2"), data.get("postcode"));
        if (data.get("email") === "") {
            enqueueSnackbar("Please enter your email address!", {
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
        } else if (data.get("region") === "") {
            enqueueSnackbar("Please enter your region!", {
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
        } else if (data.get("city") === "") {
            enqueueSnackbar("Please enter your city!", {
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
        } else if (data.get("streetLine1") === "") {
            enqueueSnackbar("Please enter your Address line 1!", {
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
        } else if (data.get("postcode") === "") {
            enqueueSnackbar('"Please enter your post code!', {
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
        } else {
            setLoader(true);
            rcRef.current.submit({
                name: data.get("name"),
                email: data.get("email"),
                billingAddress: {
                    countryCode: data.get("countryCode"),
                    region: data.get("region"),
                    city: data.get("city"),
                    streetLine1: data.get("streetLine1"),
                    streetLine2: data.get("streetLine2"),
                    postcode: data.get("postcode")
                }
            });
        }
    }
    async function renewOrder(id) {
        const response = await fetch(`/api/orders/${id}/renew`, { method: "POST" });
        const order = await response.json();
        // Router.replace(`/?order=${order.id}`);
        console.log("cancel");
    }

    if (order === null) {
        return (
            <>
                <h2>Checkout</h2>
                <h3>Order not found</h3>
            </>
        );
    }
  return (
    <div>
        <Modal
            dialogClassName="revolut_modal"
            show={showRevolut}
            onHide={closeModalRevolut}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="" closeButton>
                <h2 className="adv-price-modal-title">Payment Information</h2>
            </Modal.Header>
            <Form  onSubmit={handleFormSubmit}>
                <Modal.Body>
                <span className="title">Contact</span>
        <div className="row mb-3">
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                        name="name"
                        autoComplete="name"
                        placeholder="Name"
                    />
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                    />
                </Form.Group>
            </div>
        </div>
        <span className="title">Billing</span>
        <div className="row">
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Card Number*</Form.Label>
                    <div className="form-field" ref={cardElementRef} />
                    <div className="form-control" ref={cardElementRef}>Card*</div>
                    <p className="text-danger">
                        {cardErrors.map(
                            error =>
                                // you can use `error.type` to customise message
                                error.message
                        )}
                    </p>
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Country*</Form.Label>
                    <select
                        className="form-control"
                        name="countryCode"
                        value={code}
                        onChange={(e) => { setCode(e.target.value) }}
                        required
                    >
                        {getData().map(country => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Region*</Form.Label>
                    <Form.Control
                        name="region"
                        autoComplete="address-level1"
                        placeholder="Region"
                    />
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>City*</Form.Label>
                    <Form.Control
                        name="city"
                        autoComplete="address-level2"
                        placeholder="City"
                    />
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Address line 1*</Form.Label>
                    <Form.Control
                        name="streetLine1"
                        autoComplete="address-line1"
                        placeholder="Street, house number"
                    />
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Address line 2</Form.Label>
                    <Form.Control
                        name="streetLine2"
                        autoComplete="address-line2"
                        placeholder="Appartment, building"
                    />
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Postal code*</Form.Label>
                    <Form.Control
                        name="postcode"
                        autoComplete="postal-code"
                        placeholder="Postal code"
                    />
                </Form.Group>
            </div>
        </div>
        <div className="d-flex justify-content-center mt-3">
            <button className="primaryBtn btn d-flex" style={{color: '#ffffff', backgroundColor: '#740030'}} disabled={loader}>
                Pay {amount}
                {
                    loader &&
                    <div className="ms-2"><Spinner animation="border" /></div>
                }
            </button>
        </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button  className="category-save-btn submit-btn">Continue</Button>
                </Modal.Footer> */}
            </Form>
        </Modal>
    </div>
  )
}

export default RevolutModal