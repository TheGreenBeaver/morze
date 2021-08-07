const express = require('express');
const { User } = require('../models/index');
const httpStatus = require('http-status');
const { generateToken, hash, getB36 } = require('../util/cryptography');
const { serializeSelf, serializeUser } = require('../serializers/users');
const { sendMail } = require('../mail/index');
const methodHandlers = require('../util/method-handlers');
const { Op } = require('sequelize');
const useMiddleware = require('../middleware/index');


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
    await sendMail(`http://localhost:3000/verify/${getB36(savedUser.id)}/${verificationToken}`);

    return res.status(httpStatus.CREATED).json(serializeSelf(savedUser));
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
  res.json(serializeSelf(req.user))
);

router.get('/:id', async (req, res, next) => {
    const isMe = req.user.id === req.params.id;
    if (isMe) {
      return res.json(serializeSelf(req.user));
    }

    return methodHandlers.find({ Model: User, serializer: serializeUser }, req, res, next);
  }
);