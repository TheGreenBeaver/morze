const { omit } = require('lodash');
const { isActive } = require('../util/misc');


function serializeUser(user) {
  return { ...omit(user, ['password', 'chats', 'isVerified']), isActive: isActive(user) };
}

function serializeSelf(user) {
  return { ...omit(user, ['password']), chats: user.chats || [], isActive: isActive(user) };
}

module.exports = {
  serializeUser,
  serializeSelf
};