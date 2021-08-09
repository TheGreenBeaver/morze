const { omit } = require('lodash');
const { isActive } = require('../util/misc');


function serializeUser(user) {
  return { ...omit(user, ['password', 'isVerified', 'deletedAt']), isActive: isActive(user) };
}

function serializeSelf(user) {
  return { ...omit(user, ['password', 'deletedAt']), isActive: isActive(user) };
}

module.exports = {
  serializeUser,
  serializeSelf
};