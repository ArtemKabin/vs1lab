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
 
   
    var taglist_json = document.getElementById('map').getAttribute('data-tags');
    let taglist;
    if(taglist_json){
        taglist = JSON.parse(taglist_json);      
    }
        LocationHelper.findLocation((location) => {
            var mapContainer = document.getElementById('map');
            mapContainer.replaceChildren();
            var mapManager = new MapManager();
            mapManager.initMap(location.latitude, location.longitude);
            mapManager.updateMarkers(location.latitude, location.longitude,taglist);

            document.getElementById('latitude').value = location.latitude;
            document.getElementById('longitude').value = location.longitude;
            document.getElementById('latitudediscsearch').value = location.latitude;
            document.getElementById('longitudediscsearch').value = location.longitude;
        });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});