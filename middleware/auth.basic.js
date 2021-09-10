const { checkAuthorization } = require('../util/method-handlers');


async function handleAuthorizedRequest(req, res, next) {
  try {
    const header = req.get('Authorization');
    const key = header ? header.replace('Token ', '') : null;
    const authToken = await checkAuthorization(key);
    req.user = authToken.user;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  stack: [handleAuthorizedRequest],
  order: 1
};