const { onlyMembers } = require('../util/ws');
const { getHost } = require('../util/misc');
const { serializeMessageRecursive } = require('../serializers/messages');
const { NoSuchError, CustomError, OneValidationError } = require('../util/custom-errors');
const { User, MessageAttachment, UserChatMembership, sequelize, Message } = require('../models/index');
const {
  MESSAGE_FULL, MESSAGE_GLANCE,
  MESSAGE_WITH_RECEIVERS, MESSAGE_WITH_RECEIVERS_DUMMY, MESSAGE_WITH_ATTACHMENTS, MESSAGE_WITH_PARENT,
  USER_BASIC, withLastRead, CHAT_WITH_USERS, DUMMY
} = require('../util/query-options');
const settings = require('../config/settings');
const { QueryTypes, Op } = require('sequelize');
const { differenceWith } = require('lodash');
const fs = require('fs');
const path = require('path');


async function send(data, { user, broadcast }) {
  const { chat: chatId, text, attachments: filePaths, mentionedMessages: mentionedMessageIds } = data;

  if (!text && (!filePaths || !filePaths.length) && (!mentionedMessageIds || !mentionedMessageIds.length)) {
    throw new CustomError({ [settings.ERR_FIELD]: 'A message without attachments or mentioned messages must have some text' });
  }

  const matchingChats = await user.getChats({
    where: { id: chatId },
    ...CHAT_WITH_USERS,
    rejectOnEmpty: new NoSuchError('chat', chatId)
  });

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
  if (mentionedMessageIds && mentionedMessageIds.length) {
    const mentionedMessages = await Message.findAll({
      where: { id: mentionedMessageIds }, ...MESSAGE_GLANCE
    });
    if (mentionedMessages.length !== mentionedMessageIds.length) {
      throw new NoSuchError('message', differenceWith(mentionedMessageIds, mentionedMessages, (i, m) => m.i === i));
    }
    await newMessage.setMentionedMessages(mentionedMessages);
    for (const mm of mentionedMessages) {
      if (mm.attachments.length) {
        await newMessage.addAttachments(mm.attachments, { through: { isDirect: false } });
      }
    }
  }
  await newMessage.reload(MESSAGE_FULL);

  const getData = client => ({
    chat: { id: chatId },
    message: serializeMessageRecursive(newMessage),
    fromSelf: client.user === user
  });

  broadcast(getData, { extraCondition: client => onlyMembers(theChat.users, client) });
}

async function makeIndirectAttachments(msg, attachments) {
  for (const parentMsg of msg.mentionedIn) {
    await parentMsg.addAttachments(attachments, { through: { isDirect: false } });

    await parentMsg.reload(MESSAGE_WITH_PARENT);
    if (parentMsg.mentionedIn.length) {
      await makeIndirectAttachments(parentMsg, attachments);
    }
  }
}

async function edit(data, { user, broadcast }) {
  const { message: messageId, text: newText, attachments: newAttachments, mentionedMessages: newMentionedMessageIds } = data;

  const queryOptions = { ...MESSAGE_GLANCE };
  queryOptions.include.push({
    model: Message,
    as: 'mentionedIn',
    ...DUMMY,
    through: { attributes: [] }
  });
  const matchingMessages = await user.getMessages({
    where: { id: messageId }, ...queryOptions, rejectOnEmpty: new NoSuchError('message', messageId)
  });

  const theMessage = matchingMessages[0];

  const { text: oldText, attachments: allOldAttachments, mentionedMessages: oldMentionedMessages } = theMessage;
  const oldAttachments = allOldAttachments.filter(att => att.AttachmentsRouting.isDirect);

  const willHaveText = newText == null
    ? !!oldText
    : !!newText;
  const willHaveAttachments = newAttachments == null
    ? !!oldAttachments.length
    : !!newAttachments.length;
  const willHaveMentionedMessages = newMentionedMessageIds == null
    ? !!oldMentionedMessages.length
    : !!newMentionedMessageIds.length;

  if (!willHaveText && !willHaveAttachments && !willHaveMentionedMessages) {
    throw new CustomError({ [settings.ERR_FIELD]: 'A message without attachments or mentioned messages must have some text' });
  }

  if (newText != null) {
    theMessage.text = newText;
    await theMessage.save();
  }

  if (newAttachments != null) {
    const attachmentsToDelete = differenceWith(oldAttachments, newAttachments, (oldA, newA) => oldA.id === newA.id);
    if (attachmentsToDelete.length) {
      // No need to destroy indirect routings, CASCADE will do it for us
      await MessageAttachment.destroy({ where: { id: attachmentsToDelete.map(att => att.id) } });
      for (const att of attachmentsToDelete) {
        const pathToFile = path.join(settings.SRC_DIRNAME, att.file.replace(`${getHost()}/`, ''));
        await fs.promises.unlink(pathToFile);
      }
    }

    const attachmentsToCreate = newAttachments.filter(att => !att.saved);
    if (attachmentsToCreate.length) {
      const newAttachmentsData = await MessageAttachment.bulkCreate(attachmentsToCreate.map(fp => ({ file: fp.file, type: fp.type })));
      await makeIndirectAttachments(theMessage, newAttachmentsData);
      await theMessage.addAttachments(newAttachmentsData);
    }
  }

  if (newMentionedMessageIds != null) {
    const newMentionedMessages = await Message.findAll({
      where: { id: newMentionedMessageIds },
      ...MESSAGE_WITH_ATTACHMENTS
    });
    await theMessage.setMentionedMessages(newMentionedMessages);
    for (const mm of newMentionedMessages) {
      await theMessage.addAttachments(mm.attachments, { through: { isDirect: false } });
    }
  }

  await theMessage.reload(MESSAGE_WITH_RECEIVERS);
  broadcast(
    { chat: { id: theMessage.chat_id }, message: serializeMessageRecursive(theMessage)},
    { extraCondition: client => onlyMembers(theMessage.chat.users, client) }
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
  for (const theMessage of matchingMessages) {
    const members = theMessage.chat.users;
    await theMessage.destroy();
    broadcast({ messages: messageIds }, {
      extraCondition: client => onlyMembers(members, client)
    });
  }
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