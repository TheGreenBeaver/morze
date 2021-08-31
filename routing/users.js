const express = require('express');
const { User } = require('../models/index');
const { generateToken, hash, getB36, checkToken, TOKEN_STATUS, parseB36 } = require('../util/cryptography');
const { serializeUser } = require('../serializers/users');
const { sendMail } = require('../mail/index');
const { verification } = require('../mail/templates');
const methodHandlers = require('../util/method-handlers');
const { Op } = require('sequelize');
const useMiddleware = require('../middleware/index');
const httpStatus = require('http-status');
const settings = require('../config/settings');
const { capitalize, snakeCase } = require('lodash');
const { USER_BASIC, userSelfAttrs } = require('../util/query-options');
const { getVar, composeMediaPath } = require('../util/misc');
const useMulter = require('../middleware/multer');


const router = express.Router();

useMiddleware(router, {
  prefix: 'auth.', prop: 'get',
  routes: ['/', '/:id', '/me', { prop: 'patch', path: '/me' }]
});
useMulter('user_avatars', 'avatar', 'single', router, [{ route: '/me', method: 'patch' }]);

router.post('/', async (req, res, next) => {
  try {
    const newUser = User.build(req.body);
    await newUser.validate();

    const encryptedPassword = hash(req.body.password);
    newUser.setDataValue('password', encryptedPassword);

    const savedUser = await newUser.save();

    const verificationToken = await generateToken(savedUser);
    const link = `http://${getVar('HOST', 'localhost:8000')}/confirm/verify/${getB36(savedUser.id)}/${verificationToken}`;
    await sendMail({ html: verification(link), subject: 'Morze Registration' }, savedUser.email);

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
    return res.status(httpStatus.BAD_REQUEST).json({ [settings.ERR_FIELD]: [`${capitalize(status)} Link`] });
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) =>
  methodHandlers.list({
    Model: User, serializer: serializeUser,
    options: { where: { id: { [Op.ne]: req.user.id } }, ...USER_BASIC },
  }, req, res, next)
);

router.get('/me', (req, res) =>
  res.json(serializeUser(req.user))
);

router.patch('/me', async (req, res, next) => {
  try {
    const { firstName: newFirstName, lastName: newLastName, noAvatar } = req.body;
    const newAvatar = req.file;

    if (noAvatar === 'true') {
      req.user.avatar = null;
    } else if (newAvatar) {
      req.user.avatar = composeMediaPath(newAvatar);
    }

    if (newFirstName != null) {
      req.user.firstName = newFirstName;
    }
    if (newLastName != null) {
      req.user.lastName = newLastName;
    }

    await req.user.save({ returning: userSelfAttrs.map(snakeCase) });

    res.json(serializeUser(req.user));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', (req, res, next) => {
    const isMe = req.user.id === req.params.id;
    if (isMe) {
      return res.json(serializeUser(req.user));
    }

    return methodHandlers.find({
      Model: User,
      serializer: serializeUser,
      options: USER_BASIC
    }, req, res, next);
  }
);

module.exports = router;