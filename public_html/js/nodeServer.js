var http = require('http');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Worldn');
})
 
server.listen(1337, '0.0.0.0');
 
console.log('Server running at http://0.0.0.0:1337/');