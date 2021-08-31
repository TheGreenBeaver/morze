import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { node } from 'prop-types';
import { useWs } from './ws-context';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import {
  addOrRemoveChat,
  addSlot,
  insertOrMoveChat,
  parseConfig,
  removeSlot,
  rotate
} from '../util/chat-windows-config';
import { debounce, pick } from 'lodash';
import { CHAT_WINDOWS_CONFIG, WS_ENDPOINTS } from '../util/constants';
import { useSnackbar } from 'notistack';
import useScreenIsSmall from '../hooks/use-screen-is-small';


const Context = createContext({
  /**
   *
   * @param {number} messageId
   * @param {string} createdAt
   * @param {number} chatId
   */
  readMessage: (messageId, createdAt, chatId) => {},
  /**
   *
   * @param {Array<Object>|function(Array<Object>):Array<Object>} upd
   */
  setMessagesToMention: upd => {},
  messagesToMention: [],
  addOrRemoveChat: chatId => {},
  insertOrMoveChat: (chatId, newSlot) => {},
  addSlot: chatId => {},
  removeSlot: removedSlot => {},
  rotate: direction => {},
  config: {
    chatIds: [],
    template: ''
  },
  allChats: null,
  screenIsSmall: false,
  statistics: {
    notMaxSlots: true,
    slotsPresent: false,
    moreThanOne: false,
    noChats: true,
  },
  history: null
});

function useChats() {
  return useContext(Context);
}

function ChatsContext({ children }) {

  const { chatWindowsConfig } = useParams();
  const history = useHistory();

  const { send } = useWs();
  const { enqueueSnackbar } = useSnackbar();
  const screenIsSmall = useScreenIsSmall();

  const chats = useSelector(state => state.chats);

  const [messagesToRead, setMessagesToRead] = useState([]);
  const [messagesToMention, setMessagesToMention] = useState([]);

  const debouncedWs = useRef(debounce((currentSend, currentMessagesToRead) => {
    currentSend(WS_ENDPOINTS.messages.markRead, { messages: currentMessagesToRead });
  }, 300));

  const indicator = JSON.stringify(messagesToRead);
  useEffect(() => {
    debouncedWs.current.cancel();
    if (messagesToRead.length) {
      debouncedWs.current(send, messagesToRead);
    }
  }, [indicator]);

  useEffect(() => {
    send(WS_ENDPOINTS.chats.list)
  }, []);

  if (chats == null) {
    return null;
  }

  const config = parseConfig(chatWindowsConfig, Object.keys(chats).map(key => +key), screenIsSmall);
  const { redirect, chatIds, rotationDegrees } = config;

  function readMessage(messageId, createdAt, chatId) {
    const { lastReadMessage } = chats[chatId];
    const lastReadAsDate = new Date(lastReadMessage?.createdAt || 0);
    const newMsgAsDate = new Date(createdAt);
    if (lastReadAsDate.getTime() < newMsgAsDate.getTime() && !messagesToRead.includes(messageId)) {
      setMessagesToRead(curr => [...curr, messageId]);
    }
  }

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  const slotsAmount = chatIds.length;
  const maxSlots = screenIsSmall ? CHAT_WINDOWS_CONFIG.maxSlots.small : CHAT_WINDOWS_CONFIG.maxSlots.large;

  return (
    <Context.Provider
      value={{
        readMessage,
        setMessagesToMention,
        messagesToMention,
        addOrRemoveChat: chatId => {
          const { redirect: newLocation, message } = addOrRemoveChat(chatIds, rotationDegrees, screenIsSmall, chatId);
          if (message) {
            enqueueSnackbar(message, { variant: 'info' });
          } else {
            history.push(newLocation);
          }
        },
        insertOrMoveChat: (chatId, newSlot) => history.push(insertOrMoveChat(chatIds, rotationDegrees, screenIsSmall, chatId, newSlot)),
        addSlot: chatId => history.push(addSlot(chatIds, chatId)),
        removeSlot: removedSlot => history.push(removeSlot(chatIds, removedSlot)),
        rotate: direction => history.push(rotate(chatIds, rotationDegrees, direction)),
        config: pick(config, ['chatIds', 'template']),
        allChats: chats,
        screenIsSmall,
        statistics: {
          slotsPresent: !!slotsAmount,
          moreThanOne: slotsAmount > 1,
          noChats: !Object.values(chats).length,
          notMaxSlots: slotsAmount < maxSlots
        },
        history
      }}
    >
      {children}
    </Context.Provider>
  );
}

ChatsContext.propTypes = {
  children: node.isRequired
};

export default ChatsContext;
export { useChats };