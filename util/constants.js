const FILE_TYPES = {
  img: 'img',
  doc: 'doc',
  youtube: 'youtube',
};
const FILE_EXT_MAPPING = {
  [FILE_TYPES.doc]: ['.pdf', '.txt', '.ppt', '.doc', '.docx', '.xls', '.xlsx'],
  [FILE_TYPES.img]: ['.png', '.jpg', '.jpeg', '.svg'],
};

module.exports = {
  FILE_TYPES,
  FILE_EXT_MAPPING
};