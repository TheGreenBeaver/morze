import React from 'react';
import { func, string } from 'prop-types';
import { useDispatch } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { closeModal } from '../../store/actions/general';
import Typography from '@material-ui/core/Typography';


function ConfirmModal({ onConfirm, confirmText, bodyText, cancelText, onCancel }) {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <DialogContent>
        <Typography>{bodyText}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={e => {
            dispatch(closeModal());
            onCancel?.(e);
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={e => {
            dispatch(closeModal());
            onConfirm(e);
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

ConfirmModal.propTypes = {
  onConfirm: func.isRequired,
  onCancel: func,
  bodyText: string,
  confirmText: string,
  cancelText: string
};

ConfirmModal.defaultProps = {
  confirmText: 'OK',
  cancelText: 'Cancel',
};

export default ConfirmModal;