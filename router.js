var fs = require("fs")

function route(handle, pathname, response, request, io) { 
	console.log("About to route a request for " + pathname); 
	if (typeof handle[pathname] === 'function') { 
		handle[pathname](response, request, io); 
	} else if(/.*\.(.{0,4})$/.test(pathname)){
		suffix = RegExp.$1;
		console.log("Get" + pathname);
		handle["/static"](response, "." + pathname, suffix);
	}else{ 
		console.log("No request handler found for " + pathname); 
		response.writeHead(404, {"Content-Type": "text/html"}); 
		response.write("404 Not found"); 
		response.end(); 
	} 
} 

exports.route = route;