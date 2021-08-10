const express = require('express');
const settings = require('../config/settings');
const cors = require('cors');


module.exports = {
  stack: [
    cors(),
    express.json(),
    express.urlencoded({ extended: false }),
    // Serve static content
    express.static(settings.STATIC_ROOT)
  ],
  order: 1
};