const fs = require('fs');
const path = require('path');
const { getFileIsUsable } = require('../util/misc');


const basename = path.basename(__filename);

function useMiddleWare(applyTo, { prefix, prop = 'use', routes } = {}) {
  fs
    .readdirSync(__dirname)
    .filter(file => getFileIsUsable(file, basename) && file.startsWith(prefix))
    .map(file => require(path.join(__dirname, file)))
    .sort((a, b) => a.order - b.order)
    .forEach(({ stack }) => {
      if (routes) {
        routes.forEach(route => applyTo[route.prop || prop](route.path || route, ...stack))
      } else {
        applyTo[prop](...stack);
      }
    });
}

module.exports = useMiddleWare;