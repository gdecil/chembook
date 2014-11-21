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
		console.log(req.params.name);
		res.end(req.params.func);
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