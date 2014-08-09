var fs = require("fs"), 
	d3 = require("d3"),
	jsdom = require('jsdom'),
	STATIC_CONFIG = require("config").static;

function test (response) {
	// body...
	console.log("Request handler 'test' was called.");

	var index = fs.readFileSync('./template/index.html', 'utf-8');

	jsdom.env({
		features : { QuerySelector : true }
		, html : index
		, done : function(errors, window) {
		// this callback function pre-renders the dataviz inside the html document, then export result into a static file
 
			var el = window.document.querySelector('#test')
				, data = [4, 8, 15, 16, 23, 42]
				 , body = window.document.querySelector('body')
				// , circleId = 'a2324'  // say, this value was dynamically retrieved from some database
 
			// generate the dataviz
			// d3.select(el)
			// 	.append('svg:svg')
			// 		.attr('width', 600)
			// 		.attr('height', 300)
			// 		.append('circle')
			// 			.attr('cx', 300)
			// 			.attr('cy', 150)
			// 			.attr('r', 30)
			// 			.attr('fill', '#26963c')
			// 			.attr('id', circleId) // say, this value was dynamically retrieved from some database

			var width = 420,
    			barHeight = 20;

			var x = d3.scale.linear()
			    .domain([0, d3.max(data)])
			    .range([0, width]);

			var chart = d3.select(el)
			    .attr("width", width)
			    .attr("height", barHeight * data.length);

			var bar = chart.selectAll("g")
			    .data(data)
			  .enter().append("g")
			    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

			bar.append("rect")
			    .attr("width", x)
			    .attr("height", barHeight - 1);

			bar.append("text")
			    .attr("x", function(d) { return x(d) - 3; })
			    .attr("y", barHeight / 2)
			    .attr("dy", ".35em")
			    .text(function(d) { return d; });

 
			// make the client-side script manipulate the circle at client side)
			// var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"
 
			// d3.select(body)
			// 	.append('script')
			// 		.html(clientScript)
 
			// save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
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