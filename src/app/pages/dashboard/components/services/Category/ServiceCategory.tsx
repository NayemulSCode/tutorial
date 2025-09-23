import React, { FC, useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { KTSVG } from "../../../../../../_metronic/helpers";
import { SERVICE_CATEGORIES } from "../../../../../../gql/Query";
import { SERVICE_CATEGORY_DELETE } from "../../../../../../gql/Mutation";
import EditServiceCategoryModal from "./EditServiceCategoryModal";
import ModalWidgets from "../../../../../modules/widgets/components/ModalWidgets";

interface ICategory {
    id: string;
    name: string;
    is_personal: boolean;
}
type Props = {
    className: string
}

const ServiceCategory: FC<Props> = ({ className }) => {
    const history = useHistory();
    const [modalShow, setModalShow] = useState(false);
    const [categoryId, setCategoryId] = useState<string>("");
    const { enqueueSnackbar } = useSnackbar();
    const [serviceCategory, setServiceCategory] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteID, setDeleteID] = useState("")

    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = (id: any) => {
        setDeleteID(id);
        setDeleteModal(true);
    }
    const closeDeleteModal = () => setDeleteModal(false);

    const { data: allCategories, error: categoriesError, loading: categoryLoding, refetch } = useQuery(SERVICE_CATEGORIES, {
        variables: {
            type: "",
            count: 10,
            page: 1
        }
    })


    const [deleteServiceCategory] = useMutation(SERVICE_CATEGORY_DELETE, {
        refetchQueries: [{ query: SERVICE_CATEGORIES, variables: { type: "", count: 10, page: 1 } }],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (allCategories) {
            refetch();
            console.log(allCategories)
            setServiceCategory(allCategories.serviceCategories.data)
            setLoading(false)
        }
        if (categoryLoding) {
            setServiceCategory([])
            setLoading(true)
        }

    }, [allCategories, categoryLoding])

    const handlecategoryDelete = (id: string) => {
        if (id) {
            deleteServiceCategory({
                variables: {
                    id: id
                }
            }).then((data) => {
                if (data) {
                    enqueueSnackbar("Category deleted successfully", {
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
            handlecategoryDelete(deleteID)
        }
    }
    return (
      <>
        <section className='service-category-wrapper'>
          <div className={`card ${className}`}>
            <div id='product-category'>
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
                      {loading && loading && (
                        <div className='text-center'>
                          <div className='spinner-border' role='status'>
                            <span className='sr-only'>Loading...</span>
                          </div>
                        </div>
                      )}
                      {serviceCategory.map((item:any) => (
                        <tr key={item.id}>
                          <td className='text-dark fw-bolder fs-6 ps-4'>{item.name}</td>
                          {!item?.is_personal && 
                          <td className='pe-4'>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <i
                                onClick={() => {
                                  setModalShow(true)
                                  setCategoryId(item.id)
                                }}
                                className='far fa-edit btn btn-icon btn-bg-light text-muted text-hover-primary btn-sm me-2'
                              ></i>
                              <i
                                onClick={() => openDeleteModal(item.id)}
                                className='far fa-trash-alt btn btn-icon btn-bg-light text-muted text-hover-primary btn-sm'
                              ></i>
                            </div>
                          </td>
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <EditServiceCategoryModal
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

export { ServiceCategory }
