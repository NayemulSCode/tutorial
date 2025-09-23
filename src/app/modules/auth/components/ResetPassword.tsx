import React, { FC, useState} from 'react'
import * as Yup from 'yup'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik'
import clsx from 'clsx'
import { RESET_PASSWORD } from '../../../../gql/Mutation';
import { useMutation } from '@apollo/client';
import { useTostMessage } from '../../widgets/components/useTostMessage';
type QuizParams = {
  token: string;
};
const resetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/])[A-Za-z\d@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and one special case Character'
    ),
  changepassword: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password confirmation is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/])[A-Za-z\d@$!%*#?&~`^()_\-+={[}\]|:;"'<,.>?\\/]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and one special case Character'
    )
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
})
const initialValues = {
  email: '',
  password: "",
  changepassword: ""
}
const ResetPassword: FC = () => {
  const history = useHistory()
  const {showToast} = useTostMessage()
  const {token} = useParams<QuizParams>();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  // password hide and show
  const [isPasswordShown1, setIsPasswordShown1] = useState(false);
  const [isPasswordShown2, setIsPasswordShown2] = useState(false);
  const togglePass1 = () => {
    const getPassword: any = document.getElementById("new_password");
    setIsPasswordShown1(!isPasswordShown1)
    if (!isPasswordShown1) {
      getPassword.type = "text";
      return true; // Password is visible
    } else {
      getPassword.type = "password";
      return false; // Password is not visible
    }
  }
  const togglePass2 = () => {
    setIsPasswordShown2(!isPasswordShown2)
    const getPassword: any = document.getElementById("confirm_new_pass");
    setIsPasswordShown2(!isPasswordShown2)
    if (!isPasswordShown2) {
      getPassword.type = "text";
      return true; // Password is visible
    } else {
      getPassword.type = "password";
      return false; // Password is not visible
    }
  }

  const [resetPassword] = useMutation(RESET_PASSWORD, {
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

  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      // console.log("entered email for forget>>>", values.email, values.password, values.changepassword)
      if (values.email) {
        resetPassword({
          variables: {
            email: values.email,
            token: token,
            password: values.password,
            password_confirmation: values.changepassword
          }
        }).then(({ data }) => {
          if (data) {
            if (data?.resetPassword?.status === 0){
              setLoading(false)
              showToast(data?.resetPassword?.message, 'error')
            }else{
              showToast(data?.resetPassword?.message, 'success')
              setLoading(false)
              history.push('/auth/login')
            }
          }
          // console.log("forget pass email reposse", data);
        }).catch((error) => {
          // console.log("forget pass email error reposse", error)
        })
      }
    },
  })
    return (
        <>
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
          <form
            className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
            noValidate
            id='kt_login_password_reset_form'
            onSubmit={formik.handleSubmit}
          >
            <div className='text-center mb-10'>
              <h1 className='text-dark mb-3'>Reset Password</h1>
            </div>
            <div className='fv-row mb-10'>
              <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
              <input
                type='email'
                placeholder='Enter your email'
                autoComplete='off'
                {...formik.getFieldProps('email')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  { 'is-invalid': formik.touched.email && formik.errors.email },
                  {
                    'is-valid': formik.touched.email && !formik.errors.email,
                  }
                )}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.email}</span>
                  </div>
                </div>
              )}
            </div>
            <div className='fv-row mb-10'>
              <label className='form-label fw-bolder text-gray-900 fs-6'>New Password</label>
              <div className="passWrap1">
                <input
                  type='password'
                  placeholder='Enter your password.'
                  id="new_password"
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    // { 'is-invalid': formik.touched.password && formik.errors.password },
                    // {
                    //   'is-valid': formik.touched.password && !formik.errors.password,
                    // }
                  )}
                />
                <span><i 
                  className={`${isPasswordShown1 ? 'fa fa-eye' : 'fa fa-eye-slash'}`} 
                  onClick={() => togglePass1()}></i></span>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block text-danger'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            <div className='fv-row mb-5'>
              <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
              <div className="passWrap2">
                <input
                  type='password'
                  placeholder='Password confirmation'
                  id="confirm_new_pass"
                  autoComplete='off'
                  {...formik.getFieldProps('changepassword')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    // {
                    //   'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
                    // },
                    // {
                    //   'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
                    // }
                  )}
                />
                <span>
                  <i className={`${isPasswordShown2 ? 'fa fa-eye' : 'fa fa-eye-slash'}`} onClick={()=>togglePass2()}></i>
                </span>
              </div>
              {formik.touched.changepassword && formik.errors.changepassword && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block text-danger'>
                    <span role='alert'>{formik.errors.changepassword}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
              <button
                type='submit'
                id='kt_password_reset_submit'
                className='btn btn-lg btn-primary fw-bolder me-4'
              >
                <span className='indicator-label'>Update Password</span>
                {loading && (
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link to='/auth/login'>
                <button
                  type='button'
                  id='kt_login_password_reset_form_cancel_button'
                  className='btn btn-lg btn-light-primary fw-bolder'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Cancel
                </button>
              </Link>{' '}
            </div>
            {/* end::Form group */}
          </form>
        </div>
        </>
    )
}

export  default ResetPassword
