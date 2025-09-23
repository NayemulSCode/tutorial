import React, { FC, useState, useEffect } from "react"
import { Link, useLocation, Switch, Route } from 'react-router-dom'
import { KTSVG } from '../../../../../_metronic/helpers'
import { ALL_BRANDS } from '../../../../../gql/Query';
import { BRAND_DELETE } from '../../../../../gql/Mutation';
import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import EditBrandModal from "./EditBrandModal";
import ModalWidgets from "../../../../modules/widgets/components/ModalWidgets";

interface IBrand {
    id: string;
    name: string;
}
type Props = {
    className: string
}

const StockTakes: React.FC<Props> = ({ className }) => {
    const [modalShow, setModalShow] = useState(false);
    const [brandId, setBrandId] = useState<string>("");
    const { enqueueSnackbar } = useSnackbar();
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [loading, setLoading] = useState(false)
    const [deleteID, setDeleteID] = useState("")

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);


    const { data: brandData, error: brandError, loading: brandLoading, refetch } = useQuery(ALL_BRANDS, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    });

    const [deleteBrand] = useMutation(BRAND_DELETE, {
        refetchQueries: [{ query: ALL_BRANDS, variables: { type: "select", count: 10, page: 1 } }],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (brandData) {
            refetch();
            setBrands(brandData.brands.data)
            setLoading(false);
            // console.log(brandData)
        }
        if (brandLoading) {
            setBrands([])
            setLoading(true);
        }
    }, [brandData, brandLoading]);

    const handleBrandDelete = (id: string) => {
        if (id) {
            deleteBrand({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("Brand deleted successfully", {
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
            handleBrandDelete(deleteID)
        }
    }

    return (
        <>
            <section className="product-brand-wrapper ptc">
                <div className={`card ${className}`}>
                    <div id="product-brand">
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
                                            brands.map((item) => <tr key={item.id}>
                                                <td className='text-dark fw-bolder fs-6 ps-4'>{item.name}</td>
                                                <td className="pe-4">
                                                    <div className='d-flex justify-content-end flex-shrink-0'>
                                                        <i
                                                            onClick={() => { setModalShow(true); setBrandId(item.id); }}
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
                <EditBrandModal
                    brandId={brandId}
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

export { StockTakes };