'use strict';
const { getFkConfig } = require('../util/sql');
const { sequelize } = require('../models/index');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const creationT = await sequelize.transaction();

    try {
      await queryInterface.createTable('attachments_routing', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        message_id: getFkConfig('message', Sequelize),
        attachment_id: getFkConfig('message_attachment', Sequelize),
        is_direct: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      }, { transaction: creationT });
      await queryInterface.addConstraint('attachments_routing', {
        type: 'UNIQUE',
        fields: ['message_id', 'attachment_id'],
        name: 'unique_attachment_routing',
        transaction: creationT
      });

      await creationT.commit();

    } catch (e) {
      console.log(e);
      await creationT.rollback();
    }

    const rearrangementT = await sequelize.transaction();
    try {
      // All direct attachments
      await sequelize.query('insert into attachments_routing (attachment_id, message_id) ' +
        '(select id, att.message_id from message_attachment att)', { transaction: rearrangementT }
      );

      function rearrange(raw) {
        return raw.reduce((result, itemData) => {
          const existingGroupIdx = result.findIndex(group => group.messageId === itemData.id);
          if (existingGroupIdx === -1) {
            result.push({ messageId: itemData.mes_id, existingAttIds: [itemData.att_id] });
          } else {
            result[existingGroupIdx].existingAttIds.push(itemData.att_id);
          }

          return result;
        }, []);
      }

      // All indirect attachments
      async function monitor(messagesList, parentMessageId) {
        for (const message of messagesList) {
          const { messageId, existingAttIds } = message;
          const mentionedMessagesRaw = await sequelize.query(
            'select mm.is_mentioned mes_id, ma.id att_id from ' +
            'message_mentions mm left join message_attachment ma on mm.mentioned_at = ma.message_id ' +
            `where mentioned_at = ${messageId}`,
            { type: QueryTypes.SELECT, transaction: rearrangementT }
          );
          if (mentionedMessagesRaw.length) {
            const mentionedMessages = rearrange(mentionedMessagesRaw);
            await monitor(mentionedMessages, messageId);
          }

          if (parentMessageId == null) {
            continue;
          }

          const attachments = await sequelize.query(
            `select id from message_attachment where message_id = ${messageId}`,
            { type: QueryTypes.SELECT, transaction: rearrangementT }
          );
          const nonExistentAttachments = attachments.filter(att => !existingAttIds.includes(att.id));
          if (nonExistentAttachments.length) {
            for (const att of nonExistentAttachments) {
              try {
                await sequelize.query(
                  `insert into attachments_routing (message_id, attachment_id, is_direct) values (${parentMessageId}, ${att.id}, false)`
                );
              } catch (e) {
                if (!(e.name === 'SequelizeUniqueConstraintError' && e.parent.constraint === 'unique_attachment_routing')) {
                  throw e;
                }
              }
            }
          }
        }
      }

      const allMessagesRaw = await sequelize.query(
        'select m.id mes_id, ma.id att_id from message m left join message_attachment ma on ma.message_id = m.id',
        { type: QueryTypes.SELECT, transaction: rearrangementT }
      );
      if (allMessagesRaw.length) {
        const allMessages = rearrange(allMessagesRaw);
        await monitor(allMessages);
      }

      await queryInterface.removeColumn('message_attachment', 'message_id', {
        transaction: rearrangementT
      });

      await rearrangementT.commit();
    } catch (e) {
      console.log(e);
      await rearrangementT.rollback();
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
