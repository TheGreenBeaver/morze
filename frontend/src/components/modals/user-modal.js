import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useAxios } from '../../contexts/axios-context';
import { HTTP_ENDPOINTS } from '../../util/constants';
import useAuth from '../../hooks/use-auth';
import { logOutAction } from '../../store/actions/account';
import { useDispatch } from 'react-redux';


function UserModal(props) {

  const { api } = useAxios();
  const { clearCredentials } = useAuth();
  const dispatch = useDispatch();

  function logOut() {
    api(HTTP_ENDPOINTS.logOut).call()
      .then(() => {
        clearCredentials();
        dispatch(logOutAction());
      })
  }

  return (
    <div>
      <Button onClick={logOut}>
        Log Out
      </Button>
    </div>
  );
}

UserModal.propTypes = {

};

export default UserModal;