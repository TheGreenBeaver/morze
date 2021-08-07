'use strict';
const {
  Model
} = require('sequelize');
const { buildValidate } = require('../util/validation');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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