var fs = require("fs"), 
	d3 = require("d3"),
	jsdom = require('jsdom'),
	STATIC_CONFIG = require("config").static;

function test (response) {
	// body...
	console.log("Request handler 'test' was called.");

	var index = fs.readFileSync('./lessons/2/template/index.html', 'utf-8');

	jsdom.env({
		features : { QuerySelector : true }
		, html : index
		, done : function(errors, window) {
			var el = window.document.querySelector('#test')
				 , body = window.document.querySelector('body')

			var circle = d3.select(el).selectAll("circle");
			circle.style("fill", "steelblue");
			circle.attr("r", 30);
			circle.attr("cx", function() { return Math.random() * 720; });

			var svgsrc = window.document.innerHTML

			response.writeHead(200, {"Content-Type": "text/html"});  
			response.write(svgsrc); 
			response.end(); 
	
		} // end jsDom done callback
	})
	// no semi-column was harmed during this development

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