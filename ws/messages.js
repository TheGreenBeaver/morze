const { serializeMessage } = require('../serializers/messages');
const { Message } = require('../models/index');


function send(data, { user, err, broadcast }) {
  const { chatId, text, attachments } = data;

  user
    .getChats({ where: { id: chatId } })
    .then(matchingChats => {
      if (!matchingChats.length) {
        err({ chat: [`No chat with id ${chatId} available for ${user.username}`] });
        return;
      }

      const theChat = matchingChats[0];
      theChat
        .createMessage({ text, attachments: attachments || [], user_id: user.id })
        .then(newMessage =>
          broadcast(
            serializeMessage(newMessage), {
              extraCondition: client => new Promise((resolve, reject) =>
                client.user.hasChat(theChat).then(has => has ? resolve() : reject())
              )
            }
          )
        )
    })
    .catch(err);
}

function edit(data, { user, err, resp, broadcast }) {

}

function remove(data, { user, err, resp, broadcast }) {

}

function markRead(data, { user, err, resp, broadcast }) {

}

function list(data, { user, err, resp }) {
  const { chatId } = data;

  user
    .getChats({ where: { id: chatId } })
    .then(matchingChats => {
      if (!matchingChats.length) {
        err({ chat: [`No chat with id ${chatId} available for ${user.username}`] });
        return;
      }

      Message
        .findAll({ where: { chat_id: chatId } })
        .then(messages => resp(messages.map(serializeMessage)))
    })
    .catch(err)
}


module.exports = {
  send, edit, remove, markRead, list
};