const express = require('express');
const cors = require('cors');


module.exports = {
  stack: [
    cors(),
    express.json(),
    express.urlencoded({ extended: false }),
  ],
  order: 1
};