const { checkAuthorization } = require('../util/method-handlers');


function handleAuthorizedRequest(req, res, next) {
  const header = req.get('Authorization');
  const key = header ? header.replace('Token ', '') : null;
  checkAuthorization(key)
    .then(authToken => {
      req.user = authToken.user;
      next();
    })
    .catch(next);
}

module.exports = {
  stack: [handleAuthorizedRequest],
  order: 1
};