'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChatMembership extends Model {
    static associate(models) {
      this.belongsTo(models.Message, {
        foreignKey: 'last_read_msg_id',
        as: 'lastReadMessage'
      });
      this.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        as: 'chat'
      })
    }
  }
  UserChatMembership.init({
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UserChatMembership',
    tableName: 'user_chat_membership',
    timestamps: true,
    paranoid: true,
    createdAt: false,
    updatedAt: false
  });
  return UserChatMembership;
};