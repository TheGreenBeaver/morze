import React from 'react';
import useStyles from './styles/mentioned-messages-display.styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Cancel } from '@material-ui/icons';
import useChatWindow from '../../hooks/use-chat-window';
import useCommonStyles from '../../theme/common';
import Box from '@material-ui/core/Box';
import zDate from '../../util/dates';
import clsx from 'clsx';
import { wAmount } from '../../util/misc';
import Avatar from '@material-ui/core/Avatar';


function MentionedMessagesDisplay() {
  const { messagesToMention, clearMentions } = useChatWindow();
  const amount = messagesToMention.length;

  const styles = useStyles();
  const commonStyles = useCommonStyles();

  if (!amount) {
    return null;
  }

  let content;
  if (amount === 1) {
    const theMessage = messagesToMention[0];
    const attachmentsCount = theMessage.attachments.filter(att => att.isDirect).length;
    const mentionedCount = theMessage.mentionedMessages?.length || theMessage.mentionedCount;
    content =
      <Box>
        <Box display='flex' alignItems='center'>
          <Avatar src={theMessage.user.avatar} className={styles.smallAvatar} />
          <Typography variant='subtitle2' color='textSecondary'>
            {theMessage.user.firstName} {theMessage.user.lastName}, {zDate(theMessage.createdAt).fTime()}
          </Typography>
        </Box>
        {
          theMessage.text &&
          <Typography component='p' variant='caption' color='textSecondary'>
            {theMessage.text}
          </Typography>
        }
        {
          !!attachmentsCount &&
          <Typography component='p' variant='caption' color='textSecondary'>
            {wAmount(attachmentsCount, 'attached file')}
          </Typography>
        }
        {
          !!mentionedCount &&
          <Typography component='p' variant='caption' color='textSecondary' className={styles.forwardedText}>
            {`> ${wAmount(mentionedCount, 'forwarded message')}`}
          </Typography>
        }
      </Box>
  } else {
    content =
      <Typography variant='subtitle2' color='textSecondary'>
        {amount} messages
      </Typography>
  }

  return (
    <div className={commonStyles.verticalDistribution}>
      <Typography
        className={clsx(commonStyles.inputAreaHorizontalAlign, styles.forwardedHeader)}
        variant='subtitle1'
        component='div'
        color='textSecondary'
      >
        Forwarded message{amount === 1 ? '' : 's'}
        <IconButton
          color='secondary'
          onClick={clearMentions}
          className={styles.removeBtn}
        >
          <Cancel />
        </IconButton>
      </Typography>
      <Box position='relative' className={commonStyles.inputAreaHorizontalAlign}>
        {content}
      </Box>
    </div>
  );
}

export default MentionedMessagesDisplay;