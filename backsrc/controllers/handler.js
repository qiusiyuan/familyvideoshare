'use strict';

const fs = require('fs');

const config = require('../config/config').getconfig();
const list = require('../lib/listPath');
const logger = require('log4js').getLogger();
const path = require('path');

module.exports = {
  listPath: listPath,
};

function listPath(req, res){
  const options = {
    filePath :req.params.fullpath=='home'?  config.homeDir:req.params.fullpath ,
  };
  list.listPath(options, function(err, result){
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

