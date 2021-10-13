const express = require('express');
const useMiddleware = require('../middleware/index');
const { User } = require('../models/index');
const { serializeUser } = require('../serializers/users');
const { serializeMessageRecursive } = require('../serializers/messages');
const { OneValidationError, NoSuchError } = require('../util/custom-errors');
const { Op } = require('sequelize');
const { USER_BASIC, withChatMessages } = require('../util/query-options');
const { listChats } = require('../util/method-handlers');

const router = express.Router();

useMiddleware(router, { prefix: 'auth.' });

const SEARCH_TYPES = {
  users: 'users',
  chats: 'chats',
  messages: 'messages'
}

router.get('/', async (req, res, next) => {
  const { term, type, chat: chatId } = req.query;

  if (!type && chatId == null) {
    return next(new OneValidationError('Either a search type or a chat must be provided'));
  }

  try {
    let searchResult;
    if (chatId) {
      const matchingChats = await req.user.getChats({
        where: { id: chatId },
        rejectOnEmpty: new NoSuchError('chat', chatId),
        ...withChatMessages({ text: { [Op.iLike]: `%${term}%` } })
      });
      searchResult = matchingChats[0].messages.map(m => serializeMessageRecursive(m));
    } else {
      switch (type) {
        case SEARCH_TYPES.users:
          const usersData = await User.findAll({
            where: {
              [Op.and]: {
                [Op.or]: {
                  firstName: { [Op.iLike]: `%${term}%` },
                  lastName: { [Op.iLike]: `%${term}%` },
                  username: { [Op.iLike]: `%${term}%` }
                },
                id: { [Op.ne]: req.user.id }
              }
            },
            ...USER_BASIC
          });
          searchResult = usersData.map(serializeUser);
          break;
        case SEARCH_TYPES.chats:
          searchResult = await listChats(req.user, {
            filtering: { '$chat.name$': { [Op.iLike]: `%${term}%` } }
          });
          break;
        case SEARCH_TYPES.messages:
          const allChats = await req.user.getChats({
            ...withChatMessages({ text: { [Op.iLike]: `%${term}%` } })
          });
          searchResult = allChats.map(c => c.messages.map(m => serializeMessageRecursive(m, ['chat_id']))).flat();
          break;
        default:
      }
    }

    // TODO: refactor serialization + add pagination
    return res.json(searchResult);
  } catch (e) {
    next(e);
  }
});

module.exports = router;