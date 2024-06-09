// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");



/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    // Check if the latitude and longitude form fields have values
    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;
    var taglist_json = document.getElementById('map').getAttribute('data-tags');
    // var taglist = JSON.parse(taglist_json);
    if (latitude && longitude) {
        // If the form fields have values, update the map and markers with the provided coordinates
        // const mapManager = new MapManager();
        // mapManager.initMap(latitude, longitude);
        // mapManager.updateMarkers(latitude, longitude,taglist);
    } else {
        // If the form fields are empty, call LocationHelper.findLocation to retrieve the current location
        LocationHelper.findLocation((location) => {
            var mapContainer = document.getElementById('map');
            mapContainer.replaceChildren();

            const mapManager = new MapManager();
            mapManager.initMap(location.latitude, location.longitude);
            mapManager.updateMarkers(location.latitude, location.longitude);
            // mapManager.updateMarkers(location.latitude, location.longitude,taglist);

            latitude = location.latitude;
            longitude = location.longitude;
            document.getElementById('latitudediscsearch').value = location.latitude;
            document.getElementById('longitudediscsearch').value = location.longitude;
        });
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    // alert("Please change the script 'geotagging.js'");
});