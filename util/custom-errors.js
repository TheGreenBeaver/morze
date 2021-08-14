const { ValidationError, ValidationErrorItem } = require('sequelize');
const settings = require('../config/settings');


class AuthError extends Error {
  /**
   *
   * @param {boolean=false} credentials is it the problem with credentials
   */
  constructor(credentials = false) {
    super();
    this.credentials = credentials;
  }
}

class CustomError extends Error {
  /**
   *
   * @param {Object} data
   */
  constructor(data) {
    super();
    this.data = data;
  }
}

class OneValidationError extends ValidationError {
  /**
   *
   * @param {string} message
   * @param {string=} field
   */
  constructor(message, field = settings.ERR_FIELD) {
    super('', [
      new ValidationErrorItem(
        message,
        'Invalid data',
        field
      )
    ]);
  }
}

class NoSuchError extends ValidationError {
  /**
   *
   * @param {string} model
   * @param {number|Array<number>} id
   * @param {string=} field
   */
  constructor(model, id, field) {
    const errField = field || (Array.isArray(id) ? `${model}s` : model);
    const errValue = Array.isArray(id) ? id.join(', ') : `${id}`;
    const errMessage = Array.isArray(id)
      ? `No ${model}s found with ids of ${id.join(', ')}`
      : `No ${model} found with an id of ${id}`;
    super('', [
      new ValidationErrorItem(errMessage, 'invalid pk', errField, errValue)
    ]);
  }
}


module.exports = {
  AuthError,
  NoSuchError,
  CustomError,
  OneValidationError
};