var http = require('http');
var url = require('url');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var zerorpc = require("/usr/local/lib/node_modules/zerorpc");
  var client = new zerorpc.Client();
  var url_par = url.parse(req.url, true);
  var query = url_par.query;
//  console.log(query.name);
  client.connect("tcp://127.0.0.1:4242");
  client.invoke("hello", query.name, function(error, res1, more) {
//    console.log(res1);
    res.end(res1)
  });

})
 
server.listen(1337, '0.0.0.0');
 
console.log('Server running at http://0.0.0.0:1337/');