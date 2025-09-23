import React, { FC, useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client'
import { ALL_STAFF_INFO } from '../../../../../gql/Query';
import { IStaff } from '../../../../../types';
import { Card8 } from "../../../../../_metronic/partials/content/cards/Card8"
import Avatar1 from '../../../../../_metronic/assets/images/avatars/blank.png'
import { Link } from "react-router-dom";
import { STAFF_DELETE } from "../../../../../gql/Mutation";
// import Avatar2 from '../../../../../_metronic/assets/images/avatars/blank.png'
import { useSnackbar } from 'notistack';
import ModalWidgets from "../../../../modules/widgets/components/ModalWidgets";
import { imageUrl } from "../../../../modules/util";

const StaffMember: FC = () => {
    const imageBaseURL = `${imageUrl}/uploads/staff/`;
    const { enqueueSnackbar } = useSnackbar();
    const [staffs, setStaffs] = useState<IStaff[]>([]);

    const [deleteID, setDeleteID] = useState("")
    const [paginate, setPaginate] = useState<any>([]);
    const [count, setCount] = useState(6);
    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const confirmation = (status: any) => {
        if (status === 0) {
            console.log(status);
        }
        if (status === 1) {
            handleDeleteStaff(deleteID)
        }
    }

    const LoadMoreList = () => {
        setCount(count + 6)
    }

    const { data: StaffData, error: staffError, loading: staffLoading, refetch } = useQuery(ALL_STAFF_INFO, {
        variables: {
            count: count, page: 1
        },
        fetchPolicy: "network-only"
    });
    // chair delete
    const [deleteStaff] = useMutation(STAFF_DELETE, {
        refetchQueries: [{ query: ALL_STAFF_INFO, variables: { count: count, page: 1 } }],
        awaitRefetchQueries: true,
    });
    const handleDeleteStaff = (id: string) => {
        if (id) {
            deleteStaff({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("Staff deleted", {
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
    useEffect(() => {
        if (StaffData) {
            refetch();
            setStaffs(StaffData.staffs.data);
            setPaginate(StaffData.staffs?.paginatorInfo)
            console.log(StaffData)
        }
    }, [StaffData])


    return (
        <>
            <div className="ptc">
                {
                    staffLoading ?
                        <div className="text-center d-flex justify-content-center align-items-center">
                            <div className="spinner-grow " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        : <div className="row">

                            {
                                staffs.map((staff) => (

                                    <div className='col-xl-4 mb-5'>
                                        <div className="single-staff">
                                            <Card8
                                                avatar={staff?.photo ? `${imageBaseURL}${staff?.photo}` : Avatar1}
                                                name={staff.name}
                                                job={staff.email}
                                            />
                                            <div className="s-action">
                                                <Link to={`/staff/edit/${staff.id}`}><i className="far fa-edit"></i></Link>
                                                <span style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => { openDeleteModal(staff.id) }}><i className="far fa-trash-alt"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className="text-center">
                                {
                                    count < paginate.total && (
                                        <button className="btn btn-primary text-center" onClick={LoadMoreList}>Load More</button>
                                    )
                                }
                            </div>
                        </div>
                }

            </div>
            <ModalWidgets
                closeDeleteModal={closeDeleteModal}
                deleteModal={deleteModal}
                confirmation={confirmation}
            />

        </>
    )
}

export default StaffMember;

