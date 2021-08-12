const { serializeMessage } = require('../serializers/messages');
const { NoSuchError } = require('../util/custom-errors');


function send(data, { user, broadcast }) {
  const { chatId, text, attachments } = data;

  return user
    .getChats({ where: { id: chatId } })
    .then(matchingChats => {
      if (!matchingChats.length) {
        throw new NoSuchError('chat', chatId);
      }

      const theChat = matchingChats[0];
      return theChat
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
}

function edit(data, { user, err, resp, broadcast }) {

}

function remove(data, { user, err, resp, broadcast }) {

}

function markRead(data, { user, err, resp, broadcast }) {

}

function list(data, { user, resp }) {
  const { chatId } = data;

  // TODO: Pagination
  return user
    .getChats({ where: { id: chatId } })
    .then(matchingChats => {
      if (!matchingChats.length) {
        throw new NoSuchError('chat', chatId);
      }

      return matchingChats[0]
        .getMessages()
        .then(messages => resp(messages.map(serializeMessage)))
    })
}


module.exports = {
  send, edit, remove, markRead, list
};