'use strict';
var http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs');

var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};

http.createServer(function (req, res) {
  var uri = url.parse(req.url).pathname;
  var fileName = path.join(process.cwd(), unescape(uri));
  console.log('Loading ' + uri);
  var stats;

  try {
    stats = fs.lstatSync(fileName);
  } catch (e) {
    res.writeHead(404, {
      'Content-type': 'text/plain'
    });
    res.write('404 not Found\n');
    res.end();
    return;
  }
  // Check if file/directory
  if (stats.isFile()) {
    var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
    res.writeHead(200, {
      'Content-type': mimeType
    });
    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    res.writeHead(302, {
      'location': 'index.html'
    });
    res.end();
  } else {
    res.writeHead(500, {
      'Content-type': 'text/plain'
    });
    res.write('500 Internal Error');
    res.end();
  }
}).listen(3000, '127.0.0.1');
console.log('Server running on http://127.0.0.1:3000');