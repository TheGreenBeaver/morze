class AuthError extends Error {
  static TYPES = {
    username: 'username',
    password: 'password',
    unauthorized: 'unauthorized'
  }

  /**
   *
   * @param {TYPES} type
   * @param other
   */
  constructor(type, ...other) {
    super(...other);
    this.type = type;
  }
}

class CustomError extends Error {
  /**
   *
   * @param {Object=} data
   * @param other
   */
  constructor(data, ...other) {
    super(...other);
    this.data = data;
  }
}

class NoSuchError extends CustomError {
  /**
   *
   * @param {string} model
   * @param {number|Array<number>} id
   * @param other
   */
  constructor(model, id, ...other) {
    super(...other);
    const text = Array.isArray(id)
      ? `No ${model}s found with ids of ${id.join(', ')}`
      : `No ${model} found with an id of ${id}`;
    const fieldName = Array.isArray(id) ? `${model}s` : model;
    this.data = {
      [fieldName]: [text]
    };
  }
}


module.exports = {
  AuthError,
  NoSuchError,
  CustomError
};