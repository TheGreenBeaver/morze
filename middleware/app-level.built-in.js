const express = require('express');
const settings = require('../config/settings');


module.exports = {
  stack: [
    express.json(),
    express.urlencoded({ extended: false }),
    // Serve static content
    express.static(settings.STATIC_ROOT)
  ],
  order: 1
};