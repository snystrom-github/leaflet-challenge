// Leaflet Earthquake Visualization

// Create the map object
let map = L.map("map").setView([37.7749, -122.4194], 5); // Default center at San Francisco

// Add the base tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

// URL for earthquake GeoJSON data
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the GeoJSON data
fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
    // Define a function to determine marker size based on magnitude
    function markerSize(magnitude) {
      return magnitude * 4;
    }

    // Define a function to determine marker color based on depth
    function markerColor(depth) {
      return depth > 90 ? "#d73027" :
             depth > 70 ? "#fc8d59" :
             depth > 50 ? "#fee08b" :
             depth > 30 ? "#d9ef8b" :
             depth > 10 ? "#91cf60" : "#1a9850";
    }

    // Add GeoJSON layer to the map
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          `<h3>${feature.properties.place}</h3>
           <hr>
           <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
           <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`
        );
      }
    }).addTo(map);

    // Add a legend to the map
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend"),
          depths = [-10, 10, 30, 50, 70, 90],
          colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];

      div.innerHTML += "<h4>Depth (km)</h4>";

      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          `<i style="background: ${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] : "+"}<br>`;
      }

      return div;
    };

    legend.addTo(map);
  })
  .catch(error => console.error("Error fetching earthquake data:", error));

