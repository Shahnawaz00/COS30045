function drawBarChart(data) {
    var w = 500;
    var h = 400;
    var padding = 60;

    var svg = d3.select("#barChart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.country; }))
        .range([padding, w - padding])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.number; })])
        .range([h - padding, padding]);

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(yScale));

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.country); })
        .attr("y", function(d) { return yScale(+d.number); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return h - padding - yScale(+d.number); });

    var barLabels = svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .text(function(d) { return d.number; })
        .attr("x", function(d) { return xScale(d.country) + xScale.bandwidth() / 2; })
        .attr("y", function(d) { return yScale(+d.number) - 5; })
        .attr("text-anchor", "middle")
        .style("opacity", 0); // Set initial opacity to 0

        bars.on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "#3e1b6a");
    
            barLabels.style("opacity", 1); // show all labels           
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "rgb(132, 120, 193)");

            barLabels.style("opacity", 0); // hide all labels
        });

    // Sort bars on button click
    d3.select("#sortButton").on("click", function() {
        // Sort the data array based on number in descending order
        data.sort(function(a, b) {
            return d3.descending(+a.number, +b.number);
        });

        // Update the xScale domain with the sorted country names
        xScale.domain(data.map(function(d) { return d.country; }));

         // Update the x-axis with the updated xScale
        svg.select("g")
           .transition()
           .duration(750)
           .call(d3.axisBottom(xScale));
   
        // Animate the bars' position change
        bars.transition()
            .duration(750)
            .attr("x", function(d) { return xScale(d.country); });

        // Animate the bar labels' position change
        barLabels.transition()
            .duration(750)
            .attr("x", function(d) { return xScale(d.country) + xScale.bandwidth() / 2; });
    });

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-label")
        .text("Countries")
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

// Create a tooltip element
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("assets/topCountries.csv", function(d) {
    return {
        country: d.country,
        number: d.number.replace(/,/g, "") // Remove comma from numbers
    };
}).then(function(data) {
    drawBarChart(data);
});
