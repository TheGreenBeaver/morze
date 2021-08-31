import React from 'react';
import { useFormikContext } from 'formik';
import { MSG_FIELD_NAMES } from '../../util/constants';
import useStyles from './styles/mentioned-messages-display.styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Cancel } from '@material-ui/icons';


function MentionedMessagesDisplay() {
  const { setFieldValue, values } = useFormikContext();
  const messages = values[MSG_FIELD_NAMES.mentionedMessages];
  const amount = messages.length;

  const styles = useStyles();

  if (!amount) {
    return null;
  }

  let content;
  if (amount === 1) {
    const theMessage = messages[0];
    content =
      <React.Fragment>
        <Typography variant='subtitle2' gutterBottom color='textSecondary'>
          {theMessage.user.firstName} {theMessage.user.lastName}
        </Typography>
        {
          theMessage.text &&
          <Typography>
            {theMessage.text}
          </Typography>
        }
        {
          !!theMessage.attachments.length &&
          <Typography>
            Attachments
          </Typography>
        }
        {
          !!theMessage.mentionedCount &&
          <Typography>
            {`> ${theMessage.mentionedCount} messages ...`}
          </Typography>
        }
      </React.Fragment>
  } else {
    content =
      <Typography color='textSecondary'>
        Mentioning {amount} messages
      </Typography>
  }

  return (
    <div className={styles.wrapper}>
      <IconButton
        color='secondary'
        onClick={() => setFieldValue(MSG_FIELD_NAMES.mentionedMessages, [])}
        className={styles.removeBtn}
      >
        <Cancel />
      </IconButton>
      {content}
    </div>
  );
}

export default MentionedMessagesDisplay;