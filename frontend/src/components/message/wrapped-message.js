import React, { useRef } from 'react';
import { arrayOf, bool, number, object, shape, string } from 'prop-types';
import { useChats } from '../../contexts/chats-context';
import Box from '@material-ui/core/Box';
import ChatBotMessage from './chat-bot-message';
import RealUserMessage from './real-user-message';
import useStyles from './styles/wrapped-message.styles';
import clsx from 'clsx';
import zDate from '../../util/dates';
import useChatWindow from '../../hooks/use-chat-window';
import { Adjust, DoneAll } from '@material-ui/icons';
import CWBp from '../../util/chat-window-breakpoints';
import { getMsgAnchor } from '../../util/misc';
import { last } from 'lodash';


function WrappedMessage({ msg, chatId, prevMsg }) {
  const { readMessage } = useChats();
  const { selectedMessages, clickMessage, slotData: { size }, chatData } = useChatWindow();
  const messageBoxRef = useRef(null);

  const fromChatBot = msg.user.fromChatBot
  const isRead = zDate(msg.createdAt).isBefore(chatData.lastReadMessage?.createdAt);

  const styles = useStyles();

  const display = fromChatBot
    ? <ChatBotMessage msg={msg} readable chatId={chatId} />
    : <Box
      id={getMsgAnchor(msg.id, chatId)}
      ref={messageBoxRef}
      onMouseEnter={() => readMessage(msg.id, msg.createdAt, chatId)}
      display='flex'
      alignItems='center'
      flexDirection='column'
      className={clsx(
        styles.oneMessageWrapper,
        !!selectedMessages.find(m => m.id === msg.id) && styles.oneMessageWrapperSelected,
      )}
      onClick={e => {
        if (messageBoxRef.current && messageBoxRef.current.contains(e.target) && !fromChatBot) {
          e.stopPropagation();
          clickMessage(msg);
        }
      }}
    >
      <RealUserMessage msg={msg} />
      {
        msg.mentionedMessages?.map(mentionedMsg =>
          <RealUserMessage key={mentionedMsg.id} msg={mentionedMsg} isMentioned />
        )
      }
      <Box
        display='flex'
        justifyContent='flex-end'
        paddingTop={1}
        width='100%'
        paddingRight={size.lt(CWBp.names.large, CWBp.axis.hor) ? 2 : 7}
      >
        {isRead ? <DoneAll color='secondary' /> : <Adjust color='error' />}
      </Box>
    </Box>;

  return (
    <React.Fragment>
      {
        zDate(msg.createdAt).notSameDate(prevMsg?.createdAt) &&
        <ChatBotMessage msg={{ text: zDate(msg.createdAt).fDate() }} />
      }
      {
        prevMsg?.id === chatData.lastReadMessage.id &&
        <ChatBotMessage msg={{ text: 'Unread messages' }} />
      }
      {display}
    </React.Fragment>
  );
}

WrappedMessage.propTypes = {
  msg: shape({
    id: number.isRequired,
    user: shape({
      fromChatBot: bool
    }).isRequired,
    createdAt: string.isRequired,
    mentionedMessages: arrayOf(object)
  }).isRequired,
  prevMsg: shape({
    createdAt: string.isRequired
  }),
  chatId: number.isRequired,
};

export default WrappedMessage;