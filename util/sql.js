function getFkConfig(ref, Sequelize) {
  return {
    type: Sequelize.INTEGER,
    references: {
      model: ref,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  };
}

function dropFk(queryInterface, tableName, ref) {
  return {
    then: (cb = () => {}) => queryInterface
      .removeConstraint(tableName, `${tableName}_${ref}_id_fkey`)
      .then(() => queryInterface
        .removeColumn(tableName, `${ref}_id`).then(cb)
      )
  }
}

module.exports = {
  getFkConfig,
  dropFk
};