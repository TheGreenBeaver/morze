import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import CenterBox from '../../components/center-box';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { ERR_FIELD, LINKS, HTTP_ENDPOINTS } from '../../util/constants';
import { setVerified } from '../../store/actions/account';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/use-auth';
import { useAxios } from '../../contexts/axios-context';


const ENDPOINT_MAPPING = {
  verify: 'Account verification',
  username: 'Username reset confirmation',
  password: 'Password reset confirmation'
};

const PAGE_STATES = {
  INITIAL: 'will start in a moment...',
  ACTIVATING: 'in progress...',
  ERROR: 'failed!',
};

function Confirm() {
  const apiRef = useRef(null);
  const { uid, token } = useParams();
  const { pathname } = useLocation();
  const confirmationType = pathname.split('/')[2];
  const process = ENDPOINT_MAPPING[confirmationType];
  const { enqueueSnackbar } = useSnackbar();
  const { api } = useAxios();

  const history = useHistory();

  const { isAuthorized } = useAuth();

  const dispatch = useDispatch();
  const [forceRetry, setForceRetry] = useState(0);
  const [pageState, setPageState] = useState(PAGE_STATES.INITIAL);

  useEffect(() => {
    const requestConfirmation = async () => {
      setPageState(PAGE_STATES.ACTIVATING);
      apiRef.current?.cancel?.();
      const newApi = api(HTTP_ENDPOINTS.confirm, confirmationType, { uid, token });
      apiRef.current = newApi;
      try {
        const { isVerified } = await newApi.call();
        dispatch(setVerified(isVerified));
        enqueueSnackbar(`${process} succeeded!`, { variant: 'success' });
        if (!isAuthorized) {
          history.push(LINKS.signIn);
        }
      } catch (e) {
        enqueueSnackbar(e.response.data[ERR_FIELD], { variant: 'error' });
        setPageState(PAGE_STATES.ERROR);
      }
    };

    if (uid && token) {
      requestConfirmation();
    }
  }, [uid, token, confirmationType, forceRetry]);

  const failed = pageState === PAGE_STATES.ERROR;

  return (
    <CenterBox flexDirection='column'>
      <Typography variant='body1' gutterBottom={failed} align='center'>
        {process} {pageState}
      </Typography>
      {
        failed &&
        <Button color='primary' onClick={() => setForceRetry(curr => curr + 1)}>
          Retry
        </Button>
      }
    </CenterBox>
  );
}

export default Confirm;