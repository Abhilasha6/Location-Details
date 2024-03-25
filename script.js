// displayed the path between the default latitude and longitude valuesin const path: works properly

const path = new Array();

// function getLatLong(address, callback) {
//   var geocoder = new google.maps.Geocoder();
//   geocoder.geocode({ address: address }, function (results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       // Check if results array is not empty
//       if (results.length > 0) {
//         var location = results[0].geometry.location;
//         var lat = location.lat();
//         var lng = location.lng();
//         callback(lat, lng);
//       } else {
//         console.error("No results found for the given address.");
//       }
//     } else {
//       console.error(
//         "Geocode was not successful for the following reason: " + status
//       );
//     }
//   });
// }

async function getLatLong(address) {
  const geocoder = new google.maps.Geocoder();

  try {
    const { results } = await geocoder.geocode({ address: address });
    if (results.length === 0) {
      throw new Error("No Location Found.");
    }
    const location = results[0].geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    return {
      lat,
      lng,
    };
  } catch (err) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", async function () {
    var startLocationInput = document.getElementById("start-location").value;
    var endLocationInput = document.getElementById("end-location").value;

    // getLatLong(startLocationInput, function (startLat, startLng) {
    //   console.log("Start location: ", startLocationInput);
    //   console.log("Start Location Latitude:", startLat);
    //   console.log("Start Location Longitude:", startLng);
    //   path[0] = { lat: startLat, lng: startLng };
    // });

    // getLatLong(endLocationInput, function (endLat, endLng) {
    //   console.log("End location: ", endLocationInput);
    //   console.log("End Location Latitude:", endLat);
    //   console.log("End Location Longitude:", endLng);
    //   path[1] = { lat: endLat, lng: endLng };
    // });

    // console.log("Path:", path);

    const startCoords = await getLatLong(startLocationInput);
    const endCoords = await getLatLong(endLocationInput);

    if (!startCoords || !endCoords) {
      return alert("Geocoding unsuccessful");
    }

    console.log("Start location", startLocationInput, startCoords);
    console.log("End location", endLocationInput, endCoords);
    initMap([startCoords, endCoords]);
  });
});

// // Load the Visualization API and the columnchart package.
// // @ts-ignore TODO update to newest visualization library
google.load("visualization", "1", { packages: ["columnchart"] });

document.addEventListener("DOMContentLoaded", function () {
  var submitButton = document.getElementById("submit-button");

  submitButton.addEventListener("click", async function () {
    var startLocationInput = document.getElementById("start-location").value;
    var endLocationInput = document.getElementById("end-location").value;

    const startCoords = await getLatLong(startLocationInput);
    const endCoords = await getLatLong(endLocationInput);

    if (!startCoords || !endCoords) {
      return alert("Unable to Geocode.");
    }

    console.log("Start location", startLocationInput, startCoords);
    console.log("End location", endLocationInput, endCoords);
    initMap([startCoords, endCoords]);
  });
});

function initMap(paths) {
  if (!Array.isArray(paths) || paths.length !== 2) {
    return;
  }

  // const map = new google.maps.Map(document.getElementById('map'), {
  // 	zoom: 12,
  // 	center: paths[0],
  // 	mapTypeId: 'terrain',
  // });

  // // Create an ElevationService.
  const elevator = new google.maps.ElevationService();

  // Draw the path, using the Visualization API and the Elevation service.
  //to display the route from start to end, add 'map' to the below calling 
  //and uncomment above const map & below polyline method & map div in index page
  displayPathElevation(paths, elevator);
}

function displayPathElevation(path, elevator) {
  // Display a polyline of the elevation path.
  // new google.maps.Polyline({
  // 	path: path,
  // 	strokeColor: '#0000CC',
  // 	strokeOpacity: 0.4,
  // 	map: map,
  // });

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
    height: 250,
    innerWidth: 250,
    legend: "none",
    // @ts-ignore TODO update to newest visualization library
    titleY: "Elevation (m)",
    titleX: "Points from start location to end location",
  });
}

window.initMap = initMap;
