const path = require('path');

const REACT_APP_DIR = 'frontend';
const API_VERSION = 1;

const STATIC_ROOT = path.join(__dirname, REACT_APP_DIR, 'build');
const API_ROOT = `/api/v${API_VERSION}`;
const PORT = 8000;
const HASH_SALT_ROUNDS = 10;
const ERR_FIELD = 'non_field_errors';
const EXPIRATION_TIME = 60 * 60 * 24 * 5; // 5 days

module.exports = {
  STATIC_ROOT,
  PORT,
  API_ROOT,
  HASH_SALT_ROUNDS,
  ERR_FIELD,
  EXPIRATION_TIME
};