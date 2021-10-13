const { serializeMessageRecursive, serializeLastRead } = require('./messages');
const { serializeUser } = require('./users');


function serializeMembershipBase(membership, unreadCount) {
  const isAdmin = membership.UserChatMembership ? membership.UserChatMembership.isAdmin : membership.isAdmin;
  const result =  {
    isAdmin,
    ...membership.chat.dataValues,
    lastReadMessage: serializeLastRead(membership.lastReadMessage),
    unreadCount,
    messages: (membership.chat.messages || []).map(message => serializeMessageRecursive(message))
  };
  delete result.UserChatMembership;

  if (membership.chat.users) {
    result.users = membership.chat.users.map(serializeUser);
  }

  return result;
}

function serializeMembershipsList(memberships, unreadCounts) {
  return memberships.map((membership, idx) => {
    const theCount = unreadCounts[idx];
    return serializeMembershipBase(membership, theCount);
  });
}


module.exports = {
  serializeMembershipsList,
  serializeMembershipBase
};