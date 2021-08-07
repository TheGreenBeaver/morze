'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AuthToken.init({
    key: {
      type: DataTypes.STRING(40),
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AuthToken',
    tableName: 'auth_token',
    timestamps: true,
    updatedAt: false
  });
  return AuthToken;
};