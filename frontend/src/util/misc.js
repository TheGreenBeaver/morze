import { last } from 'lodash';
import { FILE_ERRORS, FILE_EXT_MAPPING, FILE_TYPES, MAX_FILE_SIZE } from './constants';
import zDate from './dates';
import { v4 as uuid } from 'uuid';
import queryString  from 'query-string';


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

function isFile(obj) {
  return (obj.file instanceof Blob) || (obj.file instanceof File);
}

function attachmentToApi(att) {
  const { fId, file, type } = att;
  return {
    file: type === FILE_TYPES.youtube ? JSON.stringify(file) : file,
    id: typeof fId === 'string' || !fId ? null : fId,
    type
  };
}

function isYouTubeLinkUsed(usedLinks, newLink) {
  if (!usedLinks) {
    return false;
  }
  const { host: newHost, search: newSearchRaw, pathname: newPathname } = new URL(newLink);
  const newSearch = queryString.parse(newSearchRaw);
  for (const oldLink of usedLinks) {
    const { host: oldHost, search: oldSearchRaw, pathname: oldPathname } = new URL(oldLink);
    const oldSearch = queryString.parse(oldSearchRaw);
    const sameHost = oldHost === newHost;
    const samePathname = oldPathname === newPathname;
    const sameVideoId = !!newSearch.v && newSearch.v === oldSearch.v;
    if (sameHost && samePathname && sameVideoId) {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {'doc'|'img'} type
 * @param {File|string} file
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

function msgIsRead(msg, chatData) {
  return zDate(msg.createdAt).isBefore(chatData.lastReadMessage.createdAt);
}

function readFilesGeneric(files, onRead, alertErrors) {
  const valueUpd = [];
  const displayUpd = [];
  const errors = {
    [FILE_ERRORS.size]: [],
    [FILE_ERRORS.ext]: []
  };
  let unreadAmount = files.length;

  const finish = () => {
    if (valueUpd.length && displayUpd.length) {
      onRead({ valueUpd, displayUpd });
    }
    if (Object.values(errors).some(errList => !!errList.length)) {
      alertErrors(errors);
    }
  };

  for (const file of files) {
    const extFits = Object.keys(FILE_EXT_MAPPING).map(ext => isFileType(ext, file)).some(isExt => isExt);
    if (!extFits) {
      errors[FILE_ERRORS.ext].push(file.name);
      if (--unreadAmount === 0) {
        finish();
      } else {
        continue;
      }
    }
    if (file.size > MAX_FILE_SIZE) {
      errors[FILE_ERRORS.size].push(file.name);
      if (--unreadAmount === 0) {
        finish();
      } else {
        continue;
      }
    }
    if (isFileType(FILE_TYPES.img, file)) {
      const fr = new FileReader();
      fr.onload = loadEv => {
        const fId = uuid();
        valueUpd.push({ file, fId, type: FILE_TYPES.img });
        displayUpd.push({ fId, url: loadEv.target.result, type: FILE_TYPES.img });
        if (--unreadAmount === 0) {
          finish();
        }
      }
      fr.readAsDataURL(file);
    } else {
      const fId = uuid();
      valueUpd.push({ file, fId, type: FILE_TYPES.doc });
      const url = URL.createObjectURL(file);
      displayUpd.push({ fId, url, type: FILE_TYPES.doc });
      if (--unreadAmount === 0) {
        finish();
      }
    }
  }
}

function applyUpd(upd, obj) {
  return typeof upd === 'function' ? upd(obj) : upd;
}

export {
  applyToOneOrMany,
  matchToolbar,
  isFileType,
  getOriginalFileName,
  msgIsRead,
  readFilesGeneric,
  isFile,
  applyUpd,
  attachmentToApi,
  isYouTubeLinkUsed
};