import React from 'react';
import { Form } from 'formik';
import useStyles from './styles/message-input-area.styles';
import SubmittableTextArea from './submittable-text-area';
import MessageAttachment from './message-attachment';
import MentionedMessagesDisplay from './mentioned-messages-display';
import { InputAttachmentsDisplay } from '../attachments-display';
import IconButton from '@material-ui/core/IconButton';
import { CheckCircleOutline, Close, Send } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import useChatWindow from '../../hooks/use-chat-window';
import Typography from '@material-ui/core/Typography';
import useCommonStyles from '../../theme/common';
import { object } from 'prop-types';


function MessageInputArea({ innerRef }) {
  const styles = useStyles();
  const commonStyles = useCommonStyles();

  const { isEditing, cancelEditing } = useChatWindow();

  return (
    <div ref={innerRef}>
      {
        isEditing &&
        <Box
          display='flex'
          alignItems='center'
          paddingTop={1}
          className={commonStyles.inputAreaHorizontalAlign}
        >
          <Typography
            variant='subtitle1'
            color='textSecondary'
          >
            Editing message
          </Typography>
          <IconButton onClick={cancelEditing} size='small'>
            <Close />
          </IconButton>
        </Box>
      }
      <Form className={styles.inputWrapper}>
        <MessageAttachment />
        <SubmittableTextArea
          margin='none'
          placeholder='Type your message...'
        />
        <IconButton color='secondary' type='submit'>
          {isEditing ? <CheckCircleOutline /> : <Send />}
        </IconButton>
      </Form>
      <Box>{/* maxHeight='30%' overflow='auto'>*/}
        <MentionedMessagesDisplay />
        <InputAttachmentsDisplay />
      </Box>
    </div>
  );
}

MessageInputArea.propTypes = {
  innerRef: object
};

export default MessageInputArea;