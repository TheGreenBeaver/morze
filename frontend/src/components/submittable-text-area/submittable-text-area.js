import React from 'react';
import { useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import { v4 as uuid } from 'uuid';
import { MSG_FIELD_NAMES } from '../../util/constants';
import { bool, func, object } from 'prop-types';
import { InputAdornment } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';


function SubmittableTextArea({ isEditing, setIsEditing, valuesBeforeEditing, ...otherProps }) {
  const { submitForm, getFieldProps, setSubmitting, setFieldValue, values, setValues } = useFormikContext();

  const textField = MSG_FIELD_NAMES.text;
  const attachmentsField = MSG_FIELD_NAMES.attachments;
  const parsedAttachmentsField = MSG_FIELD_NAMES.asDataUrls;

  const fieldProps = getFieldProps(textField);
  return (
    <TextField
      {...fieldProps}
      onKeyDown={e => {
        if (e.code === 'Enter') {
          if (!e.ctrlKey) {
            e.preventDefault();
            return submitForm().then(() => setSubmitting(false));
          }

          setFieldValue(textField, `${fieldProps.value}\n`);
        }
      }}
      onPaste={e => {
        const pastedFile = e.clipboardData.files[0];
        if (pastedFile) {
          const fr = new FileReader();
          fr.onload = loadEv => {
            const fId = uuid();
            setFieldValue(attachmentsField, [...values[attachmentsField], { file: pastedFile, fId }]);
            setFieldValue(parsedAttachmentsField, [...values[parsedAttachmentsField], {
              fId,
              url: loadEv.target.result
            }]);
          };
          fr.readAsDataURL(pastedFile);
        }
      }}
      multiline
      maxRows={4}
      InputProps={{
        endAdornment:
          isEditing &&
          <InputAdornment position='end'>
            <IconButton
              color='secondary'
              onClick={e => {
                e.stopPropagation();
                setValues(valuesBeforeEditing);
                setIsEditing(false);
              }}
            >
              <Close />
            </IconButton>
          </InputAdornment>
      }}
      {...otherProps}
    />
  );
}

SubmittableTextArea.propTypes = {
  isEditing: bool.isRequired,
  setIsEditing: func.isRequired,
  valuesBeforeEditing: object.isRequired
};

export default SubmittableTextArea;