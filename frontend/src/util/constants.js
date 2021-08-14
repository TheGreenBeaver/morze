const OOPS = 'Some temporary issues, please try again later';
const ERR_FIELD = 'nonFieldErrors';
const SEARCH_TYPES = {
  users: 'users',
  chats: 'chats',
  messages: 'messages',
  any: 'any',
}
const LINKS = {
  chats: '/chats',
  signIn: '/sign_in',
  signUp: '/sign_up',
  search: '/search'
};

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
  }
};

export {
  OOPS,
  ERR_FIELD,
  SEARCH_TYPES,
  LINKS,

  WS_ENDPOINTS,
  HTTP_ENDPOINTS,
  API_VERSION
};