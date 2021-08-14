import React from 'react';
import { node } from 'prop-types';
import { useFormikContext } from 'formik';
import Button from '@material-ui/core/Button';
import SmallSpinner from '../small-spinner';
import useStyles from './styles/loading-button.styles';


function LoadingButton({ children, ...otherProps }) {

  const { isSubmitting } = useFormikContext();
  const styles = useStyles();

  return (
    <Button type='submit' color='primary' {...otherProps} >
      {isSubmitting && <SmallSpinner classes={{ root: styles.spinner }} />}
      {children}
    </Button>
  );
}

LoadingButton.propTypes = {
  children: node.isRequired,
};

export default LoadingButton;