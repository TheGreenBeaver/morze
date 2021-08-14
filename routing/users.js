const express = require('express');
const { User } = require('../models/index');
const { generateToken, hash, getB36, checkToken, TOKEN_STATUS, parseB36 } = require('../util/cryptography');
const { serializeSelf, serializeUser } = require('../serializers/users');
const { sendMail } = require('../mail/index');
const methodHandlers = require('../util/method-handlers');
const { Op } = require('sequelize');
const useMiddleware = require('../middleware/index');
const httpStatus = require('http-status');
const settings = require('../config/settings');
const { capitalize } = require('lodash');


const router = express.Router();

useMiddleware(router, {
  prefix: 'auth.', prop: 'get',
  routes: ['/', '/:id', '/me', { prop: 'patch', path: '/me' }]
});

router.post('/', async (req, res, next) => {
  try {
    const newUser = User.build(req.body);
    await newUser.validate();

    const encryptedPassword = hash(req.body.password);
    newUser.setDataValue('password', encryptedPassword);

    const savedUser = await newUser.save();

    const verificationToken = await generateToken(savedUser);
    // TODO: clean up email sending
    await sendMail(`localhost:3000/confirm/verify/${getB36(savedUser.id)}/${verificationToken}`);

    await methodHandlers.authorizeWithToken({ username: savedUser.username, password: req.body.password }, res);
  } catch (e) {
    next(e);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const user = await User.findByPk(parseB36(req.body.uid));
    const status = checkToken(user, req.body.token);
    if (status === TOKEN_STATUS.OK) {
      user.setDataValue('isVerified', true);
      const savedUser = await user.save();
      return res.json({ isVerified: savedUser.isVerified });
    }
    console.log('meh...');
    return res.status(httpStatus.BAD_REQUEST).json({ [settings.ERR_FIELD]: [`${capitalize(status)} Link`] });
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) =>
  methodHandlers.list({
    Model: User, serializer: serializeUser,
    options: { where: { id: { [Op.ne]: req.user.id } } }
  }, req, res, next)
);

router.get('/me', (req, res) =>
  res.json(serializeSelf(req.user.dataValues))
);

router.get('/:id', (req, res, next) => {
    const isMe = req.user.id === req.params.id;
    if (isMe) {
      return res.json(serializeSelf(req.user.dataValues));
    }

    return methodHandlers.find({ Model: User, serializer: serializeUser }, req, res, next);
  }
);

module.exports = router;