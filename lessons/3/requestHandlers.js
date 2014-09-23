var fs = require("fs"), 
	d3 = require("d3"),
	jsdom = require('jsdom'),
	STATIC_CONFIG = require("config").static;

function test (response, request, io) {
	// body...
	console.log("Request handler 'test' was called.");

	fs.readFile('./lessons/3/template/index.html',	function (err, data) {
    	if (err) {
      		response.writeHead(500);
      		return response.end('Error loading index.html');
    	}

    	response.writeHead(200, {"Content-Type": "text/html"});
    	response.write(data);
    	response.end();
  	});

	io.on('connection', function (socket) {
  		socket.emit('news', { hello: 'world' });
  		socket.on('my other event', function (data) {
    		console.log(data);
  		});
	});

}

/*Server uses this function to get static files
**You need set file suffix and its Content-Type in STATIC_CONFIG
**By Ghold
*/
function static(response,pathname,suffix) {
	console.log("Request handler 'static' was called."); 
	fs.readFile(pathname, "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": STATIC_CONFIG[suffix]});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.static = static
exports.test = test;