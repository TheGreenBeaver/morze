import React, { useState } from 'react';
import { string } from 'prop-types';
import { TextField } from 'formik-material-ui';
import { InputAdornment } from '@material-ui/core';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { Field } from 'formik';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './styles/password-field.styles';


function PasswordField({ name }) {

  const [visible, setVisible] = useState(false);

  const styles = useStyles();
  return (
    <Field
      component={TextField}
      label='Password'
      name={name}
      type={visible ? 'text' : 'password'}
      autoComplete='current-password'
      InputProps={{
        endAdornment:
          <InputAdornment
            position='end'
            onClick={() => setVisible(curr => !curr)}
            classes={styles}
            component={IconButton}
          >
            {visible ? <VisibilityOff /> : <Visibility />}
          </InputAdornment>
      }}
    />
  );
}

PasswordField.propTypes = {
  name: string
}

PasswordField.defaultProps = {
  name: 'password'
};

export default PasswordField;