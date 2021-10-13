import { last, padStart, dropWhile, uniqBy } from 'lodash';
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
  const { file, type, saved, fId } = att;
  const result =  {
    file: type === FILE_TYPES.youtube ? JSON.stringify(file) : file,
    type, saved
  };
  if (saved) {
    result.id = fId;
  }

  return result;
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
    const sameHost = oldHost.replace('www.', '') === newHost.replace('www.', '');
    const samePathname = oldPathname === newPathname;
    const sameVideoId = (!newSearchRaw && !oldSearchRaw) || (newSearch.v === oldSearch.v);
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

function getOriginalFileName(file) {
  if (file instanceof File) {
    return file.name;
  }
  const spl = last(file.split('/')).split('-');
  return spl.slice(2).join('-');
}

function msgIsRead(msg, chatData) {
  return zDate(msg.createdAt).isBefore(chatData.lastReadMessage.createdAt);
}

function readFilesGeneric(files, onRead, alertErrors, availableExt = Object.keys(FILE_EXT_MAPPING)) {
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
    const extFits = availableExt.map(ext => isFileType(ext, file)).some(isExt => isExt);
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
        valueUpd.push({ file, fId, type: FILE_TYPES.img, saved: false });
        displayUpd.push({ fId, url: loadEv.target.result, type: FILE_TYPES.img });
        if (--unreadAmount === 0) {
          finish();
        }
      }
      fr.readAsDataURL(file);
    } else {
      const fId = uuid();
      valueUpd.push({ file, fId, type: FILE_TYPES.doc, saved: false });
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

function objectToSelectOptions(obj) {
  return Object.entries(obj).map(([key, value]) => ({
    label: key,
    value
  }));
}

function formatYouTubeDuration(durationStr) {
  const days = durationStr.match(/\d+(?=D)/)?.[0];
  const hours = durationStr.match(/\d+(?=H)/)?.[0];
  const minutes = durationStr.match(/\d+(?=M)/)?.[0];
  const seconds = durationStr.match(/\d+(?=S)/)?.[0];
  const rawResParts = [days, hours, minutes || '00', seconds || '00'];
  const cleanResParts = dropWhile(rawResParts, pt => !pt).map(pt => padStart(pt, 2, '0'));
  return cleanResParts.join(':');
}

function wAmount(amount, text) {
  return `${amount} ${text}${amount === 1 ? '' : 's'}`;
}

function compareStr(strA, strB) {
  return strA.toLowerCase().trim().includes(strB.toLowerCase().trim());
}

function getChatArchives(chatData) {
  return uniqBy(chatData.messages.map(m => m.attachments).flat(), 'id');
}

function getMsgAnchor(msgId, chatId) {
  if (!msgId && !chatId) {
    return undefined;
  }
  return `msg-anchor-${msgId}-${chatId}`;
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
  isYouTubeLinkUsed,
  objectToSelectOptions,
  formatYouTubeDuration,
  wAmount,
  compareStr,
  getChatArchives,
  getMsgAnchor
};