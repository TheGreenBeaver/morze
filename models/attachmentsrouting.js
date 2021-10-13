'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttachmentsRouting extends Model {
    static associate(models) {
      this.belongsTo(models.Message, {
        foreignKey: 'message_id',
        as: 'message'
      });

      this.belongsTo(models.MessageAttachment, {
        foreignKey: 'attachment_id',
        as: 'attachment'
      });
    }
  }
  AttachmentsRouting.init({
    isDirect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'AttachmentsRouting',
    tableName: 'attachments_routing'
  });
  return AttachmentsRouting;
};