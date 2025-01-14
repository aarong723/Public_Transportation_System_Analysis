function inlandRailBar() {
    let margin = { top: 20, left: 50, right: 30, bottom: 50 },
        width = 500 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    function chart(selector, data) {
        const svg = d3.select(selector)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .classed("svg-content", true);

        let chartGroup = svg.select("g");
        if (chartGroup.empty()) {
            chartGroup = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
        }

        // Clear previous chart elements to avoid overlap when a new country is selected
        chartGroup.selectAll("*").remove();

        // If the country data is not available, return
        if (!data || data.length === 0) {
            return;
        }

        // Assuming data is an array with one element for the selected country
        const countryData = data[0];  // Only using the first data element as we are displaying data for a single country

        // Calculate the percentage of inland investment spent on rail
        const railPercentage = countryData.infrastructureInvestment / countryData.inlandInfrastructureInvestment;
        const otherPercentage = 1 - railPercentage;

        // Create the horizontal bar for rail (green)
        chartGroup.append("rect")
            .attr("x", 0)
            .attr("y", height / 4)  // Position it in the middle of the container
            .attr("width", width * railPercentage)  // Width proportional to rail spending
            .attr("height", height / 2)  // Make the bar a bit thicker for better visibility
            .attr("fill", "green");

        // Create the horizontal bar for the other transport infrastructure spending (purple)
        chartGroup.append("rect")
            .attr("x", width * railPercentage)
            .attr("y", height / 4)
            .attr("width", width * otherPercentage)  // The remaining width for other spending
            .attr("height", height / 2)
            .attr("fill", "purple");

        // Add the country name above the bar
        chartGroup.append("text")
            .attr("x", width / 2)
            .attr("y", height / 4 - 10)  // Position the text above the bar
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .text(countryData.country + " % of Infrastructure Spending on Rail");
        
        const infoGroup = chartGroup.append("g")
            .attr("transform", `translate(${0}, ${height / 4 - 15 })`);
    
        infoGroup.append("circle")
            .attr("r", 5)
            .attr("fill", "#007BFF")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("cursor", "pointer");
    
            // Add "i" icon inside the button
        infoGroup.append("text")
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "7px")
            .style("font-style", "italic")
            .text("i");
    
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        infoGroup.on("mouseover", function (d) {
            d3.select(this).classed("mouseover", true);
            let tooltipContent = "Inland investment includes rail, road, waterway, and air infrastructure. Both rail and inland investment are from 2021.";
    
            tooltip
              .style("opacity", 1)
              .style("visibility", "visible")
              .style("height", "36px")
              .style("width", "350px")
              .html(tooltipContent);  // Display the tooltip content
          })
          .on("mousemove", function () {
            const mouseX = d3.event.pageX; // Mouse X position relative to the page
            const mouseY = d3.event.pageY; // Mouse Y position relative to the page
        
            tooltip
                .style("opacity", 1)
                .style("visibility", "visible")
                .style("left", `${mouseX + 10}px`) // Offset tooltip slightly to the right
                .style("top", `${mouseY - 20}px`); // Offset tooltip slightly above the mouse
        })
          .on("mouseout", function () {
            d3.select(this).classed("mouseover", false);
            tooltip.style("opacity", 0); // Hide tooltip
          })
        // Title for rail section
        chartGroup.append("text")
            .attr("x", width * railPercentage / 2)
            .attr("y", height / 1 + 10)  // Position the text below the bar
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .text("Rail Spending");

        // Add the percentage text for the rail section (orange)
        chartGroup.append("text")
            .attr("x", width * railPercentage / 2)  // Center the text in the rail section
            .attr("y", height / 3 + height / 3)  // Position it in the middle of the bar
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("fill", "white")
            .text(`${(railPercentage * 100).toFixed(1)}%`);

        // Add the percentage text for the other spending section (blue)
        chartGroup.append("text")
            .attr("x", width * (railPercentage + otherPercentage / 2))  // Center the text in the other section
            .attr("y", height / 3 + height / 3)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("fill", "white")
            .text(`${(otherPercentage * 100).toFixed(1)}%`);

        // Add the percentage text for the other section (blue)
        chartGroup.append("text")
            .attr("x", width * (railPercentage + otherPercentage / 2))
            .attr("y", height / 1 + 10)  // Position the text below the bar
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .text("Other Inland Transport Investment");

        return chart;
    }

    return chart;
}
