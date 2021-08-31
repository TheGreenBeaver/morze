'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        as: 'chat'
      });
      this.hasMany(models.MessageAttachment, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        as: 'attachments'
      });
      this.hasMany(models.UserChatMembership, {
        foreignKey: 'last_read_msg_id',
        as: 'lastReadMessage',
        onDelete: 'SET NULL'
      });
      this.belongsToMany(models.Message, {
        foreignKey: 'mentioned_at',
        otherKey: 'is_mentioned',
        through: 'message_mentions',
        as: 'mentionedMessages'
      });
      this.belongsToMany(models.Message, {
        foreignKey: 'is_mentioned',
        otherKey: 'mentioned_at',
        through: 'message_mentions',
        as: 'mentionedIn'
      });
    }
  }
  Message.init({
    text: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'message',
    timestamps: true,
    paranoid: true
  });
  return Message;
};