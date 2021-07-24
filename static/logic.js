d3.json("static/engineerTools.json").then(function(engineerTools) {
  d3.json("static/engineerLangs.json").then(function(engineerLangs) {
    d3.json("static/scientistTools.json").then(function(scientistTools) {
      d3.json("static/scientistLangs.json").then(function(scientistLangs) {
        d3.json("static/analystTools.json").then(function(analystTools)  {
          d3.json("static/analystLangs.json").then(function(analystLangs) {
    
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 500,
      maxZoom: 20,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    var layers = {
        Engineer: new L.LayerGroup(),
        Scientist: new L.LayerGroup(),
        Analyst: new L.LayerGroup()
      };
      
      var map = L.map("careerMap", {
        center: [37.8044, -122.2712],
        zoom: 4
      });

      streetmap.addTo(map);
      lightmap.addTo(map);
      satellitemap.addTo(map);

      var overlays = {
        "Data Engineer": layers.Engineer,
        "Data Scientist": layers.Scientist,
        "Data Analyst": layers.Analyst
      };
     
      var baseMaps = {
        "Street Map": streetmap,
        "Light Map": lightmap,
        "Satellite Map": satellitemap
      };

      L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(map);

        var datasets = [engineerTools, engineerLangs, scientistTools, scientistLangs, analystTools, analystLangs];

        datasets.forEach(function (dataset, j) {
          var topEngineerTools = [];
          var topEngineerLanguages = [];
          var topScientistTools = [];
          var topScientistLanguages = [];
          var topAnalystTools = [];
          var topAnalystLanguages = [];
          var Locations = [];
          var markers = [];
          var topTools = [];
          var topLanguages = [];

          switch (j) {
            case 0:
              currentList = topEngineerTools;
              topTools = topEngineerTools;
              topLanguages = topEngineerLanguages;
              layer = layers.Engineer;
              break
            case 1:
              currentList = topEngineerLanguages;
              topLanguages = topEngineerLanguages;
              topTools = topEngineerTools;
              layer = layers.Engineer;
              break
            case 2:
              currentList = topScientistTools;
              topTools = topScientistTools;
              topLanguages = topScientistLanguages;
              layer = layers.Scientist;
              break
            case 3:
              currentList = topScientistLanguages;
              layer = layers.Scientist;
              topTools = topScientistTools;
              topLanguages = topScientistLanguages;
              break
            case 4:
              currentList = topAnalystTools;
              topTools = topAnalystTools;
              topLanguages = topAnalystLanguages;
              layer = layers.Analyst;
              break
            case 5:
              currentList = topAnalystLanguages;
              topLanguages = topAnalystLanguages;
              topTools = topAnalystTools;
              layer = layers.Analyst;
              break
            default:
              throw new Error("Switch error...");  
          }

          for (var i = 1; i < dataset.length; i++) {
            
            if (dataset[i].lat === null || isNaN(dataset[i].lat))
                continue
            if (dataset[i].long === null || isNaN(dataset[i].long))
                continue

            dataset[i].lat = +dataset[i].lat;
            dataset[i].long = +dataset[i].long;

            var Location = dataset[i].Location;

            for (key in dataset[i]) {
              if ((+dataset[i][key] === 1) && typeof(currentList[`${+dataset[i].lat}, ${+dataset[i].long}`]) === "undefined" && key !== "lat" && key !== "long" && key !== "_id" && key !== "Location" && key !== "Job_Type") {
                currentList[`${+dataset[i].lat}, ${+dataset[i].long}`] = [key];
              }
              else if ((+dataset[i][key] === 1) && !(currentList[`${+dataset[i].lat}, ${+dataset[i].long}`].includes(key)) && key !== "lat" && key !== "long" && key !== "_id" && key !== "Location" && key !== "Job_Type") {
                currentList[`${+dataset[i].lat}, ${+dataset[i].long}`].push(key);
              }
              else { 
                  continue
              }
            }     
            
            

            if (!Locations.includes(Location)) {
              var newMarker = L.marker([dataset[i].lat, dataset[i].long]);
              markers.push(newMarker);   
            }

          } 
          
          markers.forEach(function (marker) {
          
          if (typeof(topTools[`${marker["_latlng"]["lat"]}, ${marker["_latlng"]["lng"]}`]) === "undefined")
            topTools[`${marker["_latlng"]["lat"]}, ${marker["_latlng"]["lng"]}`] = "No top tools here";
          if (typeof(topLanguages[`${marker["_latlng"]["lat"]}, ${marker["_latlng"]["lng"]}`]) === "undefined")
            topLanguages[`${marker["_latlng"]["lat"]}, ${marker["_latlng"]["lng"]}`] = "No top languages here";
          
          console.log(marker);
          marker.bindPopup("<p>CAREER PATH: " + "</p><hr><p>TOP TOOLS: " + ((topTools[`${marker["_latlng"]["lat"]}, ${marker["_latlng"]["lng"]}`]).toString()).toUpperCase() + "</p><hr><p>TOP LANGUAGES: " + ((topLanguages[`${marker["_latlng"]["lat"]}, ${marker["_latlng"]["lng"]}`]).toString()).toUpperCase());
          marker.addTo(layer);
          });
        
    });
    
});
});
});
});
});
});
      
