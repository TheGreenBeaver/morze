const express = require('express');
const { capitalize } = require('lodash');
const { checkToken, TOKEN_STATUS, parseB36, compareHashed } = require('../util/cryptography');
const { User, AuthToken } = require('../models/index');
const settings = require('../config/settings');
const httpStatus = require('http-status');
const { AuthError } = require('../util/custom-errors');
const useMiddleware = require('../middleware/index');


const router = express.Router();

useMiddleware(router, { prefix: 'auth.', prop: 'post', routes: ['/logout'] });

router.post('/verify', async (req, res, next) => {
  try {
    const user = await User.findByPk(parseB36(req.body.userId));
    const status = checkToken(user, req.body.token);

    if (status === TOKEN_STATUS.OK) {
      user.setDataValue('is_verified', true);
      const savedUser = await user.save();
      return res.json({ is_verified: savedUser.is_verified });
    }

    return res.status(httpStatus.BAD_REQUEST).json({ [settings.ERR_FIELD]: [`${capitalize(status)} Link`] });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      next(new AuthError(AuthError.TYPES.username));
    } else if (!compareHashed(password, user.password)) {
      next(new AuthError(AuthError.TYPES.password));
    } else {
      const authToken = await AuthToken.create({ user_id: user.id });
      return res.json({ token: authToken.key });
    }
  } catch (e) {
    next(e);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    await AuthToken.destroy({
      where:
        { key: req.get('Authorization').replace('Token ', '') }
    });
    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;