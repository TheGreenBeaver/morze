const httpStatus = require('http-status');


async function find({ Model, serializer = v => v, options }, req, res, next) {
  try {
    const instance = await Model.findByPk(+req.params.id, { rejectOnEmpty: true, ...options });
    return res.json(serializer(instance));
  } catch (e) {
    return next(e);
  }
}

async function list({ Model, serializer = v => v, options }, req, res, next) {
  try {
    const queryRes = await Model.findAll(options);
    return res.json(queryRes.map(instance => serializer(instance)));
  } catch (e) {
    next(e);
  }
}

async function create({ Model, serializer = v => v }, req, res, next) {
  try {
    const instance = await Model.create(req.body);
    return res.status(httpStatus.CREATED).json(serializer(instance));
  } catch (e) {
    next(e);
  }
}

module.exports = {
  find, list, create
};