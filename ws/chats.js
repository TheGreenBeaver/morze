const { namesList, userFullName } = require('../util/misc');
const { Chat, User } = require('../models/index');
const { Op } = require('sequelize');
const { differenceWith } = require('lodash');
const { serializeMembershipBase } = require('../serializers/chats');
const { serializeMessageRecursive } = require('../serializers/messages');
const { NoSuchError, CustomError } = require('../util/custom-errors');
const { onlyMembers } = require('../util/ws');
const { DUMMY, CHAT_FULL, CHAT_WITH_USERS } = require('../util/query-options');
const { listChats } = require('../util/method-handlers');


async function leave(data, { user, broadcast }) {
  const { chat: chatId } = data;

  const matchingChats = await user.getChats({
    where: { id: chatId }, ...CHAT_WITH_USERS,
    rejectOnEmpty: new NoSuchError('chat', chatId)
  });

  const theChat = matchingChats[0];
  await theChat.removeUser(user);
  const notification = await theChat.createMessage({ text: `${userFullName(user)} left the chat` });
  const members = theChat.users;

  broadcast({ chat: { id: chatId }, notification }, {
    extraCondition: client => onlyMembers(members, client),
    adjustData: (data, client) => client.user === user
      ? { chat: data.chat }
      : { message: serializeMessageRecursive(data.notification) }
  });
}

function kick(data, { user, resp, broadcast }) {
  const { chat: chatId, user: toKickId } = data;

}

async function create(data, { user, broadcast }) {
  const { invited, name } = data;
  const invitedIds = invited || [];

  const { count, rows: invitedUsers } = await User.findAndCountAll({
    where: { id: { [Op.in]: invitedIds }}, ...DUMMY
  });

  if (count < invitedIds.length) {
    const invalidIds = differenceWith(invitedIds, invitedUsers, (i, u) => u.id === i);
    throw new NoSuchError('user', invalidIds, 'invited');
  }

  const allInvitedUsers = [user, ...invitedUsers];
  let altName;
  switch (allInvitedUsers.length) {
    case 1:
      altName = 'Me';
      break;
    case 2:
      altName = null;
      break;
    default:
      altName = namesList(allInvitedUsers);
  }

  const newChat = await Chat.create({ name: name || altName });
  await newChat.setUsers(invitedUsers, { through: { isAdmin: false } });
  await newChat.addUser(user, { through: { isAdmin: true } });
  const notification = await newChat.createMessage({ text: `${user.firstName} ${user.lastName} created the ${name || altName} Chat` });
  await newChat.reload(CHAT_FULL);
  broadcast(
    serializeMembershipBase({ chat: newChat, lastReadMessage: notification }, 1), { // the notification is unread
      extraCondition: client => onlyMembers(allInvitedUsers, client),
      adjustData: (data, client) => ({ ...data, isAdmin: client.user === user })
    });
}

async function invite(data, { broadcast, user }) {
  const { invited: invitedIds, chat: chatId } = data;
  if (!invitedIds || !invitedIds.length) {
    throw new CustomError({ invited: ['You have to choose at least one user to invite'] });
  }

  const { count, rows: invitedUsers } = await User.findAndCountAll({
    where: { id: { [Op.in]: invitedIds } }, ...DUMMY
  });

  if (count < invitedIds.length) {
    const invalidIds = differenceWith(invitedIds, invitedUsers, (i, u) => u.id === i);
    throw new NoSuchError('user', invalidIds, 'invited');
  }

  const matchingChats = await user.getChats({
    where: { id: chatId }, ...CHAT_WITH_USERS,
    rejectOnEmpty: new NoSuchError('chat', chatId)
  });

  const theChat = matchingChats[0];
  const currentUsers = theChat.users;

  const notification = await theChat.createMessage({ text: `${user.firstName} ${user.lastName} invited ${namesList(invitedUsers)}` });
  await theChat.addUsers(invitedUsers, { through: invitedUsers.map(() => ({ last_read_msg_id: notification.id })) });
  theChat.reload(CHAT_FULL);

  broadcast({ theChat, notification }, {
    extraCondition: client => onlyMembers(invitedUsers, client),
    adjustData: (data, client) =>
      currentUsers.includes(client.user)
        ? serializeMessageRecursive(data.notification)
        : serializeMembershipBase({ chat: data.theChat, lastReadMessage: data.notification }, 0)
  })
}

function list(data, { user, resp }) {
  return listChats(user).then(resp);
}

function edit(data, { user, broadcast }) {
  const { name: newName, chat: chatId } = data;
  return user
    .getChats({ where: { id: chatId }, rejectOnEmpty: new NoSuchError('chat', chatId) })
    .then(matchingChats => {
      const theChat = matchingChats[0];
      theChat.name = newName;
      return theChat
        .save()
        .then(updChat =>
          updChat
            .getUsers()
            .then(members => broadcast(updChat.dataValues, {
              extraCondition: client => onlyMembers(members, client)
            }))
        )
    })
}

function remove(data, { user, resp, broadcast }) {
	
}

function makeAdmin(data, { user, resp, broadcast }) {
  const { chat: chatId, users: newAdminIds } = data;
}


module.exports = {
  leave, kick, create, invite, list, edit, remove, makeAdmin
};