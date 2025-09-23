import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';
import { TREATMENT_TYPE_UPDATE } from '../../../../../../gql/Mutation';
import { useHistory } from 'react-router-dom'
import { SINGLE_TREATMENT_TYPE, ALL_TREATEMENT_TYPE } from '../../../../../../gql/Query';

interface IData {
    id: string;
    business_id: string;
    name: string;
}

interface IProps {
    typeId: string;
    show: boolean;
    onHide: () => void;
}

const EditTreatmentTypeModal = ({ typeId, show, onHide }: IProps) => {
    const [prevType, setprevType] = useState<IData>({ id: "", business_id: "", name: "" });
    const { enqueueSnackbar } = useSnackbar();

    const { data: singleTreatmentTypeData } = useQuery(SINGLE_TREATMENT_TYPE, {
        variables: {
            id: typeId,
        }
    })

    useEffect(() => {
        if (singleTreatmentTypeData) {
            setprevType(singleTreatmentTypeData.treatmentType)
        }
    }, [singleTreatmentTypeData])

    const [updateTreatmentType] = useMutation(TREATMENT_TYPE_UPDATE, {
        refetchQueries: [{
            query: ALL_TREATEMENT_TYPE,
            variables: {
                type: "all",
                count: 10,
                page: 1
            }
        }],
        awaitRefetchQueries: true,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setprevType((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (prevType.name != null && prevType.name != undefined && prevType.name != "") {
            updateTreatmentType({
                variables: {
                    id: prevType.id,
                    name: prevType.name,
                }
            }).then(({ data }) => {
                console.log(data)

                enqueueSnackbar("Tratment type updated", {
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
            })
            onHide();
        } else {
            enqueueSnackbar("Treatment type required", {
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
    }
    return (
        <>
            <Modal
                dialogClassName="modal-90w"
                show={show}
                onHide={onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="" closeButton>
                    <h2 className="adv-price-modal-title">Update Treatment Type</h2>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Treatment Type</Form.Label>
                            <Form.Control value={prevType?.name} className="" autoComplete='off' type="text" placeholder="Treatment type Name" name="name" onChange={handleChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" className="category-save-btn submit-btn">Update</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default EditTreatmentTypeModal
