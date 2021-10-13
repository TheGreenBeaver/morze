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
  signUp: '/sign_up'
};
const SIDEBAR_WIDTH = 260;
const SIDEBAR_OFFSET_CLASS = 'z-sidebar-offset';
const FILE_TYPES = {
  img: 'img',
  doc: 'doc',
  youtube: 'youtube',
};
const FILE_EXT_MAPPING = {
  [FILE_TYPES.doc]: ['pdf', 'txt', 'ppt', 'doc', 'docx', 'xls', 'xlsx'],
  [FILE_TYPES.img]: ['png', 'jpg', 'jpeg', 'svg'],
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const FILE_ERRORS = {
  size: 'File size is too large',
  ext: 'File extension is not supported'
};
const MSG_FIELD_NAMES = {
  text: 'text',
  attachments: 'attachments',
  asDataUrls: 'asDataUrls',
};
const INITIAL_MSG_DATA = {
  [MSG_FIELD_NAMES.text]: '',
  [MSG_FIELD_NAMES.attachments]: [],
  [MSG_FIELD_NAMES.asDataUrls]: [],
};
const INITIAL_MENTIONED_DATA = {
  ...INITIAL_MSG_DATA,
  mentionedMessages: [],
  id: 0
};
const YOUTUBE_HOSTS = {
  com: 'youtube.com',
  be: 'youtu.be'
}
const YOUTUBE_PREVIEW_SIZE = {
  default: 'default',
  medium: 'medium',
  high: 'high',
  standard: 'standard',
  maxres: 'maxres',
}

const CHAT_WINDOWS_CONFIG = {
  baseAreaName: 'z-chat-window-',
  rotationActions: {
    clockwise: 1,
    counterClockwise: -1,
  },
  maxSlots: {
    small: 2,
    large: 4
  },
  patterns: {
    small: /^id=(\d+|_)(,(\d+|_))?$/,
    large: /^id=(\d+|_)(,(\d+|_)){0,3}(&rotation=(90|180|270))?$/
  }
};

const CHAT_WINDOW_HEADER_HEIGHT = {
  s: 42,
  ml: 56
};
const AUTO_SCROLL_THRESHOLD = {
  small: 1.15,
  medium: 1.35,
  large: 1.55
};

const HOST = process.env.REACT_APP_HOST || window.location.host;
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

const ERROR_RESP_THRESHOLD = 400;

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
    url: '/upload/file_attachments',
    withAuth: true
  },
  editUser: {
    method: HTTP_METHODS.patch,
    url: '/users/me',
    withAuth: true,
  },
  youtube: {
    method: HTTP_METHODS.post,
    url: '/upload/youtube',
    withAuth: true
  }
};

export {
  OOPS,
  ERR_FIELD,
  SEARCH_TYPES,
  LINKS,
  FILE_EXT_MAPPING,
  FILE_TYPES,
  MSG_FIELD_NAMES,
  INITIAL_MSG_DATA,
  INITIAL_MENTIONED_DATA,
  MAX_FILE_SIZE,
  FILE_ERRORS,
  YOUTUBE_HOSTS,
  CHAT_WINDOW_HEADER_HEIGHT,
  YOUTUBE_PREVIEW_SIZE,

  AUTO_SCROLL_THRESHOLD,

  SIDEBAR_WIDTH,
  SIDEBAR_OFFSET_CLASS,

  CHAT_WINDOWS_CONFIG,

  HOST,
  WS_ENDPOINTS,
  WS_ACTION_MAPPING,

  ERROR_RESP_THRESHOLD,

  HTTP_ENDPOINTS,
  API_VERSION
};