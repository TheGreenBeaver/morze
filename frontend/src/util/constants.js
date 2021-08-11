const OOPS = 'Some temporary issues, please try again later';
const ERR_FIELD = 'nonFieldErrors';

const WS_ENDPOINTS = {
  messages: {
    send: 'messages/send',
    edit: 'messages/edit',
    remove: 'messages/remove',
    markRead: 'messages/markRead',
    list: 'messages/list'
  },

  chats: {
    leave: 'chats/leave',
    kick: 'chats/kick',
    create: 'chats/create',
    invite: 'chats/invite',
    list: 'chats/list',
    edit: 'chats/edit',
    remove: 'chats/remove',
    makeAdmin: 'chats/makeAdmin'
  }
};

export {
  OOPS,
  ERR_FIELD,
  WS_ENDPOINTS
};