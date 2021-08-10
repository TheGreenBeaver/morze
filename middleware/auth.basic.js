const { User } = require('../models/index');
const { checkAuthorization } = require('../util/method-handlers');


function handleAuthorizedRequest(req, res, next) {
  const header = req.get('Authorization');
  const key = header ? header.replace('Token ', '') : null;
  checkAuthorization(key, { include: { model: User, as: 'user' } })
    .then(authToken => {
      req.user = authToken.user.dataValues;
      next();
    })
    .catch(next);
}

module.exports = {
  stack: [handleAuthorizedRequest],
  order: 1
};