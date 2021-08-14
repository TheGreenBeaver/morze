import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../assets/img/logo.svg';
import AppBar from '@material-ui/core/AppBar';
import useStyles from './styles/header.styles';
import SearchField from '../search-field';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import useScreenIsSmall from '../../hooks/use-screen-is-small';
import { setModalContent } from '../../store/actions/general';
import { UserModal } from '../modals';


function Header() {
  const styles = useStyles();
  const screenIsSmall = useScreenIsSmall();
  const { userData: { avatar, firstName, lastName } } = useSelector(state => state.account);
  const dispatch = useDispatch();

  return (
    <AppBar position='fixed'>
      <Toolbar classes={{ root: styles.toolbar }}>
        <img src={logo} alt='logo' className={styles.logo} />

        <Box
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
          height='100%'
          position='absolute'
          className={styles.rightBlock}
          right={0}
        >
          {!screenIsSmall && <SearchField expandable />}
          <Avatar
            src={avatar}
            classes={{ root: styles.avatar }}
            onClick={() => dispatch(setModalContent({
              title: `${firstName} ${lastName}`,
              body: <UserModal />
            }))}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;