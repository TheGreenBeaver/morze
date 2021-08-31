const settings = require('../config/settings');
const path = require('path');
const sizeOf = require('image-size');


function serializeAttachment(attachment) {
  const { file, id } = attachment;
  const result = { file, id };
  if (/^.+\.(png|jpg|jpeg)$/.test(file)) {
    try {
      const { height, width } = sizeOf(path.join(settings.MEDIA_ROOT, file).replace(`${path.sep}media`, ''));
      result.height = height;
      result.width = width;
    } catch {}
  }

  return result;
}

module.exports = {
  serializeAttachment
};