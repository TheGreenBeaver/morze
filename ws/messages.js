const { onlyMembers } = require('../util/ws');
const { serializeMessage } = require('../serializers/messages');
const { NoSuchError, CustomError } = require('../util/custom-errors');
const { Message, User, Chat } = require('../models/index');


function send(data, { user, broadcast }) {
  const { chat: chatId, text, attachments } = data;

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

function edit(data, { user, resp, broadcast }) {
  const { text: newText, attachments: newAttachments } = data;
}

function remove(data, { user, broadcast }) {
  const { message: messageId } = data;
  Message
    .findByPk(messageId, {
      rejectOnEmpty: new NoSuchError('message', messageId),
      include: [
        {
          model: User,
          attributes: ['id'],
          as: 'user',
          through: {
            attributes: []
          }
        },
        {
          model: Chat,
          as: 'chat',
          include: {
            model: User,
            attributes: [],
            as: 'users'
          }
        }
      ]
    })
    .then(message => {
      if (message.user.id !== user.id) {
        throw new CustomError({ message: ['You can only delete your own messages'] });
      }
      const members = message.chat.users;

      return message
        .destroy()
        .then(() => broadcast({ message: messageId }, {
          extraCondition: client => onlyMembers(members, client)
        }))
    })
}

function markRead(data, { user, resp, broadcast }) {
  const { message: messageId } = data;
}

function list(data, { user, resp }) {
  const { chat: chatId } = data;

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