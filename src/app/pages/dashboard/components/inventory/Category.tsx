import React, { FC, useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { KTSVG } from '../../../../../_metronic/helpers'
import { ALL_PRODUCT_CATEGORY } from '../../../../../gql/Query';
import { PRODUCT_CATEGORY_DELETE } from '../../../../../gql/Mutation';
import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import EditCategoryModal from "./EditCategoryModal";
import ModalWidgets from "../../../../modules/widgets/components/ModalWidgets";

interface ICategory {
    id: string;
    name: string;
}
type Props = {
    className: string
}

const Category: React.FC<Props> = ({ className }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [modalShow, setModalShow] = useState(false);
    const [categoryId, setCategoryId] = useState<string>("");
    const [categorys, setcategorys] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);

    const [deleteID, setDeleteID] = useState("")

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const { data: categoryData, error: categoryError, loading: categoryLoading, refetch } = useQuery(ALL_PRODUCT_CATEGORY, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    });

    const [deleteProductCategory] = useMutation(PRODUCT_CATEGORY_DELETE, {
        refetchQueries: [{ query: ALL_PRODUCT_CATEGORY, variables: { type: "select", count: 10, page: 1 } }],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (categoryData) {
            refetch();
            setcategorys(categoryData.productCategories.data)
            setLoading(false)
            // console.log(categoryData)
        }
        if (categoryLoading) {
            setcategorys([])
            setLoading(true)
        }
    }, [categoryData, categoryLoading]);

    const handlecategoryDelete = (id: any) => {
        if (id) {
            deleteProductCategory({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("category deleted successfully", {
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
                }
            })
        }
    }


    const confirmation = (status: any) => {
        if (status === 0) {
            // console.log(status);
        }
        if (status === 1) {
            handlecategoryDelete(deleteID)
        }
    }

    return (
        <>
            <section className="product-category-wrapper ptc">
                <div className={`card ${className}`}>
                    <div id="product-category">
                        <div className='card-body'>
                            <div className='table-responsive'>
                                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
                                    <thead>
                                        <tr className='fw-bolder bg-light text-muted'>
                                            <th className='ps-4 min-w-145px rounded-start'>Name</th>
                                            <th className='pe-4 min-w-100px text-end rounded-end'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading &&
                                            loading && <div className="text-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        }
                                        {
                                            categorys.map((item) => <tr key={item.id}>
                                                <td className='text-dark fw-bolder fs-6 ps-4'>{item.name}</td>
                                                <td className="pe-4">
                                                    <div className='d-flex justify-content-end flex-shrink-0'>
                                                        <i
                                                            onClick={() => { setModalShow(true); setCategoryId(item.id); }}
                                                            className='far fa-edit btn btn-icon btn-bg-light text-muted text-hover-primary btn-sm me-2'
                                                        >
                                                        </i>
                                                        <i onClick={() => openDeleteModal(item.id)} className='far fa-trash-alt btn btn-icon btn-bg-light text-muted text-hover-primary btn-sm'>
                                                        </i>
                                                    </div>
                                                </td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <EditCategoryModal
                    categoryId={categoryId}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <ModalWidgets
                    closeDeleteModal={closeDeleteModal}
                    deleteModal={deleteModal}
                    confirmation={confirmation}
                />
            </section>
        </>
    )
}

export { Category };