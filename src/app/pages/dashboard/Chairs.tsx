import React, { FC, useEffect, useState } from "react";
import { Card9 } from "../../../_metronic/partials/content/cards/Card9"
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useIntl } from "react-intl"
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { useMutation, useQuery } from "@apollo/client";
import { CHAIR_CREATE, CHAIR_DELETE } from "../../../gql/Mutation";
import { useSnackbar } from 'notistack';
import { ALL_CHAIRS } from "../../../gql/Query";
import ModalWidgets from "../../modules/widgets/components/ModalWidgets";

interface IChair {
    id: string;
    title: string;
}

const Chairs: FC = () => {
    document.title = "Chair";
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [chairs, setChairs] = useState<IChair[]>([]);
    const [deleteID, setDeleteID] = useState("")
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastChariInfo, setLastChairInfo] = useState<Array<any>>([]);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);
    const confirmation = (status: any) => {
        if (status === 0) {
            // console.log(status);
        }
        if (status === 1) {
            chairDeleteHandler(deleteID)
        }
    }

    const { data: chairsData, error: chairError, loading: chairLoading, refetch } = useQuery(ALL_CHAIRS, {
        variables: {
            count: 100,
            page: 1
        }
    });

    const ChairName = "Chair"
    const [addChair] = useMutation(CHAIR_CREATE, {
        onError(err: any) {
            // console.log(err)
        },
    });
    const addChairHandler = (e: any) => {
        e.preventDefault();
        setLoading(true);
        addChair({
            variables: {
                title: `Chair-${chairs.length == 0 ? "1" : lastChariInfo && parseInt(lastChariInfo[1]) + 1}`
            }
        }).then(({ data }) => {
            if (data) {
                enqueueSnackbar('Chair Added', {
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
                refetch();
                setTimeout(() => {
                    setLoading(false);
                }, 500)
            }
        })
    }
    // chair delete
    const [deleteChair] = useMutation(CHAIR_DELETE, {
        refetchQueries: [{ query: ALL_CHAIRS, variables: { count: 100, page: 1 } }],
        awaitRefetchQueries: true,
    });
    const chairDeleteHandler = (id: string) => {
        if (id) {
            deleteChair({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("Chair deleted", {
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
    useEffect(()=>{
        if (chairs){
            let lastElement = chairs[chairs?.length - 1];
            let lastChairName = lastElement?.title
            let lastChair = lastChairName?.split("-")
            setLastChairInfo(lastChair)
        }
    }, [chairs])
    useEffect(() => {
        if (chairsData) {
            refetch()
            setChairs(chairsData.chairs.data)
            // console.log("chair data", chairsData.chairs.data)
        }
        if (chairError) {
            // console.log("chiar err", chairError)
        }
    }, [chairsData])
    return (
        <>
            <div className="toolbar">
                <button disabled={loading} className="btn btn-primary btn-sm " onClick={()=>history.push('/business/settings')}>Back</button>
                <button disabled={loading} className="btn secondaryBtn ms-auto" onClick={addChairHandler}>Add Chair</button>
            </div>

            <div className="ptc">
                {
                    chairLoading ?
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
                                chairs.map((chair, index) => {
                                    return (
                                        <div key={index} className='col-xl-4 col-md-4 mb-5 chairWrap'>
                                            <Card9
                                                avatar={toAbsoluteUrl('/media/Chairs/chair.png')}
                                                name={`${chair.title}`}
                                                job=""
                                            />
                                            <button type="button" className="card-closeBtn" onClick={() => { openDeleteModal(chair.id) }}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )
                                })
                            }
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

export { Chairs };

