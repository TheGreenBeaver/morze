function logError(err, req, res, next) {
  console.log(err);
  next(err);
}

module.exports = {
  stack: [logError],
  order: 0
};