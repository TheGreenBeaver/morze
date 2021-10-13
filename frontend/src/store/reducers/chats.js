import { chats } from '../actions/action-types';
import { cloneDeep } from 'lodash';
import { INITIAL_MENTIONED_DATA, INITIAL_MSG_DATA } from '../../util/constants';
import { applyUpd, getMsgAnchor } from '../../util/misc';


const initialState = null;


function handleNewMessage(state, { message, chatId, fromSelf }) {
  const updatedChat = state[chatId];
  const newChatData = {
    ...updatedChat,
    unreadCount: fromSelf ? 0 : updatedChat.unreadCount + 1,
    messages: [...updatedChat.messages, message],
    lastReadMessage: fromSelf ? message : updatedChat.lastReadMessage
  };
  if (fromSelf) {
    newChatData.scrollToMessage = getMsgAnchor(message.id, chatId);
  }

  return { ...state, [chatId]: newChatData };
}

function handleAddChat(state, chat) {
  return { ...state, [chat.id]: makeChatData(chat) };
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

function makeChatData(apiData) {
  return {
    ...apiData,
    selectedMessages: [],
    messagesToMention: [],
    isEditing: false,
    editedMsgInitial: INITIAL_MENTIONED_DATA,
    valuesBeforeEditing: INITIAL_MSG_DATA,
    scrollToMessage: null,
    dataToRebase: null,
    messageListLoaded: false
  };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // === Actual Chats ===
    case chats.SET_CHATS:
      return action.chats.reduce((newState, chat) => ({
        ...newState,
        [chat.id]: makeChatData(chat)
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
          messages: action.messages,
          messagesListLoaded: true
        }
      };
    }
    case chats.ADD_MESSAGE:
      return handleNewMessage(state, action);
    case chats.MARK_READ: {
      const newState = { ...state };
      action.data.forEach(({ chat: { id: cId }, lastReadMessage, unreadCount }) => {
        newState[cId].lastReadMessage = lastReadMessage;
        newState[cId].unreadCount = unreadCount;
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

    // == Chat Window
    case chats.SET_MESSAGES_TO_MENTION: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: { ...updatedChat, messagesToMention: action.messagesToMention }
      };
    }
    case chats.CLICK_MESSAGE: {
      const updatedChat = state[action.chatId];
      const currSelectedMessages = updatedChat.selectedMessages;
      const isSelected = currSelectedMessages.find(m => m.id === action.message.id);
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          selectedMessages: isSelected
            ? updatedChat.selectedMessages.filter(m => m.id !== action.message.id)
            : [...updatedChat.selectedMessages, action.message]
        }
      };
    }
    case chats.CLEAR_SELECTED_MESSAGES: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          selectedMessages: []
        }
      };
    }
    case chats.SET_IS_EDITING: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          isEditing: action.isEditing
        }
      };
    }
    case chats.SET_VALUES_BEFORE_EDITING: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          valuesBeforeEditing: applyUpd(action.upd, updatedChat.valuesBeforeEditing)
        }
      };
    }
    case chats.SET_EDITED_MSG_INITIAL: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          editedMsgInitial: applyUpd(action.upd, updatedChat.editedMsgInitial)
        }
      };
    }
    case chats.SET_SCROLL_TO_MESSAGE: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          scrollToMessage: action.messageAnchor
        }
      };
    }
    case chats.SET_DATA_TO_REBASE: {
      const updatedChat = state[action.chatId];
      return {
        ...state,
        [action.chatId]: {
          ...updatedChat,
          dataToRebase: action.dataToRebase
        }
      };
    }
    default:
      return state;
  }
};

export default reducer;