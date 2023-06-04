d3.csv("assets/totalMigrations.csv", function(d) {
    return {
      year: d3.timeParse("%Y")(d.year),
      value: parseInt(d.value.replace(/,/g, ""), 10)
    };
  }).then(function(data) {
    drawLineChart(data);
  });
  
  function drawLineChart(data) {
    var w = 700;
    var h = 400;
    var padding = 60;
  
    var svg = d3.select("#lineChart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
  
    var xScale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([padding, w - padding]);
  
    var yScale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.value; }))
      .nice()
      .range([h - padding, padding]);
  
    var line = d3.line()
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.value); });
  
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "purple")
      .attr("stroke-width", 2)
      .attr("d", line);
  
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) { return xScale(d.year); })
      .attr("cy", function(d) { return yScale(d.value); })
      .attr("r", 4)
      .attr("fill", "darkpurple")
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("r", 6);
          
        svg.selectAll(".label")
            .filter(function(e) {
                console.log(e);
                return e.year === d.year;
            })
            .style("opacity", 1);

      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("r", 4);
      });
  
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(function(d) { return d.value; })
      .attr("x", function(d) { return xScale(d.year); })
      .attr("y", function(d) { return yScale(d.value) - 10; })
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "darkpurple")
      .style("opacity", 0)
      .on("mouseover", function() {
        d3.select(this)
        .style("opacity", "1");
      })
      .on("mouseout", function() {
        d3.select(this)
        .style("opacity", "0");
      });
    
    
    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(d3.axisBottom(xScale).ticks(5));
  
    svg.append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s")));

      // Add x-axis label
  svg.append("text")
  .attr("class", "x-label")
  .text("Year Migrated")
  .attr("x", w / 2)
  .attr("y", h - padding / 3)
  .attr("text-anchor", "middle");

// Add y-axis label
svg.append("text")
  .attr("class", "y-label")
  .text("Number of Migrations")
  .attr("transform", "rotate(-90)")
  .attr("x", -h / 2)
  .attr("y", padding / 2)
  .attr("text-anchor", "middle")
  .attr("dy", "-1em");
  }
  