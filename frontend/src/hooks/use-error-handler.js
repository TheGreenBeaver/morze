import { useDispatch } from 'react-redux';
import { setError } from '../store/actions/general';
import { useSnackbar } from 'notistack';
import { OOPS } from '../util/constants';
import useAuth from './use-auth';
import { logOutAction } from '../store/actions/account';


function useErrorHandler() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthorized, clearCredentials } = useAuth();

  function handleBackendError(error) {
    const { response } = (error || {});
    const { status } = (response || {});

    if (status < 401 || status == null) {
      return false;
    }

    let text;
    switch (status) {
      case 401:
        enqueueSnackbar('Please re-log into your account', { variant: 'info' });
        clearCredentials();
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