const { getValidationErrJson } = require('../util/misc');
const { ValidationError, EmptyResultError } = require('sequelize');
const httpStatus = require('http-status');


function handleNotFoundError(err, req, res, next) {
  if (err instanceof EmptyResultError) {
    return res.status(httpStatus.NOT_FOUND).end();
  }

  next(err);
}

function handleValidationError(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(httpStatus.BAD_REQUEST).json(getValidationErrJson(err));
  }

  next(err);
}

function handleUnknownError(err, req, res, next) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
}

module.exports = {
  stack: [
    handleNotFoundError,
    handleValidationError,
    handleUnknownError
  ],
  order: 3
};