'use strict';
const { FILE_TYPES } = require('../util/constants');

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('message_attachment', 'type', {
      type: Sequelize.ENUM,
      values: [...Object.values(FILE_TYPES)],
      defaultValue: FILE_TYPES.img,
      allowNull: false
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.removeColumn('message_attachment', 'type')
};
