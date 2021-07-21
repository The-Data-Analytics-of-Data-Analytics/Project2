d3.json("relativePath/JSON").then(function(response) {

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
        Indeed: new L.LayerGroup(),
        Glassdoor: new L.LayerGroup()
      };
      
      var map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 12,
        layers: [
          layers.Indeed,
          layers.Glassdoor
        ]
      });

      streetmap.addTo(map);
      satellitemap.addTo(map);
      lightmap.addTo(map);

      var overlays = {
        "Indeed Dataset": layers.Indeed,
        "Glassdoor Dataset": layers.Glassdoor
      };
     
      var baseMaps = {
        "Street Map": streetmap,
        "Satellite Map": satellitemap,
        "Light Map": lightmap
    };

      L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(map);

      var datasets = ["Indeed", "Glassdoor"];
      datasets.forEach( function (data) {
        for (var i = 0; i < response.length; i++) {
            var newMarker = L.marker([data.lat, data.lng]);
            newMarker.addTo(layers[datasets[i]]);
            newMarker.bindPopup("<p>Top Tools: " + topTools + "</p><hr><p>Top Languages: " + topLanguages + "</p><hr><p>Average Starting Salary: " + avgStartingSalary + "</p>");
      }
    });
});
      
