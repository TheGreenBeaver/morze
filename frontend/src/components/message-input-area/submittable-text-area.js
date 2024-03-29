import React from 'react';
import { useFormikContext } from 'formik';
import TextField from '@material-ui/core/TextField';
import { MSG_FIELD_NAMES } from '../../util/constants';
import useChatWindow from '../../hooks/use-chat-window';
import getUrls from 'get-urls';


function SubmittableTextArea(props) {
  const { submitForm, getFieldProps, setSubmitting, setFieldValue } = useFormikContext();
  const { addAttachments, addAttachmentsByLinks } = useChatWindow();

  const textField = MSG_FIELD_NAMES.text;

  const fieldProps = getFieldProps(textField);
  const adjustedProps = {
    ...fieldProps,
    onChange: e => {
      fieldProps.onChange(e);

      const currentText = e.target.value;

      const urlsInText = Array.from(getUrls(currentText, {
        requireSchemeOrWww: true
      }));

      if (urlsInText?.length) {
        addAttachmentsByLinks(urlsInText);
      }
    }
  }
  return (
    <TextField
      {...adjustedProps}
      onKeyDown={e => {
        if (e.code === 'Enter') {
          if (!e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            return submitForm().then(() => setSubmitting(false));
          }

          setFieldValue(textField, `${fieldProps.value}\n`);
        }
      }}
      onPaste={e => {
        const pastedFile = e.clipboardData.files[0];
        if (pastedFile) {
          addAttachments([pastedFile]);
        }
      }}
      multiline
      maxRows={4}
      {...props}
    />
  );
}

export default SubmittableTextArea;