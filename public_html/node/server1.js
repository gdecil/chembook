var http = require('http');
var url = require('url');
var dispatcher = require('./httpdispatcher');
	
	dispatcher.setStatic('resources');
	
	dispatcher.onGet("/page1", function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Page One');
	});	
	
	dispatcher.onGet("/python", function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		var zerorpc = require("/usr/local/lib/node_modules/zerorpc");
		var client = new zerorpc.Client();
		if (req.params.func == 'renderInd')
			{
				console.log(req.params.smile);
				client.connect("tcp://127.0.0.1:4242");
				client.invoke("renderInd", req.params.smile, function(error, res1, more) {
					res.writeHead(200, {'Content-Type': 'image/png'});
					res.end(res1)
				})
			}
		else if (req.params.func == 'hello') {
			client.connect("tcp://127.0.0.1:4242");
			client.invoke("hello", req.params.name, function(error, res1, more) {
				res.end(res1)
			})
			
		}
		else
			{
				res.end(req.params.func);
			}
//		res.end(req.params.func);
	});	

	dispatcher.onPost("/page2", function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Page Two');
	});
	
	dispatcher.beforeFilter(/\//, function(req, res, chain) { //any url
		console.log("Before filter");
		chain.next(req, res, chain);
	});
	
	dispatcher.afterFilter(/\//, function(req, res, chain) { //any url
		console.log("After filter");
		chain.next(req, res, chain);
	});
	
	dispatcher.onError(function(req, res) {
		res.writeHead(404);
	});
	
	http.createServer(function (req, res) {
		dispatcher.dispatch(req, res);
	}).listen(1337, '0.0.0.0');
	
	
	/*
	GET /page1 => 'Page One'
	POST /page2 => 'Page Two'
	GET /page3 => 404
	GET /resources/images-that-exists.png => Image resource
	GET /resources/images-that-does-not-exists.png => 404
	*/