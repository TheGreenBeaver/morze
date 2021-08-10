'use strict';
const { dropFk } = require('../util/sql');

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface
    .addColumn('user_chat_membership', 'last_read_msg_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'message',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }).then(() => queryInterface
      .changeColumn('chat', 'name', {
        type: Sequelize.STRING(50),
        allowNull: true
      })
    ),

  down: async (queryInterface, Sequelize) => queryInterface
    .changeColumn('chat', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false
    }).then(() => dropFk(queryInterface, 'user_chat_membership', 'last_read_msg'))
};
