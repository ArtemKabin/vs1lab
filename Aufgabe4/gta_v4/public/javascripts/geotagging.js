// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

//Import the GeoTag class
const GeoTag = require('./GeoTag.js');
const Location = require('./Location.js');

const tagForm = document.getElementById("tag-form");
const discoveryFilterForm = document.getElementById("discoveryFilterForm");


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

//Event Listeners for the submit forms
tagForm.addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission

    //Get formula data
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const name = document.getElementById('name').value;
    const hashtag = document.getElementById('hashtag').value;

    //Create a new tag
    var tag = new GeoTag(latitude, longitude, name, hashtag);
});

discoveryFilterForm.addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

