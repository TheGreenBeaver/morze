import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../store/actions/general';
import { useSnackbar } from 'notistack';
import { logOutAction } from '../store/actions/account';
import { OOPS } from '../util/constants';


function useErrorHandler() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthorized } = useSelector(state => state.account);

  function handleBackendError(error) {
    const { response: { status } } = error;

    if (status < 401 || status == null) {
      return false;
    }

    let text;
    switch (status) {
      case 401:
        enqueueSnackbar('Please re-log into your account', { variant: 'info' });
        dispatch(logOutAction());
        return true;
      case 404:
        text = 'Page not found';
        break;
      default:
        text = 'Server Error';
    }
    if (isAuthorized) {
      dispatch(setError({ status, text }));
    } else {
      enqueueSnackbar(OOPS, { variant: 'error' });
    }

    return true;
  }

  return handleBackendError;
}

export default useErrorHandler;