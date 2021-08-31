import React from 'react';
import { number, shape, string } from 'prop-types';
import Button from '@material-ui/core/Button';
import { useAxios } from '../../contexts/axios-context';
import { HTTP_ENDPOINTS } from '../../util/constants';
import useAuth from '../../hooks/use-auth';
import { logOutAction, setUserData } from '../../store/actions/account';
import { useDispatch, useSelector } from 'react-redux';
import { EditableAvatar, EditableText, EditableViewWrapper } from '../editable-view';
import { pick } from 'lodash';
import * as Yup from 'yup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Tooltip } from '@material-ui/core';
import { FlashOff, FlashOn } from '@material-ui/icons';
import useStyles from './styles/user-modal.styles';


function UserModal({ userData }) {

  const { api } = useAxios();
  const { clearCredentials } = useAuth();
  const dispatch = useDispatch();
  const currentUserData = useSelector(state => state.account.userData);

  const isCurrentUser = userData.id === currentUserData.id;

  function logOut() {
    api(HTTP_ENDPOINTS.logOut).call()
      .then(() => {
        clearCredentials();
        dispatch(logOutAction());
      })
  }

  const styles = useStyles();

  return (
    <EditableViewWrapper
      initialValues={{
        ...pick(userData, ['firstName', 'lastName', 'avatar']),
        avatarUrl: '',
        noAvatar: !userData.avatar
      }}
      isEditable={isCurrentUser}
      extraActions={
        isCurrentUser &&
        <Button onClick={logOut} className={styles.logOutBtn}>
          Log Out
        </Button>
      }
      validationSchema={Yup.object({
        firstName: Yup.string().required('First Name is required').max(50),
        lastName: Yup.string().required('Last Name is required').max(50),
      })}
      onSubmit={(values, formikHelpers) => {
        const formData = new FormData();
        ['firstName', 'lastName'].forEach(f => {
          if (values[f] !== userData[f]) {
            formData.set(f, values[f]);
          }
        });
        formData.set('noAvatar', values.noAvatar);
        if (values.avatar !== userData.avatar) {
          formData.append('avatar', values.avatar, values.avatar.name);
        }
        api(HTTP_ENDPOINTS.editUser, formData)
          .call()
          .then(data => dispatch(setUserData(data)))
          .catch(err => formikHelpers.setErrors(err))
          .finally(() => formikHelpers.setSubmitting(false))
      }}
    >
      <EditableAvatar otherName='avatarUrl' name='avatar' isActive={userData.isActive} removeName='noAvatar' />
      <EditableText name='firstName' />
      <EditableText name='lastName' />
      <Box display='flex' className={styles.username}>
        <Typography color='textSecondary'>@{userData.username}</Typography>
        <Tooltip title={userData.isActive ? 'Active' : 'Inactive'}>
          {
            userData.isActive
              ? <FlashOn color='secondary' />
              : <FlashOff color='secondary' />
          }
        </Tooltip>
      </Box>
    </EditableViewWrapper>
  );
}

UserModal.propTypes = {
  userData: shape({
    firstName: string.isRequired,
    lastName: string.isRequired,
    username: string.isRequired,
    avatar: string,
    id: number.isRequired
  }).isRequired
};

export default UserModal;