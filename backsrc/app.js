var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var handler = require('./controllers/handler');
var path = require('path')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get('/listPath/:fullpath', handler.listPath);

app.get('/icon',function(req, res){
  var picpath = path.join(__dirname , "/pics");
  fs.readdir(picpath, (err, files)=>{
    file = files[Math.floor(Math.random() * files.length)]
    return res.sendFile(path.join(picpath, file));
  });
})
app.get('/video/:videopath', function(req, res) {
  const path = req.params.videopath;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res)
  }
});

http.listen(10010, function(){
  console.log('listening on *: 10010');
});