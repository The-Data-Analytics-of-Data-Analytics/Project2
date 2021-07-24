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
        var topTools = [];
        var topLanguages = [];

        datasets.forEach( function (dataset, j) {
        for (var i = 1; i < dataset.length; i++) { 
          for (var i = 1; i < dataset.length; i++) { 
            if (j < 2)
              layer = layers.Engineer;
            else if (j < 4)
              layer = layers.Scientist;
            else
              layer = layers.Analyst;
            
            dataset[i].lat = +dataset[i].lat;
            dataset[i].long = +dataset[i].long;
  
            if (dataset[i].lat === null || isNaN(dataset[i].lat))
                continue
            if (dataset[i].long === null || isNaN(dataset[i].long))
                continue

            if (topTools.length === 0)
              topTools.push("None found here");
  
            if (topLanguages.length === 0)
              topLanguages.push("None found here");

            var newMarker = L.marker([dataset[i].lat, dataset[i].long]); //change reference to data to fit the structure of the JSON
            newMarker.addTo(layer);
            newMarker.bindPopup("<p>Top Tools: " + topTools + "</p><hr><p>Top Languages: " + topLanguages); // + "</p><hr><p>Average Starting Salary: " + avgStartingSalary + "</p>"); //html table
           
        }
      }
    });
    
});
});
});
});
});
});
      
