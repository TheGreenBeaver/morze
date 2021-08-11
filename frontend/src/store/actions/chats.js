import { chats } from './action-types';


const setChats = chatsList => ({
  type: chats.SET_CHATS,
  chats: chatsList,
});

const addChat = newChat => ({
  type: chats.ADD_CHAT,
  newChat
});

export {
  setChats,
  addChat
};