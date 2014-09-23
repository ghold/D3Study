var http = require("http"); 
var url = require("url");
var io = require('socket.io');

function start(route, handle) { 
	var app = http.createServer(onRequest).listen(8886); 
	var appio = io(app);

	function onRequest(request, response) { 
		var pathname = url.parse(request.url).pathname; 
		console.log("Request for " + pathname + " received."); 
		route(handle, pathname, response, request, appio); 
	} 
	
	console.log("Server has started."); 
} 

exports.start = start; 