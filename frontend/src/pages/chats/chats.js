import React from 'react';
import { useWs } from '../../contexts/ws-context';
import { WS_ENDPOINTS } from '../../util/constants';
import { useSelector } from 'react-redux';
import useOnWs from '../../hooks/use-on-ws';


function Chats() {

  const { send } = useWs()
  const { chats } = useSelector(state => state.chats);

  useOnWs(() => send(WS_ENDPOINTS.chats.list));

  return (
    <div>
      <ul>
        {chats.map(chat => <li key={chat.id}>{chat.name}</li>)}
      </ul>
      <button
        onClick={() => {
          send(
            WS_ENDPOINTS.messages.send,
            { text: 'First Message', chatId: 6 }
          );
        }}
      >
        send msg
      </button>
      <button
        onClick={() => {
          send(
            WS_ENDPOINTS.messages.send,
            { text: 'Second Message', chatId: 2 }
          );
        }}
      >
        send msg to c1
      </button>
    </div>
  );
}

export default Chats;