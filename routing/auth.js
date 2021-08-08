const express = require('express');
const methodHandlers = require('../util/method-handlers');
const { AuthToken } = require('../models/index');
const httpStatus = require('http-status');
const useMiddleware = require('../middleware/index');


const router = express.Router();

useMiddleware(router, { prefix: 'auth.', prop: 'post', routes: ['/log_out'] });

router.post('/sign_in', (req, res, next) =>
  methodHandlers.authorizeWithToken(req.body, res, next).catch(next)
);

router.post('/log_out', async (req, res, next) => {
  try {
    await AuthToken.destroy({
      where:
        { key: req.get('Authorization').replace('Token ', '') }
    });
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;