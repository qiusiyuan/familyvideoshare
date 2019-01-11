'use strict';

const fs = require('fs');

const config = require('../config/config').getconfig();
const list = require('../lib/listPath');
const download = require('../lib/downloadFile');
const logger = require('log4js').getLogger();
const scp = require('../lib/scp');
const path = require('path');

module.exports = {
  listPath: listPath,
  downloadFile: downloadFile,
};

function listPath(req, res){
  console.log(req.headers);
  
  const options = {
    filePath :req.params.fullpath=='home'?  config.homeDir:req.params.fullpath ,
  };
  console.log(options);
  list.listPath(options, function(err, result){
    console.log(result);
    if (err){
      res.status(400);
      return res.json({
        success: false,
        message: err.message
      });
    }
    if (result){
      const returnVal = result.filter(obj => {
        return Object.keys(obj).length !== 0;
      });
      console.log(returnVal);
      res.json({
        success: true,
        currentDirectory : options.filePath,
        files: returnVal
      });
    }else {
      res.status(400);
      return res.json({
        success: false,
        message: `Error getting the list directory ${options.filePath}.`
      });
    }
  });
}

function downloadFile(req, res){
  const options = {
    filePath :path.join('/',req.swagger.params.fullPath.value )|| null,
  }
  download.downloadFile(options, function(err, filePath){
    if (err){
      res.status(400);
      return res.json({
        success: false,
        message: err.message
      });
    }
    else if (filePath){
      console.log(filePath);
      return res.download(filePath, function(err) {
        if (err) {
          logger.error(err);
          // Check if the header is already sent, to prevent double callback.
          if (!res.headersSent) {
            return res.json({
              success: false,
              message: err.message
            });
          }
        } else {
          logger.debug('Download successful');
        }
      });
    }else {
      res.status(400);
      return res.json({
        success: false,
        message: `Error getting download file ${options.filePath}.`
      });
    }
  });
}
function scpTo(req, res){
  const options = {
    fromPath : req.body.fromPath,
    toPath : req.body.toPath,
    clusterIp : req.body.clusterIp,
    user : req.body.user,
    password : req.body.password,
  }

  scp.scpTo(options, function(err, message){
    if (err){
      if (!res.headersSent) {
        res.status(200);
        return res.json({
          success: false,
          message: err.message
        });
      }
    }
    else{
      res.status(200);
      return res.json({
        success: true,
        message: message,
      });
    }
  });
}
