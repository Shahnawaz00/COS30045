function init() {
  var w = 800;
  var h = 600;
  var padding = 25;

  // color scheme 
  var colorStart = "#f2f0f7"; // Lighter color
  var colorEnd = "#54278f"; // Darker color

  // projection
  var projection = d3.geoMercator()
    .center([135, -25]) // Adjust the center coordinates
    .translate([w / 2, h / 2])
    .scale(800); // Adjust the scale factor

  // path
  var path = d3.geoPath()
    .projection(projection);

  // svg
  var svg = d3.select("#chloreopath")
    .append("svg")
    .attr("width", w + padding)
    .attr("height", h + padding);

  // Tooltip
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // load data and draw map
  d3.csv("assets/states.csv", function(d) {
    return {
      state: d.state,
      number: +d.number
    };
  }).then(function(data) {

    d3.json("assets/ausStates.geojson").then(function(json) {

      var stateData = {};

      data.forEach(function(d) {
        stateData[d.state] = +d.number;
      });

      json.features.forEach(function(feature) {
        var stateName = feature.properties.STATE_NAME;
        feature.properties.value = stateData[stateName] || 0;
      });

      // Calculate the maximum value for the domain
      var maxNumber = d3.max(data, function(d) { return +d.number; });

      // color scale
      var colorScale = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([0, 1]);

      // map color
      svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("stroke", "grey")
        .attr("fill", function(d) {
          var value = d.properties.value || 0;
          var colorInterpolator = d3.interpolate(colorStart, colorEnd);
          var color = colorInterpolator(colorScale(value));
          return color;
        })
        .attr("d", path)
        .on("mouseover", function(d) {
          d3.select(this).attr("fill", "black"); // Change color on mouseover
          console.log(d)
          // show tooltip on mouseover
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(d.properties.STATE_NAME + "<br/>" + d.properties.value)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
           
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill", function(d) {
            var value = d.properties.value || 0;
            var colorInterpolator = d3.interpolate(colorStart, colorEnd);
            var color = colorInterpolator(colorScale(value));
            return color;
          });

          svg.selectAll(".label").remove();
        });

      // Legend
      var legendWidth = 100;
      var legendHeight = 10;

      var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (w - padding - legendWidth) + "," + (h - padding * 2) + ")");

      var gradient = legend.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorStart);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorEnd);

      legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient)");

      var legendScale = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([0, legendWidth]);

      var legendAxis = d3.axisBottom(legendScale)
        .ticks(2)
        .tickSize(legendHeight)
        .tickFormat(d3.format(".0f"));

      // Add legend label
      legend.append("text")
      .attr("class", "legend-label")
      .attr("x", legendWidth / 2)
      .attr("y", -10)
      .attr("font-size", "11px")
      .style("text-anchor", "middle")
      .text("Total number of migrations in 2021-22");

      legend.append("g")
        .attr("transform", "translate(0," + legendHeight + ")")
        .call(legendAxis);

    });
  });
}

window.onload = init;
