import React, { FC, useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap-v5";
import Avatar1 from '../../../../../_metronic/assets/images/avatars/blank.png'
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { STAFF_CREATE } from '../../../../../gql/Mutation';
import { GET_ALL_SERVICES, ALL_PRODUCT_CATEGORY } from '../../../../../gql/Query';
import { width } from "@mui/system";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTostMessage } from "../../../../modules/widgets/components/useTostMessage";
const schema = yup.object().shape({
    name: yup
        .string()
        .matches(/^([^0-9]*)$/, "Name should not contain numbers")
        .required("Name is a required field"),
    email: yup
        .string()
        .email("Email should have correct format")
        .required("Email is a require field"),
});
type Inputs = {
  name: string
  email: string
  mobile: string
  photo: FileList
  photoBase64?: string // New property to store base64 string
}


const StaffAdd: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [imgUrl, setImgurl] = useState("");
    const history = useHistory();
    const {showToast} = useTostMessage()
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const selectedFile = watch('photo');

    const [addStaff] = useMutation(STAFF_CREATE, {
        onError(err: any) {
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
                  showToast(message, 'error')
                })
              })
              setLoading(false)
            } else {
              // If it's a different type of error, show the general reason
              showToast(extensions.reason || 'An unknown error occurred', 'error')
              setLoading(false)
            }
          } else {
            // Handle the case where there's no detailed GraphQL error
            showToast('An unknown error occurred', 'error')
          }
        }
    });

    const onSubmit: SubmitHandler<Inputs> = async data => {
       if (data.photo && data.photo[0]) {
          const base64 = await getBase64(data.photo[0]);
          data.photoBase64 = base64; 
        } // Store base64 in a separate property
        if (data) {
            setLoading(true)
            addStaff({
              variables: {
                name: data.name,
                photo: data.photoBase64,
                email: data.email,
                mobile: data.mobile,
              },
            })
              .then(({data}) => {
                if (data) {
                  if (data.addStaff.status == 1){
                    showToast(data.addStaff.message, 'success')
                    setLoading(false)
                    history.push('/staff/employees')
                  }else if(data.addStaff.status == 0){
                    showToast(data.addStaff.message, 'error')
                    setLoading(false)
                  }
                }
              })
              .catch((e) => {
                showToast(e.message, 'error');
                setLoading(false)
              })
        }
    };
    const getBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
      })
    }

    const onLoad = (fileString: any) => {
        console.log(fileString);
        setImgurl(fileString);
    };
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
        <section id='staff-add' className='ptc'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='toolbar d-flex align-items-center justify-content-between'>
              <Link className='close-btn' to='/staff/employees'>
                <i className='fas fa-times'></i>
              </Link>
              <h2 className='page-title mb-0'>Add new staff</h2>
              {/* <button type="submit" className="submit-btn save-btn">Save</button> */}
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='submit-btn save-btn'
                disabled={loading}
              >
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Saving...
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
                  <Card.Text>
                    <div className='form-heading'>
                      <h2 className='section-title mb-0'>Basic info</h2>
                    </div>
                    <div className='basic-info-form p-30'>
                      <Form.Group className='mb-3' controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter name'
                          autoComplete='off'
                          {...register('name')}
                          onKeyPress={(e: any) => {
                            handleWhiteSpce(e)
                          }}
                        />
                        <small style={{color: 'red'}}>{errors?.name?.message}</small>
                      </Form.Group>

                      <Form.Group className='mb-3' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type='email'
                          autoComplete='off'
                          placeholder='Enter email'
                          {...register('email')}
                        />
                        <small style={{color: 'red'}}>{errors?.email?.message}</small>
                      </Form.Group>

                      <Form.Group className='mb-3' controlId='mobile'>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter mobile number'
                          autoComplete='off'
                          {...register('mobile')}
                          onKeyPress={(e: any) => {
                            handleWhiteSpce(e)
                            if (/([^+0-9]+)/gi.test(e.key)) {
                              e.preventDefault()
                            }
                          }}
                        />
                      </Form.Group>
                    </div>
                  </Card.Text>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className='primary-bx-shadow'>
                  <div className='form-heading'>
                    <h2 className='section-title mb-0'>Staff Photo</h2>
                  </div>
                  <div className='add-staff-right-body p-30'>
                    <input
                      type='file'
                      accept='image/png, image/jpg, image/jpeg'
                      {...register('photo')}
                      className='form-control'
                    />
                    {selectedFile && selectedFile[0] && (
                      <img
                        src={URL.createObjectURL(selectedFile[0])}
                        alt='Preview'
                      />
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
            {/* </Container> */}
          </Form>
        </section>
      </>
    )
}

export default StaffAdd;