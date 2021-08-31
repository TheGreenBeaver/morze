const { serializeAttachment } = require('./attachments');
const { serializeUser } = require('./users');
const { omit } = require('lodash');
const { isUpdated } = require('../util/misc');


function serializeMessageRecursive(message, deeper = false) {
  const toOmit = ['updatedAt', 'user_id', 'mentionedMessages', 'user', 'chat_id', 'chat'];

  const result = {
    ...omit(message.dataValues, toOmit),
    user: message.user ? serializeUser(message.user) : { fromChatBot: true },
    attachments: (message.attachments || []).map(serializeAttachment)
  };
  if (deeper) {
    result.mentionedCount = message.mentionedMessages.length;
  } else {
    result.mentionedMessages = (message.mentionedMessages || []).map(m => serializeMessageRecursive(m, true));
    result.isUpdated = isUpdated(message);
  }

  return result;
}

module.exports = {
  serializeMessageRecursive
};