'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        foreignKey: 'chat_id',
        through: { model: models.UserChatMembership },
        as: 'users'
      });
      this.hasMany(models.Message, {
        foreignKey: 'chat_id',
        onDelete: 'CASCADE'
      });
    }
  }
  Chat.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,

      validate: buildValidate(['required', { name: 'len', args: [0, 50] }], 'name')
    }
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chat'
  });
  return Chat;
};