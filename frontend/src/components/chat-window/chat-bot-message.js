import React from 'react';
import { func, string } from 'prop-types';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';


function ChatBotMessage({ text, readMessage }) {
  return (
    <Box
      display='grid'
      gridTemplateColumns='1fr 2fr 1fr'
      gridColumnGap={8}
      alignItems='center'
      onMouseEnter={readMessage}
    >
      <Divider/>
      <Typography color='textSecondary' align='center'>{text}</Typography>
      <Divider/>
    </Box>
  );
}

ChatBotMessage.propTypes = {
  text: string.isRequired,
  readMessage: func
};

export default ChatBotMessage;