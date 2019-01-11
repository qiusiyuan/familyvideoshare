'use strict';

const fs = require('fs');
const pa = require('path');
const scp2 = require('scp2');
var Client = require('scp2').Client;

exports.scpTo = function scpTo(options, callback){
  try{
    var fileStats = fs.statSync(options.fromPath);
  }
  catch(err){
    return callback(err);
  }
  scp2.scp(options.fromPath, {
    host: options.clusterIp,
    username: options.user,
    password: options.password,
    path: options.toPath,
  }, function(err) {
    if(err) {
      console.log(err.message);
      return callback(err);
    }else{
      return callback(null, "Successfully transfered")
    }
  });
};