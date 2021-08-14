const express = require('express');
const useMiddleware = require('../middleware/index');
const { User, Chat, Message } = require('../models/index');
const { serializeUser } = require('../serializers/users');
const { serializeChat } = require('../serializers/chats');
const { serializeMessage } = require('../serializers/messages');
const { OneValidationError } = require('../util/custom-errors');

const router = express.Router();

useMiddleware(router, { prefix: 'auth.' });

const SEARCH_TYPES = {
  users: 'users',
  chats: 'chats',
  messages: 'messages',
  any: 'any',
}

router.get('/', async (req, res, next) => {
  const { term, type, chat: chatId } = req.query;

  if (!type && chatId == null) {
    return next(new OneValidationError('Either a search type or a chat must be provided'));
  }

  try {
    let searchResult;
    if (chatId) {
      searchResult = await req.user.filterMessages(term, chatId);
    } else {
      switch (type) {
        case SEARCH_TYPES.users:
          searchResult = await User.filterUsers(term, req.user);
          break;
        case SEARCH_TYPES.chats:
          searchResult = await req.user.filterChats(term);
          break;
        case SEARCH_TYPES.messages:
          searchResult = await req.user.filterMessages(term);
          break;
        case SEARCH_TYPES.any:
          searchResult = (await Promise.all([
            User.filterUsers(term, req.user),
            req.user.filterChats(term),
            req.user.filterMessages(term)
          ])).flat();
          break;
        default:
      }
    }

    return res.json(searchResult.map(entry => {
      if (entry instanceof User) {
        return serializeUser(entry);
      }
      if (entry instanceof Chat) {
        return serializeChat(entry);
      }
      if (entry instanceof Message) {
        return serializeMessage(entry);
      }
    }));
  } catch (e) {
    next(e);
  }
});

module.exports = router;