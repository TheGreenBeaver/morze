import React from 'react';
import { string } from 'prop-types';
import { useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


function EditableText({ name }) {
  const { status, isSubmitting, errors, touched, getFieldProps } = useFormikContext();

  const isEditing = status?.isEditing;
  const err = touched[name] && errors[name];

  const field = getFieldProps(name);

  if (!isEditing) {
    return <Typography>{field.value}</Typography>
  }

  return (
    <TextField
      margin='dense'
      fullWidth={false}
      {...field}
      disabled={isSubmitting}
      error={!!err}
      helperText={err}
    />
  );
}

EditableText.propTypes = {
  name: string.isRequired,
};

export default EditableText;