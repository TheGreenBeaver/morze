import React from 'react';
import { shape, string, number, func } from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import useChatRelatedHooks from '../../hooks/use-chat-related-hooks';


function ChatItem({ data: { name, id }, goToChat }) {
  return (
    <MenuItem
      onClick={() => goToChat(id)}
      button
      style={{ minHeight: 'unset' }}
    >
      {name}
    </MenuItem>
  );
}

ChatItem.useHooks = useChatRelatedHooks;

ChatItem.propTypes = {
  data: shape({
    name: string,
    id: number.isRequired
  }).isRequired,
  goToChat: func.isRequired
};

export default ChatItem;