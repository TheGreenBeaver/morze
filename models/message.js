'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      this.belongsTo(models.Chat, {
        foreignKey: 'chat_id'
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
    }
  }
  Message.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false,

      validate: buildValidate(['required'], 'text')
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