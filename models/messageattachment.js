'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class MessageAttachment extends Model {
    static associate(models) {
      this.belongsTo(models.Message, {
        foreignKey: 'message_id',
      });
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