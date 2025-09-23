import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';
import { BRAND_UPDATE } from '../../../../../gql/Mutation';
import { useHistory } from 'react-router-dom'
import { SINGLE_BRAND, ALL_BRANDS } from '../../../../../gql/Query';

interface IData {
    id: string;
    business_id: string;
    name: string;
}

interface IProps {
    brandId: string;
    show: boolean;
    onHide: () => void;
}

const EditBrandModal = ({ brandId, show, onHide }: IProps) => {
    const [prevBrand, setPrevBrand] = useState<IData>({ id: "", business_id: "", name: "" });
    const { enqueueSnackbar } = useSnackbar();

    const { data: singleBrandData } = useQuery(SINGLE_BRAND, {
        variables: {
            id: brandId,
        }
    })

    useEffect(() => {
        if (singleBrandData) {
            setPrevBrand(singleBrandData.brand)
        }
    }, [singleBrandData])

    const [updateBrand] = useMutation(BRAND_UPDATE, {
        refetchQueries: [{
            query: ALL_BRANDS,
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
        setPrevBrand((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (prevBrand.name != null && prevBrand.name != undefined && prevBrand.name != "") {
            updateBrand({
                variables: {
                    id: prevBrand.id,
                    name: prevBrand.name,
                }
            }).then(({ data }) => {
                // console.log(data)

                enqueueSnackbar("Brnad name updated", {
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
            enqueueSnackbar("Brand name required", {
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
                    <h2 className="adv-price-modal-title">Update Product Brnad</h2>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand name</Form.Label>
                            <Form.Control value={prevBrand?.name} className="" type="text" placeholder="Brand Name" name="name" onChange={handleChange} />
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

export default EditBrandModal
