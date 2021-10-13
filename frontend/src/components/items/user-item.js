import React from 'react';
import { shape, string, func, bool } from 'prop-types';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles/user-item.styles';
import { pushModal } from '../../store/actions/general';
import { UserModal } from '../modals';
import { useDispatch } from 'react-redux';


function useHooks() {
  const dispatch = useDispatch();
  return { dispatch };
}

function UserItem({ data, dispatch, isClickable }) {
  const { avatar, firstName, lastName } = data;
  const styles = useStyles();

  return (
    <Box
      display='flex'
      alignItems='center'
      className={styles.wrapper}
      onClick={() => {
        if (isClickable) {
          dispatch(pushModal({
            title: `${data.firstName} ${data.lastName}`,
            body: <UserModal userData={data} />
          }));
        }
      }}
    >
      <Avatar src={avatar} className={styles.avatar} />
      <Typography>{firstName} {lastName}</Typography>
    </Box>
  );
}

UserItem.useHooks = useHooks;

UserItem.propTypes = {
  data: shape({
    avatar: string,
    firstName: string.isRequired,
    lastName: string.isRequired
  }).isRequired,
  dispatch: func,
  isClickable: bool
};

UserItem.defaultProps = {
  isClickable: true
};

export default UserItem;
        