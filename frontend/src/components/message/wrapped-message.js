import React from 'react';
import { arrayOf, bool, number, object, shape, string } from 'prop-types';
import { useChats } from '../../contexts/chats-context';
import Box from '@material-ui/core/Box';
import ChatBotMessage from './chat-bot-message';
import RealUserMessage from './real-user-message';
import useStyles from './styles/wrapped-message.styles';
import clsx from 'clsx';
import zDate from '../../util/dates';
import useChatWindow from '../../hooks/use-chat-window';


function WrappedMessage({ msg, chatId, prevMsg }) {
  const { readMessage } = useChats();
  const { selectedMessages, clickMessage } = useChatWindow();

  const fromChatBot = msg.user.fromChatBot

  const styles = useStyles();

  const display = fromChatBot
    ? <ChatBotMessage msg={msg} readable chatId={chatId} />
    : <Box
      onMouseEnter={() => readMessage(msg.id, msg.createdAt, chatId)}
      display='flex'
      alignItems='center'
      flexDirection='column'
      className={clsx(
        styles.oneMessageWrapper,
        !!selectedMessages.find(m => m.id === msg.id) && styles.oneMessageWrapperSelected,
      )}
      onClick={e => {
        if (!fromChatBot) {
          e.stopPropagation();
          clickMessage(msg);
        }
      }}
    >
      <RealUserMessage msg={msg} chatId={chatId} />
      {
        msg.mentionedMessages?.map(mentionedMsg =>
          <RealUserMessage key={mentionedMsg.id} msg={mentionedMsg} isMentioned chatId={chatId} />
        )
      }
    </Box>;

  return (
    <React.Fragment>
      {display}
      {/* The Container has column-reverse; this would actually be above */}
      {
        zDate(msg.createdAt).notSameDate(prevMsg?.createdAt) &&
        <ChatBotMessage msg={{ text: zDate(msg.createdAt).fDate() }} />
      }
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