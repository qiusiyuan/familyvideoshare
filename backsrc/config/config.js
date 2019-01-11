'use strict';

const configs = require('./config.json');

module.exports.getconfig = function () {
  configs.homeDir = process.env.HOME_DIR || configs.homeDir;
  return configs;
};