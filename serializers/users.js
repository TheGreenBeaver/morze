const { omit } = require('lodash');
const { isActive } = require('../util/misc');


function serializeUser(user) {
  return { ...omit(user.dataValues, ['deletedAt', 'UserChatMembership']), isActive: isActive(user) };
}

module.exports = {
  serializeUser
};