const { Chat, User } = require('../models/index');
const { Op } = require('sequelize');
const { differenceWith } = require('lodash');
const { serializeChat } = require('../serializers/chats');


function leave(data, { user, err, resp, broadcast }) {

}

function kick(data, { user, err, resp, broadcast }) {

}

function create(data, { user, err, broadcast }) {
  const invitedIds = data.invited || [];
  User
    .findAndCountAll({ where: { id: { [Op.in]: invitedIds } } })
    .then(({ count, rows: invitedUsers }) => {
      if (count < invitedIds.length) {
        const invalidIds = differenceWith(invitedIds, invitedUsers, (i, u) => u.id === i);
        err({ invited: [`No users found with ids of ${invalidIds.join(', ')}`] });
      } else {
        Chat
          .create({ name: data.name })
          .then(newChat =>
            newChat
              .setUsers([...invitedUsers, { user, isAdmin: true }])
              .then(() => broadcast(serializeChat(newChat)))
          )
      }
    })
    .catch(err)
}

function invite(data, { user, err, resp, broadcast }) {

}

function list(data, { user, resp, err }) {
  user.getChats()
    .then(chats => resp(chats.map(chat => serializeChat(chat))))
    .catch(err)
}

function edit(data, { user, err, resp, broadcast }) {

}

function remove(data, { user, err, resp, broadcast }) {
	
}

function makeAdmin(data, { user, err, resp, broadcast }) {

}


module.exports = {
  leave, kick, create, invite, list, edit, remove, makeAdmin
};