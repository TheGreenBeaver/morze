const express = require('express');
const useMiddleware = require('../middleware/index');
const useMulter = require('../middleware/multer');
const { composeMediaPath } = require('../util/misc');

const router = express.Router();

useMiddleware(router, { prefix: 'auth.' });
useMulter('attachments', 'files', 'array', router, [{ route: '/', method: 'post' }]);

router.post('/', (req, res, next) => {
  try {
    return res.json({ attachments: req.files.map(composeMediaPath) });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
