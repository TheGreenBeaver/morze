const path = require('path');


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

function dummyPromise() {
  return new Promise(resolve => resolve());
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
  dummyPromise,
  noOp
};