const multer = require('multer');
const path = require('path');
const settings = require('../config/settings');
const { generateToken } = require('../util/cryptography');
const { getEnv } = require('../util/misc');


/**
 * @typedef RouteConfig
 * @type {Object}
 * @property {string} route
 * @property {'post'|'get'|'patch'|'delete'} method
 */
/**
 *
 * @param {string} mediaType
 * @param {string} fieldName
 * @param {'array'|'single'} fieldType
 * @param {Object} router
 * @param {Array<RouteConfig>=} routes
 */
function useMulter(mediaType, fieldName, fieldType, router, routes) {
  const storage = multer.diskStorage({
    destination: path.join(settings.MEDIA_ROOT, mediaType, getEnv()),
    filename: (req, file, cb) => {
      const uniquePrefix = generateToken(req.user);
      cb(null, `${uniquePrefix}-${file.originalname}`);
    }
  })
  const fileParser = multer({ storage })[fieldType](fieldName);

  if (!routes) {
    router.use(fileParser);
  } else {
    routes.forEach(({ route, method }) => {
      router[method](route, fileParser);
    });
  }
}

module.exports = useMulter;