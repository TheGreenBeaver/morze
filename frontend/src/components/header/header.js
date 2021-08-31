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
import { setModalContent, setSidebarOpen } from '../../store/actions/general';
import { UserModal } from '../modals';
import IconButton from '@material-ui/core/IconButton';
import { Close, Menu } from '@material-ui/icons';


function Header() {
  const styles = useStyles();
  const screenIsSmall = useScreenIsSmall();
  const { userData } = useSelector(state => state.account);
  const { sidebarOpen } = useSelector(state => state.general);
  const dispatch = useDispatch();
  const { avatar, firstName, lastName } = userData;

  return (
    <AppBar position='fixed' className={styles.appBar}>
      <Toolbar classes={{ root: styles.toolbar }}>
        {
          screenIsSmall &&
          <IconButton
            className={styles.sidebarButton}
            onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
          >
            {sidebarOpen ? <Close /> : <Menu />}
          </IconButton>
        }

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
              body: <UserModal userData={userData} />
            }))}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;