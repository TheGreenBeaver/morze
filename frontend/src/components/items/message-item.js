import React from 'react';
import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import useChatRelatedHooks from '../../hooks/use-chat-related-hooks';
import Typography from '@material-ui/core/Typography';
import { getMsgAnchor } from '../../util/misc';
import { setScrollToMessage } from '../../store/actions/chats';


function MessageItem({ data: { text, chat_id, attachments, mentionedMessages, id }, goToChat, commonStyles, dispatch }) {
  const attachmentsCount = attachments.filter(att => att.isDirect).length;
  const mentionedCount = mentionedMessages.length;

  return (
    <MenuItem
      style={{ minHeight: 'unset' }}
      onClick={() => {
        goToChat(chat_id);
        dispatch(setScrollToMessage(chat_id, getMsgAnchor(id, chat_id)));
      }}
      className={commonStyles.ellipsis}
      button
    >
      {!!text && <Typography>{text}</Typography>}
    </MenuItem>
  );
}

MessageItem.useHooks = useChatRelatedHooks;

MessageItem.propTypes = {
  data: shape({
    id: number.isRequired,
    text: string,
    chat_id: number.isRequired,
    attachments: arrayOf(shape({
      isDirect: bool.isRequired
    })).isRequired,
    mentionedMessages: array.isRequired,
    user: shape({
      firstName: string,
      lastName: string,
      fromChatBot: bool
    }).isRequired
  }),
  goToChat: func.isRequired,
  commonStyles: object.isRequired,
  dispatch: func.isRequired
};

export default MessageItem;