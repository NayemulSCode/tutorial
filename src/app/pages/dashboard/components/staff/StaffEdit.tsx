import React, {FC, useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {Card, Form, Row, Col, Button} from 'react-bootstrap-v5'
import {useMutation, useQuery} from '@apollo/client'
import {useSnackbar} from 'notistack'
import {useForm, Controller} from 'react-hook-form'
import Avatar1 from '../../../../../_metronic/assets/images/avatars/blank.png'
import {STAFF_UPDATE} from '../../../../../gql/Mutation'
import {SINGLE_STAFF_INFO} from '../../../../../gql/Query'
import {IStaff} from '../../../../../types'
import {imageUrl} from '../../../../modules/util'
import {useTostMessage} from '../../../../modules/widgets/components/useTostMessage'

type QuizParams = {
  id: string
}

const StaffEdit: FC = () => {
  const {id} = useParams<QuizParams>()
  const {enqueueSnackbar} = useSnackbar()
  const history = useHistory()
  const {showToast} = useTostMessage()
  const imageBaseURL = `${imageUrl}/uploads/staff/`

  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgurl] = useState('')

  const {data: StaffData} = useQuery(SINGLE_STAFF_INFO, {variables: {id: +id}})

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      photo: '',
    },
  })

  useEffect(() => {
    if (StaffData) {
      const {name, email, mobile, photo} = StaffData.staff
      setValue('name', name || '')
      setValue('email', email || '')
      setValue('mobile', mobile || '')
      setValue('photo', photo || '')
    }
  }, [StaffData, setValue])

  const [updateStaff] = useMutation(STAFF_UPDATE, {
    onError(err) {
      console.log('GraphQL error:', err)
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImgurl(result)
        setValue('photo', result) // Update form value with base64 image
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data:any) => {
    setLoading(true)
    try {
      const {data: updateData} = await updateStaff({
        variables: {id: +id, ...data},
      })
      if (updateData.updateStaff.status === 1) {
        showToast(updateData.updateStaff.message, 'success')
        history.push('/staff/employees')
      } else {
        showToast(updateData.updateStaff.message, 'error')
      }
    } catch {
      showToast('Staff Update Failed', 'error')
    }
    setLoading(false)
  }

  return (
    <section id='staff-add' className='ptc'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='toolbar d-flex align-items-center justify-content-between'>
          <Link className='close-btn' to='/staff/employees'>
            <i className='fas fa-times'></i>
          </Link>
          <h2 className='page-title mb-0'>Update Staff Information</h2>
          <Button type='submit' className='submit-btn save-btn' disabled={loading}>
            {loading ? (
              <span className='indicator-progress'>
                Updating...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            ) : (
              <span className='indicator-label'>Update</span>
            )}
          </Button>
        </div>

        <Row>
          <Col sm={8}>
            <Card className='primary-bx-shadow'>
              <Card.Text>
                <div className='form-heading'>
                  <h2 className='section-title mb-0'>Basic info</h2>
                </div>
                <div className='basic-info-form'>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Controller
                      name='name'
                      control={control}
                      rules={{required: 'Name is required'}}
                      render={({field}) => (
                        <Form.Control
                          type='text'
                          placeholder='Enter name'
                          {...field}
                          onKeyPress={(e: any) => {
                            if (e.key === ' ' && !field.value) {
                              e.preventDefault()
                            }
                          }}
                        />
                      )}
                    />
                    {errors.name && <p className='error-text'>{errors.name.message}</p>}
                  </Form.Group>

                  <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Controller
                      name='email'
                      control={control}
                      rules={{required: 'Email is required'}}
                      render={({field}) => (
                        <Form.Control type='email' placeholder='Enter email' {...field} />
                      )}
                    />
                    {errors.email && <p className='error-text'>{errors.email.message}</p>}
                  </Form.Group>

                  <Form.Group className='mb-3' controlId='mobile'>
                    <Form.Label>Mobile</Form.Label>
                    <Controller
                      name='mobile'
                      control={control}
                      rules={{
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[0-9+]*$/,
                          message: 'Only numbers are allowed',
                        },
                      }}
                      render={({field}) => (
                        <Form.Control
                          type='text'
                          placeholder='Enter mobile number'
                          {...field}
                          onKeyPress={(e: any) => {
                            if (/([^+0-9]+)/gi.test(e.key)) {
                              e.preventDefault()
                            }
                          }}
                        />
                      )}
                    />
                    {errors.mobile && <p className='error-text'>{errors.mobile.message}</p>}
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
                <Controller
                  name='photo'
                  control={control}
                  render={({field}) => (
                    <input
                      type='file'
                      accept='image/png, image/jpg, image/jpeg'
                      onChange={handleImageUpload}
                    />
                  )}
                />
                {/* <Form.Group controlId='photo'>
                  <input
                    type='file'
                    accept='image/png, image/jpg, image/jpeg'
                    onChange={handleImageUpload}
                  />
                </Form.Group> */}
                <img src={imgUrl || imageBaseURL + watch('photo') || Avatar1} alt='Staff Avatar' />
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </section>
  )
}

export {StaffEdit}
