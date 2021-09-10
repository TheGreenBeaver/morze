import React from 'react';
import { Form } from 'formik';
import useStyles from './styles/message-input-area.styles';
import SubmittableTextArea from './submittable-text-area';
import MessageAttachment from './message-attachment';
import MentionedMessagesDisplay from './mentioned-messages-display';
import AttachmentsDisplay from '../attachments-display';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';


function MessageInputArea() {
  const styles = useStyles();

  return (
    <React.Fragment>
      <MentionedMessagesDisplay />
      <Form className={styles.inputWrapper}>
        <MessageAttachment />
        <SubmittableTextArea
          margin='none'
          placeholder='Type your message...'
        />
        <IconButton color='secondary' type='submit'>
          <Send />
        </IconButton>
      </Form>
      <AttachmentsDisplay />
    </React.Fragment>
  );
}

export default MessageInputArea;