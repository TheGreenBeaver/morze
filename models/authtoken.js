'use strict';
const {
  Model
} = require('sequelize');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }

    static create(values, options) {
      const key = crypto.randomBytes(20).toString('hex');
      return super.create({ ...values, key }, options);
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