'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
const { FILE_TYPES } = require('../util/constants');
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
      type: DataTypes.TEXT,
      allowNull: false,

      validate: buildValidate(['required'], 'file')
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [...Object.values(FILE_TYPES)],
      defaultValue: FILE_TYPES.img,

      validate: buildValidate([
        'required',
        { name: 'isIn', args: [[...Object.values(FILE_TYPES)]] }
      ], 'type')
    }
  }, {
    sequelize,
    modelName: 'MessageAttachment',
    tableName: 'message_attachment'
  });
  return MessageAttachment;
};