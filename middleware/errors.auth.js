const { AuthError } = require('../util/custom-errors');
const httpStatus = require('http-status');


function handleUnauthorizedError(err, req, res, next) {
  if (err instanceof AuthError) {
    if (err.type === AuthError.TYPES.unauthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.status(httpStatus.BAD_REQUEST).json({ [err.type]: [`Invalid ${err.type}`] })
  }

  next(err);
}

module.exports = {
  stack: [handleUnauthorizedError],
  order: 2
};