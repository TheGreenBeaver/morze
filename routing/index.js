const fs = require('fs');
const path = require('path');
const settings = require('../config/settings');
const { getFileIsUsable } = require('../util/misc');


const basename = path.basename(__filename);

function useRouting(app) {
  fs
    .readdirSync(__dirname)
    .filter(file => getFileIsUsable(file, basename))
    .forEach(file => {
      const router = require(path.join(__dirname, file));
      app.use(`${settings.API_ROOT}/${path.basename(file, '.js')}`, router);
    });
}

module.exports = useRouting;