function applyToOneOrMany(args, callback) {
  return Array.isArray(args) ? args.map(arg => callback(arg)) : callback(args);
}

/**
 *
 * @param {Object} theme
 * @param {Array<string>|string}property
 * @param {number=1}scale
 * @returns {Object}
 */
function matchToolbar(theme, property, scale = 1) {
  const tbMixin = theme.mixins.toolbar;
  const style = {};
  Object.entries(tbMixin).forEach(([key, value]) => {
    if (typeof value === 'object') {
      style[key] = {};
      applyToOneOrMany(property, p => style[key][p] = Object.values(value)[0] * scale );
    } else {
      applyToOneOrMany(property, p => style[p] = value * scale);
    }
  });

  return style;
}

function ts() {
  return (new Date()).getTime();
}

export {
  applyToOneOrMany,
  matchToolbar,
  ts
};