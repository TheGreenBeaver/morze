'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class MessageAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MessageAttachment.init({
    file: {
      type:DataTypes.TEXT,
      allowNull: false,

      validate: buildValidate(['required'], 'file')
    }
  }, {
    sequelize,
    modelName: 'MessageAttachment',
    tableName: 'message_attachment'
  });
  return MessageAttachment;
};