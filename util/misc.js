const path = require('path');


function getEnv() {
  return process.env.NODE_ENV || 'development';
}

function getFileIsUsable(file, basename) {
  return file.indexOf('.') !== 0 && file !== basename && path.extname(file) === '.js'
}

module.exports = {
  getEnv,
  getFileIsUsable
};