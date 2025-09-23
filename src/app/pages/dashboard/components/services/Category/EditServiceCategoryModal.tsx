import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';
import { SERVICE_CATEGORY_UPDATE } from '../../../../../../gql/Mutation';
import { useHistory } from 'react-router-dom'
import { SINGLE_SERVICE_CATEGORY, SERVICE_CATEGORIES } from '../../../../../../gql/Query';

interface IData {
    id: string;
    business_id: string;
    name: string;
}

interface IProps {
    categoryId: string;
    show: boolean;
    onHide: () => void;
}

const EditServiceCategoryModal = ({ categoryId, show, onHide }: IProps) => {
    const [prevCategory, setPrevCategory] = useState<IData>({ id: "", business_id: "", name: "" });
    const { enqueueSnackbar } = useSnackbar();

    const { data: singleServiceCategoryData } = useQuery(SINGLE_SERVICE_CATEGORY, {
        variables: {
            id: categoryId,
        }
    })

    useEffect(() => {
        if (singleServiceCategoryData) {
            setPrevCategory(singleServiceCategoryData.serviceCategory)
        }
    }, [singleServiceCategoryData])

    const [updateServiceCategory] = useMutation(SERVICE_CATEGORY_UPDATE, {
        refetchQueries: [{
            query: SERVICE_CATEGORIES,
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
        setPrevCategory((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (prevCategory.name != null && prevCategory.name != undefined && prevCategory.name != "") {
            updateServiceCategory({
                variables: {
                    id: prevCategory.id,
                    name: prevCategory.name,
                }
            }).then(({ data }) => {
                console.log(data)

                enqueueSnackbar("Service category name updated", {
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
            enqueueSnackbar("Service Category name required", {
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
                    <h2 className="adv-price-modal-title">Update Service Category</h2>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Category name</Form.Label>
                            <Form.Control value={prevCategory?.name} autoComplete='off' className="" type="text" placeholder="Service Category Name" name="name" onChange={handleChange} />
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

export default EditServiceCategoryModal
