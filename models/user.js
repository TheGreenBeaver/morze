'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
    deletedAt: 'deleted_at',
    paranoid: true,
  });
  return User;
};