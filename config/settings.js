const path = require('path');

const API_VERSION = 1;

const REACT_APP_DIR = 'frontend';
const MEDIA_DIR = 'media';
const SRC_DIRNAME = __dirname.replace(`${path.sep}config`, '');

const STATIC_ROOT = path.join(SRC_DIRNAME, REACT_APP_DIR, 'build');
const REACT_INDEX = path.join(STATIC_ROOT, 'index.html');
const MEDIA_ROOT = path.join(SRC_DIRNAME, MEDIA_DIR);

const API_ROOT = `/api/v${API_VERSION}`;
const PORT = 8000;
const ERR_FIELD = 'nonFieldErrors';
const EXPIRATION_TIME = 60 * 60 * 24 * 5; // 5 days
const WS_PATH = '/ws';

module.exports = {
  STATIC_ROOT,
  MEDIA_ROOT,
  SRC_DIRNAME,
  REACT_INDEX,

  ERR_FIELD,
  EXPIRATION_TIME,

  PORT,
  API_ROOT,
  WS_PATH
};