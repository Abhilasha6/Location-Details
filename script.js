// displayed the path between the default latitude and longitude valuesin const path: works properly

const path = new Array;

function getLatLong(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Check if results array is not empty
            if (results.length > 0) {
                var location = results[0].geometry.location;
                var lat = location.lat();
                var lng = location.lng();
                callback(lat, lng);
            } else {
                console.error('No results found for the given address.');
            }
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
    
}

document.addEventListener('DOMContentLoaded', function () {
    var submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function () {
        var startLocationInput = document.getElementById('start-location').value;
        var endLocationInput = document.getElementById('end-location').value;

        getLatLong(startLocationInput, function (startLat, startLng) {
            console.log('Start location: ', startLocationInput);
            console.log('Start Location Latitude:', startLat);
            console.log('Start Location Longitude:', startLng);
            path[0]= { lat: startLat, lng: startLng }
        });

        getLatLong(endLocationInput, function (endLat, endLng) {
            console.log('End location: ', endLocationInput);
            console.log('End Location Latitude:', endLat);
            console.log('End Location Longitude:', endLng);
            path[1]= { lat: endLat, lng: endLng }

        });

        console.log('Path:', path);

    });
});





// // Load the Visualization API and the columnchart package.
// // @ts-ignore TODO update to newest visualization library
google.load("visualization", "1", { packages: ["columnchart"] });

function initMap() {
  // The following path marks a path from Wai, Maharashtra, the start point
  // to Mahabaleshwar, Maharashtra, the journey end point respectively.

  const path = [
    { lat: 17.56, lng: 73.4 }, //start location latitude and longitude
    { lat: 17.94, lng: 73.88 }, //end location latitude and longitude
  ];

//   const startLocationInput = document.getElementById("start-location");
//   const endLocationInput = document.getElementById("end-location");

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: path[1],
    mapTypeId: "terrain",
  });
  // Create an ElevationService.
  const elevator = new google.maps.ElevationService();

  // Draw the path, using the Visualization API and the Elevation service.
  displayPathElevation(path, elevator, map);
}

function displayPathElevation(path, elevator, map) {
  // Display a polyline of the elevation path.
  new google.maps.Polyline({
    path: path,
    strokeColor: "#0000CC",
    strokeOpacity: 0.4,
    map: map,
  });
  // Create a PathElevationRequest object using this array. Ask for 256 samples along that path.
  elevator
    .getElevationAlongPath({
      path: path,
      samples: 256,
    })
    .then(plotElevation)
    .catch((e) => {
      const chartDiv = document.getElementById("elevation_chart");

      // Show the error code inside the chartDiv.
      chartDiv.innerHTML = "Cannot show elevation: request failed because " + e;
    });
}

// Takes an array of ElevationResult objects, draws a straight path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation({ results }) {
  const chartDiv = document.getElementById("elevation_chart");
  // Create a new chart in the elevation_chart DIV.
  const chart = new google.visualization.ColumnChart(chartDiv);
  // Extract the data from which to populate the chart.
  // Because the samples are equidistant, the 'Sample'
  // column here does double duty as distance along the
  // X axis.
  const data = new google.visualization.DataTable();

  data.addColumn("string", "Sample");
  data.addColumn("number", "Elevation");

  for (let i = 0; i < results.length; i++) {
    data.addRow(["", results[i].elevation]);
  }

  // Draw the chart using the data within its DIV.
  chart.draw(data, {
    height: 150,
    legend: "none",
    // @ts-ignore TODO update to newest visualization library
    titleY: "Elevation (m)",
  });
}

window.initMap = initMap;









//takes start and end location input and then tries to display the map details: not working properly

// Load the Visualization API and the columnchart package.
// @ts-ignore TODO update to newest visualization library

// google.load("visualization", "1", { packages: ["columnchart"] });

// function initMap() {
//   // Get references to the start and end location input elements
//   const startLocationInput = document.getElementById("start-location");
//   const endLocationInput = document.getElementById("end-location");

//   // Get references to the map and chart divs
//   const mapDiv = document.getElementById("map");
//   const chartDiv = document.getElementById("elevation_chart");

//   // Function to handle user input and fetch elevation data
//   function handleUserInput() {
//     const startLocation = startLocationInput.value;
//     const endLocation = endLocationInput.value;

//     // Use a geocoding service to fetch latitude and longitude
//     fetchLocations(startLocation, endLocation)
//       .then(path => {
//         // Create the map and display path elevation
//         const map = new google.maps.Map(mapDiv, {
//           zoom: 8,
//           center: path[1],
//           mapTypeId: "terrain"
//         });
//         const elevator = new google.maps.ElevationService();
//         displayPathElevation(path, elevator, map);
//       })
//       .catch(error => {
//         // Handle errors during location fetching
//         chartDiv.innerHTML = "Error: Could not find locations";
//         console.error("Error fetching locations:", error);
//       });
//   }

//   // Function to fetch latitude and longitude for a location
//   async function fetchLocation(location) {
//     const geocoder = new google.maps.Geocoder();
//     const response = await geocoder.geocode({ address: location });
//     if (response.results.length > 0) {
//       const { lat, lng } = response.results[0].geometry.location;
//       return { lat, lng };
//     } else {
//       throw new Error(`Location not found: ${location}`);
//     }
//   }

//   // Function to fetch latitude and longitude for start and end locations
//   async function fetchLocations(startLocation, endLocation) {
//     const [startLatLng, endLatLng] = await Promise.all([
//       fetchLocation(startLocation),
//       fetchLocation(endLocation)
//     ]);
//     return [startLatLng, endLatLng];
//   }

//   // Function to display path elevation (unchanged from previous code)
//   function displayPathElevation(path, elevator, map) {
// // Display a polyline of the elevation path.
//   new google.maps.Polyline({
//     path: path,
//     strokeColor: "#0000CC",
//     strokeOpacity: 0.4,
//     map: map,
//   });
//   // Create a PathElevationRequest object using this array.
//   // Ask for 256 samples along that path.
//   // Initiate the path request.
//   elevator
//     .getElevationAlongPath({
//       path: path,
//       samples: 256,
//     })
//     .then(plotElevation)
//     .catch((e) => {
//       const chartDiv = document.getElementById("elevation_chart");

//       // Show the error code inside the chartDiv.
//       chartDiv.innerHTML = "Cannot show elevation: request failed because " + e;
//     });
//  }

//   // Add event listener to a button (or other trigger) to call handleUserInput
//   const submitButton = document.getElementById("submit-button");
//   submitButton.addEventListener("click", handleUserInput);
// }

// window.initMap = initMap;
