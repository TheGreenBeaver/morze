'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChatMembership extends Model {
    static associate(models) {
      // define association here
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