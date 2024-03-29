'use strict';
const {
  Model, Op
} = require('sequelize');
const { NoSuchError } = require('../util/custom-errors');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.AuthToken, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      this.belongsToMany(models.Chat, {
        foreignKey: 'user_id',
        through: {
          model: models.UserChatMembership
        },
        as: 'chats'
      });
      this.hasMany(models.Message, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,

      validate: buildValidate(['required', { name: 'len', args: [0, 50] }], 'firstName')
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,

      validate: buildValidate(['required', { name: 'len', args: [0, 50] }], 'lastName')
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'Such username already exists'
      },

      validate: buildValidate(['required', { name: 'len', args: [0, 50] }], 'username')
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'This email address is already used'
      },

      validate: buildValidate(['isEmail', 'required', { name: 'len', args: [0, 255] }], 'email')
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,

      validate: buildValidate(['required', { name: 'len', args: [0, 100] }], 'password')
    },
    avatar: DataTypes.TEXT,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'morze_user',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    paranoid: true,
  });
  return User;
};