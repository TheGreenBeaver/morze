import { chats } from './action-types';


// === Actual Chats ===
const setChats = chatsList => ({
  type: chats.SET_CHATS,
  chats: chatsList,
});

const addChat = newChat => ({
  type: chats.ADD_CHAT,
  newChat
});

const someoneLeftChat = data => ({
  type: chats.SOMEONE_LEFT_CHAT,
  data
});

const someoneInvitedToChat = data => ({
  type: chats.SOMEONE_INVITED_TO_CHAT,
  data
});

const editChat = updatedChat => ({
  type: chats.EDIT_CHAT,
  updatedChat
});

// === Messages ===
const setMessages = ({ chat: { id: chatId }, messages }) => ({
  type: chats.SET_MESSAGES,
  messages,
  chatId
});

const addMessage = ({ chat: { id: chatId }, message }) => ({
  type: chats.ADD_MESSAGE,
  message,
  chatId
});

const markRead = data => ({
  type: chats.MARK_READ,
  data
});

const deleteMessage = ({ chat: { id: chatId }, message: { id: deletedMessageId } }) => ({
  type: chats.DELETE_MESSAGE,
  deletedMessageId,
  chatId
});

const editMessage = data => ({
  type: chats.EDIT_MESSAGE,
  data
});

export {
  setChats,
  addChat,
  someoneLeftChat,
  someoneInvitedToChat,
  editChat,

  setMessages,
  addMessage,
  markRead,
  deleteMessage,
  editMessage
};