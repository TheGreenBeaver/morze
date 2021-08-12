import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../assets/img/logo.svg';
import AppBar from '@material-ui/core/AppBar';
import useStyles from './styles/header.styles';
import { useMediaQuery, useTheme } from '@material-ui/core';
import SearchField from '../search-field';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { useSelector } from 'react-redux';


function Header() {
  const styles = useStyles();
  const { breakpoints } = useTheme();
  const screenIsSmall = useMediaQuery(breakpoints.down('xs'));
  const { userData: { avatar } } = useSelector(state => state.account);

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
          <Avatar src={avatar} classes={{ root: styles.avatar }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;