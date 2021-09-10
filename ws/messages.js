const { onlyMembers } = require('../util/ws');
const { serializeMessageRecursive } = require('../serializers/messages');
const { NoSuchError, CustomError, OneValidationError } = require('../util/custom-errors');
const { User, MessageAttachment, UserChatMembership, sequelize, Message } = require('../models/index');
const {
  withLastRead, MESSAGE_FULL, USER_BASIC, DUMMY, MESSAGE_GLANCE, MESSAGE_WITH_RECEIVERS, MESSAGE_WITH_RECEIVERS_DUMMY
} = require('../util/query-options');
const settings = require('../config/settings');
const { QueryTypes, Op } = require('sequelize');
const { differenceWith } = require('lodash');


async function send(data, { user, broadcast }) {
  const { chat: chatId, text, attachments: filePaths, mentionedMessages } = data;

  if (!text && (!filePaths || !filePaths.length) && (!mentionedMessages || !mentionedMessages.length)) {
    throw new CustomError({ [settings.ERR_FIELD]: 'A message without attachments or mentioned messages must have some text' });
  }

  const matchingChats = await user.getChats({ where: { id: chatId }, rejectOnEmpty: new NoSuchError('chat', chatId) });

  const theChat = matchingChats[0];
  const attachments = (filePaths || []).map(fp => ({ file: fp.file, type: fp.type }));

  const newMessage = await theChat.createMessage(
    { text, user_id: user.id, attachments },
    {
      include: [
        { model: MessageAttachment, as: 'attachments' },
        { model: User, as: 'user', ...USER_BASIC }
      ]
    }
  );
  await theChat.UserChatMembership.setLastReadMessage(newMessage);
  if (mentionedMessages && mentionedMessages.length) {
    try {
      await newMessage.setMentionedMessages(mentionedMessages);
    } catch (e) {
      // TODO: parse Error and check which messages don't exist
      throw new NoSuchError('messages', [], 'mentionedMessages');
    }
  }
  await newMessage.reload(MESSAGE_FULL);
  const members = await theChat.getUsers(DUMMY);
  broadcast({ chat: { id: chatId }, message: serializeMessageRecursive(newMessage) }, {
    extraCondition: client => onlyMembers(members, client),
    adjustData: (data, client) => ({ ...data, fromSelf: client.user === user })
  });
}

async function edit(data, { user, broadcast }) {
  const { message: messageId, text: newText, attachments: newAttachments, mentionedMessages: newMentionedMessages } = data;

  const matchingMessages = await user.getMessages({
    where: { id: messageId }, ...MESSAGE_GLANCE, rejectOnEmpty: new NoSuchError('message', messageId)
  });

  const theMessage = matchingMessages[0];

  const { text: oldText, attachments: oldAttachments, mentionedMessages: oldMentionedMessages } = theMessage;

  const willHaveText = newText == null ? !!oldText : !!newText;
  const willHaveAttachments = newAttachments == null ? !!oldAttachments.length : !!newAttachments.length;
  const willHaveMentionedMessages = newMentionedMessages == null ? !!oldMentionedMessages.length : !!newMentionedMessages.length;

  if (!willHaveText && !willHaveAttachments && !willHaveMentionedMessages) {
    throw new CustomError({ [settings.ERR_FIELD]: 'A message without attachments or mentioned messages must have some text' });
  }

  if (newText != null) {
    theMessage.text = newText;
    await theMessage.save();
  }
  if (newAttachments != null) {
    const attachmentsToCreate = newAttachments.filter(att => att.id == null);
    const newAttachmentsData = await MessageAttachment.bulkCreate(attachmentsToCreate.map(fp => ({ file: fp.file, type: fp.type })));
    await theMessage.setAttachments([...newAttachmentsData, ...newAttachments.filter(att => att.id != null).map(att => att.id)]);
  }
  if (newMentionedMessages != null) {
    await theMessage.setMentionedMessages(newMentionedMessages.map(mMsg => mMsg.id));
  }

  await theMessage.reload(MESSAGE_WITH_RECEIVERS);
  broadcast({
      chat: { id: theMessage.chat_id },
      message: serializeMessageRecursive(theMessage)
    }, {
      extraCondition: client => onlyMembers(theMessage.chat.users, client),
    }
  );
}

async function remove(data, { user, broadcast }) {
  const { messages: messageIds } = data;

  const matchingMessages = await user.getMessages({
    where: { id: messageIds }, ...MESSAGE_WITH_RECEIVERS_DUMMY
  });
  if (matchingMessages.length !== messageIds) {
    throw new NoSuchError('message', differenceWith(messageIds, matchingMessages, (i, m) => m.i === i));
  }
  const theMessage = matchingMessages[0];
  const members = theMessage.chat.users;
  await theMessage.destroy();
  broadcast({ messages: messageIds }, {
    extraCondition: client => onlyMembers(members, client)
  });
}

async function markRead(data, { user, resp }) {
  const { messages: messageIds } = data;
  const memberships = await UserChatMembership.findAll({ where: { user_id: user.id }, ...withLastRead(false) });
  const userChats = memberships.map(m => m.chat.id);

  const queryResult = await sequelize.query(
    'SELECT count(*), "latestOfMarkedId", "chatId", "latestOfMarkedTime" FROM (' +
    'SELECT chat_id "chatId", last_value(id) OVER (PARTITION BY chat_id) "latestOfMarkedId", ' +
    'last_value(created_at) OVER (PARTITION BY chat_id) "latestOfMarkedTime" FROM message ' +
    'WHERE id IN (:messageIds) AND chat_id IN (:userChats) ORDER BY chat_id DESC, created_at DESC) as ord ' +
    'GROUP BY "chatId", "latestOfMarkedId", "latestOfMarkedTime"', {
      replacements: { messageIds, userChats },
      type: QueryTypes.SELECT
    }
  );

  const foundMessagesCount = queryResult.reduce((cnt, { count: localCnt }) => cnt + (+localCnt), 0);
  if (foundMessagesCount !== messageIds.length) {
    throw new OneValidationError('Some of the marked messages don\'t exist', 'messages');
  }

  const counts = {};
  for (const row of queryResult) {
    const { chatId, latestOfMarkedId, latestOfMarkedTime } = row;
    const theMembership = await UserChatMembership.findOne({
      where: { chat_id: chatId, user_id: user.id },
      rejectOnEmpty: new NoSuchError('chat', chatId, settings.ERR_FIELD)
    });

    await theMembership.setLastReadMessage(latestOfMarkedId);
    counts[chatId] = await Message.count({
      where: { createdAt: { [Op.gt]: latestOfMarkedTime } }
    });
  }

  resp(queryResult.map(row => ({
    chat: { id: row.chatId },
    lastReadMessage: { createdAt: row.latestOfMarkedTime.toISOString(), id: row.latestOfMarkedId },
    unreadCount: counts[row.chatId]
  })));
}

function list(data, { user, resp }) {
  const { chat: chatId } = data;

  // TODO: Pagination
  return UserChatMembership
    .findOne({
      where: { chat_id: chatId, user_id: user.id },
      ...withLastRead(false)
    })
    .then(membership => {
      if (membership == null) {
        throw new NoSuchError('chat', chatId);
      }

      return membership.chat
        .getMessages(MESSAGE_FULL)
        .then(messages => resp({
          chat: { id: chatId },
          messages: messages.map(msg => serializeMessageRecursive(msg))
        }));
    })
}


module.exports = {
  send, edit, remove, markRead, list
};