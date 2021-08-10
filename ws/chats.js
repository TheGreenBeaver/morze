const { Chat, User } = require('../models/index');
const { Op } = require('sequelize');
const { differenceWith } = require('lodash');
const httpStatus = require('http-status');
const { formatWsResponse, ws500, broadcast } = require('../util/ws');
const { serializeChat } = require('../serializers/chats');


function leave(data, { ws }) {

}

function kick(data, { ws, user }) {

}

function create(data, { ws, user, wsServer }) {
  const invitedIds = data.invited || [];
  User
    .findAndCountAll({ where: { id: { [Op.in]: invitedIds } } })
    .then(({ count, rows: invitedUsers }) => {
      if (count < invitedIds.length) {
        const invalidIds = differenceWith(invitedIds, invitedUsers, (i, u) => u.id === i);
        ws.send(formatWsResponse({
          status: httpStatus.BAD_REQUEST,
          data: { invited: [`No users found with id ${invalidIds.join(', ')}`] }
        }));
      } else {
        Chat
          .create({ name: data.name })
          .then(newChat => {
            newChat
              .setUsers([...invitedUsers, user])
              .then(() => broadcast(wsServer, serializeChat(newChat)));
          })
          .catch(() => ws500(ws))
      }
    })
    .catch(() => ws500(ws))
}

function invite(data, { ws, user }) {

}

function list(data, { ws, user }) {

}

function edit(data, { ws, user }) {

}


module.exports = {
  leave, kick, create, invite, list, edit
};