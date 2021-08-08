const httpStatus = require('http-status');
const { compareHashed } = require('./cryptography');
const { AuthError } = require('./custom-errors');
const { AuthToken, User } = require('../models/index');


async function find({ Model, serializer = v => v, options }, req, res, next) {
  try {
    const instance = await Model.findByPk(+req.params.id, { rejectOnEmpty: true, ...options });
    return res.json(serializer(instance));
  } catch (e) {
    return next(e);
  }
}

async function list({ Model, serializer = v => v, options }, req, res, next) {
  try {
    const queryRes = await Model.findAll(options);
    return res.json(queryRes.map(instance => serializer(instance)));
  } catch (e) {
    next(e);
  }
}

async function create({ Model, serializer = v => v }, req, res, next) {
  try {
    const instance = await Model.create(req.body);
    return res.status(httpStatus.CREATED).json(serializer(instance));
  } catch (e) {
    next(e);
  }
}

async function authorizeWithToken({ username, password }, res, next) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    next(new AuthError(AuthError.TYPES.username));
  } else if (!compareHashed(password, user.password)) {
    next(new AuthError(AuthError.TYPES.password));
  } else {
    const authToken = await AuthToken.create({ user_id: user.id });
    return res.json({ token: authToken.key });
  }
}

module.exports = {
  find, list, create, authorizeWithToken
};