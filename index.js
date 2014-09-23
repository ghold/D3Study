var server = require("./server"); 
var router = require("./router"); 
var requestHandlers = require("./lessons/3/requestHandlers"); 

var handle = {} 
handle["/"] = requestHandlers.test; 
handle["/static"] = requestHandlers.static;

server.start(router.route, handle); 