import React, { FC } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { SERVICE_CATEGORY_CREATE } from '../../../../../gql/Mutation';
import { useHistory } from 'react-router-dom'
import { SERVICE_CATEGORIES } from '../../../../../gql/Query';
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

interface IFormInputs {
    categoryName: string;
}

type Props = {
    showCat: boolean
    handleCloseCat: () => void
}
const AddCategoryModal: FC<Props> = ({ showCat, handleCloseCat }) => {
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar();
    const [addServiceCategory] = useMutation(SERVICE_CATEGORY_CREATE, {
        refetchQueries: [{
            query: SERVICE_CATEGORIES,
            variables: {
                type: "",
                count: 10,
                page: 1
            }
        }],
        awaitRefetchQueries: true,
    })
    const {
        register,
        reset,
        formState: { errors },
        handleSubmit
    } = useForm<IFormInputs>({
        criteriaMode: "all"
    });
    const onSubmit = (data: IFormInputs) => {
        if (data) {
            addServiceCategory({
                variables: {
                    name: data.categoryName,
                }
            }).then(({ data }) => {
                if (data) {
                    enqueueSnackbar("Category Added successfully", {
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
                    history.push('/services/categories')
                }
                // console.log(data)
            })
            reset();
            handleCloseCat();
        }
    }
    return (
      <>
        <Modal
          dialogClassName='modal_400'
          show={showCat}
          onHide={handleCloseCat}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header className='' closeButton>
            <h2 className='adv-price-modal-title'>New Service Category</h2>
          </Modal.Header>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              <div className='row'>
                <div className='col-md-6'>
                  <Form.Group className='mb-3'>
                    <Form.Label>Category name</Form.Label>
                    <Form.Control
                      type='text'
                      autoComplete='off'
                      placeholder='e.g. Hair color'
                      {...register('categoryName', {
                        required: 'category name is required.',
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name='categoryName'
                      render={({message}) => <p style={{color: 'red'}}>{message}</p>}
                    />
                  </Form.Group>
                  <p>
                    Services are Organized by Category
                    <br /> This is how the Booking Area of Your Website works
                  </p>
                  <Button type='submit' className='category-save-btn submit-btn'>
                    Save
                  </Button>
                </div>
                <div className='col-md-6'>
                  <img
                    className='img-fluid'
                    src={toAbsoluteUrl('/media/Chairs/service_guide.png')}
                    alt='icon'
                  />
                </div>
              </div>
            </Modal.Body>
          </Form>
        </Modal>
      </>
    )
}

export default AddCategoryModal
