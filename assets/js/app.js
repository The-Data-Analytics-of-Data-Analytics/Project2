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

//populate dropdown with careers
var careers = ["Data Scientist", "Data Engineer", "Data Analyst"];

d3.select("#dropdown")
.selectAll("option")
.data(careers)
.enter()
.append("option")
.text(function (career) {
  return career;
});

//dropdown listener
var dropdownMenu = d3.selectAll("#dropdown");
dropdownMenu.on("change", filterViz);

//take in data and get an argument based on chosen X axis, calculate domain, set range, return
//linear scale 
function xScale(data, chosenXAxis) {
  var chosenXLength = 0;
  
  if (chosenXAxis === "tools") 
    chosenXLength =  3;
  else if (chosenXAxis === "languages")
    chosenXLength = 6;
  else if (chosenXAxis === "startingSalary")
    chosenXLength = 1;
  
  var xLinearScale = d3.scaleLinear()
      .domain([0, chosenXLength])
      .range([0, chartWidth]);
  
    return xLinearScale;
}

//take in data and get an argument based on chosen X axis, calculate domain, set range, return
//linear scale
function yScale(data, chosenXAxis) {

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => +d[chosenXAxis]), //+d[chosenXAxis] => reference to corresponding JSON y value
        d3.max(data, d => +d[chosenXAxis])]) //+d[chosenXAxis] => reference to corresponding JSON y value
      .range([chartHeight, 0]);
  
    return yLinearScale;
}

//take in X axis object and new linear scale, transform axis over span of 1 second
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  //take in Y axis object and new linear scale, transform axis over span of 1 second
  function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  //double duty function, takes in old circle group and labels and transforms their data over span
  //of 1 second using the new data specs and new linear scale, returns new circles group and labels 
  function renderBars(barGroup, newXScale, newYScale, chosenXAxis) {

    barGroup.transition()
      .duration(1000)
      .attr("x", function (d) { 
        newXScale()
      })
      .attr("y", function (d) {
        newYScale() 
      })
      .attr("height", d => d); 
  
  
    return barGroup;
  }

  //update tooltip data using new X axis, return new circles group with updated tooltips
  function updateToolTip(chosenXAxis, barGroup) {

    var xlabel;
  
    if (chosenXAxis === "tools") {
      xlabel = "Tool: ";
    }
    else if (chosenXAxis === "languages") {
      xlabel = "Language: ";
    }
    else if (chosenXAxis === "avgSalary") {
      xlabel = "Average Salary: "; 
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.Job_Type}<br>${xLabel}${d}`); //d[chosenXAxis] => reference to JSON Y value,
      });                                                   //d.state => ref to JSON X category
  
    //add tooltip to circles group
    barGroup.call(toolTip);

    //listener for circles to activate/deactivate tooltip
    barGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
    });
      return barGroup; 
  }

  function filterViz() {

    //if accessed due to change prevent default reload behavior, if initializing skip
    if (d3.event != null) {
      d3.event.preventDefault();
    }

    //get user selection from dropdown, assign correct JSON index
    userSelect = d3.select('#dropdown option:checked').text();
    if (userSelect === "Data Scientist")
      careerIndex = 2; //relative index to correct JSON element
    else if (userSelect === "Data Engineer")
      careerIndex = 0; //relative index to correct JSON element
    else if (userSelect === "Data Analyst")
      careerIndex = 1; //relative index to correct JSON element
    else
      throw new Error("Oops...user selection error");


  //read in data JSON, catch any error
    d3.json("../data/JSON/D3SummaryLangs.json").then(function(langsData, err) {
      if (err) throw err;
    
      d3.json("../data/JSON/D3SummaryTools.json").then(function(toolsData, err) {
        if (err) throw err;

    langsData = langsData[careerIndex];
    toolsData = toolsData[careerIndex];
    
    //initialize X axis
    var chosenXAxis = "tools";

  //transform data to numeric form
    langsData.forEach(function(data) {
      data.python = +data.python;
      data.sql = +data.sql;
      data.r = +data.r;
      data.sas = +data.sas;
      data.spark = +data.spark;
      data.java = +data.java;
      data.avg_salary = +data.avg_salary;
    });

    toolsData.forEach(function(data) {
      data.machine_learning = +data.machine_learning;
      data.hadoop = +data.hadoop;
      data.tableau = +data.tableau;
      data.avg_salary = +data.avg_salary;
    });

  //intitalize linear scales
    var xLinearScale = xScale(Data, chosenXAxis);
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


    var barSpacing = 10; // desired space between each bar
  
    // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
    var barWidth = (chartWidth - (barSpacing * (statisticalData[careerIndex].length - 1))) / statisticalData[chosenXAxis].length;

    var barGroup = chartGroup.selectAll("rect")
      .data(statisticalData[chosenXAxis])
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", d => barWidth)
      .attr("height", d => d3.max(yLinearScale(d[chosenXAxis])))
      .attr("x", (d, i) => i * (barWidth + barSpacing))
      .attr("y", d => yLinearScale(d[chosenXAxis]))
      .catch(function(error) {
        console.log(error); });

   //create X axis label group and labels, place on chart using dimensions
    var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 30})`);

    var toolsLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "tools") 
    .classed("active", true)
    .text("Most Popular Tools");

    var languagesLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "languages") 
    .classed("inactive", true)
    .text("Most Popular Languages");

    var avgSalaryLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "startingSalary") 
    .classed("inactive", true)
    .text("Average Salaries");
    
    //initialize tooltip
    var barGroup = updateToolTip(chosenXAxis, barGroup)  
    
    //X axis listener function
      xLabelsGroup.selectAll("text")
      .on("click", function() {
      var value = d3.select(this).attr("value");
      
      //update X axis value
      if (value !== chosenXAxis) {
        chosenXAxis = value;
        
        //update linear scales, axes, circles/tooltips/labels from user choice of X axis label
        xLinearScale = xScale(langsData, toolsData, chosenXAxis);
        yLinearScale = yScale(langsData, toolsData, chosenXAxis);
        xAxis = renderXAxis(xLinearScale, xAxis);
        yAxis = renderXAxis(yLinearScale, yAxis);
        barGroup = renderBars(barGroup, xLinearScale, yLinearScale, chosenXAxis);
        barGroup = updateToolTip(chosenXAxis, barGroup);

        //make sure css is distinguishing active/inactive axes
        if (chosenXAxis === "tools") {
          toolsLabel
            .classed("active", true)
            .classed("inactive", false);
          languagesLabel
            .classed("inactive", true)
            .classed("active", false);  
          avgSalaryLabel
            .classed("inactive", true)
            .classed("active", false);  
        }
        else if (chosenXAxis === "languages") {
          languagesLabel
            .classed("active", true)
            .classed("inactive", false);
          avgSalaryLabel
            .classed("inactive", true)
            .classed("active", false);
          toolsLabel
            .classed("inactive", true)
            .classed("active", false);
        }
        else if (chosenXAxis === "avgSalary") {
          avgSalaryLabel
            .classed("active", true)
            .classed("inactive", false);
          toolsLabel
            .classed("inactive", true)
            .classed("active", false);
          languagesLabel
            .classed("inactive", true)
            .classed("active", false);
        }
      }
    });  
  });
});
}

filterViz();
