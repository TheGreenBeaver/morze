const { AuthToken, User, Chat } = require('../models/index');
const { AuthError } = require('../util/custom-errors');


async function handleAuthorizedRequest(req, res, next) {
  const header = req.get('Authorization')
  if (!header) {
    return next(new AuthError(AuthError.TYPES.unauthorized));
  }

  const key = header.replace('Token ', '');
  const authToken = await AuthToken.findByPk(key, {
    include: {
      model: User,
      include: { model: Chat, attributes: [], as: 'chats' }
    }
  });
  if (!authToken) {
    return next(new AuthError(AuthError.TYPES.unauthorized));
  }
  req.user = authToken.user;
  next();
}

module.exports = {
  stack: [handleAuthorizedRequest],
  order: 1
};