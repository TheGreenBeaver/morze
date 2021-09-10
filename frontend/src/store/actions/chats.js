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

const addMessage = ({ chat: { id: chatId }, message, fromSelf }) => ({
  type: chats.ADD_MESSAGE,
  message,
  chatId,
  fromSelf
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

// === Chat Window
const setMessagesToMention = (chatId, messagesToMention) => ({
  type: chats.SET_MESSAGES_TO_MENTION,
  chatId,
  messagesToMention
});

const clickMessage = (chatId, message) => ({
  type: chats.CLICK_MESSAGE,
  chatId,
  message
});

const clearSelectedMessages = (chatId) => ({
  type: chats.CLEAR_SELECTED_MESSAGES,
  chatId
});

const setIsEditing = (chatId, isEditing) => ({
  type: chats.SET_IS_EDITING,
  chatId,
  isEditing
});

const setValuesBeforeEditing = (chatId, upd) => ({
  type: chats.SET_VALUES_BEFORE_EDITING,
  chatId,
  upd
});

const setEditedMsgInitial = (chatId, upd) => ({
  type: chats.SET_EDITED_MSG_INITIAL,
  chatId,
  upd
})

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
  editMessage,

  setMessagesToMention,
  clickMessage,
  clearSelectedMessages,
  setIsEditing,
  setEditedMsgInitial,
  setValuesBeforeEditing
};