margin = {top: 20, right: 50, bottom: 30, left: 50},
width = window.innerWidth - margin.left - margin.right,
height = 350 - margin.top - margin.bottom;
padding = 1


all_data = d3.json("all_dicts.json", function(data){
	return data;
});

all_data.then(function(d) {
var yearcount = d.year_dicts;
delete yearcount['1958']

var graph_max = d3.max(Object.keys(yearcount), function(d) {return yearcount[d].album_count});

var svg = d3.select("#albumsperyear")
            .append("svg")

var x = d3.scaleBand()
		  .domain(Object.keys(yearcount))
 		  .range([0, width])
 		  .padding(0.1);
var y = d3.scaleLinear()
        .domain([0, graph_max])
 		.range([height, 0]);

var xAxis = d3.axisBottom()
              .scale(x);

var chart = svg.attr("width", width + margin.left + margin.right)
			         .attr("height", height + margin.top + margin.bottom)
			         .append("g")
			         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var bar = chart.selectAll("bar")
               .data(Object.keys(yearcount))
               .enter()
               .append("rect")
               .attr("class", "bar")
               .attr("x", function(d) { return x(d); })
               .attr("y", function(d) { return y(yearcount[d].album_count); })
               .attr("height", function(d) { return height - y(yearcount[d].album_count); })
               .attr("width", x.bandwidth())
               .on('mouseover', function(d) {
        	   	var xpos = parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 2
        	   	var ypos = parseFloat(d3.select(this).attr("y")) - 2
        	   	chart.append("text")
        	   		 .attr("id", "tooltip")
        	   		 .attr("class", "counts")
        	   		 .attr("x", xpos)
        	   		 .attr("y", ypos)
        	   		 .attr("text-anchor", "middle")
        	   		 .text(yearcount[d].album_count)
    		   })
    		   .on('mouseout', function(d) {
        		d3.select("#tooltip").remove();
   			   });

chart.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

////////////////////////////////////////////////////////////////////

var album_dict = d.album_dicts;

//delete anything without an album name
            for(var element of Object.keys(album_dict)){
              if(element.split("~")[0] == '' || element.split("~")[1] == '1958'){
                  delete album_dict[element];
              }
            }

var svg_scatter = d3.select("#albumscatter").append("svg");

var chart_scatter = svg_scatter.attr("width", width + margin.left + margin.right)
                               .attr("height", height + margin.top + margin.bottom)
                               .append("g")
                               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x_max = d3.max(Object.keys(album_dict), function(d) {return album_dict[d].playcount});
var y_max = d3.max(Object.keys(album_dict), function(d) {return album_dict[d].skipcount});

var x_scatter = d3.scaleLinear()
                  .domain([0, x_max+100]) //scale of the chart
                  .range([0, width]); //scale of the canvas
var y_scatter = d3.scaleLinear()
                  .domain([0, y_max])
                  .range([height, 0]);

var xAxis_scatter = d3.axisBottom(x_scatter);
var yAxis_scatter = d3.axisLeft(y_scatter);

//TODO: keep labels constant for any high-count albums? text highlights when button?
//TODO: fix like, all of this

var dots = chart_scatter.selectAll("circle")
                        .data(Object.keys(album_dict))
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) { return x_scatter(album_dict[d].playcount); })
                        .attr("cy", function(d) { return y_scatter(album_dict[d].skipcount); })
                        .attr("class", function(d) { return d.split("~")[1] })
                        .attr("r", 4)
                        .attr("fill", "#0084ff")
                        .on('mouseover', function(d) {
                           var xpos = parseFloat(d3.select(this).attr("cx")) + 7
                           var ypos = parseFloat(d3.select(this).attr("cy")) + 2
                           chart_scatter.append("text")
                           .attr("id", "tooltip_scatter")
                           .attr("class", "counts")
                           .attr("x", xpos)
                           .attr("y", ypos)
                           .text(d.split("~")[0] + " (" + d.split("~")[1] + ")")
                           })
                           .on('mouseout', function(d) {
                           d3.select("#tooltip_scatter").remove();
                           });
chart_scatter.append("text")
             .attr("x", width/2)
             .attr("y", height+30)
             .style("font-family", "sans-serif")
             .style("font-size", "10")
             .style("text-anchor", "middle")
             .text("PLAY COUNT")
chart_scatter.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis_scatter);

chart_scatter.append("text")
             .attr("transform", "rotate(-90)")
             .attr("x", 0 - height/2)
             .attr("y", 0 - 30)
             .style("font-family", "sans-serif")
             .style("font-size", "10")
             .style("text-anchor", "middle")
             .text("SKIP COUNT")

chart_scatter.append("g")
             .attr("class", "y axis")
             .call(yAxis_scatter);

});
