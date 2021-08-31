const { serializeMessageRecursive } = require('./messages');


function serializeMembershipBase(membership, unreadCount) {
  return {
    isAdmin: membership.isAdmin,
    ...membership.chat.dataValues,
    lastReadMessage: membership.lastReadMessage ? membership.lastReadMessage.dataValues : null,
    unreadCount,
    messages: membership.chat.messages.map(message => serializeMessageRecursive(message))
  };
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