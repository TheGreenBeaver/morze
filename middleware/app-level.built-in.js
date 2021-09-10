const express = require('express');
const cors = require('cors');
const { isDev, getHost } = require('../util/misc');

const corsOrigin = [getHost()];
if (isDev()) {
  corsOrigin.push('http://127.0.0.1:3000', 'http://localhost:3000');
}
module.exports = {
  stack: [
    cors({
      origin: corsOrigin,
      credentials: true
    }),
    express.json(),
    express.urlencoded({ extended: false }),
  ],
  order: 1
};