function serializeChat(chat) {
  return { name: chat.name, id: chat.id };
}

module.exports = {
  serializeChat
};