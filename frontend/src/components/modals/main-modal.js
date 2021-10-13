import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import { closeModal } from '../../store/actions/general';
import useStyles from './styles/main-modal.styles';
import { last } from 'lodash';


function MainModal() {
  const currentModal = useSelector(state => last(state.general.modalStack));
  const dispatch = useDispatch();

  const styles = useStyles();

  return (
    <Dialog
      open={!!currentModal}
      classes={{ paper: styles.modalPaperRoot }}
      onClose={() => dispatch(closeModal())}
    >
      <DialogTitle className={styles.placeholder}>
        {currentModal?.title}
        <IconButton
          className={styles.closeButton}
          onClick={() => dispatch(closeModal())}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      {currentModal?.body}
    </Dialog>
  );
}

export default MainModal;