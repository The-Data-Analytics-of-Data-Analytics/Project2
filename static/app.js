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
var svg = d3.select(".D3")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json("../static/D3SummaryLangs.json").then(function(langsData, err) {
        if (err) throw err;
              
    d3.json("../static/D3SummaryTools.json").then(function(toolsData, err) {
        if (err) throw err;
          
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

            langsData = langsData[2];
            toolsData = toolsData[2];

            langsDataList = [];
            toolsDataList = [];
            avgSalaryDataList = [];

            langsDataList.push({"python": +langsData.python});
            langsDataList.push({"sql": +langsData.sql});
            langsDataList.push({"r": +langsData.r});
            langsDataList.push({"sas": +langsData.sas});
            langsDataList.push({"spark": +langsData.spark});
            langsDataList.push({"java": langsData.java});
            avgSalaryDataList.push({"avg_salary": +langsData.avg_salary});

            toolsDataList.push({"machine_learning": +toolsData.machine_learning});
            toolsDataList.push({"hadoop": +toolsData.hadoop});
            toolsDataList.push({"tableau": +toolsData.tableau});

            console.log(langsDataList);
            console.log(toolsDataList);
            console.log(avgSalaryDataList);

            var barSpacing = 15;
  
            var barWidth = (chartWidth - (barSpacing * (toolsDataList.length - 1))) / (toolsDataList.length); //play with these numbers

            var barGroup = chartGroup.selectAll("rect")
                .data(toolsDataList)
                .enter()
                .append("rect")
                .classed("bar", true)
                .attr("width", d => barWidth)
                .attr("x", (d, i) => i * (barWidth + barSpacing))
                .attr("y", function (d) { 
                    for (key in d)   
                        return (chartHeight - d[key]*8)
                }) 
                .attr("height", function (d) { 
                    for (key in d) {
                        console.log(d[key]);
                        return d[key]*8
                    }
                }); 

            var xPointScale = xScale(toolsDataList, barWidth, barSpacing);
            var yLinearScale = yScale(toolsDataList);
                
            var bottomAxis = d3.axisBottom(xPointScale);
            var leftAxis = d3.axisLeft(yLinearScale);
                  
            var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(bottomAxis);
                
            var yAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis);   
                    
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
                .attr("value", "avgSalary") 
                .classed("inactive", true)
                .text("Average Salary");

            var chosenXAxis = "tools";
            barGroup = updateToolTip(chosenXAxis, barGroup, "Data Scientist");

            xLabelsGroup.selectAll("text")
                .on("click", function() {
                    
                    var value = d3.select(this).attr("value");

                    if (value !== chosenXAxis)  
                        chosenXAxis = value;
        
                    if (chosenXAxis === "tools") 
                        currentData = toolsDataList;
                    else if (chosenXAxis === "languages")
                        currentData = langsDataList; 
                    else if (chosenXAxis === "avgSalary")
                        currentData = avgSalaryDataList;
                    else
                        throw new Error("Oops...user selection error");
                    
                    barSpacing = 15;
  
                    barWidth = (chartWidth - (barSpacing * (currentData.length - 1))) / (currentData.length);

                    xPointScale = xScale(currentData, barWidth, barSpacing);
                    yLinearScale = yScale(currentData);

                    xAxis = renderXAxis(xPointScale, xAxis);
                    yAxis = renderYAxis(yLinearScale, yAxis);

                    career = d3.select('#dropdown option:checked').text();
                    barGroup = renderBars(barGroup, currentData, barWidth, barSpacing);
                    barGroup = updateToolTip(chosenXAxis, barGroup, career);



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

                    });        


function filterViz() {

    d3.event.preventDefault();

    userSelect = d3.select('#dropdown option:checked').text();
        if (userSelect === "Data Scientist")
            careerIndex = 2; 
        else if (userSelect === "Data Engineer")
            careerIndex = 0; 
        else if (userSelect === "Data Analyst")
            careerIndex = 1; 
        else
            throw new Error("Oops...user selection error");

    langsData = langsData[careerIndex];
    toolsData = toolsData[careerIndex];

}

function xScale(methodData, barWidth, barSpacing) {
    var xScale = d3.scalePoint()
        .domain(methodData.map(function (d) {
            for (key in d) {
                return key 
            }  
        }))
        .range([barWidth/2, ((methodData.length - 1)*(barWidth + barSpacing) + barWidth/2)]);
    return xScale;
}

function yScale(methodData) {

    for (key in (d3.max(methodData))) {
        maxValue = (d3.max(methodData))[key];
    }
    var yLinearScale = d3.scaleLinear()
        .domain([0, maxValue*1.5]) 
        .range([chartHeight, 0]);
        
    return yLinearScale;
}

function updateToolTip(chosenXAxis, barGroup, career) {

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
        var value;
        var currentKey;
        for (key in d) {
            value = d[key];
            currentKey = key; 
        }
        if (chosenXAxis === "avgSalary")
            return (`<p>${career}</p><hr><p>${xlabel} $${value}</p>`);
        else
            return (`<p>${career}</p><hr><p>${xlabel} ${currentKey}</p><hr><p>Frequency: ${value}%</p>`); 
      });                                                   
  
    barGroup.call(toolTip);

    barGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
    });
      return barGroup; 
  }

  function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  function renderBars(barGroup, methodData, barWidth, barSpacing ) {

    barGroup.remove();

    //multipliers = [{scientistTools: 8}, {scientistLangs: 5.8}, {scientistSal: 0.0057}, {engineerTools:}, {engineerLangs:}, {engineerSal:}, {analystTools:}, {analystLangs:}, {analystSal:}];
    barGroup = chartGroup.selectAll("rect")
    .data(methodData)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", d => barWidth)
    .attr("x", (d, i) => i * (barWidth + barSpacing))
    .attr("y", function (d) { 
    for (key in d)    
        return chartHeight - d[key]*(0.0057)//adjust multiplier as needed
    }) 
    .attr("height", function (d) { 
    for (key in d) {
        return d[key]*(0.0057)
    }
    });
    return barGroup
}

});
});