import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import CenterBox from '../../components/center-box';
import Typography from '@material-ui/core/Typography';
import useErrorHandler from '../../hooks/use-error-handler';
import { useDispatch } from 'react-redux';
import { confirm } from '../../api/auth';
import { ERR_FIELD, OOPS } from '../../util/constants';
import { setVerified } from '../../store/actions/account';
import { links } from '../../util/routing';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/use-auth';


const ENDPOINT_MAPPING = {
  verify: 'Account verification',
  username: 'Username reset confirmation',
  password: 'Password reset confirmation'
};

const PAGE_STATES = {
  INITIAL: 'will start in a moment...',
  ACTIVATING: 'in progress...',
  ERROR: 'failed:',
};

function Confirm() {

  const { uid, token } = useParams();
  const { pathname } = useLocation();
  const confirmationType = pathname.split('/')[2];
  const process = ENDPOINT_MAPPING[confirmationType];
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const { isAuthorized } = useAuth();

  const dispatch = useDispatch();
  const handleBackendError = useErrorHandler();
  const [forceRetry, setForceRetry] = useState(0);
  const [pageState, setPageState] = useState(PAGE_STATES.INITIAL);
  const [displayedError, setDisplayedError] = useState(null);

  useEffect(() => {
    const requestConfirmation = async () => {
      setPageState(PAGE_STATES.ACTIVATING);
      setDisplayedError(null);
      try {
        const { isVerified } = await confirm(confirmationType, uid, token);
        dispatch(setVerified(isVerified));
        enqueueSnackbar(`${process} succeeded!`, { variant: 'success' });
        if (!isAuthorized) {
          history.push(links.signIn);
        }
      } catch (e) {
        let newDisplayedError = ` ${OOPS}`;
        if (!handleBackendError(e)) {
          newDisplayedError = ` ${e.response.data.errors[ERR_FIELD]}`;
        }
        setDisplayedError(newDisplayedError);
        setPageState(PAGE_STATES.ERROR);
      }
    };

    if (uid && token) {
      requestConfirmation();
    }
  }, [uid, token, confirmationType, forceRetry]);

  const failed = pageState === PAGE_STATES.ERROR;

  return (
    <CenterBox>
      <Typography variant='body1' gutterBottom={failed} align='center'>
        {process} {pageState}{displayedError}
      </Typography>
      {
        failed &&
        <Button onClick={() => setForceRetry(curr => curr + 1)}>
          Retry
        </Button>
      }
    </CenterBox>
  );
}

export default Confirm;