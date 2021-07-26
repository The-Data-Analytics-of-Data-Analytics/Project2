# Project2

Group project analyzing the top tools and languages needed to become one of three career paths in the data field: Data Scientist, Data Engineer, or Data Analyst. The website runs on a flask server, and comprises a homepage displaying a togglable series of bar charts with togglable x axes as well as a linked page displaying an interactive map. The bar charts display tools, languages, and average salary for the selected field, and the map indicates which top tools and languages appeared in any of the job listings for the selected career path overlay at that set of coordinates. The javascript uses D3 to create the svg charts, the D3-tip plugin for the chart tooltip functionality, and D3 with Leaflet drawing on the mapbox API to create the map. The styling combines Bootstrap and custom css. The data was processed in Excel and stored in mongoDB, then accessed as exported JSONs. The data comprises three main sources: Glassdoor, Indeed, and LinkedIn.   

View the site adapted to GitHub server here: https://the-data-analytics-of-data-analytics.github.io/Project2/

NOTE: PLEASE ALLOW TIME FOR MAP TO PROCESS ROBUST DATA

![2021-07-26](https://user-images.githubusercontent.com/44123311/127026546-2ae8b3ce-2b82-410f-9eb3-22b85cbbe83d.png)
