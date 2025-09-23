import { useSnackbar } from 'notistack';

const useTostMessage = () => {
  const {enqueueSnackbar} = useSnackbar()
  const showToast = (message: string, type: string) => {
    enqueueSnackbar(message, {
      // @ts-ignore
      variant: type,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      transitionDuration: {
        enter: 300,
        exit: 500,
      },
    })
  }

  return {showToast}
}

export {useTostMessage}