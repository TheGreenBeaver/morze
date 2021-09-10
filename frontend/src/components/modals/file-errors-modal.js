import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FILE_ERRORS } from '../../util/constants';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../store/actions/general';
import Typography from '@material-ui/core/Typography';


function FileErrorsModal({ errors }) {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <DialogContent>
        {
          Object.entries(errors).map(([errName, filesList]) => {
            if (!filesList.length) {
              return null;
            }

            return <Typography>{errName}: {filesList.join(', ')}</Typography>;
          })
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeModal())}>
          Ok
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}

FileErrorsModal.propTypes = {
  errors: shape({
    [FILE_ERRORS.size]: arrayOf(string).isRequired,
    [FILE_ERRORS.ext]: arrayOf(string).isRequired
  }).isRequired
};

export default FileErrorsModal;