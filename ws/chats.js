const { dummyPromise } = require('../util/misc');
const { Chat, User } = require('../models/index');
const { Op } = require('sequelize');
const { differenceWith } = require('lodash');
const { serializeChat } = require('../serializers/chats');
const { serializeUser } = require('../serializers/users');
const { NoSuchError } = require('../util/custom-errors');
const { onlyMembers } = require('../util/ws');


function leave(data, { user, broadcast }) {
  const { chat: chatId } = data;

  return user
    .getChats({ where: { id: chatId }, rejectOnEmpty: new NoSuchError('chat', chatId) })
    .then(matchingChats => {
      const theChat = matchingChats[0];
      return theChat
        .removeUser(user)
        .then(() => theChat
          .getUsers()
          .then(members => broadcast(serializeUser(user), {
              extraCondition: client => onlyMembers(members, client)
            })
          )
        );
    });
}

function kick(data, { user, err, resp, broadcast }) {
  const { chat: chatId, user: toKickId } = data;
  
}

function create(data, { user, broadcast }) {
  const invitedIds = data.invited || [];
  return User
    .findAndCountAll({ where: { id: { [Op.in]: invitedIds } } })
    .then(({ count, rows: invitedUsers }) => {
      if (count < invitedIds.length) {
        const invalidIds = differenceWith(invitedIds, invitedUsers, (i, u) => u.id === i);
        throw new NoSuchError('user', invalidIds);
      }

      return Chat
        .create({ name: data.name })
        .then(newChat =>
          newChat
            .setUsers([...invitedUsers, { user, isAdmin: true }])
            .then(() => broadcast(serializeChat(newChat), {
              extraCondition: client => onlyMembers(invitedUsers, client)
            }))
        );
    })
}

function invite(data, { err, broadcast }) {
  const { invited: invitedIds, chat: chatId } = data;
  if (!invitedIds || !invitedIds.length) {
    err({ invited: ['You have to choose at least one user to invite'] });
    return dummyPromise();
  }

  return User
    .findAndCountAll({ where: { id: { [Op.in]: invitedIds } } })
    .then(({ count, rows: invitedUsers }) => {
      if (count < invitedIds.length) {
        const invalidIds = differenceWith(invitedIds, invitedUsers, (i, u) => u.id === i);
        throw new NoSuchError('user', invalidIds);
      }

      return Chat
        .findByPk(chatId, { rejectOnEmpty: new NoSuchError('chat', chatId) })
        .then(theChat =>
          theChat
            .addUsers(invitedUsers)
            .then(() => broadcast(serializeChat(theChat), {
              extraCondition: client => onlyMembers(invitedUsers, client)
            }))
        )
    })
}

function list(data, { user, resp }) {
  return user
    .getChats()
    .then(chats => resp(chats.map(chat => serializeChat(chat))))
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
            .then(members => broadcast(serializeChat(updChat), {
              extraCondition: client => onlyMembers(members, client)
            }))
        )
    })
}

function remove(data, { user, err, resp, broadcast }) {
	
}

function makeAdmin(data, { user, err, resp, broadcast }) {

}


module.exports = {
  leave, kick, create, invite, list, edit, remove, makeAdmin
};