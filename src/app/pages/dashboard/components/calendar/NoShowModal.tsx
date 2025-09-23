import React,{FC} from 'react'
import { Button, Modal } from 'react-bootstrap-v5';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { NO_SHOW_APPNT_UPDATE } from '../../../../../gql/Mutation';
import { STAFF_WISE_APPOINTMENT, SINGLE_APPOINTMENT } from '../../../../../gql/Query';

type Props = {
    isNoShow: boolean;
    handleClose: () => void
    appointmentId: any;
}
const NoShowModal: FC<Props> = ({isNoShow, handleClose, appointmentId}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [appointmentNoShowUpdate] = useMutation(NO_SHOW_APPNT_UPDATE,{
        refetchQueries: [{
            query: STAFF_WISE_APPOINTMENT, variables: {
                staff_id: 0,
                chair_id: 0
            }
        },
        {
            query: SINGLE_APPOINTMENT, variables: {
                id: +appointmentId
            }
        }
    ],
        awaitRefetchQueries: true,
    })
    const handleAppointmentCancellation=(status:string)=>{
        appointmentNoShowUpdate({
            variables:{
                id: appointmentId,
                status: status
            }
        }).then(({data})=>{
            if (data.appointmentNoShowUpdate.status === 1) {
                enqueueSnackbar(data.appointmentNoShowUpdate.message, {
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
                handleClose()
            }
            else if (data.appointmentNoShowUpdate.status === 0) {
                enqueueSnackbar(data.appointmentNoShowUpdate.message, {
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
                handleClose()
                // refetch()
            }
        })
    }
  return (
    <Modal
           dialogClassName="modal-90w"
            show={isNoShow}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
                <Modal.Header className="sale-modal-heade" closeButton>
                    <h2 className="adv-price-modal-title">Your Guest is a No-Show</h2>
                </Modal.Header>
                <Modal.Footer>
                    <Button onClick={() => { handleAppointmentCancellation("2")}} className='btn btn-danger btn-sm mx-3'>Keep Deposit</Button>
                    <Button onClick={() => { handleAppointmentCancellation("0") }} className='btn btn-sm'>Return Deposit</Button>
                </Modal.Footer>
        </Modal>
  )
}

export default NoShowModal