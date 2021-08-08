import React, { useRef } from 'react';
import { node } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import { SnackbarProvider } from 'notistack';
import useStyles from './styles/alert-system.styles';


function AlertSystem({ children }) {
  const snackbarRef = useRef(null);

  function closeSnackbar(key) {
    snackbarRef.current.closeSnackbar(key);
  }

  const styles = useStyles();

  return (
    <SnackbarProvider
      ref={snackbarRef}
      action={key =>
        <IconButton onClick={() => closeSnackbar(key)}>
          <Close />
        </IconButton>
      }
      classes={styles}
    >
      {children}
    </SnackbarProvider>
  );
}

AlertSystem.propTypes = {
  children: node.isRequired
};

export default AlertSystem;