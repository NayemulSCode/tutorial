/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { KTSVG } from '../../../../../../_metronic/helpers'
import { useSnackbar } from 'notistack';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { AppContext } from '../../../../../../../src/context/Context';
// import {IUpdatePassword, IUpdateEmail, updatePassword, updateEmail} from '../SettingsModel'
import { PROFILE_INFORMATION } from '../../../../../../gql/Query';
import { UPDATE_PASSWORD, PARTNER_EMAIL_UPDATE } from '../../../../../../gql/Mutation';
import { useApolloClient } from "@apollo/client";
import { useTostMessage } from '../../../../widgets/components/useTostMessage';

const emailFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const passwordFormValidationSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/])[A-Za-z\d@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and one special case Character'
    ),
  password_confirmation: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/])[A-Za-z\d@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and one special case Character'
    )
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})
export interface IUpdatePassword {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export interface IUpdateEmail {
  email: string;
  password: string;
}

const SignInMethod: React.FC<{ accInfo: any }> = ({ children, accInfo }) => {
  const { authToken, token, user} = useContext(AppContext);
  const {showToast} = useTostMessage()
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const authtoken = localStorage.getItem('token');
  const [isPasswordShown1, setIsPasswordShown1] = useState<boolean>(false);
  const togglePass1 = () => {
    setIsPasswordShown1(!isPasswordShown1)
  }
  const [isPasswordShown2, setIsPasswordShown2] = useState<boolean>(false);
  const togglePass2 = () => {
    setIsPasswordShown2(!isPasswordShown2)
  }
  const [isPasswordShown3, setIsPasswordShown3] = useState<boolean>(false);
  const togglePass3 = () => {
    setIsPasswordShown3(!isPasswordShown3)
  }
  const [isPasswordShown4, setIsPasswordShown4] = useState<boolean>(false);
  const togglePass4 = () => {
    setIsPasswordShown4(!isPasswordShown4)
  }
  const [updatePassword, {data, error, loading}] = useMutation(UPDATE_PASSWORD, {
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
              showToast(message, 'error')
            })
          })
        } else {
          // If it's a different type of error, show the general reason
          showToast(extensions.reason, 'error')
        }
      } else {
        // Handle the case where there's no detailed GraphQL error
        showToast('An unknown error occurred', 'error')
      }
    },
  })
  const [partnerEmailUpdate] = useMutation(PARTNER_EMAIL_UPDATE, {
    refetchQueries: [{ query: PROFILE_INFORMATION }],
    awaitRefetchQueries: true,
  });

  const [emailUpdateData, setEmailUpdateData] = useState<IUpdateEmail>({
    email: "", password: "",
  })
  const [passwordUpdateData, setPasswordUpdateData] = useState<IUpdatePassword>({
    old_password: "", password: "", password_confirmation: ""
  })

  const [showEmailForm, setShowEmailForm] = useState<boolean>(false)
  const [showPasswordForm, setPasswordForm] = useState<boolean>(false)

  const [loading1, setLoading1] = useState(false)

  const formik1 = useFormik<IUpdateEmail>({
    initialValues: {
      ...emailUpdateData,
    },
    validationSchema: emailFormValidationSchema,
    onSubmit: (values) => {
      setLoading1(true)
      partnerEmailUpdate({
        variables: {
          email: values.email,
          password: values.password,
        }
      }).then(({ data }) => {
        // console.log(data)
        showToast(data?.partnerEmailUpdate?.message, `${data?.partnerEmailUpdate?.status == 0 ? 'error' : 'success'}`)
        
        // {
        //   if (data?.partnerEmailUpdate?.status == 1)
        //     localStorage.removeItem('token'); client.cache.reset(); authToken("")
        // }

        setLoading1(false)
        if (data?.partnerEmailUpdate?.status == 0) {
          setShowEmailForm(true)
        } else {
          setShowEmailForm(false)
        }
      }).catch((e) => {
        // console.log(e)
        setLoading1(true)
        showToast("Cannot changed email",'error')
        setLoading1(false)
      })
    },
  })

  const [loading2, setLoading2] = useState(false)

  const formik2 = useFormik<IUpdatePassword>({
    initialValues: {
      ...passwordUpdateData,
    },
    validationSchema: passwordFormValidationSchema,
    onSubmit: (values) => {
      // console.log(values);
      setLoading2(true)
      updatePassword({
        variables: {
          token: authtoken,
          old_password: values.old_password,
          password: values.password,
          password_confirmation: values.password_confirmation
        }
      }).then(({ data }) => {
        // console.log(data);
        if (data?.updatePassword?.status === 1) {
          showToast(data?.updatePassword?.message, 'success')
           values.old_password = ''
           values.password = ''
           values.password_confirmation = ''
           setLoading2(false)
           setPasswordForm(false)
        }
        else {
          showToast(data?.updatePassword?.message, 'error')
          setLoading2(false)
        }
      })
     
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_signin_method'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Sign-in Method</h3>
        </div>
      </div>

      <div id='kt_account_signin_method' className='collapse show'>
        <div className='card-body border-top p-9'>
          <div className='d-flex flex-wrap align-items-center'>
            <div id='kt_signin_email' className={' ' + (showEmailForm && 'd-none')}>
              <div className='fs-6 fw-bolder mb-1'>Email Address</div>
              <div className='fw-bold text-gray-600'>{accInfo?.email}</div>
            </div>

            <div
              id='kt_signin_email_edit'
              className={'flex-row-fluid ' + (!showEmailForm && 'd-none')}
            >
              <form
                onSubmit={formik1.handleSubmit}
                id='kt_signin_change_email'
                className='form'
                noValidate
              >
                <div className='row mb-6'>
                  <div className='col-lg-6 mb-4 mb-lg-0'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='emailaddress' className='form-label fs-6 fw-bolder mb-3'>
                        Enter New Email Address
                      </label>
                      <input
                        type='email'
                        className='form-control form-control-lg form-control-solid'
                        id='emailaddress'
                        placeholder='Email Address'
                        {...formik1.getFieldProps('email')}
                      />
                      {formik1.touched.email && formik1.errors.email && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik1.errors.email}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='fv-row mb-0'>
                      <label
                        htmlFor='confirmemailpassword'
                        className='form-label fs-6 fw-bolder mb-3'
                      >
                        Confirm Password
                      </label>
                      <div className='passWrap1'>
                      <input
                        type={isPasswordShown1 ? "text" : "password"}
                        className='form-control form-control-lg form-control-solid'
                        id='confirmemailpassword'
                        autoComplete='off'
                        {...formik1.getFieldProps('password')}
                      />
                      <i className={`fa ${isPasswordShown1 ? "fa-eye" : "fa fa-eye-slash"} passwordIcon`}
                        onClick={togglePass1}
                      />
                      </div>
                      {formik1.touched.password && formik1.errors.password && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik1.errors.password}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                  <button
                    id='kt_signin_submit'
                    type='submit'
                    className='btn btn-primary  me-2 px-6'
                    disabled={loading1}
                  >
                    {!loading1 && 'Update Email'}
                    {loading1 && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    id='kt_signin_cancel'
                    type='button'
                    onClick={() => {
                      setShowEmailForm(false)
                    }}
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div id='kt_signin_email_button' className={'ms-auto ' + (showEmailForm && 'd-none')}>
              <button
                onClick={() => {
                  setShowEmailForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                Change Email
              </button>
            </div>
          </div>

          <div className='separator separator-dashed my-6'></div>

          <div className='d-flex flex-wrap align-items-center mb-10'>
            <div id='kt_signin_password' className={' ' + (showPasswordForm && 'd-none')}>
              <div className='fs-6 fw-bolder mb-1'>Password</div>
              <div className='fw-bold text-gray-600'>************</div>
            </div>

            <div
              id='kt_signin_password_edit'
              className={'flex-row-fluid ' + (!showPasswordForm && 'd-none')}
            >
              <form
                onSubmit={formik2.handleSubmit}
                id='kt_signin_change_password'
                className='form'
                noValidate
              >
                <div className='row mb-1'>
                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='old_password' className='form-label fs-6 fw-bolder mb-3'>
                        Old Password
                      </label>
                      <div className='passWrap1'>
                        <input
                          type={isPasswordShown2 ? "text" : "password"}
                          className='form-control form-control-lg form-control-solid '
                          id='old_password'
                          autoComplete='off'
                          {...formik2.getFieldProps('old_password')}
                        />
                        <i className={`fa ${isPasswordShown2 ? "fa-eye" : "fa fa-eye-slash"} passwordIcon`}
                          onClick={togglePass2}
                        />
                      </div>
                      {formik2.touched.old_password && formik2.errors.old_password && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik2.errors.old_password}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='password' className='form-label fs-6 fw-bolder mb-3'>
                        New Password
                      </label>
                      <div className='passWrap1'>
                        <input
                          type={isPasswordShown3 ? "text" : "password"}
                          className='form-control form-control-lg form-control-solid '
                          id='password'
                          autoComplete='off'
                          {...formik2.getFieldProps('password')}
                        />
                        <i className={`fa ${isPasswordShown3 ? "fa-eye" : "fa fa-eye-slash"} passwordIcon`}
                          onClick={togglePass3}
                        />
                      </div>
                      {formik2.touched.password && formik2.errors.password && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik2.errors.password}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='password_confirmation' className='form-label fs-6 fw-bolder mb-3'>
                        Confirm New Password
                      </label>
                      <div className='passWrap1'>
                        <input
                          type={isPasswordShown4 ? "text" : "password"}
                          className='form-control form-control-lg form-control-solid '
                          id='password_confirmation'
                          autoComplete='off'
                          {...formik2.getFieldProps('password_confirmation')}
                        />
                       <i className={`fa ${isPasswordShown4 ? "fa-eye" : "fa fa-eye-slash"} passwordIcon`}
                          onClick={togglePass4}
                        />
                      </div>
                      {formik2.touched.password_confirmation && formik2.errors.password_confirmation && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik2.errors.password_confirmation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='form-text mb-5'>

                </div>

                <div className='d-flex'>
                  <button
                    id='kt_password_submit'
                    type='submit'
                    className='btn btn-primary me-2 px-6'
                    disabled={loading2}
                  >
                    {!loading2 && 'Update Password'}
                    {loading2 && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPasswordForm(false)
                    }}
                    id='kt_password_cancel'
                    type='button'
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div
              id='kt_signin_password_button'
              className={'ms-auto ' + (showPasswordForm && 'd-none')}
            >
              <button
                onClick={() => {
                  setPasswordForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                Update Password
              </button>
            </div>
          </div>

          {/* <div className='notice d-flex bg-light-primary rounded border-primary border border-dashed p-6'>
            <KTSVG
              path='/media/icons/duotune/general/gen048.svg'
              className='svg-icon-2tx svg-icon-primary me-4'
            />
            <div className='d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap'>
              <div className='mb-3 mb-md-0 fw-bold'>
                <h4 className='text-gray-800 fw-bolder'>Secure Your Account</h4>
                <div className='fs-6 text-gray-600 pe-7'>
                  Two-factor authentication adds an extra layer of security to your account. To log
                  in, in addition you'll need to provide a 6 digit code
                </div>
              </div>
              <a
                href='#'
                className='btn btn-primary px-6 align-self-center text-nowrap'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_two_factor_authentication'
              >
                Enable
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export { SignInMethod }
