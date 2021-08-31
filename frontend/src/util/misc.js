import { padStart, last } from 'lodash';
import { FILE_EXT_MAPPING } from './constants';


function applyToOneOrMany(args, callback) {
  return Array.isArray(args) ? args.map(arg => callback(arg)) : callback(args);
}

/**
 *
 * @param {Object} theme
 * @param {Array<string>|string} property
 * @param {function} transform
 * @returns {Object}
 */
function matchToolbar(theme, property, transform = v => v) {
  const tbMixin = theme.mixins.toolbar;
  const style = {};
  Object.entries(tbMixin).forEach(([key, value]) => {
    if (typeof value === 'object') {
      style[key] = {};
      applyToOneOrMany(property, p => style[key][p] = transform(Object.values(value)[0]) );
    } else {
      applyToOneOrMany(property, p => style[p] = transform(value));
    }
  });

  return style;
}
function extractTime(timeString) {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${padStart(minutes.toString(), 2, '0')}`;
}

/**
 *
 * @param {'doc'|'img'} type
 * @param {File} file
 * @returns {boolean}
 */
function isFileType(type, file) {
  const possibleExt = FILE_EXT_MAPPING[type];
  const regExp = new RegExp(`^.+\\.(${possibleExt.join('|')})$`);
  return regExp.test(file.name || file);
}

function getOriginalFileName(rawFileName) {
  const spl = last(rawFileName.split('/')).split('-');
  return spl.slice(2).join('-');
}

export {
  applyToOneOrMany,
  matchToolbar,
  extractTime,
  isFileType,
  getOriginalFileName
};