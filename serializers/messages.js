const { serializeAttachment } = require('./attachments');
const { serializeUser } = require('./users');
const { omit, sortBy } = require('lodash');
const { isUpdated } = require('../util/misc');


function serializeLastRead(lastRead) {
  if (!lastRead) {
    return null;
  }

  return {
    createdAt: lastRead.dataValues.createdAt.toISOString(),
    id: lastRead.dataValues.id
  };
}

function serializeMessageRecursive(message, deeper = false) {
  const toOmit = ['updatedAt', 'user_id', 'mentionedMessages', 'user', 'chat_id', 'chat', 'createdAt'];

  const result = {
    ...omit(message.dataValues, toOmit),
    createdAt: message.dataValues.createdAt.toISOString(),
    user: message.user ? serializeUser(message.user) : { fromChatBot: true },
    attachments: (message.attachments || []).map(serializeAttachment)
  };
  if (deeper) {
    result.mentionedCount = (message.mentionedMessages || []).length;
  } else {
    result.mentionedMessages =
      sortBy(message.mentionedMessages || [], 'createdAt').map(m => serializeMessageRecursive(m, true));
    result.isUpdated = isUpdated(message);
  }

  return result;
}

module.exports = {
  serializeMessageRecursive,
  serializeLastRead
};