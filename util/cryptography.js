const crypto = require('crypto');
const { now } = require('./misc');
require('dotenv').config();
const settings = require('../config/settings');

/**
 *
 * @param {string} value a string to encrypt
 * @returns {string} hmac256-hashed string
 */
function hash(value) {
  const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY, { encoding: 'utf8' });
  hmac.update(value);
  return hmac.digest('hex');
}

/**
 *
 * @param {string} plain a non-encrypted string
 * @param {string} hashed
 * @returns {boolean} true if the plain string gives the same hash
 */
function compareHashed(plain, hashed) {
  return hash(plain) === hashed;
}

/**
 *
 * @param {number} value
 * @returns {string}
 */
function getB36(value) {
  return value.toString(36);
}

/**
 *
 * @param {string} value
 * @returns {number}
 */
function parseB36(value) {
  return parseInt(value, 36);
}

/**
 *
 * @param {Object} seedObj the object providing the hash seed
 * @param {Array<string>} usedFields the seedObj fields to use
 * @param {number} timestamp
 * @returns {string}
 */
function generateToken(
  seedObj,
  { usedFields = ['name', 'username'], timestamp } = {}
) {
  const toHash = usedFields.map(field => seedObj[field]).join('');
  const hashedVal = hash(toHash);

  const b36 = getB36(timestamp || now());
  return `${b36}-${hashedVal}`;
}

const TOKEN_STATUS = {
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
  OK: 'OK'
};

/**
 *
 * @param {Object} seedObj the object providing the hash seed
 * @param {string} token
 * @param {Array<string>} usedFields the seedObj fields to use
 * @returns {string}
 */
function checkToken(
  seedObj, token,
  { usedFields = ['name', 'username'] } = {}
) {
  if (!seedObj) {
    return TOKEN_STATUS.INVALID;
  }

  const timestamp = parseB36(token.split('-')[0]);
  const regenerated = generateToken(seedObj, { usedFields, timestamp });
  if (regenerated !== token) {
    return TOKEN_STATUS.INVALID;
  }

  if (now() - timestamp > settings.EXPIRATION_TIME) {
    return TOKEN_STATUS.EXPIRED;
  }

  return TOKEN_STATUS.OK;
}

module.exports = {
  hash,
  compareHashed,
  generateToken,
  getB36,
  parseB36,
  checkToken,

  TOKEN_STATUS
};