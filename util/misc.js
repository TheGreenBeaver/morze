const path = require('path');
const { CustomError } = require('./custom-errors');
const { last } = require('lodash');
const settings = require('../config/settings');
require('dotenv').config();


function getVar(name, defaultVal = '') {
  return process.env[name] || defaultVal;
}

function getHost() {
  return `http://${getVar('HOST', 'localhost')}:${settings.PORT}`;
}

const DEV_ENV = 'dev';
function getEnv() {
  return getVar('NODE_ENV', DEV_ENV);
}

function isDev() {
  return getEnv() === DEV_ENV;
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

function isUpdated(obj) {
  return obj.createdAt && obj.updatedAt && obj.createdAt.getTime() !== obj.updatedAt.getTime();
}

function getValidationErrJson(validationResult) {
  return validationResult.errors.reduce(
    (acc, err) => {
      if (acc[err.path] == null) {
        acc[err.path] = '';
      } else {
        acc[err.path] += ' ';
      }
      acc[err.path] += err.message;
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

function userFullName(user) {
  return `${user.firstName} ${user.lastName}`;
}

function namesList(users) {
  const amount = users.length;
  if (amount === 1) {
    return userFullName(users[0]);
  }

  let firstPart, secondPart;
  if (amount < 5) {
    firstPart = users.slice(0, -1);
    secondPart = userFullName(last(users));
  } else {
    firstPart = users.slice(0, 4);
    secondPart = `${amount - 4} others`;
  }

  return `${firstPart.map(userFullName).join(', ')} and ${secondPart}`;
}

function composeMediaPath(file) {
  const relativePath = path.relative(settings.SRC_DIRNAME, file.path);
  return `${getHost()}/${relativePath}`;
}

module.exports = {
  getEnv,
  getFileIsUsable,
  now,
  isActive,
  isUpdated,
  getValidationErrJson,
  getUniqueKeyName,
  dummyResolve,
  dummyReject,
  noOp,
  namesList,
  userFullName,
  getVar,
  isDev,
  composeMediaPath,
  getHost
};