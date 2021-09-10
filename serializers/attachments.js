const settings = require('../config/settings');
const path = require('path');
const sizeOf = require('image-size');
const { getHost } = require('../util/misc');
const { FILE_TYPES } = require('../util/constants');


function serializeAttachment(attachment) {
  const { file, id, type } = attachment;
  const result = { file, id, type };
  if (type === FILE_TYPES.img) {
    try {
      const { height, width } = sizeOf(path.join(
        settings.SRC_DIRNAME,
        file.replace(getHost(), '')
      ));
      result.height = height;
      result.width = width;
    } catch {}
  } else if (type === FILE_TYPES.youtube) {
    result.file = JSON.parse(file)
  }

  return result;
}

function serializeYouTubeData(fullVideoData) {
  const { player, snippet, id } = fullVideoData;
  const links = [
    `https://www.youtube.com/watch?v=${id}`,
    `https://www.youtu.be/${id}`
  ];
  return {
    file: { player, preview: snippet.thumbnails, links },
    type: FILE_TYPES.youtube,
    id
  };
}

module.exports = {
  serializeAttachment,
  serializeYouTubeData
};