import React from 'react';
import useStyles from '../chat-window/styles/mentioned-messages-display.styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Cancel } from '@material-ui/icons';
import useChatWindow from '../../hooks/use-chat-window';


function MentionedMessagesDisplay() {
  const { messagesToMention, clearMentions } = useChatWindow();
  const amount = messagesToMention.length;

  const styles = useStyles();

  if (!amount) {
    return null;
  }

  let content;
  if (amount === 1) {
    const theMessage = messagesToMention[0];
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
        onClick={clearMentions}
        className={styles.removeBtn}
      >
        <Cancel />
      </IconButton>
      {content}
    </div>
  );
}

export default MentionedMessagesDisplay;