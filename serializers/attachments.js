const { FILE_TYPES } = require('../util/constants');


function serializeAttachment(attachment) {
  const { file, id, type, AttachmentsRouting } = attachment;
  const result = { id, type, saved: true, isDirect: AttachmentsRouting.isDirect };
  result.file = type === FILE_TYPES.youtube
    ? JSON.parse(file)
    : file;
  return result;
}

function serializeYouTubeData(fullVideoData) {
  const { player, snippet, id, contentDetails } = fullVideoData;
  const links = [
    `https://www.youtube.com/watch?v=${id}`,
    `https://www.youtu.be/${id}`
  ];
  return {
    file: { player, preview: snippet.thumbnails, links, title: snippet.title, duration: contentDetails.duration },
    type: FILE_TYPES.youtube,
    id
  };
}

module.exports = {
  serializeAttachment,
  serializeYouTubeData
};