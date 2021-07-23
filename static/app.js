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

var svg = d3
  .select(".D3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

function filterViz() {
    userSelect = d3.select('#dropdown option:checked').text();
        if (userSelect === "Data Scientist")
            careerIndex = 2; //relative index to correct JSON element
        else if (userSelect === "Data Engineer")
            careerIndex = 0; //relative index to correct JSON element
        else if (userSelect === "Data Analyst")
            careerIndex = 1; //relative index to correct JSON element
        else
            throw new Error("Oops...user selection error");

    d3.json("../static/D3SummaryLangs.json").then(function(langsData, err) {
        if (err) throw err;
              
    d3.json("../static/D3SummaryTools.json").then(function(toolsData, err) {
        if (err) throw err;
          
            langsData = langsData[careerIndex];
            toolsData = toolsData[careerIndex];

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
            avgSalaryDataList.push({"avg_salary": +toolsData.avg_salary});

            chosenXaxis = "tools";

            var xLinearScale = xScale(toolsDataList);
            var yLinearScale = yScale(toolsDataList);
            
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);
              
            var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(bottomAxis);
            
            var yAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis);

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
                    for (key in (d3.max(toolsDataList))) {
                        var maxValue = (d3.max(toolsDataList))[key];   
                        return (chartHeight - maxValue *  1)//adjust multiplier as needed
                    }
                }) 
                .attr("height", function (d) { 
                    for (key in (d3.max(toolsDataList))) {
                        var maxValue = (d3.max(toolsDataList))[key];   
                        return (maxValue *  1)//adjust multiplier as needed
                    }
                }); 

    });
    });
}

filterViz();

function xScale(methodData) {
    var xLinearScale = d3.scaleLinear()
        .domain([0, methodData.length])
        .range([0, chartWidth]);
  
    return xLinearScale;
}

function yScale(methodData) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(methodData), 
          d3.max(methodData)]) 
        .range([chartHeight, 0]);
    
    return yLinearScale;
}