'use strict';

const ip = require("./ip.json");

module.exports.getconfig = function () {
  var configs = {};
  configs.hostIp = `http://${ip.ip}:10010`
  return configs;
};