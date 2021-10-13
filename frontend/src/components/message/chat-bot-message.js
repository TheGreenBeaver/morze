import React from 'react';
import { bool, number, shape, string } from 'prop-types';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { useChats } from '../../contexts/chats-context';
import { getMsgAnchor } from '../../util/misc';


function ChatBotMessage({ msg, readable, chatId }) {
  const { readMessage } = useChats();

  return (
    <Box
      display='grid'
      gridTemplateColumns='1fr 2fr 1fr'
      gridColumnGap={8}
      alignItems='center'
      paddingBottom={1}
      width='100%'
      maxWidth={600}
      onMouseOver={() => {
        if (readable) {
          readMessage(msg.id, msg.createdAt, chatId);
        }
      }}
      id={getMsgAnchor(msg.id, chatId)}
    >
      <Divider/>
      <Typography color='textSecondary' align='center'>{msg.text}</Typography>
      <Divider/>
    </Box>
  );
}

ChatBotMessage.propTypes = {
  msg: shape({
    text: string.isRequired,
    createdAt: string,
    id: number
  }).isRequired,
  readable: bool,
  chatId: number
};

export default ChatBotMessage;