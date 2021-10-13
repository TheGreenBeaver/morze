const { User, Chat, Message, MessageAttachment } = require('../models/index');
const { Op } = require('sequelize');

const userBasicAttrs = ['id', 'username', 'firstName', 'lastName', 'avatar', 'deletedAt'];
const userSelfAttrs = [...userBasicAttrs, 'isVerified'];
const userAuthAttrs = ['id', 'password']

const messageGlanceAttrs = ['text', 'createdAt', 'id', 'user_id'];
const messageFullAttrs = [...messageGlanceAttrs, 'updatedAt'];

const attachmentAttrs = ['id', 'file', 'type'];

const DUMMY = {
  attributes: ['id']
};
const CHAT_WITH_USERS = {
  ...DUMMY,
  include: [
    {
      model: User,
      ...DUMMY,
      as: 'users'
    }
  ]
};
const INCLUDE = {
  User: {
    model: User,
    as: 'user',
    attributes: userBasicAttrs
  },
  Attachment: {
    model: MessageAttachment,
    as: 'attachments',
    attributes: attachmentAttrs,
    through: { attributes: ['isDirect'] }
  },
  MentionedMessage: {
    model: Message,
    as: 'mentionedMessages',
    attributes: messageGlanceAttrs,
    through: { attributes: [] }
  },
  ChatWithUsers: {
    model: Chat,
    as: 'chat',
    ...CHAT_WITH_USERS
  }
};

const USER_BASIC = {
  attributes: userBasicAttrs
};
const USER_AUTH = {
  attributes: userAuthAttrs
};

const MESSAGE_WITH_ATTACHMENTS = {
  ...DUMMY,
  include: [
    { ...INCLUDE.Attachment }
  ]
};
const MESSAGE_GLANCE = {
  attributes: messageGlanceAttrs,
  include: [
    { ...INCLUDE.Attachment },
    { ...INCLUDE.MentionedMessage }
  ]
};
const MESSAGE_WITH_PARENT = {
  ...DUMMY,
  include: [
    {
      model: Message,
      as: 'mentionedIn',
      ...DUMMY,
      through: { attributes: [] }
    }
  ]
};
const MESSAGE_FULL = {
  attributes: [...messageFullAttrs],
  include: [
    { ...INCLUDE.User },
    { ...INCLUDE.Attachment },
    {
      ...INCLUDE.MentionedMessage,
      include: [
        { ...INCLUDE.User },
        { ...INCLUDE.Attachment },
        {
          model: Message,
          as: 'mentionedMessages',
          ...DUMMY
        }
      ],
    }
  ],
  order: [['createdAt', 'ASC']]
};
const MESSAGE_WITH_RECEIVERS = { ...MESSAGE_FULL };
MESSAGE_WITH_RECEIVERS.include.push({ ...INCLUDE.ChatWithUsers });
MESSAGE_WITH_RECEIVERS.attributes.push('chat_id');
const MESSAGE_WITH_RECEIVERS_DUMMY = {
  attributes: ['id', 'chat_id'],
  include: [{ ...INCLUDE.ChatWithUsers }]
}

const CHAT_FULL = {
  attributes: ['id', 'name'],
  include: [
    {
      model: Message,
      as: 'messages',
      ...MESSAGE_FULL,
      limit: 1
    }
  ]
};

const AUTH_TOKEN_LOG_IN = {
  attributes: ['key'],
  include: [
    {
      model: User,
      as: 'user',
      attributes: userSelfAttrs
    }
  ]
};

// TODO: Revisit later
// const DEFAULT_PAGE_SIZE = 30;
// function getPaginationOptions({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
//   const offset = (page - 1) * pageSize;
//   return {
//     limit: pageSize,
//     offset
//   };
// }

function getChatOptions(needUsersList) {
  const options = { ...CHAT_FULL };
  if (needUsersList) {
    options.include.push({
      ...INCLUDE.User,
      as: 'users'
    });
  }

  options.include[0].order = [['createdAt', 'DESC']];

  return options;
}

function withLastRead(needChatData, needUsersList) {
  return {
    include: [
      {
        model: Chat,
        as: 'chat',
        ...(needChatData ? getChatOptions(needUsersList) : DUMMY)
      },
      {
        model: Message,
        as: 'lastReadMessage',
        attributes: ['createdAt', 'id']
      }
    ]
  };
}

function withChatMessages(filters) {
  return {
    ...DUMMY,
    include: [
      {
        model: Message,
        as: 'messages',
        ...MESSAGE_FULL,
        where: {
          ...filters,
          user_id: { [Op.not]: null }
        },
        order: [['createdAt', 'DESC']]
      }
    ]
  };
}

module.exports = {
  userSelfAttrs,
  DUMMY,

  MESSAGE_GLANCE,
  MESSAGE_WITH_ATTACHMENTS,
  MESSAGE_FULL,
  MESSAGE_WITH_RECEIVERS,
  MESSAGE_WITH_RECEIVERS_DUMMY,
  MESSAGE_WITH_PARENT,

  CHAT_FULL,
  CHAT_WITH_USERS,

  USER_BASIC,
  USER_AUTH,

  AUTH_TOKEN_LOG_IN,

  withLastRead,
  withChatMessages,
  getChatOptions
}

