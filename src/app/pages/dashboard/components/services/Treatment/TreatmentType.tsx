import React, { FC, useState, useEffect } from "react"
import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { ALL_TREATEMENT_TYPE } from "../../../../../../gql/Query";
import { TREATMENT_TYPE_DELETE } from "../../../../../../gql/Mutation";
import EditTreatmentTypeModal from "./EditTreatmentTypeModal";
import ModalWidgets from "../../../../../modules/widgets/components/ModalWidgets";

interface ITreatemnt {
    id: string;
    name: string;
}
type Props = {
    className: string
}

const TreatmentType: FC<Props> = ({ className }) => {
    const [modalShow, setModalShow] = useState(false);
    const [typeId, setTypeId] = useState<string>("");
    const { enqueueSnackbar } = useSnackbar();
    const [treatmentTpe, setTreatmentType] = useState<ITreatemnt[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteID, setDeleteID] = useState("")

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const { data: treatmentTpes, error: treatmentTypeError, loading: treatmentTypeLoading, refetch } = useQuery(ALL_TREATEMENT_TYPE, {
        variables: {
            type: "select",
            count: 10,
            page: 1
        }
    })

    const [deleteTreatmentType] = useMutation(TREATMENT_TYPE_DELETE, {
        refetchQueries: [{ query: ALL_TREATEMENT_TYPE, variables: { type: "select", count: 10, page: 1 } }],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (treatmentTpes) {
            refetch();
            console.log(treatmentTpes)
            setTreatmentType(treatmentTpes.treatmentTypes.data)
            setLoading(false)
        }
        if (treatmentTypeLoading) {
            setTreatmentType([])
            setLoading(true)
        }
    }, [treatmentTpes, treatmentTypeLoading])

    const handleTreatmentDelete = (id: string) => {
        if (id) {
            deleteTreatmentType({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("Treatment Type deleted successfully", {
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
            console.log(status);
        }
        if (status === 1) {
            handleTreatmentDelete(deleteID)
        }
    }

    return (
        <>
            <section className="product-category-wrapper">
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
                                            treatmentTpe.map((item) => <tr key={item.id}>
                                                <td className='text-dark fw-bolder fs-6 ps-4'>{item.name}</td>
                                                <td className="pe-4">
                                                    <div className='d-flex justify-content-end flex-shrink-0'>
                                                        <i
                                                            onClick={() => { setModalShow(true); setTypeId(item.id); }}
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
                <EditTreatmentTypeModal
                    typeId={typeId}
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

export { TreatmentType }
