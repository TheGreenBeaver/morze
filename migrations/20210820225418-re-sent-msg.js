'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface
      .changeColumn('message', 'text', {
        allowNull: true,
        type: Sequelize.TEXT
      }).then(() => queryInterface
      .createTable('message_mentions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        mentioned_at: {
          type: Sequelize.INTEGER,
          references: {
            model: 'message',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        is_mentioned: {
          type: Sequelize.INTEGER,
          references: {
            model: 'message',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }).then(() => queryInterface
        .addConstraint('message_mentions', {
          type: 'UNIQUE',
          fields: ['mentioned_at', 'is_mentioned'],
          name: 'unique_mentions'
        })
      )
    ),

  down: async (queryInterface, Sequelize) =>
    queryInterface.dropTable('message_mentions')
      .then(() => queryInterface.changeColumn('message', 'text', {
        allowNull: false,
        type: Sequelize.TEXT
      }))
};
