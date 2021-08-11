const { pick } = require('lodash');


function serializeMessage(message) {
  return {
    ...pick(message, ['text', 'createdAt']),
    isUpdated: message.createdAt.getTime() !== message.updatedAt.getTime(),
    user: message.user
  };
}

module.exports = {
  serializeMessage
};