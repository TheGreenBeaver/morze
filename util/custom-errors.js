class AuthError extends Error {
  static TYPES = {
    username: 'username',
    password: 'password',
    unauthorized: 'unauthorized'
  }

  constructor(type, ...other) {
    super(...other);
    this.type = type;
  }
}


module.exports = {
  AuthError,
};