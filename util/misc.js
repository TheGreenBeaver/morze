const path = require('path');
const { CustomError } = require('./custom-errors');


function getEnv() {
  return process.env.NODE_ENV || 'development';
}

function getFileIsUsable(file, basename) {
  return file.indexOf('.') !== 0 && file !== basename && path.extname(file) === '.js'
}

function now() {
  return (new Date()).getTime();
}

function isActive(obj) {
  return obj.deletedAt == null;
}

function getValidationErrJson(validationResult) {
  return validationResult.errors.reduce(
    (acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {})
}

function getUniqueKeyName(sqlData) {
  return sqlData.constraint
    .replace(`${sqlData.table}_`, '')
    .replace('_key', '');
}

function dummyResolve() {
  return new Promise(resolve => resolve());
}

/**
 *
 * @param {Error|Object} err
 * @returns {Promise<Error>}
 */
function dummyReject(err) {
  return new Promise((_, reject) => reject(
    err instanceof Error
      ? err
      : new CustomError(err)
  ));
}

function noOp() {
  return null;
}

module.exports = {
  getEnv,
  getFileIsUsable,
  now,
  isActive,
  getValidationErrJson,
  getUniqueKeyName,
  dummyResolve,
  dummyReject,
  noOp
};