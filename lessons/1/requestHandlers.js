var fs = require("fs"), 
	d3 = require("d3"),
	jsdom = require('jsdom'),
	STATIC_CONFIG = require("config").static;

function test (response) {
	// body...
	console.log("Request handler 'test' was called.");

	var index = fs.readFileSync('./lessons/1/template/index.html', 'utf-8');

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

			var margin = {top: 20, right: 30, bottom: 30, left:40},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

    		var x = d3.scale.ordinal()
    			.rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
			
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10, "%");

			var chart = d3.select(el)
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			fs.readFile("./lessons/1/data.tsv", "utf-8", function(err, data){
				
				data = d3.tsv.parse(data,type);

				x.domain(data.map(function(d){ return d.name; }));				
				y.domain([0, d3.max(data, function(d){return d.value})]);

				chart.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
					

				chart.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
      				.attr("transform", "rotate(-90)")
      				.attr("y", 6)
      				.attr("dy", ".71em")
      				.style("text-anchor", "end")
      				.text("Frequency");

				chart.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { return x(d.name);})
					.attr("y", function(d) { return y(d.value);})
					.attr("height", function(d) {return height - y(d.value);})
					.attr("width", x.rangeBand());

				var svgsrc = window.document.innerHTML

				response.writeHead(200, {"Content-Type": "text/html"});  
				response.write(svgsrc); 
				response.end(); 
			});

			function type(d) {
				d.value = +d.value;
				return d;
			}

			

			

 
			// make the client-side script manipulate the circle at client side)
			// var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"
 
			// d3.select(body)
			// 	.append('script')
			// 		.html(clientScript)
 
			// save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
			
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