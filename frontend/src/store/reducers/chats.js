import { chats } from '../actions/action-types';
import { cloneDeep } from 'lodash';


const initialState = null;


function handleNewMessage(state, { message, chatId }) {
  const updatedChat = state[chatId];

  return {
    ...state,
    [chatId]: {
      ...updatedChat,
      unreadCount: updatedChat.unreadCount + 1,
      messages: [message, ...updatedChat.messages]
    }
  };
}

function handleAddChat(state, chat) {
  return { ...state, [chat.id]: chat };
}

function handleRemoveChat(state, { id: chatId }) {
  const newState = { ...state };
  delete newState[chatId];
  return newState;
}

function handleSomeoneAction(state, data, adding) {
  const { message, chat } = data;

  // It's not the current user who's affected, the current one just receives a notification
  if (message) {
    return handleNewMessage(state, { message, chatId: chat.id });
  }

  return (adding ? handleAddChat : handleRemoveChat)(state, chat);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // === Actual Chats ===
    case chats.SET_CHATS:
      return action.chats.reduce((newState, chat) => ({
        ...newState,
        [chat.id]: chat
      }), {});
    case chats.ADD_CHAT:
      return handleAddChat(state, action.newChat);
    case chats.SOMEONE_LEFT_CHAT:
      return handleSomeoneAction(state, action.data, false);
    case chats.SOMEONE_INVITED_TO_CHAT:
      return handleSomeoneAction(state, action.data, true);
    case chats.EDIT_CHAT: {
      const { id: chatId } = action.updatedChat;
      const currentChatData = state[chatId];
      return {
        ...state,
        [chatId]: {
          ...currentChatData,
          name: action.updatedChat.name
        }
      };
    }

    // === Messages ===
    case chats.SET_MESSAGES: {
      const updatedChat = state[action.chatId];

      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          messages: action.messages
        }
      };
    }
    case chats.ADD_MESSAGE:
      return handleNewMessage(state, action);
    case chats.MARK_READ: {
      const newState = { ...state };
      Object.entries(action.data).forEach(([cId, info]) => {
        const { messages, lastReadMessage } = info;
        newState[cId].lastReadMessage = lastReadMessage;
        newState[cId].unreadCount -= messages.length;
        newState[cId].messages.forEach(m => {
          if (messages.some(rm => rm.id === m.id)) {
            m.isRead = true;
          }
        });
      });

      return newState;
    }
    case chats.DELETE_MESSAGE: {
      const newState = cloneDeep(state);
      const msgIndex = newState[action.chatId].messages.findIndex(msg => msg.id === action.deletedMessageId);
      if (msgIndex !== -1) {
        newState[action.chatId].messages.splice(msgIndex, 1);
      }
      return newState;
    }
    case chats.EDIT_MESSAGE: {
      const newState = cloneDeep(state);
      const chatId = action.data.chat.id
      newState[chatId].messages = state[chatId].messages.map(m =>
        m.id === action.data.message.id
          ? { ...m, ...action.data.message }
          : m
      );
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;