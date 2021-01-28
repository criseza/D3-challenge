// Code for SVG at index.html

// Setting parameters for SVG
var svgWidth = 960;
var svgHeight = 600;

// Setting margins for X and Y
var margin = {
  top: 15,
  right: 45,
  bottom: 100,
  left: 100
};

// Setting calculated width and height from margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Appending an SVG group to be held by the graph
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Setting initial graph parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Updating X-scale upon clicking on label
function xScale(data, chosenXAxis) {
    // Creating the scale with domain and range
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  };

// Updating x-Axis when label is clicked
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
      
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
      
        return xAxis;
      };
  
// Updating Y-scale upon clicking on label
function yScale(data, chosenYAxis) {
    // Creating the scale with domain and range
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  };
  
  // Updating y-Axis when label is clicked
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  
  // Updating circles group with transitions
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }  
  // Updating circles labels with transitions
  function renderLabels(cLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    cLabels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return cLabels;
  }
  
  // Updating circles group with new tooltip
  function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
  
    let label = "";
  
    if (chosenXAxis == "poverty") {
        label = "In Poverty(%)";
    }else if(chosenXAxis == "age"){
        label = "Age (Median)"
    }else if(chosenXAxis == "income"){
        label = "Household Income (Median)";
    }else{
        label = "X Error"
    } 

    if (chosenYAxis == "healthcare") {
        label = label + " vs Lacks Healthcare (%)";
    } 
    else if(chosenYAxis == "obesity"){
        label = label + " vs Obesity (%)"
    }
    else if(chosenYAxis == "smokes"){
        label = label + " vs Smokes (%)";
    }else{
        label = label + "Y Error"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(d => {
        return (`${d.state} (${d.abbr})<br>${ylabel}${d[chosenYAxis]}<br>${xlabel}${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);

// Mouseover
    circlesGroup
    // Show tooltip
        .on("mouseover", function(data) {
      toolTip.show(data);
        })
      // Hide tooltip
        .on("mouseout", function(data) {
        toolTip.hide(data);
        });
  
    return circlesGroup;
  };

  // Getting data from CSV
d3.csv("static/data/data.csv").then(function(mainData, err) {
    if (err) throw err;
  
    // Data parsing
    mainData.forEach(data => {
      // X Axis
      data.poverty = parseFloat(data.poverty);
      data.age = parseFloat(data.age);
      data.income = parseFloat(data.income);
      // Y Axis
      data.healthcare = parseFloat(data.healthcare);
      data.smokes = parseFloat(data.smokes);
      data.obesity = parseFloat(data.obesity);
    });
  
    // Assigning imported CSV data to X/Y-Scales
    var xLinearScale = xScale(mainData, chosenXAxis);    
    var yLinearScale = yScale(mainData, chosenYAxis);
  
    // Initiating axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // Appending axes
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // Appending initial circles
    var gGroup = chartGroup.selectAll("g")
        .data(mainData)
        .enter()
        .append("g")
        .classed("circles", true);
    var circlesGroup = gGroup.append("circle")
        .data(mainData)
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "purple")
      .attr("opacity", ".5")
      .attr("class","stateCircle");
  
    ////// Adding labels within circle
    var cLabels = chartGroup.selectAll(".circles")
     .append("text")
     .text( d => d.abbr)
     .attr("text-anchor", "middle")
     .attr("alignment-baseline", "middle")
     .attr("font-size",".8em")
     .attr("style","stroke:white;")
     .attr("x", d => xLinearScale(d[chosenXAxis]))  
     .attr("y", d => yLinearScale(d[chosenYAxis]));

    // X-Axis labels group
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
      
    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 55)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // Y-axis labels group
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    var healthcareLabel = yLabelsGroup.append("text")
      .attr("x", 0 - (height/2))
      .attr("y", 0 - (margin.left/3))
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");    
      
    var obesityLabel = yLabelsGroup.append("text")
      .attr("x", 0 - (height/2))
      .attr("y", -20 - (margin.left/3))
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");   

    var smokesLabel = yLabelsGroup.append("text")
      .attr("x", 0 - (height/2))
      .attr("y", -40 - (margin.left/3))
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokers (%)");
  
    // Updating ToolTip function on CSV data import
    var circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
  
    // Getting value on X-axis selection upon click
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // Replacing with new values
          chosenXAxis = value;
          // Updating scale for new values
          xLinearScale = xScale(mainData, chosenXAxis);
          // Updating axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          // Updating circles with new values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,  yLinearScale, chosenYAxis);
          // Updating tooltips with new values
          circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);
          // Updating labels with new values
          cLabels = renderLabels(cLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
          // Changing text to bold for selected classes
          if (chosenXAxis === "income") {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
    // Getting value on X-axis selection upon click
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          // Replacing with new values
          chosenYAxis = value;
          // Updating scale for new values
          yLinearScale = yScale(mainData, chosenYAxis);
          // Updating axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);
          // Updating circles with new values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,  yLinearScale, chosenYAxis);
          // Updating tooltips with new values
          circlesGroup = updateToolTip(circlesGroup, chosenYAxis);
          // Updating labels with new values
          cLabels = renderLabels(cLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
          // Changing text to bold for selected classes
          if (chosenYAxis === "smokes") {
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "obesity") {
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

  }).catch(function(error) {
    console.log(error);
  });