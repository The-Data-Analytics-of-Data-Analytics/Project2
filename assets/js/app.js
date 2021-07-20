//set svg and chart dimensions and margins 
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 15,
  right: 15,
  bottom: 115,
  left: 150
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//add svg to page
var svg = d3
  .select(".D3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//add chartgroup "g" to svg, translate out of the margins  
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//take in data and a column argument based on chosen axis, calculate domain, set range, return
//linear scale 
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([0, data[chosenXAxis].length]) //data[chosenXAxis] => reference to JSON
      .range([0, chartWidth]);
  
    return xLinearScale;
}

//take in data and index argument based on chosen axis, calculate domain, set range, return
//linear scale
function yScale(data, chosenXAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => +d[chosenXAxis]), //+d[chosenXAxis] => reference to corresponding JSON y value
        d3.max(data, d => +d[chosenXAxis])]) //+d[chosenXAxis] => reference to corresponding JSON y value
      .range([chartHeight, 0]);
  
    return yLinearScale;
}

//take in axis object and new linear scale, transform axis over span of 1 second
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  //take in axis object and new linear scale, transform axis over span of 1 second
  function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  //double duty function, takes in old circle group and labels and transforms their data over span
  //of 1 second using the new column specs and new linear scales, returns new circles group and labels 
  function renderCircleLayers(circlesGroup, circleLabels, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
    circleLabels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]) - 7);
  
    return circlesGroup, circleLabels;
  }

  //update tooltip data using new column designations with old circles group, return new circles group
  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "tools") {
      label = "Tool: ";
    }
    else if (chosenXAxis === "techologies") {
      label = "Technology: ";
    }
    else if (chosenXAxis === "startingSalary") {
      label = "Starting Salary: "; 
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.state}<br>${xLabel}${d[chosenXAxis]}`); //d[chosenXAxis] => reference to JSON Y value,
      });                                                   //d.state => ref to X category
  
    //add tooltip to circles group
    circlesGroup.call(toolTip);

    //listener for circles to activate/deactivate tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
    });
  
    return circlesGroup; 
  }

  //tools, technologies, starting salary
  //initialize X axis
  var chosenXAxis = "tools";

  //populate dropdown
  var careers = ["Data Scientist", "Data Engineer", "Data Analyst"];

  d3.select("#dropdown")
  .selectAll("option")
  .data(careers)
  .enter()
  .append("option")
  .text(function (career) {
    return career;
  });

  var dropdownMenu = d3.selectAll("#dropdown");
  dropdownMenu.on("change", filterViz);

  filterViz();

  function filterViz() {

    //if accessed due to change prevent default reload behavior, if initializing skip
    if (d3.event != null) {
      d3.event.preventDefault();
    }

    //get user selection from dropdown, extract index number from array of IDs
    userSelect = d3.select('#dropdown option:checked').text();
    if (userSelect === "Data Scientist")
      JSONaddress = "";
    else if (userSelect === "Data Engineer")
      JSONaddress = "";
    else if (userSelect === "Data Analyst")
      JSONaddress = "";
    else
      throw new Error("Oops...user selection error");

  //read in data JSON, catch any error
    d3.json(JSONaddress).then(function(statisticalData, err) {
      if (err) throw err;
  
  //transform data to numeric form
    statisticalData.forEach(function(data) {
      //convert numerical data to Number
    });

  //intitalize linear scales
    var xLinearScale = xScale(statisticalData, chosenXAxis);
    var yLinearScale = yScale(statisticalData, chosenXAxis);

  //create axes from linear scales
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
   //add axes to chartgroup, drop x-axis to bottom of page 
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);   

  //add state abbreviations to chartgroup where corresponding circles will be, center them on
  //circles' centers
    var circleLabels = chartGroup.selectAll(null)
    .data(statisticalData)
    .enter()
    .append("text")
    .classed("circle-text", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 7) //d[chosenXAxis] => reference to JSON X category
    .attr("y", d => yLinearScale(d[chosenXAxis]) + 3) //d[chosenXAxis] => reference to JSON Y value
    .attr("font-size", 9)
    .attr("text-anchor", "center")
    .text(d => d); //labels?

  //add circles to chartgroup, leave slightly translucent so labels show through, center coordinates
  //based on each data point from specified index passed to the linear scale  
    var circlesGroup = chartGroup.selectAll("circle")
    .data(statisticalData)
    .enter()
    .append("circle")
    .classed("circle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis])) //d[chosenXAxis] => reference to JSON X category
    .attr("cy", d => yLinearScale(d[chosenXAxis])) //d[chosenXAxis] => reference to JSON Y value
    .attr("r", 14)
    .attr("opacity", ".60");

   //create axis label groups and labels, place on chart using dimensions, class so that css 
  //distinguishes current axis from unselected ones 
    var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 30})`);

    var toolsLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "tools") 
    .classed("active", true)
    .text("Most Popular Tools");

    var technologiesLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "technologies") 
    .classed("inactive", true)
    .text("Most Popular Technologies");

    var startingSalaryLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "startingSalary") 
    .classed("inactive", true)
    .text("Average Starting Salaries By Location");
    
  //initialize tooltip
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    //axis listener functions

      xLabelsGroup.selectAll("text")
      .on("click", function() {
      var value = d3.select(this).attr("value");
      
      //update axis value
      if (value !== chosenXAxis) {
        chosenXAxis = value;
        
        //update linear scales, axes, circles/tooltips/labels from user choice of X axis label
        xLinearScale = xScale(statisticalData, chosenXAxis);
        yLinearScale = yScale(statisticalData, chosenXAxis);
        xAxis = renderXAxis(xLinearScale, xAxis);
        yAxis = renderXAxis(yLinearScale, yAxis);
        circlesGroup, circleLabels = renderCircleLayers(circlesGroup, circleLabels, xLinearScale, chosenXAxis);
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        //make sure css is distinguishing active/inactive axes
        if (chosenXAxis === "tools") {
          toolsLabel
            .classed("active", true)
            .classed("inactive", false);
          technologiesLabel
            .classed("inactive", true)
            .classed("active", false);  
          startingSalariesLabel
            .classed("inactive", true)
            .classed("active", false);  
        }
        else if (chosenXAxis === "technologies") {
          technologiesLabel
            .classed("active", true)
            .classed("inactive", false);
          startingSalariesLabel
            .classed("inactive", true)
            .classed("active", false);
          toolsLabel
            .classed("inactive", true)
            .classed("active", false);
        }
        else if (chosenXAxis === "startingSalary") {
          startingSalariesLabel
            .classed("active", true)
            .classed("inactive", false);
          toolsLabel
            .classed("inactive", true)
            .classed("active", false);
          technologiesLabel
            .classed("inactive", true)
            .classed("active", false);
        }
      }
    });  
  });
}
