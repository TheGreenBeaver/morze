import {
  addChat,
  addMessage, deleteMessage, editChat, editMessage,
  markRead,
  setChats,
  setMessages, someoneInvitedToChat,
  someoneLeftChat
} from '../store/actions/chats';


const OOPS = 'Some temporary issues, please try again later';
const ERR_FIELD = 'nonFieldErrors';
const SEARCH_TYPES = {
  users: 'users',
  chats: 'chats',
  messages: 'messages'
}
const LINKS = {
  chats: '/chats',
  signIn: '/sign_in',
  signUp: '/sign_up',
  search: '/search'
};
const SIDEBAR_WIDTH = 260;
const SIDEBAR_OFFSET_CLASS = 'z-sidebar-offset';
const ONE_IMAGE_WRAPPER = 'z-one-image-wrapper';
const FILE_EXT_MAPPING = {
  doc: ['pdf', 'txt', 'ppt', 'doc', 'docx', 'xls', 'xlsx'],
  img: ['png', 'jpg', 'jpeg']
};
const MSG_FIELD_NAMES = {
  text: 'text',
  attachments: 'attachments',
  asDataUrls: 'asDataUrls',
};

const CHAT_WINDOWS_CONFIG = {
  baseAreaName: 'z-chat-window-',
  rotationActions: {
    clockwise: 1,
    counterClockwise: -1,
  },
  maxSlots: {
    small: 2,
    large: 4
  }
};

const HOST = process.env.REACT_APP_HOST || '';
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
const WS_ACTION_MAPPING = {
  [WS_ENDPOINTS.chats.list]: setChats,
  [WS_ENDPOINTS.chats.create]: addChat,
  [WS_ENDPOINTS.chats.leave]: someoneLeftChat,
  [WS_ENDPOINTS.chats.invite]: someoneInvitedToChat,
  [WS_ENDPOINTS.chats.edit]: editChat,

  [WS_ENDPOINTS.messages.list]: setMessages,
  [WS_ENDPOINTS.messages.send]: addMessage,
  [WS_ENDPOINTS.messages.markRead]: markRead,
  [WS_ENDPOINTS.messages.remove]: deleteMessage,
  [WS_ENDPOINTS.messages.edit]: editMessage
}

const API_VERSION = 1;
const HTTP_METHODS = {
  post: { name: 'post', withData: true },
  get: { name: 'get' },
  patch: { name: 'patch', withData: true },
  delete: { name: 'delete' },
};
const HTTP_ENDPOINTS = {
  signIn: {
    method: HTTP_METHODS.post,
    url: '/auth/sign_in',
    cancelOnPathChange: true
  },
  signUp: {
    method: HTTP_METHODS.post,
    url: '/users'
  },
  getCurrentUserData: {
    method: HTTP_METHODS.get,
    url: '/users/me',
    withAuth: true
  },
  confirm: {
    method: HTTP_METHODS.post,
    url: type => `/users/${type}`
  },
  search: {
    method: HTTP_METHODS.get,
    url: '/search',
    withAuth: true,
    cancelOnPathChange: true
  },
  logOut: {
    method: HTTP_METHODS.post,
    url: '/auth/log_out',
    withAuth: true
  },
  getUser: {
    method: HTTP_METHODS.get,
    url: id => `/users/${id}`,
    withAuth: true,
    cancelOnPathChange: true
  },
  listUsers: {
    method: HTTP_METHODS.get,
    url: '/users',
    withAuth: true
  },
  uploadFile: {
    method: HTTP_METHODS.post,
    url: '/upload',
    withAuth: true,
    cancelOnPathChange: true
  },
  editUser: {
    method: HTTP_METHODS.patch,
    url: '/users/me',
    withAuth: true,
  }
};

export {
  OOPS,
  ERR_FIELD,
  SEARCH_TYPES,
  LINKS,
  ONE_IMAGE_WRAPPER,
  FILE_EXT_MAPPING,
  MSG_FIELD_NAMES,

  SIDEBAR_WIDTH,
  SIDEBAR_OFFSET_CLASS,

  CHAT_WINDOWS_CONFIG,

  HOST,
  WS_ENDPOINTS,
  WS_ACTION_MAPPING,

  HTTP_ENDPOINTS,
  API_VERSION
};