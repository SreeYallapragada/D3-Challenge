// d3.select(window).on("resize", handleResize);

// //Call loadChart() when the browser loads
// loadChart();

//Set the dimensions for the SVG Container and Parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom; 

//Create an SVG wrapper, append the svg group that will have the chart
//Shift the chart by lefft and top margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append to an SVG group    
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);    
    
// Import data from external CSV    
d3.csv("assets/data/data.csv").then(function(stateDemographicData) {
    console.log(stateDemographicData);
    
    //Create a function to parse the income and age data
    stateDemographicData.forEach(function(data) {
        data.healthcare = +data.healthcare; 
        data.medianIncome = +data.medianIncome;
    });

    //Create the x/y linear scaling functions

    var xLinScale = d3.scaleLinear()
        //.classed("x-axis", true)
        .domain([0, d3.max(stateDemographicData, d => d.medianIncome)])
        .range([0, width]);

    var yLinScale = d3.scaleLinear()
        .domain([0, d3.max(stateDemographicData, d => d.healthcare)])
        .range([height, 0]);    

    //Axis functions    
    var bottomAxis = d3.axisBottom(xLinScale);
    var leftAxis = d3.axisLeft(yLinScale);

    //Append the X-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // chartGroup.append("g")
    //     .call(leftAxis);    

    //Append the Y-Axis
    chartGroup.append("g")
        //.classes("black", "true")
        .attr("stroke", "black")
        .call(leftAxis);   
    
    //Scatter plot circles
    var scatterDots = chartGroup.selectAll("circle")
        .data(stateDemographicData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinScale(d.medianIncome))
        .attr("cy", d => yLinScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "navy")
        .attr("opacity", ".5");

    //State Abbreviations
    scatterDots.selectAll("text")
        .data(stateDemographicData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("dy", "2.35em")
        .attr("x", d => xLinScale(d.medianIncome))
        .attr("y", d=> yLinScale(d.healthcare))
        .style("font", "10 px calibri")
        .style("font-weight", "bold")
        .style("fill", "black");

    //Append Y Axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")    
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2) - 40)
        .attr("class", "axisText")
        .text("Availability to Healthcare");

    //Append X Axis
    chartGroup.append("text")
    .attr("transform", `translate(${(width/2)}, ${height + margin.top + 25})`)
    .attr("class", "axisText")
    .text("Median Income ($)")
});