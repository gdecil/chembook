var http = require('http');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var zerorpc = require("zerorpc");

  var client = new zerorpc.Client();
  client.connect("tcp://127.0.0.1:4242");

  client.invoke("hello", "World!", function(error, res, more) {
    console.log(res);
    res.end('Hello Worldn');
  });

  
})
 
server.listen(1337, '0.0.0.0');
 
console.log('Server running at http://0.0.0.0:1337/');