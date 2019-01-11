'use strict';

const fs = require('fs');

exports.downloadFile = function downloadFile(options, callback){
  try{
    var fileStats = fs.statSync(options.filePath);
  }
  catch(err){
    return callback(err);
  }
  if(fileStats.isDirectory()){
    console.log("Download a directory");
    return callback(Error("Download a directory"));
  }
  else{
    return callback(null, options.filePath);
  }
}