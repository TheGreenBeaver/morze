function logRequest(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

module.exports = {
  order: 2,
  stack: [logRequest]
}