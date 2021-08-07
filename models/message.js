'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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