const { getUniqueKeyName } = require('../util/misc');
const { UniqueConstraintError } = require('sequelize');
const httpStatus = require('http-status');
const models = require('../models/index');


function handleUniqueConstraintError(err, req, res, next) {
  if (err instanceof UniqueConstraintError) {
    const { parent } = err;
    const failedUnique = getUniqueKeyName(parent);
    const failedModel = Object.values(models).find(model => model.tableName === parent.table).modelName;
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ [failedUnique]: [`${failedModel} with such ${failedUnique} already exists`] });
  }

  next(err);
}

module.exports = {
  stack: [handleUniqueConstraintError],
  order: 1
};