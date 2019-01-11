'use strict';

const fs = require('fs');
const async = require('async');
const pa = require('path');

var path='';
exports.listPath = function listPath(options, callback){
  path = options.filePath;
  fs.readdir(path, (err, files)=>{
    if(err){
      return callback(err);
    }
    async.map(files, getFileStat, function(err, fileStats){
      if(err){
        return callback(Error("Error getting files list"));
      }
      if(fileStats){
        return callback(null, fileStats);
      }
    })
  });
};

function getFileStat(file, callback){
  var filePath = pa.join(path, file)
  var fileStats={};
  fileStats.fileName = file;
  try{
    var fullFileStats = fs.statSync(filePath);
  }
  catch(err){
    return callback(err);
  }
  if (fullFileStats.isDirectory()){
    fileStats.isDirectory = true;
  }else{
    fileStats.isDirectory = false;
    fileStats.size = formatSizeUnits(fullFileStats.size);
  }
  return callback(null,fileStats);
}

function formatSizeUnits(bytes) {
  var unit;
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2);
    unit = 'GB';
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2);
    unit = 'MB';
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2);
    unit = 'KB';
  } else if (bytes > 1) {
    unit = 'Bytes';
  } else {
    unit = 'Byte';
  }
  return [Number(bytes), unit];
};