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

			//correct
			var svg = d3.select(el);
			var circle = svg.selectAll("circle").data([32, 57, 112, 239]);
			var circleEnter = circle.enter().append("circle");

			circle.attr("cy", 60);
			circle.attr("cx", function(d, i) { return i * 100 + 30; });
			circle.attr("r", function(d) { return Math.sqrt(d); });

			//bug
			// svg.selectAll("circle")
			//     .data([32, 57, 112, 293])
			//   .enter().append("circle")
			//     .attr("cy", 60)
			//     .attr("cx", function(d, i) { return i * 100 + 30; })
			//     .attr("r", function(d) { return Math.sqrt(d); });

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