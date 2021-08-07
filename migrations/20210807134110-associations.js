'use strict';
const { getFkConfig, dropFk } = require('../util/sql');

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface
    .addColumn('user_chat_membership', 'user_id', getFkConfig('morze_user', Sequelize))
    .then(() => queryInterface
      .addColumn('user_chat_membership', 'chat_id', getFkConfig('chat', Sequelize))
      .then(() => queryInterface
        .addConstraint('user_chat_membership', {
          type: 'UNIQUE',
          fields: ['user_id', 'chat_id'],
          name: 'unique_user_chat_membership'
        }).then(() => queryInterface
          .addColumn('auth_token', 'user_id', getFkConfig('morze_user', Sequelize))
          .then(() => queryInterface
            .addColumn('message', 'user_id', getFkConfig('morze_user', Sequelize))
            .then(() => queryInterface
              .addColumn('message', 'chat_id', getFkConfig('chat', Sequelize))
              .then(() => queryInterface
                .addColumn('message_attachment', 'message_id', getFkConfig('message', Sequelize))
              )
            )
          )
        )
      )
    ),

  down: async (queryInterface, Sequelize) =>
    dropFk(queryInterface, 'message_attachment', 'message')
      .then(() => dropFk(queryInterface, 'message', 'chat')
        .then(() => dropFk(queryInterface, 'message', 'user')
          .then(() => dropFk(queryInterface, 'auth_token', 'user')
            .then(() => queryInterface
              .removeConstraint('user_chat_membership', 'unique_user_chat_membership')
              .then(() => dropFk(queryInterface, 'user_chat_membership', 'chat')
                .then(() => dropFk(queryInterface, 'user_chat_membership', 'user'))
              )
            )
          )
        )
      )
};
