const httpStatus = require('http-status');
const { compareHashed } = require('./cryptography');
const { AuthError } = require('./custom-errors');
const { AuthToken, User, UserChatMembership } = require('../models/index');
const { USER_AUTH, AUTH_TOKEN_LOG_IN, withLastRead } = require('./query-options');
const { serializeMembershipsList } = require('../serializers/chats');
const { Op } = require('sequelize');


async function find({ Model, serializer = v => v, options }, req, res, next) {
  try {
    const instance = await Model.findByPk(+req.params.id, { rejectOnEmpty: true, ...options });
    return res.json(serializer(instance));
  } catch (e) {
    return next(e);
  }
}

async function list({ Model, serializer = v => v, options }, req, res, next) {
  try {
    const queryRes = await Model.findAll(options);
    return res.json(queryRes.map(instance => serializer(instance)));
  } catch (e) {
    next(e);
  }
}

async function create({ Model, serializer = v => v }, req, res, next) {
  try {
    const instance = await Model.create(req.body);
    return res.status(httpStatus.CREATED).json(serializer(instance));
  } catch (e) {
    next(e);
  }
}

async function authorizeWithToken({ username, password }, res) {
  const user = await User.findOne({ where: { username }, ...USER_AUTH, rejectOnEmpty: new AuthError(true) });
  if (!compareHashed(password, user.password)) {
    throw new AuthError(true);
  } else {
    const authToken = await AuthToken.create({ user_id: user.id });
    return res.json({ token: authToken.key });
  }
}

function listChats(user, { filtering, needUsersList } = {}) {
  return UserChatMembership.findAll({
    where: { user_id: user.id, ...filtering },
    attributes: ['isAdmin'],
    ...withLastRead(true, needUsersList)
  })
    .then(memberships => {
      const getUnreadCounts = memberships.map(({ chat, lastReadMessage }) =>
        chat.countMessages({
          where: { createdAt: { [Op.gt]: lastReadMessage ? lastReadMessage.createdAt : new Date(0) } }
        })
      );
      return Promise.all(getUnreadCounts).then(counters =>
        serializeMembershipsList(memberships, counters)
      )
    })
}

async function checkAuthorization(key) {
  if (!key) {
    throw new AuthError();
  }
  return await AuthToken.findByPk(key, { ...AUTH_TOKEN_LOG_IN, rejectOnEmpty: new AuthError() });
}

module.exports = {
  find,
  list,
  create,
  authorizeWithToken,
  checkAuthorization,
  listChats
};