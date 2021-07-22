d3.json("../data/JSON/D3SummaryLangs.json").then(function(engineerTools) {
  d3.json("../data/JSON/LeafletDatasets/engineerLangs.json").then(function(engineerLangs) {
    d3.json("../data/JSON/LeafletDatasets/scientistTools.json").then(function(scientistTools) {
      d3.json("../data/JSON/LeafletDatasets/scientistLangs.json").then(function(scientistLangs) {
        d3.json("../data/JSON/LeafletDatasets/analystTools.json").then(function(analystTools)  {
          d3.json("../data/JSON/LeafletDatasets/analystLangs.json").then(function(analystLangs) {
            
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
        center: [40.73, -74.0059],
        zoom: 12,
        layers: [
          layers.Engineer,
          layers.Scientist,
          layers.Analyst
        ]
      });

      streetmap.addTo(map);
      satellitemap.addTo(map);
      lightmap.addTo(map);

      var overlays = {
        "Data Engineer": layers.Engineer,
        "Data Scientist": layers.Scientist,
        "Data Analyst": layers.Analyst
      };
     
      var baseMaps = {
        "Street Map": streetmap,
        "Satellite Map": satellitemap,
        "Light Map": lightmap
    };

      L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(map);

        var datasets = [engineerTools, engineerLangs, scientistTools, scientistLangs, analystTools, analystLangs];

        datasets.forEach( function (dataset, j) {
        for (var i = 1; i < dataset.length; i++) { 
            if (j < 2)
              layerIndex = "Engineer";
            else if (j < 4)
              layerIndex = "Scientist";
            else
              layerIndex = "Analyst";
            var newMarker = L.marker(dataset.lat, dataset.long]); //change reference to data to fit the structure of the JSON
            newMarker.addTo(layers[layerIndex]);
            newMarker.bindPopup("<p>Top Tools: " + topTools + "</p><hr><p>Top Languages: " + topLanguages + "</p><hr><p>Average Starting Salary: " + avgStartingSalary + "</p>"); //html table


            
      }
    });
});
});
});
});
});
});
      
