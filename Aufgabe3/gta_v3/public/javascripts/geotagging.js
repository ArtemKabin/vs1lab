// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// let mapManager  = new MapManager();;


// // -----
/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    // Check if the latitude and longitude form fields have values
    
    // var latitude = document.getElementById('latitude').value;
    // var longitude = document.getElementById('longitude').value;
   
    var mapManager = new MapManager();
    var searchField = document.getElementById('searchterm').value;

    var taglist_json = document.getElementById('map').getAttribute('data-tags');
    let taglist;
    if(taglist_json){
        taglist = JSON.parse(taglist_json);      
    }
    // document.getElementById('latitudediscsearch').value = location.latitude;
    // document.getElementById('longitudediscsearch').value = location.longitude;
    if (searchField != null && searchField != "" && taglist != null && taglist.length != 0) {
        // var latitude =  document.getElementById('latitudediscsearch').value = location.latitude;
        // var longitude = document.getElementById('longitudediscsearch').value = location.longitude;
            // if(taglist){
                // var tag = Object.keys(taglist)[1];
                
                var tag = taglist[0];
                var lat =tag.location.latitude;
                var long = tag.location.longitude;
                LocationHelper.findLocation((location) => {
                    mapManager.initMap(lat,long);
                    mapManager.updateMarkers(lat, long,taglist);
                });
            
            // }
    } else {
        // If the form fields are empty, call LocationHelper.findLocation to retrieve the current location
        LocationHelper.findLocation((location) => {
            var mapContainer = document.getElementById('map');
            mapContainer.replaceChildren();
            // mapManager = new MapManager();
            
            mapManager.initMap(location.latitude, location.longitude);
            if(taglist){
                mapManager.updateMarkers(location.latitude, location.longitude,taglist);
            }else {
                mapManager.updateMarkers(location.latitude, location.longitude);
            }

            document.getElementById('latitude').value = location.latitude;
            document.getElementById('longitude').value = location.longitude;
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