/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, FC, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useHistory, useParams,useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik'
import { useForm, SubmitHandler } from "react-hook-form";
import * as auth from '../redux/AuthRedux'
import {setOnboardingActive} from '../../onboarding/onboardingSlice'
import { login } from '../redux/AuthCRUD'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { AUTH_LOGIN, SYSTEM_LOG } from '../.../../../../../gql/Mutation';
import { AppContext } from '../../../../../src/context/Context'
import Cookies from 'universal-cookie';
import { useTostMessage } from '../../widgets/components/useTostMessage'
import { print } from 'graphql'
import { systemLogPayload } from '../../util'
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

type Inputs = {
  email: string;
  password: string;
}

const Login: FC = () => {
  const cookies = new Cookies();
  const searchParam = new URLSearchParams(useLocation().search)
  const currentUrl = window.location.href;
  // console.log("current url", currentUrl)
  const msg = searchParam?.get("message");
  if(msg){
    // console.log("search param", msg)
  }
  const { authToken, token, addUser, user } = useContext(AppContext)
  const history = useHistory();
  const {showToast} = useTostMessage()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const [isPasswordShown1, setIsPasswordShown1] = useState(false);
  const togglePass1 = () => {
    setIsPasswordShown1(!isPasswordShown1)
  }
  const [system_log] = useMutation(SYSTEM_LOG)
  const [login, { data: loginData, error: loginError, loading: loginLoading }] = useMutation(AUTH_LOGIN, {
    onError(err: any) {
      showToast(err.graphQLErrors[0].extensions.reason, 'error')
    }
  });
  const AUTH_LOGIN_STRING = print(AUTH_LOGIN)
  const onSubmit: SubmitHandler<Inputs> = data => {
    // console.log(data);
    setLoading(true);
    if (data.email && data.password) {
      login({
        variables: {
          username: data.email,
          password: data.password,
        }
      }).then(({ data }) => {
        if (data) {
          // console.log("user data",data.login?.user?.user_type)
          if(data.login?.user?.user_type === 1){
            cookies.set('remember_employee_token', data?.login?.access_token, { maxAge: 1209600, secure: true, sameSite: 'lax' });
            localStorage.setItem('token', data?.login?.access_token);
            localStorage.setItem('partner', JSON.stringify(data?.login?.user))
            authToken(data?.login?.access_token);
            addUser(data?.login?.user)
            if (data.login.user.approved_status !== 'approved') {
              dispatch(setOnboardingActive(true))
            }
            showToast('Successfully Login', 'success')
            if (
              data.login.access_token &&
              Array.isArray(data.login.user.business_type) &&
              data.login.user.business_type.length > 0
            ) {
              history.push('/home')
            } else if (data.login.user.business_type.length === 0) {
              history.push('/account/setup')
            }
          }
          else{
            system_log({
              variables: {
                ...systemLogPayload,
                api: AUTH_LOGIN_STRING,
                type: 'partner-login-error',
                body: JSON.stringify(data.email),
                response: JSON.stringify(data),
              },
            })
            showToast('Please login with business account!', 'warning')
          }
          
        }
        setLoading(false);

      }).catch((error) => {
        system_log({
          variables: {
            ...systemLogPayload,
            api: AUTH_LOGIN_STRING,
            type: 'partner-login-error',
            body: JSON.stringify(data.email),
            exception: JSON.stringify(error),
          },
        })
        showToast('Login failed', 'error');
        setLoading(false);
      })

    } else {
       showToast("invalid input field", 'error')
    }

  };
  useEffect(()=>{
    if(msg){
      
      showToast(msg, 'info')
    }
  }, [])
  useEffect(() => {
    if (loginData) {
      // console.log(loginData)
    }
    if (loginError) {
      // console.log(loginError)
    }
  }, [loginData])

  return (
    <>
      <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
        <form
          className='form w-100'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          id='kt_login_signin_form'
        >
          <h2 className='text-center mb-8'>Business User Log In</h2>
          {/* begin::Heading */}
          {/* <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Sign In to Chuzeday</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          New Here?{' '}
          <Link to='/auth/registration' className='link-primary fw-bolder'>
            Create an Account
          </Link>
        </div>
      </div> */}
          {/* begin::Heading */}
          {/* 
      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded remove'>
          <div className='text-info'>
            Use account <strong>maxsmith@gmail.com</strong> and password <strong>demo</strong> to
            continue.
          </div>
        </div>
      )} */}

          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
            <input
              placeholder='Email'
              {...register("email", { required: true })}
              className={clsx(
                'form-control form-control-lg form-control-solid',
              )}
              type='email'
              name='email'
              autoComplete='off'
            />
            {errors.email && <span>This field is required</span>}

            <div className='fv-plugins-message-container'>
              <span role='alert'></span>
            </div>

          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <div className='d-flex justify-content-between mt-n5'>
              <div className='d-flex flex-stack mb-2'>
                {/* begin::Label */}
                <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                {/* end::Label */}
              </div>
            </div>
            <div className='passWrap1'>
              <input
                type={isPasswordShown1 ? "text" : "password"}
                autoComplete='off'
                placeholder="Password"
                {...register("password", { required: true })}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                )}
              />
              <i className={`fa ${isPasswordShown1 ? "fa-eye" : "fa-eye"} passwordIcon`}
                onClick={togglePass1}
              />
            </div>
            <div className="d-flex justify-content-between">
              {errors.password && <span>This field is required</span>}
              <div></div>
              {/* begin::Link */}
              <Link
                to='/auth/forgot-password'
                className='link-primary fs-6 fw-bolder mt-2'
                style={{ marginLeft: '' }}
              >
                Forgot Password ?
              </Link>
              {/* end::Link */}
            </div>

            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'></span>
              </div>
            </div>

          </div>
          {/* end::Form group */}

          {/* begin::Action */}
          <div className='text-center'>
            <button
              type='submit'
              id='kt_sign_in_submit'
              className='btn btn-lg btn-primary w-100 mb-5'
              disabled={loading}
            >
              {!loading && <span className='indicator-label' >Continue</span>}
              {loading && (
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {/* <div className='mb-2'>
              <h3>Don’t have a Business Account?</h3>
              <Link className="link-primary fs-6 fw-bolder" to="/auth/registration">Get Free Trial</Link>
            </div> */}
            {/* <a className="privacy-terms"
              href="https://chuzeday.com/system/privacy-policy"
              target='_blank'
            > Privacy Policy</a> */}

            {/* begin::Separator */}
            {/* <div className='text-center text-muted text-uppercase fw-bolder mb-5'>or</div> */}
            {/* end::Separator */}

            {/* begin::Google link */}
            {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
            className='h-20px me-3'
          />
          Continue with Google
        </a> */}
            {/* end::Google link */}

            {/* begin::Google link */}
            {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/facebook-4.svg')}
            className='h-20px me-3'
          />
          Continue with Facebook
        </a> */}
            {/* end::Google link */}

            {/* begin::Google link */}
            {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/apple-black.svg')}
            className='h-20px me-3'
          />
          Continue with Apple
        </a> */}
            {/* end::Google link */}
          </div>
          {/* end::Action */}
        </form>
      </div>
    </>
  )
}

export default Login;