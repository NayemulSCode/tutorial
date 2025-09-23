import React, { FC } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { ADD_TREATMENT } from '../../../../../gql/Mutation';
import { ALL_TREATEMENT_TYPE } from '../../../../../gql/Query';
import { useHistory } from 'react-router-dom';

interface IFormInputs {
    treatmentName: string;
}

type Props = {
    show: boolean
    handleClose: () => void
}
const AddTreatmentTypeModal: FC<Props> = ({ show, handleClose }) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [addTreatmentType] = useMutation(ADD_TREATMENT, {
        refetchQueries: [{
            query: ALL_TREATEMENT_TYPE,
            variables: {
                type: "select",
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
            addTreatmentType({
                variables: {
                    name: data.treatmentName,
                }
            }).then(({ data }) => {
                if (data) {
                    enqueueSnackbar(data.addTreatmentType.message, {
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
                    history.push('/services/treatment-types')
                }
                // console.log(data)
            })
            reset();
            handleClose();
        }

        // alert(JSON.stringify(data));
    }
    return (
        <>
            <Modal
                dialogClassName="modal-90w"
                show={show}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="" closeButton>
                    <h2 className="adv-price-modal-title">New Treatment type</h2>
                </Modal.Header>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Treatment Type name</Form.Label>
                            <Form.Control type="text"
                                autoComplete='off'
                                placeholder="e.g. Hair Transplants"
                                {...register("treatmentName", {
                                    required: "category name is required."
                                })}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="treatmentName"
                                render={({ message }) => <p style={{ color: "red" }}>{message}</p>}
                            />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" className="category-save-btn submit-btn">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default AddTreatmentTypeModal
